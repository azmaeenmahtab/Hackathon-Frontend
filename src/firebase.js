/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ✅ FIX: add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsjoziX5vnejJ9_vArojyEnbH-rjwwsCA",
  authDomain: "club-website-authentication.firebaseapp.com",
  projectId: "club-website-authentication",
  storageBucket: "club-website-authentication.firebasestorage.app",
  messagingSenderId: "278408649479",
  appId: "1:278408649479:web:82fd1bca907f19ef2603a2",
  measurementId: "G-B3H531FJYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ✅ Option 1: export separately
export { app, auth };

// ✅ Option 2: default export (object)
export default { app, auth };
