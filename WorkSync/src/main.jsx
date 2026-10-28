import { StrictMode } from 'react';
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../public/index.css';
import Home from './pages/Home';
import ErrorPage from './ErrorPage';
import RootLayout from './RootLayout';
import ContactUs from './pages/ContactUs';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import PrivateRoute from './components/Auth/PrivateRoute';
import RoleRoute from './components/Auth/RoleRoute';
import AuthLayout from './components/Auth/AuthLayout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Worksheet from './pages/Employee/Worksheet';
import PaymentHistory from './pages/Employee/PaymentHistory';
import EmployeeDetails from './pages/HR/EmployeeDetails';
import Progress from './pages/HR/Progress';
import EmployeeList from './pages/HR/EmployeeList';
import AllEmployeesList from './pages/Admin/AllEmployeeList';
import Payroll from './pages/Admin/Payroll';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
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
      { // Contact Us Page
        path: "/about-us",
        element: <div className='w-11/12 mx-auto'>
          <PrivateRoute>
            <Navbar />
            <AboutUs />
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
      { // All users profile page
        path: '/profile',
        element: <div className='w-11/12 mx-auto'>
          <PrivateRoute>
            <Navbar />
            <Profile />
            <Footer />
          </PrivateRoute>
        </div >,
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
      },
      { // HR Employee-List page. UI role gate only; the server is the boundary.
        path: '/employee-list',
        element: <div className='w-11/12 mx-auto'>
          <PrivateRoute>
            <Navbar />
            <RoleRoute allowedRoles={['hr', 'admin']}>
              <EmployeeList />
            </RoleRoute>
            <Footer />
          </PrivateRoute>
        </div>,
      },
      { // HR Employee-details page. UI role gate only; the server is the boundary.
        path: '/details/:uid',
        element: <div className='w-11/12 mx-auto'>
          <PrivateRoute>
            <Navbar />
            <RoleRoute allowedRoles={['hr', 'admin']}>
              <EmployeeDetails />
            </RoleRoute>
            <Footer />
          </PrivateRoute>
        </div>,
      },
      { // HR Payment History
        path: '/progress',
        element: <div className='w-11/12 mx-auto'>
          <PrivateRoute>
            <Navbar />
            <RoleRoute allowedRoles={['hr', 'admin']}>
              <Progress />
            </RoleRoute>
            <Footer />
          </PrivateRoute>
        </div>,
      },
      { // ADMIN All Employees page. UI role gate only; the server is the boundary.
        path: '/all-employee-list',
        element: <div className='w-11/12 mx-auto'>
          <PrivateRoute>
            <Navbar />
            <RoleRoute allowedRoles={['admin']}>
              <AllEmployeesList />
            </RoleRoute>
            <Footer />
          </PrivateRoute>
        </div>,
      },
      { // ADMIN Payroll Page. UI role gate only; the server is the boundary.
        path: '/payroll',
        element: <div className='w-11/12 mx-auto'>
          <PrivateRoute>
            <Navbar />
            <RoleRoute allowedRoles={['admin']}>
              <Payroll />
            </RoleRoute>
            <Footer />
          </PrivateRoute>
        </div>,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>,
);