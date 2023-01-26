import React, { useEffect, FC } from 'react';
import useSwr from 'swr';
import { useRouter } from 'next/router';

import fetcher from '../utils/fetchers';
import { useAuth } from '../utils/useAuth';
import { withUserBoundary } from '../components/UserBoundary';
import Link from 'next/link';
import Image from 'next/image';

interface Conversation {
  isActive: boolean;
  lastName: string;
  firstName: string;
  message: string;
  id: number;
  messageDateTime: string;
}

function _Home() {
  const { user } = useAuth();
  const router = useRouter();
  // doesn't fetch if no user
  console.log({ user });
  const {
    data: conversations,
    isLoading,
    error,
  } = useSwr<Conversation[]>(user ? [`/cp/conversations/`, user] : null);

  // todo pull out to helper
  useEffect(() => {
    if (!user) {
      console.log('No user logged in, redirecting.');
      router.push('/login');
    }
  }, [router, user]);

  if (isLoading)
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  if (error || !conversations) {
    console.error(error);
    return (
      <main>
        <p>Error</p>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Messages</h1>
      {conversations.map((convo) => {
        const message = convo.message.replaceAll('<br>', ' ');
        const fullName = `${convo.firstName} ${convo.lastName}`;
        return (
          <Link
            href={`/conversation/${convo.id}`}
            key={convo.id}
            className="flex flex-row mt-4"
          >
            {convo.isActive ? (
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
            ) : null}
            {/* TODO -- next image */}
            <Image
              alt={`Profile picture for ${fullName}`}
              src="https://images.placeholders.dev/?width=100&height=100"
              width={100}
              height={100}
            />
            <div>
              <div>
                <p>{fullName}</p>
                <p>{convo.messageDateTime}</p>
              </div>
              {/* todo -- cleanup truncation */}
              {/* todo - html stipping */}
              <p>{message.slice(0, 100)}...</p>
            </div>
            <hr />
          </Link>
        );
      })}
    </main>
  );
}

// todo -- types
// @ts-ignore
// export default withUserBoundary({ Comp: _Home });

export default _Home;
