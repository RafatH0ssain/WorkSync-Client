import React from 'react';
import { FaGoogle } from "react-icons/fa";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Firebase provider for Google
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();

const SocialsLogin = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // This gives you a Google Access Token.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log('Google login success:', user.displayName);

            // Send user data to backend
            const userData = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                userType: "employee",
                uid: user.uid,
            };

            // Send the data to your backend to store it in MongoDB
            await axios.post('http://localhost:5000/users', userData);
            // After successful login and backend update, navigate to the home page
            navigate('/');  // Redirect to home ("/")
        } catch (error) {
            console.error('Error during Google login:', error.message);
        }
    };

    return (
        <div className="w-full space-y-2">
            <button className="btn btn-outline btn-info" onClick={handleGoogleLogin}>
                <FaGoogle /> Google Authentication
            </button>
        </div>
    );
};

export default SocialsLogin;