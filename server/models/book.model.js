const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
    },
    pageCount: {
      type: Number,
      min: 1,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search
bookSchema.index({ title: "text", author: "text", description: "text" });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
