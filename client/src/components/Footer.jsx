import { Link } from "react-router-dom"
import { FiBook, FiGithub, FiTwitter, FiInstagram } from "react-icons/fi"

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link to="/" className="flex items-center space-x-2">
                            <FiBook className="text-emerald-400 text-2xl" />
                            <span className="text-xl font-bold text-emerald-400">BookReviews</span>
                        </Link>
                        <p className="mt-4 text-gray-300">
                            Discover your next favorite book through honest reviews from our community.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-emerald-400">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/books" className="text-gray-300 hover:text-emerald-400">
                                    Books
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-300 hover:text-emerald-400">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-300 hover:text-emerald-400">
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/books?category=fiction" className="text-gray-300 hover:text-emerald-400">
                                    Fiction
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?category=non-fiction" className="text-gray-300 hover:text-emerald-400">
                                    Non-Fiction
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?category=mystery" className="text-gray-300 hover:text-emerald-400">
                                    Mystery
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?category=sci-fi" className="text-gray-300 hover:text-emerald-400">
                                    Science Fiction
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-emerald-400">
                                <FiGithub size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-emerald-400">
                                <FiTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-emerald-400">
                                <FiInstagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} BookReviews. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
