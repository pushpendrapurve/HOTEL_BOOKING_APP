import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.json({ success: false, message: "No admin token provided" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.json({ success: false, message: "Not authorized as admin" });
    }
    req.admin = decoded;
    next();
  } catch {
    return res.json({ success: false, message: "Invalid admin token" });
  }
};
