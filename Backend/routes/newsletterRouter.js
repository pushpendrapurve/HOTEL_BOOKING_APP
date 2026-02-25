import express from "express";
import { subscribeNewsletter, getSubscribers } from "../controllers/newsletterController.js";
import { protectUserData } from "../middleware/authMiddleware.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/subscribe", subscribeNewsletter);
newsletterRouter.get("/subscribers", protectUserData, getSubscribers);

export default newsletterRouter;
