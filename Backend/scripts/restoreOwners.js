import mongoose from "mongoose";
import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve("Backend/.env") });

const hotelSchema = new mongoose.Schema({ owner: mongoose.Schema.Types.Mixed }, { strict: false });
const userSchema = new mongoose.Schema({ role: String }, { strict: false });

const Hotel = mongoose.model("Hotel", hotelSchema);
const User = mongoose.model("User", userSchema);

await mongoose.connect(process.env.MONGO_URI);

const hotels = await Hotel.find({});
console.log("Hotels found:", hotels.length);

for (const hotel of hotels) {
  const ownerId = hotel.owner?.toString();
  if (!ownerId) continue;
  const result = await User.findByIdAndUpdate(ownerId, { role: "hotelOwner" }, { new: true });
  console.log("Restored:", result?.name, "->", result?.role);
}

await mongoose.disconnect();
console.log("Done - all hotel owners restored");
