import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../configs/nodemailer.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyOtp: otp,
      verifyOtpExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send verification email
    await transporter.sendMail({
      from: `"StayHere" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Verify your StayHere account",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Verify Your Email</h1>
            <p style="color: #94a3b8; margin: 6px 0 0; font-size: 14px;">StayHere Account Verification</p>
          </div>
          <div style="background: white; border-radius: 10px; padding: 28px; border: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #475569; font-size: 15px; margin-bottom: 24px;">Hi <strong>${name}</strong>, use this OTP to verify your email address:</p>
            <div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #1e293b;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">This OTP expires in <strong>24 hours</strong>. Do not share it with anyone.</p>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">If you didn't create a StayHere account, ignore this email.</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to continue.",
      email,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || "",
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// FORGOT PASSWORD — sends OTP to email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: true, message: "If that email is registered, an OTP has been sent." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: `"StayHere" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Your StayHere Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 15 minutes.\n\nIf you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.log("forgotPassword error:", error);
    res.json({ success: false, message: error.message });
  }
};

// RESET PASSWORD — verifies OTP and sets new password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.json({ success: false, message: "Email, OTP and new password are required." });
    }
    if (password.length < 6) {
      return res.json({ success: false, message: "Password must be at least 6 characters." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found." });
    if (user.resetOtp !== otp) return res.json({ success: false, message: "Invalid OTP." });
    if (Date.now() > user.resetOtpExpiry) return res.json({ success: false, message: "OTP has expired. Please request a new one." });

    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = "";
    user.resetOtpExpiry = 0;
    await user.save();

    res.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// VERIFY EMAIL — verifies OTP and activates account
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found." });
    if (user.isVerified) return res.json({ success: false, message: "Email already verified." });
    if (user.verifyOtp !== otp) return res.json({ success: false, message: "Invalid OTP." });
    if (Date.now() > user.verifyOtpExpiry) return res.json({ success: false, message: "OTP expired. Please register again." });

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiry = 0;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Email verified successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || "",
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// RESEND VERIFY OTP
export const resendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found." });
    if (user.isVerified) return res.json({ success: false, message: "Email already verified." });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `"StayHere" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Your new StayHere verification OTP",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">New Verification OTP</h1>
          </div>
          <div style="background: white; border-radius: 10px; padding: 28px; border: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #475569; font-size: 15px; margin-bottom: 24px;">Your new OTP is:</p>
            <div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #1e293b;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">Expires in 24 hours.</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: "New OTP sent to your email." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
