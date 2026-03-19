import axios from "axios";
import { createContext, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("user")) || null
);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.pathname]);

  const token = localStorage.getItem("token");

  const [isOwner, setIsOwner] = useState(
  localStorage.getItem("isOwner") === "true"
  );

  useEffect(() => {
  // Only set isOwner based on localStorage initially, 
  // fetchUser will update it with the correct value based on actual hotel ownership
  if (user?.role === "hotelOwner") {
    // Don't automatically set to true, let fetchUser determine the correct value
    // This prevents the issue where user shows as owner without having a hotel
  } else {
    setIsOwner(false);
    localStorage.setItem("isOwner", "false");
  }
}, [user]);


  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? stored === "true" : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    if (!token) return; // Don't fetch if no token
    
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        // Only set isOwner to true if user has hotelOwner role AND actually has a hotel
        const shouldBeOwner = data.role === "hotelOwner" && data.hasHotel;
        setIsOwner(shouldBeOwner);
        localStorage.setItem("isOwner", shouldBeOwner.toString());
        setSearchedCities(data.recentSearchedCities);
      } else {
        //Retry Fetching User Details after 5 seconds
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchUser();
    }
  }, [user, token]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const refreshOwnerStatus = async () => {
    if (user && token) {
      await fetchUser();
    }
  };

  const value = {
    currency,
    navigate,
    isOwner,
    setIsOwner,
    axios,
    token,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    user,
    setUser,
    rooms,
    setRooms,
    toast,
    refreshOwnerStatus,
    isDarkMode,
    toggleDarkMode,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
