import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CoursePage from './pages/CoursePage';
import ProfilePage from './pages/ProfilePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import SupportPage from './pages/SupportPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { pb } from './lib/pocketbase';

const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: pb.authStore.isValid ? <Navigate to="/courses" replace /> : <Navigate to="/login" replace />,
      },
      {
        path: 'courses',
        element: (
          <ProtectedRoute>
            <CoursePage />
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
        path: 'course/:id',
        element: (
          <ProtectedRoute>
            <CourseDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'support',
        element: (
          <ProtectedRoute>
            <SupportPage />
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
    ],
  },
];

export const router = createBrowserRouter(routes);
