import React, { useEffect } from 'react';
import useSwr from 'swr';
import { useRouter } from 'next/router';

import { useAuth } from '../utils/useAuth';
import { Conversation } from '../types';
import Layout from '../components/Layout';
import ConversationComp from '../components/Conversation';

function _Home() {
  const { user } = useAuth();
  const router = useRouter();

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
    <Layout>
      <>
        <h1 className="text-xl font-bold">Messages</h1>
        {conversations.map((convo) => {
          return <ConversationComp key={convo.id} conversation={convo} />;
        })}
      </>
    </Layout>
  );
}

// todo -- types
// @ts-ignore
// export default withUserBoundary({ Comp: _Home });

export default _Home;
