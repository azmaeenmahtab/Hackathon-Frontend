// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'; // Assuming you have a Home component
import SignIn from "./SignIn";

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