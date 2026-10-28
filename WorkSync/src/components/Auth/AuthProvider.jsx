import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../../firebaseConfig";
import { apiFetch } from "../../api";

const auth = getAuth(app);

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const userLogin = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
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

    // Fetch user data from the server's user record (MongoDB via the API).
    // This is the only place a role comes from. The client never reads a role
    // out of localStorage or a token claim: the server record is authoritative
    // and every privileged action is re-checked server-side.
    const getUserDataFromDB = async (uid) => {
        try {
            const response = await apiFetch(`/users/${uid}`);
            if (!response.ok) {
                throw new Error(`Error fetching user data: ${response.status}`);
            }
            const userData = await response.json();
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
                    // Re-read the user record from the server on every auth
                    // change so role and status always come from the server.
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