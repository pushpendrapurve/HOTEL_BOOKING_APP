import express from "express";
import { protectUserData } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities } from "../controllers/userController.js";

const router = express.Router();

router.get('/', protectUserData ,getUserData);
router.post('/store-recent-search', protectUserData ,storeRecentSearchedCities);


export default router;