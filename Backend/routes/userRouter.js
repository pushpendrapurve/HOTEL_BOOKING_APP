import express from "express";
import { protectUserData } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities, getProfile, updateProfile } from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get('/', protectUserData ,getUserData);
router.post('/store-recent-search', protectUserData ,storeRecentSearchedCities);
router.get('/profile', protectUserData, getProfile);
router.put('/profile', protectUserData, upload.single("image"), updateProfile);

export default router;