import React, { useEffect, useCallback, useState } from 'react';
import useSwr from 'swr';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/useAuth';
import { sendMessage } from '../../utils/fetchers';
import { MessageResponse } from '../../types';
import Message from '../../components/Message';
import UserBoundary from '../../components/UserBoundary';

function _Conversation() {
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

  const handleMessageSend = useCallback(() => {
    mutate(
      sendMessage({ user, message: inputMessage, customerId }).then((res) => {
        return { ...data, messages: [...data.messages, res] };
      }),
    );
  }, [mutate, user, inputMessage, customerId, data]);

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

function Conversation() {
  return (
    <UserBoundary>
      <_Conversation />
    </UserBoundary>
  );
}
export default Conversation;
