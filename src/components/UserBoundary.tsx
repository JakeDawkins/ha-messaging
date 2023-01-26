import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useAuth } from '../utils/useAuth';

interface UserBoundaryProps {
  children: React.ReactElement;
}

// function UserBoundary({ children }: UserBoundaryProps) {
//   const { user } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       console.log('No user logged in, redirecting.');
//       router.push('/login');
//     }
//   }, [router, user]);

//   return children;
// }

// export default UserBoundary;

// // todo - types
// export function withUserBoundary(Comp) {
//   return (
//     <UserBoundary>
//       {Comp}
//     </UserBoundary>
//   );
// }

export default function UserBoundary({ children }: UserBoundaryProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || user) return;
    if (router.isReady) {
      router.push({ pathname: '/login' });
    }
  }, [user, loading, router]);

  if (user) return <>{children}</>;

  return null;
}
