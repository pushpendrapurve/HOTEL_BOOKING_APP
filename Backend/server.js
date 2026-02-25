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

// CORS configuration - Allow all origins
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Stripe webhook (must be before express.json())
app.post('/api/stripe', express.raw({type: "application/json", limit: '50mb'}), stripeWebhooks);

// Initialize connections (only once)
let isConnected = false;

const initializeConnections = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      await connectClodinary();
      isConnected = true;
      console.log('Connections initialized');
    } catch (error) {
      console.error('Failed to initialize connections:', error);
    }
  }
};

// Middleware to ensure connections are initialized
app.use(async (req, res, next) => {
  await initializeConnections();
  next();
});

// routes
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

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
export default app;
