import { FaGoogle } from "react-icons/fa";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiFetch } from '../../api';

// Firebase provider for Google
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();

const SocialsLogin = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // New sign-ins always start as employee. Roles change only through
            // the server's admin-gated promotion endpoints; the server is the
            // authorization boundary.
            const userData = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                userType: "employee",
                uid: user.uid,
            };

            const response = await apiFetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            // 400 means the server record already exists, which is expected
            // for a returning user.
            if (!response.ok && response.status !== 400) {
                throw new Error('Failed to save the account on the server');
            }
            navigate('/');
        } catch (error) {
            console.error('Error during Google login:', error.message);
            toast.error('Google sign-in failed. Please try again.');
        }
    };

    return (
        <div className="space-y-2">
            <button className="btn btn-outline btn-info mx-auto" onClick={handleGoogleLogin}>
                <FaGoogle /> Google Authentication
            </button>
        </div>
    );
};

export default SocialsLogin;
