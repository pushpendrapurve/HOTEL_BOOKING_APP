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
  const [hotelApproved, setHotelApproved] = useState(
    localStorage.getItem("hotelApproved") === "true"
  );
  const [hasPendingHotel, setHasPendingHotel] = useState(
    localStorage.getItem("hasPendingHotel") === "true"
  );

  // fetchUser will always set the correct isOwner value — no need to reset here


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
        // isOwner = has a hotel (approved or not) with hotelOwner role, OR has approved hotel
        const shouldBeOwner = (data.role === "hotelOwner" && data.hasHotel) || data.hotelApproved;
        setIsOwner(shouldBeOwner);
        localStorage.setItem("isOwner", shouldBeOwner.toString());
        setHotelApproved(data.hotelApproved === true);
        localStorage.setItem("hotelApproved", (data.hotelApproved === true).toString());
        setHasPendingHotel(data.hasPendingHotel === true);
        localStorage.setItem("hasPendingHotel", (data.hasPendingHotel === true).toString());
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
    hotelApproved,
    hasPendingHotel,
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
