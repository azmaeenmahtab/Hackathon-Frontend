import hero from "../../../assets/hero.jpg"
import React from "react";
import { useNavigate } from "react-router-dom";
const Hero = () => {
	const navigate = useNavigate();
	return (
		<section 
  className="relative w-full h-screen bg-cover bg-center" 
  style={{ backgroundImage: `url(${hero})` }}>

   <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

   <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
    <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
      Welcome to Our Event
    </h1>
    <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow">
      Empowering universities and higher education through impactful event management solutions.
    </p>
    <button className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl shadow-lg border border-white/30" onClick={() => navigate("/signup")}>
      Get Started
    </button>
  </div>
</section>
	);
};

export default Hero;

