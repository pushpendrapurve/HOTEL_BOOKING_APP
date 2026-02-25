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
import reviewRouter from "./routes/reviewRouter.js";
import newsletterRouter from "./routes/newsletterRouter.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

dotenv.config();

const app = express();

// CORS - Allow all
app.use(cors());

// Body parsers with size limits
app.post('/api/stripe', express.raw({type: "application/json"}), stripeWebhooks);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize connections once
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      await connectClodinary();
      isConnected = true;
    } catch (error) {
      console.error('Connection error:', error);
    }
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/newsletter", newsletterRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
