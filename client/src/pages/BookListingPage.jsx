

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { bookService } from "../services/api"
import BookCard from "../components/BookCard"
import { FiSearch, FiFilter, FiX } from "react-icons/fi"

const BookListingPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalBooks, setTotalBooks] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showFilters, setShowFilters] = useState(false)

    // Filter states
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")

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

    const sortOptions = [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "rating", label: "Highest Rated" },
        { value: "reviews", label: "Most Reviewed" },
    ]

    useEffect(() => {
        fetchBooks()
    }, [searchParams])

    const fetchBooks = async () => {
        try {
            setLoading(true)

            const page = Number.parseInt(searchParams.get("page") || "1")
            setCurrentPage(page)

            // Convert sort values to API parameters
            let sortParam
            switch (searchParams.get("sort")) {
                case "oldest":
                    sortParam = "createdAt"
                    break
                case "rating":
                    sortParam = "-averageRating"
                    break
                case "reviews":
                    sortParam = "-reviewCount"
                    break
                default:
                    sortParam = "-createdAt" // newest first
            }

            const response = await bookService.getBooks({
                page,
                limit: 12,
                search: searchParams.get("search") || "",
                category: searchParams.get("category") || "",
                sort: sortParam,
            })

            setBooks(response.data.books)
            setTotalBooks(response.data.totalBooks)
            setTotalPages(response.data.totalPages)
        } catch (error) {
            console.error("Error fetching books:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()

        const params = new URLSearchParams(searchParams)

        if (searchTerm) {
            params.set("search", searchTerm)
        } else {
            params.delete("search")
        }

        params.set("page", "1") // Reset to first page on new search
        setSearchParams(params)
    }

    const handleCategoryChange = (category) => {
        const params = new URLSearchParams(searchParams)

        if (category) {
            params.set("category", category)
        } else {
            params.delete("category")
        }

        params.set("page", "1") // Reset to first page on category change
        setSearchParams(params)
        setSelectedCategory(category)
    }

    const handleSortChange = (e) => {
        const value = e.target.value
        const params = new URLSearchParams(searchParams)

        if (value) {
            params.set("sort", value)
        } else {
            params.delete("sort")
        }

        setSearchParams(params)
        setSortBy(value)
    }

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", page.toString())
        setSearchParams(params)
    }

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedCategory("")
        setSortBy("newest")
        setSearchParams({})
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Browse Books</h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <form onSubmit={handleSearch} className="flex-grow max-w-md">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search books by title, author, or ISBN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input pl-10 pr-4 py-2 w-full"
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <button type="submit" className="sr-only">
                            Search
                        </button>
                    </div>
                </form>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600"
                    >
                        <FiFilter />
                        <span>Filters</span>
                    </button>

                    <div className="flex-grow">
                        <select value={sortBy} onChange={handleSortChange} className="form-input py-2">
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Filters</h3>
                        <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-emerald-600 flex items-center">
                            <FiX className="mr-1" />
                            Clear All
                        </button>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(selectedCategory === category ? "" : category)}
                                    className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category
                                            ? "bg-emerald-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
                </div>
            ) : books.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No books found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
            ) : (
                <>
                    <p className="text-gray-600 mb-4">
                        Showing {books.length} of {totalBooks} books
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-md ${currentPage === 1
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1
                                    // Show current page, first page, last page, and pages around current
                                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 rounded-md ${currentPage === page
                                                        ? "bg-emerald-600 text-white"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                        return (
                                            <span key={page} className="px-4 py-2">
                                                ...
                                            </span>
                                        )
                                    }
                                    return null
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-md ${currentPage === totalPages
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default BookListingPage
