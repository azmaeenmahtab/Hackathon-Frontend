// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../src/components/Dashboard/Home/home'; // Assuming you have a Home component
import SignIn from "./components/AuthPages/Signin/SignIn";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;