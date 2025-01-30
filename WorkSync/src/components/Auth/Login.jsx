import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider.jsx";
import { useContext, useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';
import SocialsLogin from './SocialsLogin.jsx'

const BACKEND_URL = 'https://work-sync-server-eight.vercel.app';

// Create axios instance with default config
const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    }
});

const Login = () => {
    const { userLogin, setUser, logOut } = useContext(AuthContext);
    const [error, setError] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const checkUserStatus = async (uid) => {
        try {
            const response = await api.get(`/check-user-status/${uid}`);
            return response.data;
        } catch (error) {
            console.error('Error checking user status:', error);
            if (error.response?.status === 403) {
                throw new Error('CORS error: Not allowed to access the server');
            }
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError({});

        try {
            const form = e.target;
            const email = form.email.value;
            const password = form.password.value;

            // First login with Firebase
            const result = await userLogin(email, password);

            if (!result?.user?.uid) {
                throw new Error('No user ID received from Firebase');
            }

            try {
                const statusData = await checkUserStatus(result.user.uid);

                if (statusData.status === 'fired' || !statusData.status) {
                    await logOut();
                    setUser(null);
                    toast.error("Your access has been revoked. Please contact the administrator.");
                    return;
                }

                // If everything is okay, proceed with login
                setUser(result.user);
                navigate(location?.state ? location.state : "/");
                toast.success("Successfully logged in!");
            } catch (statusError) {
                // Handle status check errors
                console.error('Status check error:', statusError);
                if (statusError.message.includes('CORS')) {
                    toast.error("Unable to connect to the server. Please try again later.");
                } else {
                    toast.error("Error verifying user status. Please try again.");
                }
                await logOut();
                setUser(null);
            }

        } catch (err) {
            console.error('Login error:', err);

            let errorMessage = "An error occurred during login.";
            if (err.code === 'auth/user-not-found') {
                errorMessage = "No user found with that email.";
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password.";
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            }

            toast.error(errorMessage);
            setError({ login: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 min-h-screen flex flex-col justify-center items-center text-black poppins-regular">
            <div className="card w-full max-w-lg mx-auto shrink-0 rounded-2xl p-10">
                <h2 className="font-bold text-center text-3xl pt-5">Login to your Account</h2>
                <form onSubmit={handleSubmit} className="card-body">
                    <div className="form-control">
                        <label className="label">
                            <span className="font-bold text-black">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="email"
                            className="input input-bordered"
                            required
                            name="email"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="text-black font-bold">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="password"
                            className="input input-bordered"
                            required
                            name="password"
                            disabled={isLoading}
                        />
                        {error.login && (
                            <label className="label text-sm text-red-600">
                                {error.login}
                            </label>
                        )}
                    </div>
                    <div className="form-control mt-6">
                        <button
                            className={`btn btn-success text-white rounded-xl border-none hover:bg-gray-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="text-center font-semibold">
                    Don't Have An Account? <Link className="text-red-500" to="/auth/register">Register</Link>
                </p>
            </div>
            <h2 className="text-black text-3xl font-extrabold pt-5 pb-10">OR</h2>
            <SocialsLogin />
        </div>
    );
}

export default Login;