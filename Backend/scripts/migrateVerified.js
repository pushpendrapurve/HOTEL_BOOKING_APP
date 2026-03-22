import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
const result = await User.updateMany({ isVerified: { $ne: true } }, { $set: { isVerified: true } });
console.log(`Updated ${result.modifiedCount} users to isVerified: true`);
await mongoose.disconnect();
