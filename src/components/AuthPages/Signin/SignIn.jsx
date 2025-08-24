import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebase";
import googlepic from "../../../assets/google_image.png"

function SignIn() {
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  async function syncProfile(user) {
    const token = await user.getIdToken();
    await fetch("http://localhost:4000/api/login/auth/login", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, mail, password);
      await syncProfile(res.user);
      const token = await res.user.getIdToken();
      const apiRes = await fetch("http://localhost:4000/auth/get-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: res.user.uid }),
      });
      const apiData = await apiRes.json();
      localStorage.setItem("uid", res.user.uid);

      if (apiData && apiData.profile.role === "student") {
        navigate("/student/dashboard");
      } else if (apiData && apiData.profile.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncProfile(res.user);
      const token = await res.user.getIdToken();
      const apiRes = await fetch("http://localhost:4000/auth/get-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: res.user.uid }),
      });
      const apiData = await apiRes.json();
      localStorage.setItem("uid", res.user.uid);

      if (apiData && apiData.profile.role === "student") {
        navigate("/student/dashboard");
      } else if (apiData && apiData.profile.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 relative">
        {/* Project Branding */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-700">UnIvents</h1>
          <p className="text-gray-500 mt-2">Welcome back! Sign in to continue.</p>
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
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleSignIn}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Sign In
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <img src={googlepic} alt="Google" className="w-6 h-6" />
            Sign in with Google
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          Don't have an account? <span className="text-purple-600 cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
