

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { FiStar, FiCalendar, FiBookOpen, FiTag } from "react-icons/fi"
import { bookService, reviewService } from "../services/api"
import { useAuth } from "../context/AuthContext"
import ReviewCard from "../components/ReviewCard"
import ReviewForm from "../components/ReviewForm"
import toast from "react-hot-toast"

const BookDetailPage = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userHasReviewed, setUserHasReviewed] = useState(false)

    useEffect(() => {
        const fetchBookAndReviews = async () => {
            try {
                setLoading(true)

                // Fetch book details
                const bookResponse = await bookService.getBook(id)
                setBook(bookResponse.data)

                // Fetch reviews for this book
                const reviewsResponse = await reviewService.getReviews(id)
                setReviews(reviewsResponse.data)

                // Check if current user has already reviewed this book
                if (user) {
                    const hasReviewed = reviewsResponse.data.some((review) => review.user._id === user._id)
                    setUserHasReviewed(hasReviewed)
                }
            } catch (error) {
                console.error("Error fetching book details:", error)
                setError("Failed to load book details. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchBookAndReviews()
    }, [id, user])

    const handleReviewAdded = (newReview) => {
        setReviews([newReview, ...reviews])
        setUserHasReviewed(true)
        toast.success("Review submitted successfully!")
        // No navigation needed - we stay on the same page
    }

    const handleReviewUpdated = (updatedReview) => {
        setReviews(reviews.map((review) => (review._id === updatedReview._id ? updatedReview : review)))
    }

    const handleReviewDeleted = (reviewId) => {
        setReviews(reviews.filter((review) => review._id !== reviewId))
        setUserHasReviewed(false)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    <p>{error}</p>
                    <Link to="/books" className="underline mt-2 inline-block">
                        Return to book listing
                    </Link>
                </div>
            </div>
        )
    }

    if (!book) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
                    <p className="text-gray-600 mb-4">The book you're looking for doesn't exist or has been removed.</p>
                    <Link to="/books" className="btn btn-primary">
                        Browse Books
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3 p-6">
                        <img
                            src={book.coverImage || "/placeholder.svg?height=600&width=400"}
                            alt={book.title}
                            className="w-full h-auto rounded-md shadow-md"
                        />
                    </div>

                    <div className="md:w-2/3 p-6">
                        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                        <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                        <div className="flex items-center mb-4">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className={`${i < Math.floor(book.averageRating) ? "fill-yellow-500" : ""}`} />
                                ))}
                            </div>
                            <span className="ml-2 text-gray-600">
                                {book.averageRating.toFixed(1)} ({book.reviewCount} {book.reviewCount === 1 ? "review" : "reviews"})
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center text-gray-600">
                                <FiCalendar className="mr-2" />
                                <span>Published: {new Date(book.publishedDate).getFullYear()}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <FiBookOpen className="mr-2" />
                                <span>{book.pageCount} pages</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <FiTag className="mr-2" />
                                <span>{book.category}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <span>ISBN: {book.isbn}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p className="text-gray-700">{book.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>

                {user && !userHasReviewed && (
                    <div className="mb-8">
                        <ReviewForm bookId={book._id} onReviewAdded={handleReviewAdded} user={user} />
                    </div>
                )}

                {!user && (
                    <div className="bg-gray-50 p-6 rounded-md text-center mb-8">
                        <h3 className="text-lg font-semibold mb-2">Want to share your thoughts?</h3>
                        <p className="text-gray-600 mb-4">Log in to write a review for this book.</p>
                        <Link to="/login" className="btn btn-primary">
                            Log In
                        </Link>
                    </div>
                )}

                {reviews.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-md text-center">
                        <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                        <p className="text-gray-600">Be the first to share your thoughts on this book!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                onDelete={handleReviewDeleted}
                                onUpdate={handleReviewUpdated}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookDetailPage
