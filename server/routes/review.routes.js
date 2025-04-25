const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { protect } = require("../middleware/auth.middleware");

// Get reviews (can filter by bookId or userId)
router.get("/", reviewController.getReviews);

// Create a new review
router.post("/", protect, reviewController.createReview);

// Update a review
router.put("/:id", protect, reviewController.updateReview);

// Delete a review
router.delete("/:id", protect, reviewController.deleteReview);

// Refine review with AI (bonus task)
router.post("/refine", protect, reviewController.refineReview);

module.exports = router;
