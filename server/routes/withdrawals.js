import express from "express"
import { ObjectId } from "mongodb"
import { getDB } from "../config/db.js"
import { verifyToken, verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

// Get all withdrawals (Admin)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB()
    const withdrawals = await db.collection("withdrawals").find({}).sort({ requested_at: -1 }).toArray()
    res.json(withdrawals)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get withdrawals by worker
router.get("/worker/:email", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const withdrawals = await db
      .collection("withdrawals")
      .find({ worker_email: req.params.email })
      .sort({ requested_at: -1 })
      .toArray()
    res.json(withdrawals)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Create withdrawal request (Worker)
router.post("/", verifyToken, async (req, res) => {
  try {
    const db = getDB()
    const { worker_email, worker_name, withdraw_coin, withdraw_amount, payment_system, account_number } = req.body

    // Check if worker has enough coins
    const worker = await db.collection("users").findOne({ email: worker_email })
    if (worker.coins < withdraw_coin) {
      return res.status(400).json({ message: "Insufficient coins" })
    }

    // Minimum withdrawal check ($10 = 200 coins)
    if (withdraw_coin < 200) {
      return res.status(400).json({ message: "Minimum withdrawal is 200 coins ($10)" })
    }

    // Deduct coins from worker
    await db.collection("users").updateOne({ email: worker_email }, { $inc: { coins: -withdraw_coin } })

    const newWithdrawal = {
      worker_email,
      worker_name,
      withdraw_coin,
      withdraw_amount,
      payment_system,
      account_number,
      status: "pending",
      requested_at: new Date(),
    }

    const result = await db.collection("withdrawals").insertOne(newWithdrawal)

    res.status(201).json({ ...newWithdrawal, _id: result.insertedId })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Approve withdrawal (Admin)
router.patch("/:id/approve", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB()
    const withdrawal = await db.collection("withdrawals").findOne({ _id: new ObjectId(req.params.id) })

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" })
    }

    await db
      .collection("withdrawals")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: "approved", approved_at: new Date() } })

    // Notify worker
    await db.collection("notifications").insertOne({
      message: `Your withdrawal request of $${withdrawal.withdraw_amount} has been approved!`,
      toEmail: withdrawal.worker_email,
      actionRoute: "/dashboard/withdrawals",
      time: new Date(),
      read: false,
    })

    res.json({ message: "Withdrawal approved" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
