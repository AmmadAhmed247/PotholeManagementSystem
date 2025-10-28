import React from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 shadow-lg w-full flex items-center justify-between px-10 py-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link to={"/"} className="p-2 bg-white/20 rounded-full backdrop-blur-md">
          <MapPin size={28} className="text-white drop-shadow-md" />
        </Link>
        <Link to={"/"} className="text-white text-2xl font-bold tracking-wide">Pothole</Link>
      </div>
      <div className="flex items-center gap-5">
        <Link to={"/complaints"} className="text-white text-lg cursor-pointer hover:scale-105 font-semibold hover:text-green-100 transition-all duration-200">
          Report Complaint
        </Link>
        <Link to={"/viewcomplaints"} className="text-white text-lg cursor-pointer hover:scale-105 font-semibold hover:text-green-100 transition-all duration-200">
          View Complaint
        </Link>
        <button className="text-white cursor-pointer text-lg hover:scale-105 font-semibold hover:text-green-100 transition-all duration-200">
          Login
        </button>
        <button className="bg-white cursor-pointer text-green-700 text-lg font-semibold px-4 py-1.5 rounded-full shadow-md hover:bg-green-100 hover:scale-105 active:scale-95 transition-all duration-200">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Navbar;
