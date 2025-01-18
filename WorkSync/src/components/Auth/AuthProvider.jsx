import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

// Assuming your MongoDB backend is running on localhost:5000
const MONGO_URL = 'http://localhost:5000';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userLogin = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
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
            const response = await fetch(`${MONGO_URL}/users/${uid}`);
            if (response.ok) {
                const userData = await response.json();
                // console.log("Fetched user data from DB:", userData);
                return userData;
            } else {
                throw new Error(`Error fetching user data: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    setUser(currentUser);

                    // Fetch user data from MongoDB using the UID
                    const userDoc = await getUserDataFromDB(currentUser.uid);

                    // If user data is fetched successfully, set userDetails
                    if (userDoc) {
                        setUserDetails({
                            email: currentUser.email,
                            name: userDoc.name || "Anonymous",  // Use name from MongoDB
                            userType: userDoc.userType || "employee", // Default to 'employee' if undefined
                        });
                    } else {
                        setUserDetails({
                            email: currentUser.email,
                            name: currentUser.displayName || "Anonymous",  // Fallback name
                            userType: "employee", // Default to 'employee'
                        });
                    }
                } else {
                    setUser(null);
                    setUserDetails(null);
                }
            } catch (error) {
                console.error("Error in auth state change:", error);
            } finally {
                setLoading(false);
            }
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