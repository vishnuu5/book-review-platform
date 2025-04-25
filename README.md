# Book Review Platform

A full-stack MERN application where users can browse books, read and write reviews, and rate books.

## Features

- User authentication (register, login, profile management)
- Browse books with search and filter functionality
- View book details and reviews
- Write, edit, and delete reviews
- Admin dashboard for managing books
- AI-powered review refinement (bonus feature)

## DEMO

Click => [Here](https://book-review-platform-green.vercel.app)

## Tech Stack

### Frontend

- React (with Vite)
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API requests
- React Icons for icons
- React Hot Toast for notifications

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt.js for password hashing
- OpenAI API for review refinement

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key (for bonus feature)

### Installation

1. Clone the repository

```bash
git clone https://github.com/vishnuu5/book-review-platform.git
cd book-review-platform
```

2. Install dependencies for both client and server

```bash
npm install
```

# Install server dependencies

```bash
cd server
npm install
```

# Install client dependencies

```bash
cd ../client
npm install
```

3. Set up environment variables
   Create a `.env` file in the server directory with the following variables:

```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development servers

# Start the backend server

```
cd server
npm run dev
```

# Start the frontend server in a new terminal

```bash
cd client
npm run dev
```

6. Access the application
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Users

- GET /api/users/me - Get current user profile
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user profile

### Books

- GET /api/books - Get all books (with pagination, search, and filters)
- GET /api/books/:id - Get book details
- POST /api/books - Add a new book (admin only)
- PUT /api/books/:id - Update book (admin only)
- DELETE /api/books/:id - Delete book (admin only)

### Reviews

- GET /api/reviews?bookId=xxx - Get reviews for a book
- POST /api/reviews - Submit a new review
- PUT /api/reviews/:id - Update a review
- DELETE /api/reviews/:id - Delete a review
- POST /api/reviews/refine - Refine review with AI

## Known Issues

- The AI review refinement feature requires a valid OpenAI API key

## Future Enhancements

- Add book recommendations based on user preferences
- Implement social features (follow users, like reviews)
- Add book lists/collections feature
- Integrate with external book APIs for more comprehensive data
