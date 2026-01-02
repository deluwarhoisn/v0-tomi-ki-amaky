"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Search } from "lucide-react"

// Mock data
const initialTasks = [
  {
    _id: "1",
    task_title: "Watch YouTube video and comment",
    buyer_name: "John Smith",
    buyer_email: "john@example.com",
    payable_amount: 10,
    required_workers: 25,
    completion_date: "2026-01-15",
  },
  {
    _id: "2",
    task_title: "Sign up for newsletter",
    buyer_name: "Sarah Johnson",
    buyer_email: "sarah@example.com",
    payable_amount: 5,
    required_workers: 100,
    completion_date: "2026-01-20",
  },
  {
    _id: "3",
    task_title: "Download mobile app",
    buyer_name: "Mike Chen",
    buyer_email: "mike@example.com",
    payable_amount: 15,
    required_workers: 50,
    completion_date: "2026-01-18",
  },
  {
    _id: "4",
    task_title: "Complete survey",
    buyer_name: "Emily Davis",
    buyer_email: "emily@example.com",
    payable_amount: 8,
    required_workers: 200,
    completion_date: "2026-01-25",
  },
  {
    _id: "5",
    task_title: "Share on social media",
    buyer_name: "Alex Brown",
    buyer_email: "alex@example.com",
    payable_amount: 5,
    required_workers: 150,
    completion_date: "2026-01-12",
  },
]

type Task = (typeof initialTasks)[0]

export default function ManageTasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState(initialTasks)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = tasks.filter(
    (task) =>
      task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteTask = () => {
    if (!deletingTask) return
    setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id))
    toast({
      title: "Task Deleted",
      description: "The task has been removed from the platform.",
      variant: "destructive",
    })
    setDeletingTask(null)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Tasks</h1>
            <p className="text-muted-foreground">View and manage all platform tasks</p>
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

        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>
              Showing {filteredTasks.length} of {tasks.length} tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Slots</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                      {task.task_title}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{task.buyer_name}</p>
                        <p className="text-xs text-muted-foreground">{task.buyer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{task.payable_amount} coins</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{task.required_workers}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(task.completion_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingTask(task)}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTasks.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No tasks found.</div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingTask} onOpenChange={() => setDeletingTask(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{deletingTask?.task_title}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive hover:bg-destructive/90">
                Delete Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
}
