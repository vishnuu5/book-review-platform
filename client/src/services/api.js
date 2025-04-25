import axios from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Adding token to request");
    } else {
      console.log("No token available for request");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.response?.status,
      error.response?.data?.message || error.message
    );
    console.error("Request URL:", error.config?.url);
    console.error("Request Method:", error.config?.method);

    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Check if we're not already on the login page to avoid redirect loops
      if (!window.location.pathname.includes("/login")) {
        toast.error("Your session has expired. Please log in again.");

        // Clear authentication data
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];

        // Use a timeout to ensure the toast is visible before redirecting
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else if (error.response && error.response.status === 403) {
      toast.error("You don't have permission to perform this action");
    } else {
      // Handle other errors
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Book service
export const bookService = {
  getBooks: (params) => api.get("/books", { params }),
  getBook: (id) => api.get(`/books/${id}`),
  addBook: (bookData) => api.post("/books", bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
};

// Review service
export const reviewService = {
  getReviews: (bookId) => api.get("/reviews", { params: { bookId } }),
  getUserReviews: (userId) => api.get("/reviews", { params: { userId } }),
  addReview: (reviewData) => api.post("/reviews", reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  refineReview: (content) => api.post("/reviews/refine", { content }),
};

// User service
export const userService = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (userData) => api.put("/users/me", userData),
};
