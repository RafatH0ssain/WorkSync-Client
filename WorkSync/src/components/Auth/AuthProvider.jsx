import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const MONGO_URL = 'https://work-sync-server-eight.vercel.app/';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [authChecked, setAuthChecked] = useState(false);
    const navigate = useNavigate();

    const userLogin = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log(result);
            return result;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log(result);
            return result;
        } catch (error) {
            console.error("Create user error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            setUserDetails(null);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (updatedData) => {
        try {
            await updateProfile(auth.currentUser, updatedData);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    // Fetch user data from MongoDB
    const getUserDataFromDB = async (uid) => {
        try {
            const response = await fetch(`${MONGO_URL}users/${uid}`);
            if (!response.ok) {
                throw new Error(`Error fetching user data: ${response.status}`);
            }
            const userData = await response.json();
            console.log(userData);
            return userData;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            try {
                if (currentUser) {
                    // Fetch user data from MongoDB
                    const userDoc = await getUserDataFromDB(currentUser.uid);

                    if (userDoc) {
                        setUser(currentUser);
                        setUserDetails({
                            email: currentUser.email,
                            name: userDoc.name || "Anonymous",
                            userType: userDoc.userType || "employee",
                            status: userDoc.status
                        });
                    } else {
                        // If no MongoDB data, sign out the user
                        await signOut(auth);
                        setUser(null);
                        setUserDetails(null);
                    }
                } else {
                    setUser(null);
                    setUserDetails(null);
                }
            } catch (error) {
                console.error("Error in auth state change:", error);
                setUser(null);
                setUserDetails(null);
            } finally {
                setLoading(false);
                // setAuthChecked(true);
            }
        });
        return () => unsubscribe();
    }, []);

    // if (!authChecked) {
    //     return <div>Initializing...</div>;
    // }

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