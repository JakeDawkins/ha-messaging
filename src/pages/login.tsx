import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { useAuth } from '../utils/useAuth';

function Login() {
  const { user, signIn } = useAuth();
  const router = useRouter();

  /**
   * Form handling hooks here
   */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const onUsernameChange = useCallback((e) => {
    if (!e?.target) return;
    setUsername(e.target.value);
  }, []);
  const onPasswordChange = useCallback((e) => {
    if (!e?.target) return;
    setPassword(e.target.value);
  }, []);

  /**
   * Fn that actually makes the network request and saves user to store
   */
  const handleSignIn = useCallback(
    (event) => {
      event.preventDefault();
      signIn(username, password);
    },
    [username, password, signIn],
  );

  /**
   * if user already logged in, redirect to home page /
   */
  if (user) {
    console.log('User logged in successfully:', { user });
    router.push('/');
  }

  return (
    <main className="flex flex-col flex-1 p-4 w-48 mx-auto">
      <h1 className="text-4xl font-bold">Login</h1>

      {/* todo -- accessibility of login form */}
      <form onSubmit={handleSignIn} className="flex flex-col w-48 mt-4">
        <input
          type="text"
          onChange={onUsernameChange}
          value={username}
          placeholder="Username"
          className="border px-2 border-black rounded"
        />
        <input
          type="password"
          onChange={onPasswordChange}
          value={password}
          placeholder="Password"
          className="mt-4 border px-2 border-black rounded"
        />
        <button
          type="submit"
          className="border border-black w-32 mt-4 hover:bg-gray-100"
        >
          Login
        </button>
      </form>
      {/* <p className="mt-4 text-red-700">TODO error message</p> */}
    </main>
  );
}

export default Login;
