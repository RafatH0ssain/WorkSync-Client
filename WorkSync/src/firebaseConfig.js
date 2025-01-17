// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmnvzV5FRhFS-XP2xQQ0snkwyI2R_m7Vw",
    authDomain: "worksync-2ca3b.firebaseapp.com",
    projectId: "worksync-2ca3b",
    storageBucket: "worksync-2ca3b.firebasestorage.app",
    messagingSenderId: "687204604373",
    appId: "1:687204604373:web:c1b38ab1166cc12d5e055c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;