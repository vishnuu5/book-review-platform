const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { protect, admin } = require("../middleware/auth.middleware");

// Get all books
router.get("/", bookController.getBooks);

// Get book by ID
router.get("/:id", bookController.getBookById);

// Create a new book (admin only)
router.post("/", protect, admin, bookController.createBook);

// Update a book (admin only)
router.put("/:id", protect, admin, bookController.updateBook);

// Delete a book (admin only)
router.delete("/:id", protect, admin, bookController.deleteBook);

module.exports = router;
