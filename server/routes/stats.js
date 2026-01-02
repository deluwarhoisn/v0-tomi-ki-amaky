import express from "express"
import { getDB } from "../config/db.js"
import { verifyToken, verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

// Get platform stats (Admin)
router.get("/admin", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB()

    const totalWorkers = await db.collection("users").countDocuments({ role: "worker" })
    const totalBuyers = await db.collection("users").countDocuments({ role: "buyer" })
    const totalTasks = await db.collection("tasks").countDocuments()

    // Calculate total coins in platform
    const usersWithCoins = await db
      .collection("users")
      .aggregate([{ $group: { _id: null, totalCoins: { $sum: "$coins" } } }])
      .toArray()
    const totalCoins = usersWithCoins[0]?.totalCoins || 0

    // Total payments (approved withdrawals)
    const payments = await db
      .collection("withdrawals")
      .aggregate([{ $match: { status: "approved" } }, { $group: { _id: null, total: { $sum: "$withdraw_amount" } } }])
      .toArray()
    const totalPayments = payments[0]?.total || 0

    res.json({
      totalWorkers,
      totalBuyers,
      totalTasks,
      totalCoins,
      totalPayments,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get worker stats
router.get("/worker/:email", verifyToken, async (req, res) => {
  try {
    const db = getDB()

    const totalSubmissions = await db.collection("submissions").countDocuments({ worker_email: req.params.email })
    const pendingSubmissions = await db
      .collection("submissions")
      .countDocuments({ worker_email: req.params.email, status: "pending" })
    const approvedSubmissions = await db
      .collection("submissions")
      .countDocuments({ worker_email: req.params.email, status: "approved" })

    // Total earnings
    const earnings = await db
      .collection("submissions")
      .aggregate([
        { $match: { worker_email: req.params.email, status: "approved" } },
        { $group: { _id: null, total: { $sum: "$payable_amount" } } },
      ])
      .toArray()
    const totalEarnings = earnings[0]?.total || 0

    res.json({
      totalSubmissions,
      pendingSubmissions,
      approvedSubmissions,
      totalEarnings,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get buyer stats
router.get("/buyer/:email", verifyToken, async (req, res) => {
  try {
    const db = getDB()

    const totalTasks = await db.collection("tasks").countDocuments({ buyer_email: req.params.email })
    const pendingReviews = await db
      .collection("submissions")
      .countDocuments({ buyer_email: req.params.email, status: "pending" })

    // Total payment
    const payments = await db
      .collection("submissions")
      .aggregate([
        { $match: { buyer_email: req.params.email, status: "approved" } },
        { $group: { _id: null, total: { $sum: "$payable_amount" } } },
      ])
      .toArray()
    const totalPayment = payments[0]?.total || 0

    res.json({
      totalTasks,
      pendingReviews,
      totalPayment,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get homepage stats (public)
router.get("/public", async (req, res) => {
  try {
    const db = getDB()

    const totalUsers = await db.collection("users").countDocuments()
    const totalTasks = await db.collection("tasks").countDocuments()
    const completedTasks = await db.collection("submissions").countDocuments({ status: "approved" })

    res.json({
      totalUsers,
      totalTasks,
      completedTasks,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
