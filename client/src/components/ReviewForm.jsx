

import { useState } from "react"
import { FiStar } from "react-icons/fi"
import { reviewService } from "../services/api"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

const ReviewForm = ({ bookId, onReviewAdded }) => {
    const { user } = useAuth()
    const [content, setContent] = useState("")
    const [rating, setRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [refinedContent, setRefinedContent] = useState("")
    const [isRefining, setIsRefining] = useState(false)
    const [showRefined, setShowRefined] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return toast.error("You must be logged in to submit a review")
        }

        if (rating === 0) {
            return toast.error("Please select a rating")
        }

        if (content.trim().length < 10) {
            return toast.error("Review must be at least 10 characters long")
        }

        try {
            setIsSubmitting(true)
            const finalContent = showRefined && refinedContent ? refinedContent : content

            const newReview = await reviewService.addReview({
                bookId,
                content: finalContent,
                rating,
            })

            onReviewAdded(newReview)
            setContent("")
            setRating(0)
            setRefinedContent("")
            setShowRefined(false)
            toast.success("Review submitted successfully!")
        } catch (error) {
            console.error("Error submitting review:", error)

            if (error.response && error.response.status === 401) {
                toast.error("Your session has expired. Please log in again.")
            } else {
                toast.error("Failed to submit review. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRefine = async () => {
        if (!user) {
            return toast.error("You must be logged in to use this feature")
        }

        if (content.trim().length < 10) {
            return toast.error("Review must be at least 10 characters long to refine")
        }

        try {
            setIsRefining(true)
            const { data } = await reviewService.refineReview(content)
            setRefinedContent(data.refinedContent)
            setShowRefined(true)
            toast.success("Review refined successfully")
        } catch (error) {
            console.error("Error refining review:", error)

            // Check for specific error types
            if (error.response && error.response.status === 401) {
                toast.error("Your session has expired. Please log in again.")
            } else {
                toast.error("Failed to refine review. Using basic improvements instead.")

                // Apply basic improvements locally if API call fails
                const improved = basicImprove(content)
                setRefinedContent(improved)
                setShowRefined(true)
            }
        } finally {
            setIsRefining(false)
        }
    }

    // Basic improvement function for client-side fallback
    const basicImprove = (text) => {
        let improved = text.trim()

        // Capitalize first letter
        improved = improved.charAt(0).toUpperCase() + improved.slice(1)

        // Fix common typos
        improved = improved
            .replace(/\bi\b/g, "I")
            .replace(/\bdont\b/g, "don't")
            .replace(/\bcant\b/g, "can't")

        // Add ending punctuation if missing
        if (!improved.endsWith(".") && !improved.endsWith("!") && !improved.endsWith("?")) {
            improved += "."
        }

        return improved
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="form-label">Rating</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="text-2xl text-yellow-500 focus:outline-none"
                            >
                                <FiStar className={star <= rating ? "fill-yellow-500" : ""} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="review" className="form-label">
                        Your Review
                    </label>
                    <textarea
                        id="review"
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-input"
                        placeholder="Share your thoughts about this book..."
                        required
                    />
                </div>

                {showRefined && (
                    <div className="mb-4">
                        <label className="form-label">AI-Refined Review</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                            <p>{refinedContent}</p>
                        </div>
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="useRefined"
                                checked={showRefined}
                                onChange={() => setShowRefined(!showRefined)}
                                className="mr-2"
                            />
                            <label htmlFor="useRefined" className="text-sm">
                                Use refined version
                            </label>
                        </div>
                    </div>
                )}

                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={handleRefine}
                        disabled={isRefining || isSubmitting}
                        className="btn btn-secondary"
                    >
                        {isRefining ? "Refining..." : "Refine with AI"}
                    </button>

                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReviewForm
