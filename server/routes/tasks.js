import express from "express"
import { ObjectId } from "mongodb"
import { getDB } from "../config/db.js"
import { verifyToken, verifyBuyer } from "../middleware/auth.js"

const router = express.Router()

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const db = getDB()
    const tasks = await db.collection("tasks").find({}).sort({ createdAt: -1 }).toArray()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get task by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDB()
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(req.params.id) })
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get tasks by buyer email
router.get("/buyer/:email", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const tasks = await db.collection("tasks").find({ buyer_email: req.params.email }).sort({ createdAt: -1 }).toArray()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Create task (Buyer only)
router.post("/", verifyToken, verifyBuyer, async (req, res) => {
  try {
    const db = getDB()
    const {
      task_title,
      task_detail,
      task_quantity,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
      buyer_email,
      buyer_name,
    } = req.body

    const totalCost = task_quantity * payable_amount

    // Check buyer coins
    const buyer = await db.collection("users").findOne({ email: buyer_email })
    if (buyer.coins < totalCost) {
      return res.status(400).json({ message: "Insufficient coins" })
    }

    // Deduct coins from buyer
    await db.collection("users").updateOne({ email: buyer_email }, { $inc: { coins: -totalCost } })

    const newTask = {
      task_title,
      task_detail,
      task_quantity,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
      buyer_email,
      buyer_name,
      current_submissions: 0,
      createdAt: new Date(),
    }

    const result = await db.collection("tasks").insertOne(newTask)
    res.status(201).json({ ...newTask, _id: result.insertedId })
  } catch (error) {
    console.error("Create task error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update task (Buyer only)
router.put("/:id", verifyToken, verifyBuyer, async (req, res) => {
  try {
    const db = getDB()
    const { task_title, task_detail, submission_info } = req.body

    await db
      .collection("tasks")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { task_title, task_detail, submission_info } })

    res.json({ message: "Task updated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Delete task (Buyer/Admin)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(req.params.id) })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Calculate refund (remaining slots * payable_amount)
    const remainingSlots = task.task_quantity - task.current_submissions
    const refundAmount = remainingSlots * task.payable_amount

    // Refund coins to buyer
    if (refundAmount > 0) {
      await db.collection("users").updateOne({ email: task.buyer_email }, { $inc: { coins: refundAmount } })
    }

    // Delete task
    await db.collection("tasks").deleteOne({ _id: new ObjectId(req.params.id) })

    // Delete related submissions
    await db.collection("submissions").deleteMany({ task_id: req.params.id })

    res.json({ message: "Task deleted successfully", refundAmount })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
