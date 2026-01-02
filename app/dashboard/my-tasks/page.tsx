"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2, Loader2 } from "lucide-react"

// Mock data
const initialTasks = [
  {
    _id: "1",
    task_title: "Watch YouTube video and comment",
    task_detail: "Watch the full video and leave a meaningful comment.",
    completion_date: "2026-01-15",
    payable_amount: 10,
    required_workers: 25,
    submission_info: "Screenshot of comment",
  },
  {
    _id: "2",
    task_title: "Sign up for newsletter",
    task_detail: "Sign up with a valid email and confirm subscription.",
    completion_date: "2026-01-20",
    payable_amount: 5,
    required_workers: 100,
    submission_info: "Screenshot of confirmation",
  },
  {
    _id: "3",
    task_title: "Download mobile app",
    task_detail: "Download and rate the app 5 stars.",
    completion_date: "2026-01-18",
    payable_amount: 15,
    required_workers: 50,
    submission_info: "Screenshot of rating",
  },
]

type Task = (typeof initialTasks)[0]

export default function MyTasksPage() {
  const { user, updateUserCoin } = useAuth()
  const { toast } = useToast()
  const [tasks, setTasks] = useState(initialTasks)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [editForm, setEditForm] = useState({ task_title: "", task_detail: "", submission_info: "" })
  const [isUpdating, setIsUpdating] = useState(false)

  const handleEditClick = (task: Task) => {
    setEditingTask(task)
    setEditForm({
      task_title: task.task_title,
      task_detail: task.task_detail,
      submission_info: task.submission_info,
    })
  }

  const handleUpdate = async () => {
    if (!editingTask) return

    setIsUpdating(true)
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === editingTask._id
            ? {
                ...t,
                task_title: editForm.task_title,
                task_detail: editForm.task_detail,
                submission_info: editForm.submission_info,
              }
            : t,
        ),
      )
      toast({ title: "Task updated", description: "Your task has been updated successfully." })
      setEditingTask(null)
      setIsUpdating(false)
    }, 1000)
  }

  const handleDelete = () => {
    if (!deletingTask || !user) return

    // Calculate refund
    const refund = deletingTask.required_workers * deletingTask.payable_amount

    setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id))
    updateUserCoin(user.coin + refund)

    toast({
      title: "Task deleted",
      description: `Task deleted and ${refund} coins have been refunded.`,
    })
    setDeletingTask(null)
  }

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground">Manage all tasks you have created</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>Sorted by completion date (newest first)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Slots</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks
                  .sort((a, b) => new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime())
                  .map((task) => (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                        {task.task_title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(task.completion_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-foreground">{task.payable_amount} coins</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{task.required_workers} remaining</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(task)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeletingTask(task)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {tasks.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">You haven&apos;t created any tasks yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update your task details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_title">Task Title</Label>
                <Input
                  id="edit_title"
                  value={editForm.task_title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, task_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_detail">Task Detail</Label>
                <Textarea
                  id="edit_detail"
                  value={editForm.task_detail}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, task_detail: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_submission">Submission Info</Label>
                <Textarea
                  id="edit_submission"
                  value={editForm.submission_info}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, submission_info: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Task"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingTask} onOpenChange={() => setDeletingTask(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete the task and refund{" "}
                <span className="font-semibold text-foreground">
                  {deletingTask ? deletingTask.required_workers * deletingTask.payable_amount : 0} coins
                </span>{" "}
                for uncompleted slots. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
}
