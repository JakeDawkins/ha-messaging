import React from 'react';
import { useAuth } from '../utils/useAuth';
import List from './icons/list';

function NavBar() {
  const { signout } = useAuth();
  return (
    <nav className="sticky top-0 left-0 right-0 flex flex-row h-24 p-2 items-center justify-between">
      <List size={32} accessibilityLabel="Menu" color="#000000" />
      <p className="text-xl ml-2 font-bold">Homeaglow</p>
      <button type="button" onClick={() => signout()}>
        Log Out
      </button>
    </nav>
  );
}

export default NavBar;
