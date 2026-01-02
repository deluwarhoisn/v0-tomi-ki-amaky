import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getDB } from "../config/db.js"

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const db = getDB()
    const { name, email, password, role, photoURL } = req.body

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Set initial coins based on role
    const coins = role === "worker" ? 10 : role === "buyer" ? 50 : 0

    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      photoURL: photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d9488&color=fff`,
      coins,
      createdAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)

    // Generate token
    const token = jwt.sign({ id: result.insertedId, email, role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser
    userWithoutPassword._id = result.insertedId

    res.status(201).json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const db = getDB()
    const { email, password } = req.body

    // Find user
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Google Sign In
router.post("/google", async (req, res) => {
  try {
    const db = getDB()
    const { name, email, photoURL, role } = req.body

    // Check if user exists
    let user = await db.collection("users").findOne({ email })

    if (!user) {
      // Create new user
      const coins = role === "worker" ? 10 : role === "buyer" ? 50 : 0

      const newUser = {
        name,
        email,
        password: "", // No password for Google users
        role,
        photoURL,
        coins,
        createdAt: new Date(),
      }

      const result = await db.collection("users").insertOne(newUser)
      user = { ...newUser, _id: result.insertedId }
    }

    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error("Google auth error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const db = getDB()

    const user = await db.collection("users").findOne({ email: decoded.email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
})

export default router
