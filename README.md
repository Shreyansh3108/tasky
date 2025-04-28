# Task Management Application

A full-stack task management application with React frontend and Node.js/Express/MongoDB backend.

## Features

- User registration and authentication with JWT
- Create, read, update, and delete tasks
- Filter tasks by status (All, Active, Completed)
- Task priority assignment (Low, Medium, High)
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React (with Hooks)
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Custom hooks for data handling

### Backend
- Node.js and Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
/task-manager
  /client             # React frontend
    /public
    /src
      /components     # React components
        /auth         # Authentication related components
        /layout       # Layout components (navbar, etc.)
        /tasks        # Task management components
      /context        # React context for global state
      /hooks          # Custom React hooks
      App.js          # Main app component
      index.js        # Entry point
  /server             # Express backend
    /middleware       # Custom middleware (auth, etc.)
    /models           # Mongoose models
    /routes           # API routes
    index.js          # Server entry point
  README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local installation or MongoDB Atlas account)

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd task-manager/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the client directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

### Backend Setup
1. Navigate to the server directory:
   ```
   cd task-manager/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```
   npm run dev
   ```

## Database Schema

### User
- `_id`: ObjectId (automatically generated)
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `createdAt`: Date (default: Date.now)

### Task
- `_id`: ObjectId (automatically generated)
- `title`: String (required)
- `description`: String
- `status`: Boolean (default: false - incomplete)
- `priority`: String (enum: ['low', 'medium', 'high'], default: 'medium')
- `createdAt`: Date (default: Date.now)
- `userId`: ObjectId (reference to User model)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Seed Data

The application comes with pre-configured seed data with:
- 2 test users
- 3 sample tasks per user

### Test Users
1. Email: `test@example.com`, Password: `password123`
2. Email: `demo@example.com`, Password: `demo1234`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
</antArtif
