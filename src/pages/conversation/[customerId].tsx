import React, { useEffect, FC, useCallback, useState } from 'react';
import useSwr from 'swr';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { sendMessage } from '../../utils/fetchers';

enum SourceEnum {
  'cp',
  'c',
  'admin',
  'system',
}

enum RecipientEnum {
  'cp',
  'c',
  'admin',
  'system',
}

interface Message {
  id: number;
  sourceEnum: SourceEnum;
  recipientEnum: RecipientEnum;
  channel: string;
  message: string;
  customerId: number;
  cleanerId: number;
  messageDateTime: string;
}

interface MessageResponse {
  messages: Message[];
  customerId: string;
  lastWeekMessageCount: number;
}

function Conversation() {
  const { user } = useAuth();
  const router = useRouter();
  const customerId =
    typeof router?.query?.customerId === 'string'
      ? router?.query?.customerId
      : undefined;

  // doesn't fetch if no user or customer id
  const SWRKey =
    user && customerId ? [`/cp/messages/${customerId}/`, user] : null;
  const { data, isLoading, error } = useSwr<MessageResponse>(SWRKey);
  const messages = data?.messages;

  const [inputMessage, setInputMessage] = useState('');

  const { trigger: send } = useSWRMutation(SWRKey, sendMessage);
  const handleMessageSend = useCallback(() => {
    send({ message: inputMessage, customerId });
  }, [send, inputMessage, customerId, user]);

  // todo pull out to helper
  useEffect(() => {
    if (!user) {
      console.log('No user logged in, redirecting.');
      router.push('/login');
    }
  }, [router, user]);

  const onInputMessageChange = useCallback((e) => {
    if (!e?.target) return;
    setInputMessage(e.target.value);
  }, []);

  if (isLoading)
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  if (error || !data || !Array.isArray(messages)) {
    console.error(error);
    return (
      <main>
        <p>Error</p>
      </main>
    );
  }

  console.log(messages);
  return (
    <main className="flex flex-col absolute top-0 bottom-0 left-0 right-0 overflow-hidden">
      {/* todo back button */}
      <button
        type="button"
        className="flex flex-row items-center m-4"
        onClick={() => router.back()}
      >
        <div className="h-5 w-5 bg-gray-300"></div>
        <h1 className="ml-4 text-xl font-bold">Messages</h1>
      </button>
      <div className="flex flex-1 flex-col-reverse w-full overflow-scroll p-4">
        {messages.map((msg) => {
          // todo -- proper escaping
          const content = msg.message.replaceAll('<br>', '\n');
          // @ts-ignore
          const isSender = msg.recipientEnum === 'cp';
          console.log({ isSender });
          return (
            <div
              key={msg.id}
              className={`flex flex-row w-4/5 mt-4 border border-black p-2 ${
                isSender ? 'self-end' : 'self-start'
              }`}
            >
              <p>{content}</p>
              <p>{msg.messageDateTime}</p>
            </div>
          );
        })}
      </div>
      <div className="flex self-end w-full h-32 border border-red-500 flex-col p-4">
        <input
          type="text"
          onChange={onInputMessageChange}
          value={inputMessage}
          placeholder="Username"
          className="border px-2 border-black rounded"
        />
        <div className="flex flex-row w-full">
          <button
            className="border border-black w-32 mt-4 hover:bg-gray-100"
            onClick={handleMessageSend}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
export default Conversation;
