import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protectUserData } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability, updateRoom, deleteRoom } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post('/',upload.array("images",4), protectUserData, createRoom)
roomRouter.get('/',getRooms)
roomRouter.get('/owner',protectUserData,getOwnerRooms)
roomRouter.post('/toggle-availability',protectUserData, toggleRoomAvailability)
roomRouter.put('/:roomId', upload.array("images",4), protectUserData, updateRoom)
roomRouter.delete('/:roomId', protectUserData, deleteRoom)
export default roomRouter;