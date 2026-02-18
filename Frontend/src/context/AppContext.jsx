import axios from "axios";
import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || $;
  const navigate = useNavigate();
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
  if (user?.role === "hotelOwner") {
    setIsOwner(true);
    localStorage.setItem("isOwner", "true");
  } else {
    setIsOwner(false);
    localStorage.setItem("isOwner", "false");
  }
}, [user]);


  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

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
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
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
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

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
    toast
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
