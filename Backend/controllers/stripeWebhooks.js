import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (req, res) => {

  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Correct event type for Checkout
  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const bookingId = session.metadata.bookingId;

    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "Stripe",
    });

    console.log("Booking marked as paid:", bookingId);
  }

  res.json({ received: true });
};