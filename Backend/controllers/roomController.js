import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";
import Review from "../models/Review.js";

//API to create a new room for hotel
export const createRoom = async(req,res)=>{
    try {
        console.log('Creating room - User:', req.user?._id);
        console.log('Request body:', req.body);
        console.log('Files:', req.files?.length);
        
        const {roomType, pricePerNight,amenities} = req.body;
        const hotel = await Hotel.findOne({owner : req.user._id})

        if(!hotel) {
            console.log('No hotel found for user:', req.user._id);
            return res.json({success: false, message: "No Hotel found. Please register your hotel first."});
        }

        console.log('Hotel found:', hotel._id);

        if(!req.files || req.files.length === 0) {
            return res.json({success: false, message: "Please upload at least one image"});
        }

        //upload images to cloudinary
        const uploadImages = req.files.map(async(file)=>{
          const response = await cloudinary.uploader.upload(file.path);
          return response.secure_url;
        })

        //wait for all uploads to complete
        const images = await Promise.all(uploadImages)
        console.log('Images uploaded:', images.length);

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })

        console.log('Room created successfully');
        res.json({success:true, message: "Room created successfully"})
 
    } catch (error) {
        console.error('Error creating room:', error);
        res.json({success:false, message: error.message})
    }
}

//API to get all rooms
export const getRooms = async(req,res)=>{
  try {
   const rooms = await Room.find({isAvailable: true}).populate({
    path: 'hotel',
    match: { isApproved: true },
    populate:{
        path: 'owner',
        select: 'name email image'
    }
   }).sort({createdAt: -1})

   // Filter out rooms whose hotel didn't match (unapproved)
   const approvedRooms = rooms.filter(room => room.hotel !== null);

   res.json({success: true, rooms: approvedRooms})
  } catch (error) { 
   res.json({success: false,message: error.message})
  }
}

//API to get all rooms for a specific hotel
export const getOwnerRooms = async (req,res)=>{
    try {
        const hotelData = await Hotel.findOne({owner: req.user._id})
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate("hotel");
        
        res.json({success: true,rooms})
    } catch (error) {
        res.json({success: false,message: error.message})
    } 
}

//API to toggle availability of a room
export const toggleRoomAvailability = async(req,res)=>{
  try {
    const {roomId} = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({success: true,message: " Room availability Updated"})
  } catch (error) {
    res.json({success: false,message: error.message})
  }
} 

// API to update a room
// PUT /api/rooms/:roomId
export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { roomType, pricePerNight, amenities } = req.body;

    const room = await Room.findById(roomId).populate("hotel");
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    // Check if the user is the owner of the hotel
    if (room.hotel.owner.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Update room details
    if (roomType) room.roomType = roomType;
    if (pricePerNight) room.pricePerNight = +pricePerNight;
    if (amenities) room.amenities = JSON.parse(amenities);

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      const uploadImages = req.files.map(async (file) => {
        const response = await cloudinary.uploader.upload(file.path);
        return response.secure_url;
      });
      const newImages = await Promise.all(uploadImages);
      room.images = newImages;
    }

    await room.save();

    res.json({ success: true, message: "Room updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to delete a room
// DELETE /api/rooms/:roomId
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId).populate("hotel");
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    // Check if the user is the owner of the hotel
    if (room.hotel.owner.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Room.findByIdAndDelete(roomId);

    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
