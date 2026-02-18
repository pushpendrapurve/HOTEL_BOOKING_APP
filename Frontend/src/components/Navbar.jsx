import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotel", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {user,setUser, navigate, isOwner, setShowHotelReg} = useAppContext();
  
  const location = useLocation();


  // Scroll Effect
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isOwner");
    setUser(null);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled && "invert opacity-80"}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}

        {user && (<button
          className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
            isScrolled ? "text-black" : "text-white"
          } transition-all`}
          onClick={() => isOwner? navigate("/owner") : setShowHotelReg(true)}
        >
         {isOwner? "Dashboard" : "List Your Hotel"}
        </button>)}

      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`${isScrolled && "invert"} h-7 transition-all duration-500`}
        />

        {/* Login OR Avatar */}
        {user ? (
          <div className="relative group">
            {/* Avatar */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold cursor-pointer ${
                isScrolled ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              {user.email?.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform translate-y-2 transition-all duration-300 overflow-hidden">
              <p className="px-4 py-2 text-sm text-gray-600 border-b">
                {user.email}
              </p>

              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => navigate("/my-bookings")}
              >
                My Bookings
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className={`px-8 py-2.5 rounded-full ml-4 cursor-pointer transition-all duration-500 ${
              isScrolled ? "text-white bg-black" : "bg-white text-black"
            }`}
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        {user && (
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-full font-bold ${
              isScrolled ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {user.email?.charAt(0).toUpperCase()}
          </div>
        )}

        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="menu"
          className={`${isScrolled && "invert"} cursor-pointer`}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeMenu} alt="close-menu" className="h-6.5" />
        </button>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        <button
          className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
          onClick={() => {
            // setIsMenuOpen(false);
           isOwner? navigate("/owner") : setShowHotelReg(true)
          }}
        >
           {isOwner? "Dashboard" : "List Your Hotel"}
        </button>

        {/* Login OR Logout */}
        {user ? (
          <>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/my-bookings");
              }}
              className="bg-gray-800 text-white px-8 py-2.5 rounded-full transition-all duration-500"
            >
              My Bookings
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="bg-red-500 text-white px-8 py-2.5 rounded-full transition-all duration-500"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/login");
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 hover:cursor-pointer"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
