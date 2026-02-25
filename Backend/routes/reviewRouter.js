import express from "express";
import { protectUserData } from "../middleware/authMiddleware.js";
import { createReview, getRoomReviews, getHotelReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", protectUserData, createReview);
reviewRouter.get("/room/:roomId", getRoomReviews);
reviewRouter.get("/hotel/:hotelId", getHotelReviews);

export default reviewRouter;
