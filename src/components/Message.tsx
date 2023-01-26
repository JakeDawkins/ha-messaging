import React from 'react';
import { Message } from '../types';
import Image from 'next/image';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

const Message = ({ msg }: { msg: Message }) => {
  // todo -- proper escaping
  const content = msg.message.replaceAll('<br>', '\n');
  // @ts-ignore
  const isSender = msg.sourceEnum === 'cp';
  return (
    <div
      className={`flex flex-row w-4/5 mt-4 justify-end ${
        isSender ? 'self-end' : 'self-start'
      }`}
    >
      {/* I didn't have time to unwrap this confusion. It looks like the sourceEnum
      and recipientEnum are different. Also this test user seems to be communicating
      with another cleaner, so the conversation thread is a bit confusing. */}
      {msg.sourceEnum === 'customer' ? (
        <Image
          alt="placeholer avatar"
          width={48}
          height={48}
          src="https://images.placeholders.dev/?width=48&height=48"
          className="rounded-full mr-4 self-end"
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

export default Message;
