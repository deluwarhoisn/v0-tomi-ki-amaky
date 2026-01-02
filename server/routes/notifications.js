import express from "express"
import { ObjectId } from "mongodb"
import { getDB } from "../config/db.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Get notifications for user
router.get("/:email", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const notifications = await db
      .collection("notifications")
      .find({ toEmail: req.params.email })
      .sort({ time: -1 })
      .limit(20)
      .toArray()
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Mark notification as read
router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    await db.collection("notifications").updateOne({ _id: new ObjectId(req.params.id) }, { $set: { read: true } })
    res.json({ message: "Notification marked as read" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Mark all as read
router.patch("/read-all/:email", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    await db.collection("notifications").updateMany({ toEmail: req.params.email }, { $set: { read: true } })
    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
