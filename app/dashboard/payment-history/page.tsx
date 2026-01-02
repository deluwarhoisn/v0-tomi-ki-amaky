"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"

// Mock data
const mockPayments = [
  { _id: "1", coins: 500, amount: 20, date: "2026-01-02T14:30:00Z", status: "completed" },
  { _id: "2", coins: 150, amount: 10, date: "2025-12-28T10:15:00Z", status: "completed" },
  { _id: "3", coins: 1000, amount: 35, date: "2025-12-20T09:00:00Z", status: "completed" },
  { _id: "4", coins: 10, amount: 1, date: "2025-12-15T16:45:00Z", status: "completed" },
]

export default function PaymentHistoryPage() {
  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
          <p className="text-muted-foreground">View all your coin purchase transactions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All coin purchases made on your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Coins Purchased</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className="text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString()} at{" "}
                      {new Date(payment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{payment.coins} coins</TableCell>
                    <TableCell className="text-foreground">${payment.amount}</TableCell>
                    <TableCell>
                      <Badge className="bg-chart-2 text-card">Completed</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {mockPayments.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No payment history found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
