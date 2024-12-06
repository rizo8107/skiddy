import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { pb } from './lib/pocketbase';
import { router } from './routes';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient();

pb.authStore.onChange(() => {
  console.log('authStore changed');
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;