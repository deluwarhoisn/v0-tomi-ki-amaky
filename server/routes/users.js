import express from "express"
import { ObjectId } from "mongodb"
import { getDB } from "../config/db.js"
import { verifyToken, verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

// Get all users (Admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB()
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get top workers
router.get("/top-workers", async (req, res) => {
  try {
    const db = getDB()
    const topWorkers = await db
      .collection("users")
      .find({ role: "worker" }, { projection: { password: 0 } })
      .sort({ coins: -1 })
      .limit(6)
      .toArray()
    res.json(topWorkers)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Update user role (Admin only)
router.patch("/:id/role", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB()
    const { role } = req.body

    await db.collection("users").updateOne({ _id: new ObjectId(req.params.id) }, { $set: { role } })

    res.json({ message: "Role updated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Delete user (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB()
    await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) })
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Update user coins
router.patch("/:email/coins", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const { coins, operation } = req.body // operation: 'add' or 'subtract'

    const updateQuery = operation === "add" ? { $inc: { coins: coins } } : { $inc: { coins: -coins } }

    await db.collection("users").updateOne({ email: req.params.email }, updateQuery)

    res.json({ message: "Coins updated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
