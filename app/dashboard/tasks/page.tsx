"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProtectedRoute } from "@/components/protected-route"
import { Calendar, Coins, Users, Search, Eye } from "lucide-react"

// Mock data - replace with API calls
const mockTasks = [
  {
    _id: "1",
    task_title: "Watch YouTube video and leave a comment",
    buyer_name: "John Smith",
    completion_date: "2026-01-15",
    payable_amount: 10,
    required_workers: 25,
    task_image_url: "/youtube-task-thumbnail.png",
  },
  {
    _id: "2",
    task_title: "Sign up for our newsletter and confirm email",
    buyer_name: "Sarah Johnson",
    completion_date: "2026-01-20",
    payable_amount: 5,
    required_workers: 100,
    task_image_url: "/newsletter-task-thumbnail.png",
  },
  {
    _id: "3",
    task_title: "Download mobile app and rate 5 stars",
    buyer_name: "Mike Chen",
    completion_date: "2026-01-18",
    payable_amount: 15,
    required_workers: 50,
    task_image_url: "/app-download-task-thumbnail.png",
  },
  {
    _id: "4",
    task_title: "Complete product feedback survey",
    buyer_name: "Emily Davis",
    completion_date: "2026-01-25",
    payable_amount: 8,
    required_workers: 200,
    task_image_url: "/survey-task-thumbnail.png",
  },
  {
    _id: "5",
    task_title: "Share our post on Twitter/X",
    buyer_name: "Alex Brown",
    completion_date: "2026-01-12",
    payable_amount: 5,
    required_workers: 150,
    task_image_url: "/social-share-task-thumbnail.png",
  },
  {
    _id: "6",
    task_title: "Write a product review on Amazon",
    buyer_name: "Lisa Wang",
    completion_date: "2026-01-30",
    payable_amount: 20,
    required_workers: 30,
    task_image_url: "/review-task-thumbnail.png",
  },
]

export default function TaskListPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = mockTasks.filter(
    (task) =>
      task.required_workers > 0 &&
      (task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.buyer_name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <ProtectedRoute allowedRoles={["worker"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Available Tasks</h1>
            <p className="text-muted-foreground">Browse and complete tasks to earn coins</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card key={task._id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video bg-secondary">
                <img
                  src={task.task_image_url || "/placeholder.svg?height=200&width=400&query=task"}
                  alt={task.task_title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2 text-base text-foreground">{task.task_title}</CardTitle>
                <p className="text-sm text-muted-foreground">by {task.buyer_name}</p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(task.completion_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Coins className="h-4 w-4" />
                    <span className="font-semibold">{task.payable_amount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{task.required_workers} slots</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/tasks/${task._id}`} className="w-full">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No tasks found matching your search.</p>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
