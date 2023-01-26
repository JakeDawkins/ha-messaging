import Image from 'next/image';
import { Conversation } from '../types';
import Link from 'next/link';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

interface ConversationProps {
  conversation: Conversation;
}
const Conversation = ({ conversation }: ConversationProps) => {
  const message = conversation.message.replaceAll('<br>', ' ');
  const fullName = `${conversation.firstName} ${conversation.lastName}`;
  return (
    <Link
      href={`/conversation/${conversation.id}`}
      key={conversation.id}
      className="flex flex-row mt-4 justify-center items-center"
    >
      <div
        className={`h-3 w-3 ${
          conversation.isActive ? 'bg-green-400' : 'bg-transparent'
        }`}
      />
      <Image
        alt={`Profile picture for ${fullName}`}
        src="https://images.placeholders.dev/?width=64&height=64"
        width={64}
        height={64}
        className="ml-2"
      />
      <div className="ml-2 flex-1">
        <div className="flex flex-row justify-between">
          <p className="font-bold">{fullName}</p>
          <p className="font-bold text-gray-500">
            {format(parseISO(conversation.messageDateTime), 'MMM, dd')}
          </p>
        </div>
        {/* todo -- cleanup truncation */}
        {/* todo - html stipping */}
        <p>{message.slice(0, 100)}...</p>
      </div>
      <hr />
    </Link>
  );
};

export default Conversation;
