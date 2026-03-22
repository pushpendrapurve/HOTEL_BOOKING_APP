import express from "express";
import {
  registerAdmin, loginAdmin, getDashboardStats,
  getAllUsers, getAllOwners, getAllHotels, getAllRooms,
  getAllBookings, getNewsletterSubscribers, deleteUser, deleteHotel,
  submitContact, getAllContacts, markContactRead, deleteContact,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/contact", submitContact); // public

adminRouter.get("/dashboard", protectAdmin, getDashboardStats);
adminRouter.get("/users", protectAdmin, getAllUsers);
adminRouter.get("/owners", protectAdmin, getAllOwners);
adminRouter.get("/hotels", protectAdmin, getAllHotels);
adminRouter.get("/rooms", protectAdmin, getAllRooms);
adminRouter.get("/bookings", protectAdmin, getAllBookings);
adminRouter.get("/newsletter", protectAdmin, getNewsletterSubscribers);
adminRouter.get("/contacts", protectAdmin, getAllContacts);
adminRouter.patch("/contacts/:id/read", protectAdmin, markContactRead);
adminRouter.delete("/contacts/:id", protectAdmin, deleteContact);
adminRouter.delete("/users/:id", protectAdmin, deleteUser);
adminRouter.delete("/hotels/:id", protectAdmin, deleteHotel);

export default adminRouter;
