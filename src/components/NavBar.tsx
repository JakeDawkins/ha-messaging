import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useAuth } from '../utils/useAuth';

function NavBar() {
  return (
    <nav className="sticky top-0 left-0 right-0 flex flex-row">
      <div>img</div>
      <p>Homeaglow</p>
    </nav>
  );
}

export default NavBar;
