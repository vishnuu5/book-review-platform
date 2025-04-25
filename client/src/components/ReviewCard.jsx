
import { useState } from "react"
import { FiStar, FiEdit, FiTrash2, FiThumbsUp } from "react-icons/fi"
import { format } from "date-fns"
import { useAuth } from "../context/AuthContext"
import { reviewService } from "../services/api"
import toast from "react-hot-toast"

const ReviewCard = ({ review, onDelete, onUpdate }) => {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(review.content)
    const [rating, setRating] = useState(review.rating)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleUpdate = async () => {
        if (!user) {
            return toast.error("You must be logged in to update a review")
        }

        try {
            setIsUpdating(true)
            const updatedReview = await reviewService.updateReview(review._id, {
                content,
                rating,
            })
            onUpdate(updatedReview)
            setIsEditing(false)
            toast.success("Review updated successfully")
        } catch (error) {
            console.error("Error updating review:", error)

            if (error.response && error.response.status === 401) {
                toast.error("Your session has expired. Please log in again.")
            } else {
                toast.error("Failed to update review. Please try again.")
            }
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            if (!user) {
                return toast.error("You must be logged in to delete a review")
            }

            try {
                setIsDeleting(true)
                await reviewService.deleteReview(review._id)
                onDelete(review._id)
                toast.success("Review deleted successfully")
            } catch (error) {
                console.error("Error deleting review:", error)

                if (error.response && error.response.status === 401) {
                    toast.error("Your session has expired. Please log in again.")
                } else if (error.response && error.response.status === 403) {
                    toast.error("You don't have permission to delete this review")
                } else {
                    toast.error("Failed to delete review. Please try again.")
                }
            } finally {
                setIsDeleting(false)
            }
        }
    }

    return (
        <div className="border-b border-gray-200 py-4">
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                        {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-medium">{review.user.name}</h4>
                        <div className="flex items-center space-x-2">
                            {isEditing ? (
                                <div className="flex mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setRating(star)} className="text-yellow-500">
                                            <FiStar className={star <= rating ? "fill-yellow-500" : ""} />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className={`${i < review.rating ? "fill-yellow-500" : ""}`} />
                                    ))}
                                </div>
                            )}
                            <span className="text-sm text-gray-500">{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
                        </div>
                    </div>
                </div>

                {user && (user._id === review.user._id || user.isAdmin) && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-gray-500 hover:text-emerald-600"
                            disabled={isDeleting || isUpdating}
                        >
                            <FiEdit />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-gray-500 hover:text-red-600"
                            disabled={isDeleting || isUpdating}
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="mt-3">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-input"
                        rows={4}
                        disabled={isUpdating}
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary" disabled={isUpdating}>
                            Cancel
                        </button>
                        <button onClick={handleUpdate} className="btn btn-primary" disabled={isUpdating}>
                            {isUpdating ? "Updating..." : "Update"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-2">
                    <p className="text-gray-700">{review.content}</p>
                    <div className="flex items-center mt-2">
                        <button className="flex items-center text-sm text-gray-500 hover:text-emerald-600">
                            <FiThumbsUp className="mr-1" />
                            <span>Helpful ({review.helpfulCount || 0})</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReviewCard
