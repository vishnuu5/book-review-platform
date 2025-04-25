const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("No token provided in request");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
      console.log("Token verified successfully for user ID:", decoded.id);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.log("User not found for ID:", decoded.id);
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      // Set the user object on the request
      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Server error in authentication" });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.log(
      "Admin access denied for user:",
      req.user ? req.user._id : "unknown",
      "isAdmin:",
      req.user ? req.user.isAdmin : false
    );
    res.status(403).json({ message: "Not authorized as admin" });
  }
};
