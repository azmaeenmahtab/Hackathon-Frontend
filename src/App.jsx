// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../src/components/Dashboard/Home/home';  
import SignIn from "./components/AuthPages/Signin/SignIn";
import SignUp from "./components/AuthPages/Signup/signup";
import AdminDashboard from './components/Admin Dashboard/admindashboard';
import AdminManageEvents from './components/Admin Dashboard/manageEvents';
import StudentDashboard from './components/Student Dashboard/studentdashboard';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/admin/manage-events" element={<AdminManageEvents />} />
  {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;