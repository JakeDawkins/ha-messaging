import React from 'react';
import '../../globals.css';
import { AuthProvider } from '../utils/useAuth';
import { SWRConfig } from 'swr';
import { fetchWithUser } from '../utils/fetchers';

export default function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchWithUser,
        // revalidateOnReconnect: false, // offline -> online
        // revalidateOnFocus: false, // tab switching
      }}
    >
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  );
}
