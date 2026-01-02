import { MongoClient, ServerApiVersion } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const uri = process.env.MONGODB_URI

let db = null
let client = null

export async function connectDB() {
  if (db) return db

  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })

    await client.connect()
    db = client.db("taskflow")
    console.log("Connected to MongoDB!")

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("tasks").createIndex({ buyer_email: 1 })
    await db.collection("submissions").createIndex({ worker_email: 1 })
    await db.collection("submissions").createIndex({ task_id: 1 })

    return db
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.")
  }
  return db
}
