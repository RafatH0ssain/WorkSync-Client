import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../../firebaseConfig";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = async (email, password) => {
        setLoading(true);
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const userLogin = async (email, password) => {
        setLoading(true);
        return await signInWithEmailAndPassword(auth, email, password).catch(() => {
            setLoading(false);
        });
    };

    const logOut = async () => {
        setLoading(true);
        return await signOut(auth);
    };

    const updateUserProfile = async (updatedData) => {
        return await updateProfile(auth.currentUser, updatedData);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Keeps full user object for Firebase logic
                setUserDetails({
                    userEmail: currentUser.email,
                    userName: currentUser.displayName || "Anonymous",
                });
            } else {
                setUser(null);
                setUserDetails(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        userDetails,
        setUser,
        createUser,
        logOut,
        userLogin,
        loading,
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};

export default AuthProvider;