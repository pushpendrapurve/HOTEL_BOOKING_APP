import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if already connected (important for serverless)
    if (mongoose.connection.readyState >= 1) {
      console.log("MongoDB already connected");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Serverless-friendly options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
    // Don't exit in serverless environment
    throw error;
  }
};

export default connectDB;
