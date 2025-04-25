import { Link } from "react-router-dom"
import { FiStar } from "react-icons/fi"

const BookCard = ({ book }) => {
    return (
        <div className="card h-full flex flex-col">
            <div className="relative pb-[140%]">
                <img
                    src={book.coverImage || "/placeholder.svg?height=400&width=300"}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold line-clamp-1">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-2">by {book.author}</p>

                <div className="flex items-center mb-2">
                    <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={`${i < Math.floor(book.averageRating) ? "fill-yellow-500" : ""}`} />
                        ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                        ({book.reviewCount} {book.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2 mb-4">{book.description}</p>

                <Link to={`/books/${book._id}`} className="mt-auto btn btn-primary text-center">
                    View Details
                </Link>
            </div>
        </div>
    )
}

export default BookCard
