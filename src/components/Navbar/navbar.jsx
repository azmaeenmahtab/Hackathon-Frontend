import { useState, useEffect } from "react";

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scrolling down → hide navbar
        setShow(false);
      } else {
        // Scrolling up → show navbar
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      } bg-gray-900 text-white shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left - Nav Links */}
        <ul className="flex gap-6">
          <li className="hover:text-gray-400 cursor-pointer">Home</li>
          <li className="hover:text-gray-400 cursor-pointer">About</li>
          <li className="hover:text-gray-400 cursor-pointer">Services</li>
          <li className="hover:text-gray-400 cursor-pointer">Contact</li>
        </ul>

        {/* Center - Brand */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
          UnIvents
        </h1>

        {/* Right - Buttons */}
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-700 transition">
            Login
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

