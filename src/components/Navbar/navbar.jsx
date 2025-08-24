import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function GlassNavbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();

   const handleLogin = () => {
     navigate("/signin");
  };

  const handleSignup = () => {
     navigate("/signup");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShow(false); // hide on scroll down
      } else {
        setShow(true); // show on scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


 

  return (
    <div
      className={`fixed left-1/2 transform -translate-x-1/2 top-5 w-[90%] max-w-6xl z-50 
        transition-transform duration-300 ${
          show ? "translate-y-0" : "-translate-y-[150%]"
        }`}
    >
      <div
        className="flex items-center justify-between px-6 py-3 rounded-full 
                   bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
      >
        {/* Left - Nav Links */}
        <ul className="flex items-center gap-6 text-white font-medium">
          <li className="hover:text-gray-300 cursor-pointer">Platform</li>
          <li className="hover:text-gray-300 cursor-pointer">Customer Stories</li>
          <li className="hover:text-gray-300 cursor-pointer">Resources</li>
          <li className="hover:text-gray-300 cursor-pointer">Pricing</li>
        </ul>

        {/* Center - Brand */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-white">
          MyBrand
        </h1>

        {/* Right - Buttons */}
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 border border-white/50 rounded-full text-white hover:bg-white/10">
            EN ▼
          </button>
          <button className="px-4 py-2 rounded-full bg-white text-black font-semibold shadow-md hover:bg-gray-100" onClick={handleLogin}>
            Login
          </button>
          <button className="text-white hover:text-gray-300" onClick={handleSignup}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}
