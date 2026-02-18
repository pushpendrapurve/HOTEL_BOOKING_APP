import express from 'express'
import { protectUserData } from '../middleware/authMiddleware.js';
import { registerHotel } from '../controllers/hotelController.js';

const hotelRouter = express.Router();

hotelRouter.post('/',protectUserData, registerHotel);

export default hotelRouter;