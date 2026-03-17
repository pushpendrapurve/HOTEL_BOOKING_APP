import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role :{
        type: String,
        enum: ["user","hotelOwner"],
        default: "user"
    },

    image: {
        type: String,
        default: ""
    },

    resetOtp: {
        type: String,
        default: ""
    },

    resetOtpExpiry: {
        type: Number,
        default: 0
    },

    recentSearchedCities :[{
        type: String,
        required: true 
    }],

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
