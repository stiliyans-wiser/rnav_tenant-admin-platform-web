import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './features/layout/RootLayout.tsx';
import { Tenants } from './features/tenants/Tenants.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'tenants',
        element: <Tenants />,
      },
      {
        path: '',
        element: <Navigate to="/tenants" replace />,
      },
    ],
  },
]); 