import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthProvider";
import SocialsLogin from "./SocialsLogin.jsx";
import { apiFetch } from "../../api";

const Register = () => {
    const { createUser, setUser, updateUserProfile } = useContext(AuthContext);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const name = form.get("name");
        const email = form.get("email");
        const photo = form.get("photo");
        const password = form.get("password");

        if (password.length < 5) {
            setError({ ...error, password: "Password must be more than 6 characters long!" });
            return;
        }

        try {
            const result = await createUser(email, password);
            const user = result.user;
            setUser(user);
            await updateUserProfile({ displayName: name, photoURL: photo });

            // Registration always creates an employee. Roles change only via
            // the server's admin-gated promotion endpoints, never from here.
            const userData = { name, email, photoURL: photo, uid: user.uid, userType: "employee" };

            const response = await apiFetch("/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.message || "Failed to register user.");
            }

            toast.success("Account created. Welcome!");
            navigate("/");
        } catch (err) {
            console.error("Registration error:", err);
            const message = err.message || "Failed to register user.";
            setError({ ...error, backend: message });
            toast.error(message);
        }
    };

    return (
        <div className="pt-6 min-h-screen justify-center items-center text-center poppins-regular">
            <div className="card w-full max-w-lg mx-auto shrink-0 rounded-2xl p-10">
                <h2 className="font-bold text-center text-3xl pt-10">Register your Account</h2>
                <form className="card-body" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="text-black font-bold">Name</span>
                        </label>
                        <input type="text" placeholder="Name" className="input input-bordered" required name="name" />
                        {error.name && <label className="label text-xs text-rose-500">{error.name}</label>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="text-black font-bold">Photo URL</span>
                        </label>
                        <input type="text" placeholder="www.exampleImageURL.com" className="input input-bordered" required name="photo" />
                        {error.photo && <label className="label text-xs text-rose-500">{error.photo}</label>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="text-black font-bold">Email</span>
                        </label>
                        <input type="email" placeholder="email" className="input input-bordered" required name="email" />
                        {error.email && <label className="label text-xs text-rose-500">{error.email}</label>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="text-black font-bold">Password</span>
                        </label>
                        <input type="password" placeholder="password" className="input input-bordered" required name="password" />
                        {error.password && <label className="label text-xs text-rose-500">{error.password}</label>}
                    </div>
                    <p className="text-sm text-gray-500 text-left">
                        New accounts start as Employee. Roles change only through an admin.
                    </p>
                    <div className="form-control mt-6">
                        <button className="btn btn-success text-black rounded-xl border-none hover:bg-gray-500">Register</button>
                        {error.backend && <label className="label text-xs text-rose-500">{error.backend}</label>}
                    </div>
                </form>
                <p className="text-center font-semibold pb-5">Already Have An Account? <Link className="text-red-500" to="/auth/login">Login</Link></p>
            </div>
            <h2 className="text-black text-3xl font-extrabold pt-16 pb-10">OR</h2>
            <SocialsLogin />
        </div>
    );
};

export default Register;