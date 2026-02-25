import Review from "../models/Review.js";
import Room from "../models/Room.js";

// API to create a review
// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { room, rating, comment } = req.body;
    const user = req.user._id;

    if (!room || !rating || !comment) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    const review = await Review.create({
      user,
      hotel: roomData.hotel._id,
      room,
      rating,
      comment,
    });

    res.json({ success: true, message: "Review submitted successfully", review });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to create review" });
  }
};

// API to get reviews for a room
// GET /api/reviews/room/:roomId
export const getRoomReviews = async (req, res) => {
  try {
    const { roomId } = req.params;

    const reviews = await Review.find({ room: roomId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0;

    res.json({
      success: true,
      reviews,
      totalReviews,
      averageRating: averageRating.toFixed(1),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch reviews" });
  }
};

// API to get reviews for a hotel
// GET /api/reviews/hotel/:hotelId
export const getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const reviews = await Review.find({ hotel: hotelId })
      .populate("user", "name email")
      .populate("room", "roomType")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0;

    res.json({
      success: true,
      reviews,
      totalReviews,
      averageRating: averageRating.toFixed(1),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch reviews" });
  }
};
