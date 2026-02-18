import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import authRoutes from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import hotelRouter from "./routes/hotelRouter.js";
import connectClodinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRouter.js";
import bookingRouter from "./routes/bookingRouter.js";

dotenv.config();
connectDB();
connectClodinary();

const app = express();

app.use(cors());
app.use(express.json());

// routes
//login/register router
app.use("/api/auth", authRoutes);

app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
