import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

// Route imports
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import taskRoutes from "./routes/tasks.js"
import submissionRoutes from "./routes/submissions.js"
import withdrawalRoutes from "./routes/withdrawals.js"
import notificationRoutes from "./routes/notifications.js"
import statsRoutes from "./routes/stats.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/api/withdrawals", withdrawalRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/stats", statsRoutes)

// Health check
app.get("/", (req, res) => {
  res.json({ message: "TaskFlow API is running!" })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
