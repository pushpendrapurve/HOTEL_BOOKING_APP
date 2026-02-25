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
connectDB();
connectClodinary();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://stayhere.vercel.app',
    'https://hotel-booking-backend-pink-three.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.post('/api/stripe', express.raw({type: "application/json"}),stripeWebhooks)
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// routes
//login/register router
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
