
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FiMenu, FiX, FiUser, FiLogOut, FiBook } from "react-icons/fi"

const Header = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <FiBook className="text-emerald-600 text-2xl" />
                        <span className="text-xl font-bold text-emerald-600">BookReviews</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-emerald-600">
                            Home
                        </Link>
                        <Link to="/books" className="text-gray-700 hover:text-emerald-600">
                            Books
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600">
                                    <span>{user.name}</span>
                                    <FiUser />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                    {user.isAdmin && (
                                        <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-emerald-600">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-gray-700" onClick={toggleMenu}>
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden mt-4 space-y-3">
                        <Link to="/" className="block py-2 text-gray-700 hover:text-emerald-600" onClick={toggleMenu}>
                            Home
                        </Link>
                        <Link to="/books" className="block py-2 text-gray-700 hover:text-emerald-600" onClick={toggleMenu}>
                            Books
                        </Link>

                        {user ? (
                            <>
                                <Link to="/profile" className="block py-2 text-gray-700 hover:text-emerald-600" onClick={toggleMenu}>
                                    Profile
                                </Link>
                                {user.isAdmin && (
                                    <Link to="/admin" className="block py-2 text-gray-700 hover:text-emerald-600" onClick={toggleMenu}>
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout()
                                        toggleMenu()
                                    }}
                                    className="flex items-center space-x-2 py-2 text-gray-700 hover:text-emerald-600"
                                >
                                    <FiLogOut />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Link to="/login" className="block py-2 text-gray-700 hover:text-emerald-600" onClick={toggleMenu}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary text-center" onClick={toggleMenu}>
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>
                )}
            </div>
        </header>
    )
}

export default Header
