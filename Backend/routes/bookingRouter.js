import express from "express"
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from "../controllers/bookingController.js";
import { protectUserData } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI)
bookingRouter.post('/book', protectUserData, createBooking)
bookingRouter.get('/user', protectUserData, getUserBookings)
bookingRouter.get('/hotel', protectUserData, getHotelBookings)

export default bookingRouter