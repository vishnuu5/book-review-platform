

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { bookService } from "../services/api"
import BookCard from "../components/BookCard"
import { FiArrowRight, FiBookOpen } from "react-icons/fi"

const HomePage = () => {
    const [featuredBooks, setFeaturedBooks] = useState([])
    const [recentBooks, setRecentBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Fetch featured books (highest rated)
                const featuredResponse = await bookService.getBooks({
                    sort: "-averageRating",
                    limit: 4,
                })

                // Fetch recent books
                const recentResponse = await bookService.getBooks({
                    sort: "-createdAt",
                    limit: 8,
                })

                setFeaturedBooks(featuredResponse.data.books)
                setRecentBooks(recentResponse.data.books)
            } catch (error) {
                console.error("Error fetching books:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Favorite Book</h1>
                        <p className="text-xl mb-8">
                            Join our community of book lovers to find honest reviews and recommendations.
                        </p>
                        <Link
                            to="/books"
                            className="btn bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md"
                        >
                            Browse Books
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Books Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Featured Books</h2>
                        <Link to="/books" className="flex items-center text-emerald-600 hover:text-emerald-700">
                            <span>View All</span>
                            <FiArrowRight className="ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {featuredBooks.map((book) => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiBookOpen size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Discover Books</h3>
                            <p className="text-gray-600">
                                Browse our extensive collection of books across various genres and categories.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Read Reviews</h3>
                            <p className="text-gray-600">
                                Get insights from our community's honest reviews before making your choice.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Share Your Thoughts</h3>
                            <p className="text-gray-600">Write your own reviews and help others find their perfect read.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Books Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Recently Added</h2>
                        <Link to="/books" className="flex items-center text-emerald-600 hover:text-emerald-700">
                            <span>View All</span>
                            <FiArrowRight className="ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {recentBooks.map((book) => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage
