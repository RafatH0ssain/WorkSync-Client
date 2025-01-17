import React from 'react';
import { FaGoogle } from "react-icons/fa";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

// Firebase provider for Google
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();

const SocialsLogin = () => {
    const navigate = useNavigate();  // Initialize the useNavigate hook

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // This gives you a Google Access Token.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log('Google login success:', user.displayName);

            // After successful login, navigate to the home page
            navigate('/');  // Redirect to home ("/")
        } catch (error) {
            console.error('Error during Google login:', error.message);
        }
    };

    return (
        <div>
            <div className="w-full space-y-2">
                <button className="btn btn-outline btn-info" onClick={handleGoogleLogin}>
                    <FaGoogle /> Login With Google
                </button>
            </div>
        </div>
    );
};

export default SocialsLogin;