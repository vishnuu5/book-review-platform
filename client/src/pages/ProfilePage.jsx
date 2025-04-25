

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { reviewService } from "../services/api"
import { FiUser, FiMail, FiEdit, FiSave } from "react-icons/fi"
import ReviewCard from "../components/ReviewCard"
import toast from "react-hot-toast"

const ProfilePage = () => {
    const { user, updateProfile } = useAuth()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [bio, setBio] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reviews, setReviews] = useState([])
    const [loadingReviews, setLoadingReviews] = useState(true)

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setEmail(user.email || "")
            setBio(user.bio || "")

            // Fetch user's reviews
            const fetchUserReviews = async () => {
                try {
                    setLoadingReviews(true)
                    const response = await reviewService.getUserReviews(user._id)
                    setReviews(response.data)
                } catch (error) {
                    console.error("Error fetching user reviews:", error)
                    toast.error("Failed to load your reviews")
                } finally {
                    setLoadingReviews(false)
                }
            }

            fetchUserReviews()
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            await updateProfile({ name, bio })
            setIsEditing(false)
            toast.success("Profile updated successfully")
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const handleReviewUpdated = (updatedReview) => {
        setReviews(reviews.map((review) => (review._id === updatedReview._id ? updatedReview : review)))
    }

    const handleReviewDeleted = (reviewId) => {
        setReviews(reviews.filter((review) => review._id !== reviewId))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-emerald-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">My Profile</h1>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold">{user?.name}</h2>
                                <p className="text-gray-600">{user?.email}</p>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center text-emerald-600 hover:text-emerald-700"
                            >
                                <FiEdit className="mr-1" />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-input pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="text-gray-400" />
                                    </div>
                                    <input id="email" type="email" value={email} className="form-input pl-10 bg-gray-100" disabled />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="bio" className="form-label">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="form-input"
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="btn btn-primary flex items-center">
                                    {loading ? (
                                        "Saving..."
                                    ) : (
                                        <>
                                            <FiSave className="mr-1" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">About Me</h3>
                            <p className="text-gray-700 mb-4">{user?.bio || "No bio provided yet."}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">My Reviews</h2>

                {loadingReviews ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-md text-center">
                        <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                        <p className="text-gray-600">You haven't written any reviews yet. Start sharing your thoughts on books!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="mb-6 last:mb-0">
                                <div className="flex items-center mb-2">
                                    <h3 className="font-semibold text-lg">{review.book.title}</h3>
                                    <span className="mx-2 text-gray-400">•</span>
                                    <span className="text-gray-600">by {review.book.author}</span>
                                </div>
                                <ReviewCard review={review} onDelete={handleReviewDeleted} onUpdate={handleReviewUpdated} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage
