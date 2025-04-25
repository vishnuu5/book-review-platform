
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (!user || !user.isAdmin) {
        return <Navigate to="/" />
    }

    return children
}

export default AdminRoute
