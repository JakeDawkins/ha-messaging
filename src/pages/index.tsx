import React from 'react';
import useSwr from 'swr';
import fetcher from '../utils/fetchers';

function Home() {
  const { data, isLoading, error } = useSwr(
    'https://fakerapi.it/api/v1/companies',
    fetcher,
  );

  if (isLoading)
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  if (error || !data)
    return (
      <main>
        <p>Error</p>
      </main>
    );

  return (
    <main>
      <h1 className="underline">Hey</h1>
      <p>{JSON.stringify(data)}</p>
    </main>
  );
}

export default Home;
