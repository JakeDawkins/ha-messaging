import React from 'react';
// import ErrorBoundary from '../errorBoundary';
import NavBar from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col absolute top-0 bottom-0 right-0 left-0 overflow-y-scroll">
      {/* <ErrorBoundary> */}
      <NavBar />
      {/* <ErrorBoundary> */}
      <main className="m-4 mx-auto p-4 w-full">{children}</main>
      {/* </ErrorBoundary> */}
      {/* Footer */}
      {/* </ErrorBoundary> */}
    </div>
  );
}

export default Layout;
