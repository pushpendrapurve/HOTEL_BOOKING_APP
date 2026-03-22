import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async(req,res)=>{
    try {
        const {name,address,contact,city} = req.body;
        const owner = req.user._id;

        const hotel = await Hotel.findOne({
          $or: [{ owner }, { owner: owner.toString() }]
        });
        if(hotel){
            return res.json({success:false, message:"Hotel Already Registered"})
        }

        // Create hotel with isApproved: false — do NOT change role yet
        await Hotel.create({name,address,contact,city,owner,isApproved:false});

        res.json({success:true, message:"Hotel registration submitted. Awaiting admin approval."})
    } catch (error) {
        res.json({success: false,message: error.message})
    }
}