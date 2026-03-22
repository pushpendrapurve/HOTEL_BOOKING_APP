import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Newsletter from "../models/Newsletter.js";
import Contact from "../models/Contact.js";
import transporter from "../configs/nodemailer.js";

// POST /api/admin/register
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.json({ success: false, message: "Invalid secret key" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) return res.json({ success: false, message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// POST /api/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalOwners, totalHotels, totalRooms, totalBookings, subscribers] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "hotelOwner" }),
        Hotel.countDocuments(),
        Room.countDocuments(),
        Booking.countDocuments(),
        Newsletter.countDocuments(),
      ]);

    const revenueData = await Booking.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .populate("room", "roomType pricePerNight")
      .populate("hotel", "name city")
      .sort({ createdAt: -1 })
      .limit(5);

    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalOwners, totalHotels, totalRooms, totalBookings, totalRevenue, subscribers },
      recentBookings,
      monthlyBookings,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/owners
export const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: "hotelOwner" }).select("-password").sort({ createdAt: -1 });
    const ownersWithHotels = await Promise.all(
      owners.map(async (owner) => {
        const hotel = await Hotel.findOne({
          $or: [
            { owner: owner._id },
            { owner: owner._id.toString() },
          ]
        });
        return { ...owner.toObject(), hotel: hotel || null };
      })
    );
    res.json({ success: true, owners: ownersWithHotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/hotels
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    const hotelsWithRooms = await Promise.all(
      hotels.map(async (hotel) => {
        const roomCount = await Room.countDocuments({ hotel: hotel._id });
        const owner = await User.findById(hotel.owner).select("name email");
        return { ...hotel.toObject(), roomCount, ownerDetails: owner };
      })
    );
    res.json({ success: true, hotels: hotelsWithRooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("hotel", "name city").sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("room", "roomType pricePerNight images")
      .populate("hotel", "name city address")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/newsletter
export const getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, subscribers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/hotels/:id
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.json({ success: false, message: "Hotel not found" });

    // Downgrade owner back to regular user using string-safe query
    await User.findOneAndUpdate(
      { _id: hotel.owner.toString() },
      { role: "user" }
    );

    // Delete all rooms belonging to this hotel
    await Room.deleteMany({ hotel: req.params.id });

    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Hotel deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// POST /api/admin/contact (public - no auth needed)
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.json({ success: false, message: "All fields are required" });

    await Contact.create({ name, email, subject, message });

    // Send notification email to admin
    await transporter.sendMail({
      from: `"StayHere Contact" <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📬 New Contact Message: ${subject}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">New Contact Message</h1>
            <p style="color: #c7d2fe; margin: 6px 0 0; font-size: 14px;">StayHere Admin Notification</p>
          </div>

          <div style="background: white; border-radius: 10px; padding: 24px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; width: 100px;">From</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #6366f1; font-size: 14px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">Subject</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; font-weight: 600;">${subject}</td>
              </tr>
            </table>

            <div style="margin-top: 20px;">
              <p style="color: #64748b; font-size: 13px; margin-bottom: 8px;">Message</p>
              <div style="background: #f8fafc; border-left: 3px solid #6366f1; padding: 14px 16px; border-radius: 6px; color: #334155; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                Reply to ${name}
              </a>
            </div>
          </div>

          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
            This notification was sent from StayHere contact form.
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/contacts/:id/read
export const markContactRead = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/contacts/:id
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/hotels/:id/approve
export const approveHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!hotel) return res.json({ success: false, message: "Hotel not found" });
    // Upgrade owner role to hotelOwner
    await User.findOneAndUpdate(
      { _id: hotel.owner.toString() },
      { role: "hotelOwner" }
    );
    res.json({ success: true, message: "Hotel approved" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/hotels/:id/reject
export const rejectHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
    if (!hotel) return res.json({ success: false, message: "Hotel not found" });
    // Downgrade owner back to user
    await User.findOneAndUpdate(
      { _id: hotel.owner.toString() },
      { role: "user" }
    );
    res.json({ success: true, message: "Hotel rejected" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
