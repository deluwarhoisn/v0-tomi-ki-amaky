import express from "express"
import { ObjectId } from "mongodb"
import { getDB } from "../config/db.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Get submissions by worker
router.get("/worker/:email", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const { page = 1, limit = 10 } = req.query

    const submissions = await db
      .collection("submissions")
      .find({ worker_email: req.params.email })
      .sort({ submitted_at: -1 })
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))
      .toArray()

    const total = await db.collection("submissions").countDocuments({ worker_email: req.params.email })

    res.json({ submissions, total, pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get submissions by task (for buyer review)
router.get("/task/:taskId", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const submissions = await db
      .collection("submissions")
      .find({ task_id: req.params.taskId })
      .sort({ submitted_at: -1 })
      .toArray()
    res.json(submissions)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get pending submissions for buyer
router.get("/buyer/:email/pending", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const submissions = await db
      .collection("submissions")
      .find({ buyer_email: req.params.email, status: "pending" })
      .sort({ submitted_at: -1 })
      .toArray()
    res.json(submissions)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Create submission (Worker)
router.post("/", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const {
      task_id,
      task_title,
      worker_email,
      worker_name,
      buyer_email,
      buyer_name,
      submission_details,
      payable_amount,
    } = req.body

    // Check if already submitted
    const existingSubmission = await db.collection("submissions").findOne({
      task_id,
      worker_email,
    })

    if (existingSubmission) {
      return res.status(400).json({ message: "You have already submitted for this task" })
    }

    // Check task availability
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(task_id) })
    if (!task || task.current_submissions >= task.task_quantity) {
      return res.status(400).json({ message: "Task is no longer available" })
    }

    const newSubmission = {
      task_id,
      task_title,
      worker_email,
      worker_name,
      buyer_email,
      buyer_name,
      submission_details,
      payable_amount,
      status: "pending",
      submitted_at: new Date(),
    }

    const result = await db.collection("submissions").insertOne(newSubmission)

    // Update task submission count
    await db.collection("tasks").updateOne({ _id: new ObjectId(task_id) }, { $inc: { current_submissions: 1 } })

    // Create notification for buyer
    await db.collection("notifications").insertOne({
      message: `${worker_name} submitted work for "${task_title}"`,
      toEmail: buyer_email,
      actionRoute: "/dashboard",
      time: new Date(),
      read: false,
    })

    res.status(201).json({ ...newSubmission, _id: result.insertedId })
  } catch (error) {
    console.error("Submission error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Approve submission (Buyer)
router.patch("/:id/approve", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const submission = await db.collection("submissions").findOne({ _id: new ObjectId(req.params.id) })

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" })
    }

    // Update submission status
    await db.collection("submissions").updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: "approved" } })

    // Add coins to worker
    await db
      .collection("users")
      .updateOne({ email: submission.worker_email }, { $inc: { coins: submission.payable_amount } })

    // Create notification for worker
    await db.collection("notifications").insertOne({
      message: `Your submission for "${submission.task_title}" was approved! You earned ${submission.payable_amount} coins.`,
      toEmail: submission.worker_email,
      actionRoute: "/dashboard/my-submissions",
      time: new Date(),
      read: false,
    })

    res.json({ message: "Submission approved" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Reject submission (Buyer)
router.patch("/:id/reject", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const submission = await db.collection("submissions").findOne({ _id: new ObjectId(req.params.id) })

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" })
    }

    // Update submission status
    await db.collection("submissions").updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: "rejected" } })

    // Decrement task submission count (slot becomes available again)
    await db
      .collection("tasks")
      .updateOne({ _id: new ObjectId(submission.task_id) }, { $inc: { current_submissions: -1 } })

    // Refund coins to buyer
    await db
      .collection("users")
      .updateOne({ email: submission.buyer_email }, { $inc: { coins: submission.payable_amount } })

    // Create notification for worker
    await db.collection("notifications").insertOne({
      message: `Your submission for "${submission.task_title}" was rejected.`,
      toEmail: submission.worker_email,
      actionRoute: "/dashboard/my-submissions",
      time: new Date(),
      read: false,
    })

    res.json({ message: "Submission rejected" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
