import React from 'react';
import List from './icons/list';

function NavBar() {
  return (
    <nav className="sticky top-0 left-0 right-0 flex flex-row h-24 p-2 items-center">
      <List size={32} accessibilityLabel="Menu" color="#000000" />
      <p className="text-xl ml-2 font-bold">Homeaglow</p>
    </nav>
  );
}

export default NavBar;
