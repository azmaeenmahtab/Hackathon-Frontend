


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebase";

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
      await syncProfile(res.user); // no role here
      console.log("Signed in user:", res.user);
      if (res && res.user) {
        console.log("User UID:", res.user.uid);
        // Get token and call POST API with uid in body and token in header
        const token = await res.user.getIdToken();
        const apiRes = await fetch("http://localhost:4000/auth/get-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ uid: res.user.uid })
        });
        const apiData = await apiRes.json();
        localStorage.setItem("uid", res.user.uid);
        console.log("/auth/getuser response:", apiData);
              console.log("Signed in user token:", res.user.accessToken);

        // Navigate based on role
        if (apiData && apiData.profile.role === "student") {
          navigate("/student/dashboard");
        } else if (apiData && apiData.profile.role === "admin") {
          navigate("/admin/dashboard");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncProfile(res.user); // no role here
      console.log("Google Sign in");
      console.log("Signed in user:", res.user);
      if (res && res.user) {
        console.log("User UID:", res.user.uid);
        // Get token and call POST API with uid in body and token in header
        const token = await res.user.getIdToken();
        const apiRes = await fetch("http://localhost:4000/auth/get-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ uid: res.user.uid })
        });
        const apiData = await apiRes.json();
        console.log("/auth/getuser response:", apiData);
        // Navigate based on role
        if (apiData && apiData.profile.role === "student") {
          navigate("/student/dashboard");
        } else if (apiData && apiData.profile.role === "admin") {
          navigate("/admin/dashboard");
        }
      }
      console.log("Signed in user token:", res.user.accessToken);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      <button onClick={handleSignIn} className="w-full bg-black text-white py-2 rounded mb-2">
        Sign In
      </button>
      <button onClick={handleGoogleSignIn} className="w-full bg-blue-600 text-white py-2 rounded">
        Sign In with Google
      </button>
    </div>
  );
}

export default SignIn;
