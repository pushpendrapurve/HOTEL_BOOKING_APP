import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Trip Mood", path: "/trip-mood" },
    { name: "FAQ", path: "/faq" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {user,setUser, navigate, isOwner, setShowHotelReg, isDarkMode, toggleDarkMode, hasPendingHotel} = useAppContext();
  
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
    localStorage.removeItem("hotelApproved");
    localStorage.removeItem("hasPendingHotel");
    setUser(null);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/90 shadow-md text-gray-700 dark:text-gray-200 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo2}
          alt="logo"
          className={`h-15 ${isScrolled && !isDarkMode && "invert opacity-80"}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white"
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700 dark:bg-gray-200" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}

        {user && (<button
          className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
            isScrolled ? "text-black dark:text-gray-200 dark:border-gray-400" : "text-white"
          } transition-all ${hasPendingHotel ? "opacity-70 cursor-default" : ""}`}
          onClick={() => {
            if (hasPendingHotel) return;
            isOwner ? navigate("/owner") : setShowHotelReg(true);
          }}
        >
          {isOwner ? "Dashboard" : hasPendingHotel ? "⏳ Approval Pending" : "List Your Hotel"}
        </button>)}

      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
            isScrolled ? "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" : "text-white hover:bg-white/20"
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      
        {/* Login OR Avatar */}
        {user ? (
          <div className="relative group">
            {/* Avatar */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold cursor-pointer overflow-hidden ${
                isScrolled ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              {user.image ? (
                <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user.email?.charAt(0).toUpperCase()
              )}
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-50 bg-white dark:bg-gray-800 shadow-lg rounded-xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform translate-y-2 transition-all duration-300 overflow-hidden">
              <p className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                {user.email}
              </p>

              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
                onClick={() => navigate("/my-bookings")}
              >
                My Bookings
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            className={`w-9 h-9 flex items-center justify-center rounded-full font-bold overflow-hidden ${
              isScrolled ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {user.image ? (
              <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              user.email?.charAt(0).toUpperCase()
            )}
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
        className={`fixed top-0 left-0 w-full h-screen bg-white dark:bg-gray-900 text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 dark:text-gray-200 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeMenu} alt="close-menu" className={`h-6.5 ${isDarkMode && "invert"}`} />
        </button>

        {/* Dark Mode Toggle in Mobile Menu */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 text-sm"
        >
          {isDarkMode ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Light Mode
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dark Mode
            </>
          )}
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
          className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all ${hasPendingHotel ? "opacity-70 cursor-default" : ""}`}
          onClick={() => {
            if (hasPendingHotel) return;
            isOwner ? navigate("/owner") : setShowHotelReg(true);
          }}
        >
          {isOwner ? "Dashboard" : hasPendingHotel ? "⏳ Approval Pending" : "List Your Hotel"}
        </button>

        {/* Login OR Logout */}
        {user ? (
          <>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/profile");
              }}
              className="bg-gray-800 text-white px-8 py-2.5 rounded-full transition-all duration-500"
            >
              My Profile
            </button>

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
