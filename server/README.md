# TaskFlow Server - Express + MongoDB Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file based on `.env.example`:
```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

### 3. Create Admin User
After starting the server, register a user with email `admin@taskflow.com` and then manually update their role to `admin` in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@taskflow.com" },
  { $set: { role: "admin" } }
)
```

### 4. Run the Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/google` - Google sign in
- GET `/api/auth/me` - Get current user

### Users
- GET `/api/users` - Get all users (Admin)
- GET `/api/users/top-workers` - Get top 6 workers
- PATCH `/api/users/:id/role` - Update user role (Admin)
- DELETE `/api/users/:id` - Delete user (Admin)

### Tasks
- GET `/api/tasks` - Get all tasks
- GET `/api/tasks/:id` - Get task by ID
- GET `/api/tasks/buyer/:email` - Get buyer's tasks
- POST `/api/tasks` - Create task (Buyer)
- PUT `/api/tasks/:id` - Update task (Buyer)
- DELETE `/api/tasks/:id` - Delete task

### Submissions
- GET `/api/submissions/worker/:email` - Get worker's submissions
- GET `/api/submissions/task/:taskId` - Get task submissions
- GET `/api/submissions/buyer/:email/pending` - Get pending reviews
- POST `/api/submissions` - Create submission (Worker)
- PATCH `/api/submissions/:id/approve` - Approve submission (Buyer)
- PATCH `/api/submissions/:id/reject` - Reject submission (Buyer)

### Withdrawals
- GET `/api/withdrawals` - Get all withdrawals (Admin)
- GET `/api/withdrawals/worker/:email` - Get worker's withdrawals
- POST `/api/withdrawals` - Create withdrawal request
- PATCH `/api/withdrawals/:id/approve` - Approve withdrawal (Admin)

### Notifications
- GET `/api/notifications/:email` - Get user notifications
- PATCH `/api/notifications/:id/read` - Mark as read
- PATCH `/api/notifications/read-all/:email` - Mark all as read

### Stats
- GET `/api/stats/admin` - Admin dashboard stats
- GET `/api/stats/worker/:email` - Worker stats
- GET `/api/stats/buyer/:email` - Buyer stats
- GET `/api/stats/public` - Homepage public stats

## Deployment

Deploy to Render, Railway, or any Node.js hosting:

1. Connect your GitHub repository
2. Set environment variables
3. Deploy!

## MongoDB Collections

- `users` - User accounts
- `tasks` - Task listings
- `submissions` - Worker submissions
- `withdrawals` - Withdrawal requests
- `notifications` - User notifications
