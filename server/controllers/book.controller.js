const Book = require("../models/book.model");
const Review = require("../models/review.model");

// Get all books with pagination, filtering, and sorting
exports.getBooks = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Determine sort order
    let sort = {};
    if (req.query.sort) {
      sort = req.query.sort;
    } else {
      sort = { createdAt: -1 }; // Default: newest first
    }

    // Execute query with pagination
    const books = await Book.find(query).sort(sort).skip(skip).limit(limit);

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query);

    res.json({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getBooks:", error);
    next(error);
  }
};

// Get book by ID
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error in getBookById:", error);
    next(error);
  }
};

// Create a new book (admin only)
exports.createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      description,
      isbn,
      publishedDate,
      pageCount,
      category,
      coverImage,
    } = req.body;

    const book = new Book({
      title,
      author,
      description,
      isbn,
      publishedDate,
      pageCount,
      category,
      coverImage,
      addedBy: req.user.id,
    });

    await book.save();
    console.log("Book created successfully:", book._id);
    res.status(201).json(book);
  } catch (error) {
    console.error("Error in createBook:", error);
    next(error);
  }
};

// Update a book (admin only)
exports.updateBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      description,
      isbn,
      publishedDate,
      pageCount,
      category,
      coverImage,
    } = req.body;

    // Log the user information for debugging
    console.log(
      "Update book request from user:",
      req.user._id,
      "isAdmin:",
      req.user.isAdmin
    );

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update books" });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (isbn !== undefined) book.isbn = isbn;
    if (publishedDate) book.publishedDate = publishedDate;
    if (pageCount) book.pageCount = pageCount;
    if (category) book.category = category;
    if (coverImage !== undefined) book.coverImage = coverImage;

    await book.save();
    console.log("Book updated successfully:", book._id);
    res.json(book);
  } catch (error) {
    console.error("Error in updateBook:", error);
    next(error);
  }
};

// Delete a book (admin only)
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete all reviews for this book
    await Review.deleteMany({ book: req.params.id });
    console.log("Deleted reviews for book:", req.params.id);

    // Delete the book
    await Book.findByIdAndDelete(req.params.id);
    console.log("Book deleted successfully:", req.params.id);

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBook:", error);
    next(error);
  }
};
