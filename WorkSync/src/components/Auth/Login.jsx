import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider.jsx";
import { useContext, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SocialsLogin from "./SocialsLogin.jsx";
import axios from 'axios';

const Login = () => {
    const { userLogin, setUser, logOut } = useContext(AuthContext);
    const [error, setError] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            // First attempt to login with Firebase
            const result = await userLogin(email, password);
            const user = result.user;

            try {
                // Check if the user exists in your backend
                const statusResponse = await axios.get(`http://localhost:5000/check-user-status/${user.uid}`);
                if (statusResponse.data.status === 'fired' || !statusResponse.data.status) {
                    // If user is fired, show error and prevent login
                    toast.error("Your access has been revoked. Please contact the administrator if you think this is a mistake.", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    // Sign out the user since they shouldn't be logged in
                    await logOut();
                    setUser(null);
                } else {
                    // If user is not fired, proceed with login
                    setUser(user);
                    navigate(location?.state ? location.state : "/");
                    toast.success("Successfully logged in!", {
                        position: "top-right",
                        autoClose: 3000
                    });
                }
            } catch (statusError) {
                // Handle 404 error (user not found in MongoDB)
                if (statusError.response?.status === 404) {
                    await logOut();
                    setUser(null);
                    toast.error(
                        <div>
                            <h3 className="font-bold mb-2">Account Not Registered</h3>
                            <p className="mb-2">This email exists in Firebase but is not registered in our system.</p>
                            <div className="mt-2">
                                <button 
                                    onClick={() => {
                                        toast.dismiss();
                                        navigate('/auth/register');
                                    }}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                                >
                                    Register Now
                                </button>
                            </div>
                        </div>,
                        {
                            position: "top-center",
                            autoClose: false,
                            hideProgressBar: true,
                            closeOnClick: false,
                            draggable: true,
                            className: 'bg-white text-black',
                        }
                    );
                } else {
                    throw statusError; // Re-throw other errors to be caught by outer catch
                }
            }
        } catch (err) {
            // Handle Firebase and other errors
            let errorMessage = "An error occurred during login.";
            if (err.code === 'auth/user-not-found') {
                errorMessage = "No user found with that email. Please check your email.";
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password. Please try again.";
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            }
            
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            
            setError({ ...error, login: err.code });
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
            <ToastContainer />
        </div>
    );
}

export default Login;