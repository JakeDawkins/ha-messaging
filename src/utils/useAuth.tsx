/**
 * This is a reusable hook that tracks auth state
 * TODO - flesh this out a bit
 */

import React from 'react';
import { useState, useContext, createContext } from 'react';
import { BASE_URL } from './constants';

const authContext = createContext(undefined);

// Provider component that wraps the app and makes auth object
// available to any child component that calls useAuth().
export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object
// and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

export interface AuthUser {
  access: string;
  refresh: string;
}

// Provider hook that creates auth object and handles state
function useAuthProvider() {
  const [user, setUser] = useState<AuthUser | undefined>(undefined);

  // fetch credentials and save the user to state.
  const signIn = (username, password) => {
    return fetch(BASE_URL + '/token/', {
      body: JSON.stringify({ username, password }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ access, refresh }) => {
        if (!access || !refresh) throw new Error('Invalid token response');

        const loggedInUser = { access, refresh };
        console.log({ loggedInUser });

        setUser(loggedInUser);
        return loggedInUser;
      })
      .catch((e) => {
        // Would add sentry or other logging call here
        console.error(e);
      });
  };

  const refreshAccessToken = () => {
    return fetch(BASE_URL + '/token/refresh', {
      body: JSON.stringify({ refresh: user.refresh }),
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
    })
      .then((res) => res.json())
      .then(({ access }) => {
        if (!access)
          throw new Error('Failed to refresh token. Invalid token response');

        setUser({ ...user, access });
        return user;
      })
      .catch((e) => {
        // Would add sentry or other logging call here
        console.error(e);
      });
  };

  const signout = () => {
    setUser(undefined);
  };

  // Return the user object and auth methods
  return {
    user,
    signIn,
    signout,
  };
}
