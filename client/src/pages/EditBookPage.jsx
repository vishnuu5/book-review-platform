

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { bookService } from "../services/api"
import { FiSave, FiX } from "react-icons/fi"
import toast from "react-hot-toast"

const EditBookPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        isbn: "",
        publishedDate: "",
        pageCount: "",
        category: "",
        coverImage: "",
    })

    const categories = [
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Science Fiction",
        "Fantasy",
        "Romance",
        "Thriller",
        "Biography",
    ]

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true)
                const { data } = await bookService.getBook(id)

                // Format the date for the input field (YYYY-MM-DD)
                const formattedDate = data.publishedDate ? new Date(data.publishedDate).toISOString().split("T")[0] : ""

                setFormData({
                    title: data.title || "",
                    author: data.author || "",
                    description: data.description || "",
                    isbn: data.isbn || "",
                    publishedDate: formattedDate,
                    pageCount: data.pageCount?.toString() || "",
                    category: data.category || "",
                    coverImage: data.coverImage || "",
                })
            } catch (error) {
                console.error("Error fetching book:", error)
                toast.error("Failed to load book details")
                navigate("/admin")
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [id, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!formData.title || !formData.author || !formData.description || !formData.category) {
            return toast.error("Please fill in all required fields")
        }

        try {
            setSubmitting(true)

            // Convert page count to number
            const bookData = {
                ...formData,
                pageCount: Number.parseInt(formData.pageCount) || 0,
            }

            await bookService.updateBook(id, bookData)
            toast.success("Book updated successfully")
            navigate("/admin")
        } catch (error) {
            console.error("Error updating book:", error)

            if (error.response && error.response.status === 401) {
                toast.error("Your session has expired. Please log in again.")
            } else if (error.response && error.response.status === 403) {
                toast.error("You don't have permission to update this book")
            } else {
                toast.error("Failed to update book. Please try again.")
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Edit Book</h1>
                    <button onClick={() => navigate("/admin")} className="btn btn-secondary flex items-center">
                        <FiX className="mr-1" />
                        <span>Cancel</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="title" className="form-label">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="author" className="form-label">
                                    Author *
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="form-label">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="isbn" className="form-label">
                                    ISBN
                                </label>
                                <input
                                    type="text"
                                    id="isbn"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label htmlFor="publishedDate" className="form-label">
                                    Published Date
                                </label>
                                <input
                                    type="date"
                                    id="publishedDate"
                                    name="publishedDate"
                                    value={formData.publishedDate}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label htmlFor="pageCount" className="form-label">
                                    Page Count
                                </label>
                                <input
                                    type="number"
                                    id="pageCount"
                                    name="pageCount"
                                    value={formData.pageCount}
                                    onChange={handleChange}
                                    className="form-input"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label htmlFor="coverImage" className="form-label">
                                    Cover Image URL
                                </label>
                                <input
                                    type="url"
                                    id="coverImage"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="https://example.com/book-cover.jpg"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="form-label">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="form-input"
                                    rows={5}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button type="submit" disabled={submitting} className="btn btn-primary flex items-center">
                                {submitting ? (
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
                </div>
            </div>
        </div>
    )
}

export default EditBookPage
