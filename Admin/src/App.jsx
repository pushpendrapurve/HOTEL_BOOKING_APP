import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAdmin } from "./context/AdminContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import HotelOwners from "./pages/HotelOwners";
import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Newsletter from "./pages/Newsletter";
import Contacts from "./pages/Contacts";

const ProtectedRoute = ({ children }) => {
  const { token } = useAdmin();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="owners" element={<HotelOwners />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="contacts" element={<Contacts />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
