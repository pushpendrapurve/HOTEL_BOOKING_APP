import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("admin");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || null);

  const login = (adminData, adminToken) => {
    setAdmin(adminData);
    setToken(adminToken);
    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("adminToken", adminToken);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const authHeaders = { Authorization: `Bearer ${token}` };

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, axios, toast, navigate, authHeaders }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
