import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Navbar = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-9 invert opacity-80" />
      </Link>

      <button
        onClick={handleLogout}
        className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
