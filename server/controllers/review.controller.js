const Review = require("../models/review.model");
const Book = require("../models/book.model");
const axios = require("axios");

// Get reviews (can filter by bookId or userId)
exports.getReviews = async (req, res, next) => {
  try {
    const { bookId, userId } = req.query;

    // Build query based on filters
    const query = {};
    if (bookId) query.book = bookId;
    if (userId) query.user = userId;

    // Fetch reviews with populated user and book data
    const reviews = await Review.find(query)
      .populate("user", "name")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    next(error);
  }
};

// Create a new review
exports.createReview = async (req, res, next) => {
  try {
    const { bookId, rating, content } = req.body;

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      book: bookId,
      user: req.user._id,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book" });
    }

    // Create new review
    const review = new Review({
      book: bookId,
      user: req.user._id,
      rating,
      content,
    });

    await review.save();

    // Update book's average rating and review count
    await updateBookRatingStats(bookId);

    // Populate user data for response
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("book", "title author");

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    next(error);
  }
};

// Update a review
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, content } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is authorized to update this review
    if (
      review.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (content) review.content = content;

    await review.save();

    // Update book's average rating
    await updateBookRatingStats(review.book);

    // Populate user data for response
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("book", "title author");

    res.json(populatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    next(error);
  }
};

// Delete a review
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Log the user information for debugging
    console.log(
      "Delete review request from user:",
      req.user._id,
      "isAdmin:",
      req.user.isAdmin
    );
    console.log("Review owner:", review.user.toString());

    // Check if user is authorized to delete this review
    if (
      review.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    const bookId = review.book;

    // Delete the review
    await Review.findByIdAndDelete(req.params.id);

    // Update book's average rating
    await updateBookRatingStats(bookId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    next(error);
  }
};

// Refine review with AI
exports.refineReview = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Review content is required" });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log(
        "OpenAI API key is not configured. Using fallback refinement."
      );
      // Provide a fallback refinement for testing purposes
      return res.json({
        originalContent: content,
        refinedContent: improvementFallback(content),
      });
    }

    try {
      // Call OpenAI API to refine the review
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that improves book reviews. Enhance the grammar, clarity, and tone of the review while preserving the original meaning and sentiment. Make it more engaging and professional.",
            },
            {
              role: "user",
              content: `Please refine this book review: "${content}"`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const refinedContent = response.data.choices[0].message.content.trim();

      res.json({
        originalContent: content,
        refinedContent,
      });
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError.message);
      // If OpenAI API call fails, use the fallback
      res.json({
        originalContent: content,
        refinedContent: improvementFallback(content),
      });
    }
  } catch (error) {
    console.error("Error refining review:", error);
    res.status(500).json({ message: "Failed to refine review with AI" });
  }
};

// Helper function to update a book's average rating and review count
async function updateBookRatingStats(bookId) {
  try {
    const reviews = await Review.find({ book: bookId });

    if (reviews.length === 0) {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: 0,
        reviewCount: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Book.findByIdAndUpdate(bookId, {
      averageRating,
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error("Error updating book rating stats:", error);
    throw error;
  }
}

// Fallback function to improve text without using OpenAI
function improvementFallback(text) {
  // Basic improvements: capitalize first letter, fix common typos, add some professional phrases
  let improved = text.trim();

  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  // Fix common typos and add sentence structure
  improved = improved
    .replace(/\bi\b/g, "I")
    .replace(/\bdont\b/g, "don't")
    .replace(/\bwont\b/g, "won't")
    .replace(/\bcant\b/g, "can't")
    .replace(/\bim\b/g, "I'm")
    .replace(/\bive\b/g, "I've")
    .replace(/\bid\b/g, "I'd");

  // Add professional phrases if the review is short
  if (improved.length < 100) {
    improved +=
      " Overall, this book provides a compelling narrative that readers will find engaging.";
  }

  // Ensure proper ending punctuation
  if (
    !improved.endsWith(".") &&
    !improved.endsWith("!") &&
    !improved.endsWith("?")
  ) {
    improved += ".";
  }

  return improved;
}
