import React, { useEffect, FC, useCallback, useState } from 'react';
import useSwr from 'swr';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { sendMessage } from '../../utils/fetchers';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { BASE_URL } from '../../utils/constants';

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

const Message = ({ msg }: { msg: Message }) => {
  // todo -- proper escaping
  const content = msg.message.replaceAll('<br>', '\n');
  // @ts-ignore
  const isSender = msg.recipientEnum === 'cp';
  console.log(msg.sourceEnum);
  return (
    <div
      className={`flex flex-row w-4/5 mt-4 ${
        isSender ? 'self-end' : 'self-start'
      }`}
    >
      {/* This is a bit of a edge case, right now, since the convo
      on the staging account is cp <> cp */}
      {msg.sourceEnum === 'c' ? (
        <Image
          alt="placeholer avatar"
          width={48}
          height={48}
          src="https://images.placeholders.dev/?width=48&height=48"
          className="rounded-full mr-4"
        />
      ) : null}
      <div>
        <p
          className={`rounded p-2 ${
            isSender ? 'bg-blue-600 text-white' : 'bg-white border border-black'
          } p-2`}
        >
          {content}
        </p>

        <p className="self-center">
          {format(parseISO(msg.messageDateTime), 'h:mm a')}
        </p>
      </div>
    </div>
  );
};

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
  const { data, isLoading, error, mutate } = useSwr<MessageResponse>(SWRKey);
  const messages = data?.messages;

  const [inputMessage, setInputMessage] = useState('');

  const { trigger: send } = useSWRMutation(SWRKey, sendMessage);
  const handleMessageSend = useCallback(async () => {
    // send({ message: inputMessage, customerId });
    return fetch(`${BASE_URL}/cp/messages/${customerId}/`, {
      method: 'POST',
      body: JSON.stringify({ message: inputMessage }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.access}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('invalid response');
        }
      })
      .then(() => {
        setInputMessage('');
        mutate();
      })
      .catch((e) => {
        console.error(e);
      });
  }, [send, inputMessage, customerId]);

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
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}
      </div>
      <div className="flex self-end w-full h-24 flex-col p-4">
        <input
          type="text"
          onChange={onInputMessageChange}
          value={inputMessage}
          placeholder="Write a message..."
          className="border px-2 border-black rounded"
        />
        <div className="flex flex-row w-full">
          <button
            className="border border-black w-32 mt-4 hover:bg-gray-100 self-end"
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
