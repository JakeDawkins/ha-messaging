import React, { useEffect } from 'react';
import useSwr from 'swr';
import { useRouter } from 'next/router';

import { useAuth } from '../utils/useAuth';
import { Conversation } from '../types';
import Layout from '../components/Layout';
import ConversationComp from '../components/Conversation';
import UserBoundary from '../components/UserBoundary';

function _Home() {
  const { user } = useAuth();

  const {
    data: conversations,
    isLoading,
    error,
  } = useSwr<Conversation[]>(user ? [`/cp/conversations/`, user] : null);

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

function Home() {
  return (
    <UserBoundary>
      <_Home />
    </UserBoundary>
  );
}
export default Home;
