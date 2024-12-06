import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';

// Pages
import RootLayout from './layouts/RootLayout';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ContactUsPage from './pages/ContactUsPage';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import { pb, isAdmin } from './lib/pocketbase';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: pb.authStore.isValid ? (
          <Navigate to="/courses" replace />
        ) : (
          <Navigate to="/login" replace />
        ),
      },
      {
        path: 'courses',
        element: (
          <ProtectedRoute>
            <CoursesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'course/:id',
        element: (
          <ProtectedRoute>
            <CourseDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            {isAdmin() ? <SettingsPage /> : <Navigate to="/courses" replace />}
          </ProtectedRoute>
        ),
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicyPage />,
      },
      {
        path: 'terms-and-conditions',
        element: <TermsAndConditionsPage />,
      },
      {
        path: 'contact-us',
        element: <ContactUsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
