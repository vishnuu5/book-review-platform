
import { createContext, useState, useEffect, useContext } from "react"
import { api } from "../services/api"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem("token")
                if (token) {
                    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
                    const { data } = await api.get("/users/me")
                    setUser(data)
                    console.log("User authenticated:", data._id, "isAdmin:", data.isAdmin)
                }
            } catch (error) {
                console.error("Auth check failed:", error)
                localStorage.removeItem("token")
                delete api.defaults.headers.common["Authorization"]
            } finally {
                setLoading(false)
            }
        }

        checkLoggedIn()
    }, [])

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", { email, password })
            localStorage.setItem("token", data.token)
            api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
            setUser(data.user)
            console.log("User logged in:", data.user._id, "isAdmin:", data.user.isAdmin)
            return data.user
        } catch (error) {
            console.error("Login failed:", error)
            throw error
        }
    }

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("/auth/register", { name, email, password })
            localStorage.setItem("token", data.token)
            api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
            setUser(data.user)
            console.log("User registered:", data.user._id, "isAdmin:", data.user.isAdmin)
            return data.user
        } catch (error) {
            console.error("Registration failed:", error)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        delete api.defaults.headers.common["Authorization"]
        setUser(null)
        toast.success("Logged out successfully")
    }

    const updateProfile = async (userData) => {
        try {
            const { data } = await api.put(`/users/${user._id}`, userData)
            setUser(data)
            return data
        } catch (error) {
            console.error("Profile update failed:", error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}
