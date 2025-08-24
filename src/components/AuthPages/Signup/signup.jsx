import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebase";
import googlepic from "../../../assets/google_image.png";

function SignUp() {
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role

  async function syncProfile(user, role) {
    const token = await user.getIdToken();
    await fetch("https://hackathon-backend-1-2wm6.onrender.com/api/signup/auth/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }), // send role only on signup
    });
  }

  // Email signup
  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, mail, password);
      await syncProfile(res.user, role);
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  // Google signup
  const handleGoogleSignUp = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncProfile(res.user, role);
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 relative">
        {/* Branding */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-700">UnIvents</h1>
          <p className="text-gray-500 mt-2">Create an account to get started</p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 rounded-xl p-3 outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 rounded-xl p-3 outline-none transition"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 rounded-xl p-3 outline-none transition"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleSignUp}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Sign Up with Email
          </button>
          <button
            onClick={handleGoogleSignUp}
            className="w-full bg-white border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <img src={googlepic} alt="Google" className="w-6 h-6" />
            Sign Up with Google
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <span
            className="text-purple-600 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
