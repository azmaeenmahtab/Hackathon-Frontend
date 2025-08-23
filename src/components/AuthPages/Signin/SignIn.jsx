/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { app, auth } from "../../../firebase";

function SignIn() {
  const googleProvider = new GoogleAuthProvider();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleCreateUser = async () => {
    try {
      await createUserWithEmailAndPassword(auth, mail, password);
      setMail("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, mail, password);
      console.log("Logged in");
      setMail("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        console.log(res);
        console.log("Logged in");
        setMail("");
        setPassword("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sign In to Your Account
        </h2>

        <input
          type="text"
          placeholder="Enter your E-mail"
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your Password"
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter your Role"
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <button
          onClick={handleLogIn}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
        >
          Sign In
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?
          <button
            onClick={handleCreateUser}
            className="ml-2 text-black font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>

        <div className="mt-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleLogInWithGoogle}
          className="mt-6 flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default SignIn;
