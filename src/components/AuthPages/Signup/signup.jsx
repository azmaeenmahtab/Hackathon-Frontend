import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebase";

function SignUp() {
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role

  async function syncProfile(user, role) {
    const token = await user.getIdToken();
    console.log(token);
    await fetch("http://localhost:4000/api/signup/auth/sync", {
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
      console.log("createUserWithEmailAndPassword response:", res);
      const syncRes = await syncProfile(res.user, role);
      console.log("syncProfile response:", syncRes);
      console.log("Signed up as:", role);
      console.log("Signed up user:", res.user);
      navigate("/signin"); // Navigate to login after successful signup
    } catch (error) {
      console.error(error);
    }
  };

  // Google signup (first time) with role
  const handleGoogleSignUp = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      console.log("signInWithPopup response:", res);
      const syncRes = await syncProfile(res.user, role);
      console.log("syncProfile response:", syncRes);
      console.log("Google signup as:", role);
      console.log("Signed up user:", res.user);
      navigate("/signin"); // Navigate to login after successful Google signup
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
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
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      >
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleSignUp} className="w-full bg-green-600 text-white py-2 rounded mb-2">
        Sign Up with Email
      </button>
      <button onClick={handleGoogleSignUp} className="w-full bg-red-500 text-white py-2 rounded">
        Sign Up with Google
      </button>
    </div>
  );
}

export default SignUp;
