"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock data - replace with API calls
const mockSubmissions = Array.from({ length: 35 }, (_, i) => ({
  _id: String(i + 1),
  task_title: [
    "Watch YouTube video and comment",
    "Sign up for newsletter",
    "Download mobile app",
    "Complete survey",
    "Share on social media",
  ][i % 5],
  payable_amount: [10, 5, 15, 8, 5][i % 5],
  buyer_name: ["John Smith", "Sarah Johnson", "Mike Chen", "Emily Davis", "Alex Brown"][i % 5],
  submission_date: new Date(2026, 0, 1 + i).toISOString(),
  status: (["pending", "approved", "rejected"] as const)[i % 3],
}))

const ITEMS_PER_PAGE = 10

export default function MySubmissionsPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(mockSubmissions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedSubmissions = mockSubmissions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-chart-2 text-card">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return (
          <Badge variant="secondary" className="bg-chart-4/20 text-chart-4">
            Pending
          </Badge>
        )
    }
  }

  return (
    <ProtectedRoute allowedRoles={["worker"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Submissions</h1>
          <p className="text-muted-foreground">Track the status of all your task submissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
            <CardDescription>
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, mockSubmissions.length)} of{" "}
              {mockSubmissions.length} submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubmissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell className="font-medium text-foreground">{submission.task_title}</TableCell>
                    <TableCell className="text-muted-foreground">{submission.buyer_name}</TableCell>
                    <TableCell className="text-foreground">{submission.payable_amount} coins</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(submission.submission_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
