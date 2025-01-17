import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider.jsx";
import { useContext, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SocialsLogin from "./SocialsLogin.jsx";

const Login = () => {
    const { userLogin, setUser } = useContext(AuthContext);
    const [error, setError] = useState({});
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // This prevents the default form submit action (page reload)
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        userLogin(email, password)
            .then((result) => {
                const user = result.user;
                setUser(user);
                navigate(location?.state ? location.state : "/");
            })
            .catch((err) => {
                const errorCode = err.code;
                const errorMessage = err.message;
                setError({ ...error, login: errorCode });

                // Show toast if login fails
                toast.error("Incorrect email or password. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };

    return (
        <div className="mt-6 min-h-screen flex flex-col justify-center items-center bg-black text-white">
            <div className="card bg-white w-full max-w-lg mx-auto shrink-0 rounded-2xl p-10">
                <h2 className="font-bold text-center text-3xl pt-5">Login your Account</h2>
                <form onSubmit={handleSubmit} className="card-body">
                    <div className="form-control">
                        <label className="label">
                            <span className="font-bold text-white">Email</span>
                        </label>
                        <input type="email" placeholder="email" className="input input-bordered" required name="email" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="text-white font-bold">Password</span>
                        </label>
                        <input type="password" placeholder="password" className="input input-bordered" required name="password" />
                        {
                            error.login && (
                                <label className="label text-sm text-red-600">
                                    {error.login}
                                </label>
                            )
                        }
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-success text-white rounded-xl border-none hover:bg-gray-500">Login</button>
                    </div>
                </form>
                <p className="text-center font-semibold pb-5">Don't Have An Account? <Link className="text-red-500" to="/auth/register">Register</Link></p>
            </div>
            <h2 className="text-white text-3xl font-extrabold pt-16 pb-10">OR</h2>
            <SocialsLogin />
            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
}

export default Login;