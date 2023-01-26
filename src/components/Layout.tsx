import React from 'react';
// import ErrorBoundary from '../errorBoundary';
import NavBar from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * This is a wrapping layout component. It's meant to set up the flow
 * of the page, and place the navbar with the main content.
 *
 * Since this layout isn't used on all pages, it's just imported into the
 * one page it's used on (the list page "/")
 *
 * In a real-world scenario, this would be a great place to place error
 * boundaries and error logging, with easy wins across all pages. So if your
 * main content failed completely, you'd still have a navigation bar to use to
 * go somewhere else.
 */
function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col absolute top-0 bottom-0 right-0 left-0 overflow-y-scroll">
      <NavBar />
      <main className="m-4 mx-auto p-4 w-full">{children}</main>
    </div>
  );
}

export default Layout;
