import React from 'react';
import '../../globals.css';
import { AuthProvider, useAuth } from '../utils/useAuth';
import { SWRConfig } from 'swr';
import { fetchWithUser } from '../utils/fetchers';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppWithAuth>
        <Component {...pageProps} />
      </AppWithAuth>
    </AuthProvider>
  );
}

function AppWithAuth({ children }) {
  const { refreshAccessToken, user } = useAuth();
  return (
    <SWRConfig
      value={{
        fetcher: fetchWithUser(refreshAccessToken),
      }}
    >
      {children}
    </SWRConfig>
  );
}
