import React, { useEffect } from 'react';
import { useState, useContext, createContext } from 'react';
import { BASE_URL, LOCALSTORAGE_AUTH_KEY } from './constants';

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

/**
 * This is a reusable hook that tracks auth state. It lives at the top of the
 * react tree as teh UseAuthProvider provider and allows any child components in
 * the tree to use the `useAuth` hook to access things like `user`.
 */
function useAuthProvider() {
  const [user, setUser] = useState<AuthUser | undefined>(undefined);

  useEffect(() => {
    // try to fetch the user from local store
    setUser(JSON.parse(localStorage.getItem(LOCALSTORAGE_AUTH_KEY)));
  }, []);

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

        localStorage.setItem(
          LOCALSTORAGE_AUTH_KEY,
          JSON.stringify(loggedInUser),
        );
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

        localStorage.setItem(
          LOCALSTORAGE_AUTH_KEY,
          JSON.stringify({ ...user, access }),
        );

        setUser({ ...user, access });
        return user;
      })
      .catch((e) => {
        // Would add sentry or other logging call here
        console.error(e);
      });
  };

  const signout = () => {
    localStorage.removeItem(LOCALSTORAGE_AUTH_KEY);
    setUser(undefined);
  };

  // Return the user object and auth methods
  return {
    user,
    signIn,
    signout,
    refreshAccessToken,
  };
}
