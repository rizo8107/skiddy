import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { pb } from './lib/pocketbase';
import { router } from './routes';
import { Toaster } from './components/ui/toaster';
import { notificationService } from './services/notificationService';

const queryClient = new QueryClient();

pb.authStore.onChange(() => {
  console.log('authStore changed');
});

function App() {
  useEffect(() => {
    // Initialize notification service
    notificationService.init().catch(error => {
      console.error('Failed to initialize notification service:', error);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;