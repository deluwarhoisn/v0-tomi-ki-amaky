"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, DollarSign } from "lucide-react"

// Mock data - replace with API calls to your MongoDB backend
const mockStats = {
  totalSubmissions: 45,
  pendingSubmissions: 12,
  totalEarnings: 850,
}

const mockApprovedSubmissions = [
  {
    id: "1",
    taskTitle: "Watch YouTube video and comment",
    payableAmount: 10,
    buyerName: "John Smith",
    status: "approved",
  },
  { id: "2", taskTitle: "Sign up for newsletter", payableAmount: 5, buyerName: "Sarah Johnson", status: "approved" },
  {
    id: "3",
    taskTitle: "Download and review mobile app",
    payableAmount: 15,
    buyerName: "Mike Chen",
    status: "approved",
  },
  {
    id: "4",
    taskTitle: "Complete survey about shopping",
    payableAmount: 8,
    buyerName: "Emily Davis",
    status: "approved",
  },
  { id: "5", taskTitle: "Share post on social media", payableAmount: 5, buyerName: "Alex Brown", status: "approved" },
]

export function WorkerHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Worker Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Submissions</CardTitle>
            <Clock className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.totalEarnings} coins</div>
            <p className="text-xs text-muted-foreground">From approved submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Approved Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Approved Submissions</CardTitle>
          <CardDescription>Your recently approved task submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Title</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApprovedSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium text-foreground">{submission.taskTitle}</TableCell>
                  <TableCell className="text-muted-foreground">{submission.buyerName}</TableCell>
                  <TableCell className="text-foreground">{submission.payableAmount} coins</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-chart-2 text-card">
                      {submission.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
