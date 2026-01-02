"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ListTodo, Clock, DollarSign, Eye, CheckCircle, XCircle } from "lucide-react"

// Mock data - replace with API calls
const mockStats = {
  totalTasks: 12,
  pendingWorkers: 156,
  totalPayment: 2450,
}

const mockPendingSubmissions = [
  {
    _id: "1",
    worker_name: "Alice Brown",
    worker_email: "alice@example.com",
    task_title: "Watch YouTube video and comment",
    payable_amount: 10,
    submission_details: "I watched the full video and left a comment. Screenshot: https://imgur.com/abc123",
    submitted_at: "2026-01-02T10:30:00Z",
  },
  {
    _id: "2",
    worker_name: "Bob Wilson",
    worker_email: "bob@example.com",
    task_title: "Sign up for newsletter",
    payable_amount: 5,
    submission_details: "Signed up with my email bob@example.com. Confirmation screenshot attached.",
    submitted_at: "2026-01-02T09:15:00Z",
  },
  {
    _id: "3",
    worker_name: "Carol Davis",
    worker_email: "carol@example.com",
    task_title: "Download mobile app",
    payable_amount: 15,
    submission_details: "Downloaded and rated the app 5 stars. Screenshots: https://imgur.com/xyz789",
    submitted_at: "2026-01-02T08:45:00Z",
  },
]

export function BuyerHome() {
  const { toast } = useToast()
  const [selectedSubmission, setSelectedSubmission] = useState<(typeof mockPendingSubmissions)[0] | null>(null)
  const [submissions, setSubmissions] = useState(mockPendingSubmissions)

  const handleApprove = (submission: (typeof mockPendingSubmissions)[0]) => {
    setSubmissions((prev) => prev.filter((s) => s._id !== submission._id))
    setSelectedSubmission(null)
    toast({
      title: "Submission Approved",
      description: `${submission.worker_name} has been paid ${submission.payable_amount} coins.`,
    })
  }

  const handleReject = (submission: (typeof mockPendingSubmissions)[0]) => {
    setSubmissions((prev) => prev.filter((s) => s._id !== submission._id))
    setSelectedSubmission(null)
    toast({
      title: "Submission Rejected",
      description: "The submission has been rejected and the task slot is now available again.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Buyer Dashboard</h1>
        <p className="text-muted-foreground">Manage your tasks and review submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks you created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Workers</CardTitle>
            <Clock className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.pendingWorkers}</div>
            <p className="text-xs text-muted-foreground">Total slots available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payment</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.totalPayment} coins</div>
            <p className="text-xs text-muted-foreground">Paid to workers</p>
          </CardContent>
        </Card>
      </div>

      {/* Task to Review */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks to Review</CardTitle>
          <CardDescription>Pending submissions awaiting your approval</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell className="font-medium text-foreground">{submission.worker_name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {submission.task_title}
                    </TableCell>
                    <TableCell className="text-foreground">{submission.payable_amount} coins</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-chart-2 hover:bg-chart-2/90"
                          onClick={() => handleApprove(submission)}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(submission)}>
                          <XCircle className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No pending submissions to review. Great job staying on top of things!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>Review the worker&apos;s submission</DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Worker</p>
                  <p className="font-medium text-foreground">{selectedSubmission.worker_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-foreground">{selectedSubmission.payable_amount} coins</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Task</p>
                <p className="font-medium text-foreground">{selectedSubmission.task_title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Submission</p>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedSubmission.submission_details}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-sm text-foreground">{new Date(selectedSubmission.submitted_at).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
              Close
            </Button>
            <Button variant="destructive" onClick={() => selectedSubmission && handleReject(selectedSubmission)}>
              <XCircle className="mr-1 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="bg-chart-2 hover:bg-chart-2/90"
              onClick={() => selectedSubmission && handleApprove(selectedSubmission)}
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
