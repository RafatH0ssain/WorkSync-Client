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

const router = createBrowserRouter([
  { // Home Page
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />
  },
  { // Contact Us Page
    path: "/contactUs",
    element: <ContactUs />,
    errorElement: <ErrorPage />
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Navbar />
      <RouterProvider router={router}></RouterProvider>
      <Footer />
    </AuthProvider>
  </StrictMode>,
)
