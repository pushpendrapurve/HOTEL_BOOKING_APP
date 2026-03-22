import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserData = async(req,res)=>{
    try {
       const role = req.user.role;
       const recentSearchedCities = req.user.recentSearchedCities;
       
       // Check if user actually has a hotel (for hotelOwner role)
       let hasHotel = false;
       let hotelApproved = false;
       let hasPendingHotel = false;
       // Check for any hotel (approved or not) for this user
       const hotel = await Hotel.findOne({
         $or: [{ owner: req.user._id }, { owner: req.user._id.toString() }]
       });
       if (hotel) {
         hasHotel = true;
         hotelApproved = hotel.isApproved === true;
         hasPendingHotel = hotel.isApproved === false;
       }
       
       res.json({success: true, role, recentSearchedCities, hasHotel, hotelApproved, hasPendingHotel})  
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    const { name, email, role, image } = req.user;
    res.json({ success: true, user: { name, email, role, image } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = req.user;

    if (name) user.name = name;

    // Handle profile image upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.image = result.secure_url;
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.json({ success: false, message: "Current password is required" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.json({ success: false, message: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ success: true, message: "Profile updated successfully", user: { name: user.name, email: user.email, role: user.role, image: user.image } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//store user recent searched cities
export const storeRecentSearchedCities = async(req,res)=>{
    try {
        const {recentSearchedCities} = req.body;
        const user = await req.user;

        if(user.recentSearchedCities.length < 3){
            user.recentSearchedCities.push(recentSearchedCities);
        }else{
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCities)
        }

        await user.save();
        res.json({success:true,message:"city added"})
    } catch (error) {
         res.json({success:false,message: error.message})
    }
}