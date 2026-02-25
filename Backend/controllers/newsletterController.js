import Newsletter from "../models/Newsletter.js";

// API to subscribe to newsletter
// POST /api/newsletter/subscribe
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.json({ success: false, message: "Email already subscribed" });
    }

    await Newsletter.create({ email });

    res.json({ success: true, message: "Successfully subscribed to newsletter" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to subscribe" });
  }
};

// API to get all newsletter subscribers (admin only)
// GET /api/newsletter/subscribers
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, subscribers, total: subscribers.length });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch subscribers" });
  }
};
