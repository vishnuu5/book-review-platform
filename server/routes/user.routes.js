const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

// Get current user
router.get("/me", protect, userController.getCurrentUser);

// Get user by ID
router.get("/:id", protect, userController.getUserById);

// Update user profile
router.put("/:id", protect, userController.updateUser);

module.exports = router;
