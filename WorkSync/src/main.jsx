import { StrictMode } from 'react'
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Home from './pages/Home';
import ErrorPage from './ErrorPage';
import AuthProvider from './components/Auth/AuthProvider';
import ContactUs from './pages/ContactUs';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import PrivateRoute from './components/Auth/PrivateRoute';
import AuthLayout from './components/Auth/AuthLayout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Worksheet from './pages/Employee/Worksheet';
import PaymentHistory from './pages/Employee/PaymentHistory';

const router = createBrowserRouter([
  { // Home Page
    path: "/",
    element: <div className='w-11/12 mx-auto'>
      <PrivateRoute>
        <Navbar />
        <Home />
        <Footer />
      </PrivateRoute>
    </div>,
    errorElement: <ErrorPage />,
  },
  { // Contact Us Page
    path: "/contactUs",
    element: <div className='w-11/12 mx-auto'>
      <PrivateRoute>
        <Navbar />
        <ContactUs />
        <Footer />
      </PrivateRoute>
    </div>,
    errorElement: <ErrorPage />,
  },
  { // Error Page
    path: "/*",
    element: <ErrorPage />
  },
  { // Login & Registration systems page
    path: '/auth',
    element: <div className='w-11/12 mx-auto'><AuthLayout /></div>,
    children: [
      {
        path: '/auth/login',
        element: <Login />
      },
      {
        path: '/auth/register',
        element: <Register />
      },
    ],
  },
  { // EMPLOYEE Work-Sheet page
    path: '/work-sheet',
    element: <div className='w-11/12 mx-auto'>
      <PrivateRoute>
        <Navbar />
        <Worksheet />
        <Footer />
      </PrivateRoute>
    </div>,
  },
  { // EMPLOYEE Payment History
    path: '/payment-history',
    element: <div className='w-11/12 mx-auto'>
      <PrivateRoute>
        <Navbar />
        <PaymentHistory />
        <Footer />
      </PrivateRoute>
    </div>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} ></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)