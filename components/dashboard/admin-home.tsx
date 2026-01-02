"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Users, ShoppingBag, Coins, DollarSign, CheckCircle } from "lucide-react"

// Mock data
const mockStats = {
  totalWorkers: 1250,
  totalBuyers: 340,
  totalAvailableCoins: 458920,
  totalPayments: 125000,
}

const mockWithdrawalRequests = [
  {
    _id: "1",
    worker_name: "Alice Brown",
    worker_email: "alice@example.com",
    withdrawal_coin: 400,
    withdrawal_amount: 20,
    payment_system: "Stripe",
    account_number: "****1234",
    withdraw_date: "2026-01-02T10:30:00Z",
    status: "pending",
  },
  {
    _id: "2",
    worker_name: "Bob Wilson",
    worker_email: "bob@example.com",
    withdrawal_coin: 600,
    withdrawal_amount: 30,
    payment_system: "bKash",
    account_number: "01712345678",
    withdraw_date: "2026-01-02T09:15:00Z",
    status: "pending",
  },
  {
    _id: "3",
    worker_name: "Carol Davis",
    worker_email: "carol@example.com",
    withdrawal_coin: 200,
    withdrawal_amount: 10,
    payment_system: "Nagad",
    account_number: "01898765432",
    withdraw_date: "2026-01-01T16:45:00Z",
    status: "pending",
  },
]

export function AdminHome() {
  const { toast } = useToast()
  const [withdrawals, setWithdrawals] = useState(mockWithdrawalRequests)

  const handleApproveWithdrawal = (withdrawal: (typeof mockWithdrawalRequests)[0]) => {
    setWithdrawals((prev) => prev.filter((w) => w._id !== withdrawal._id))
    toast({
      title: "Withdrawal Approved",
      description: `Payment of $${withdrawal.withdrawal_amount} to ${withdrawal.worker_name} has been processed.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.totalWorkers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Buyers</CardTitle>
            <ShoppingBag className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.totalBuyers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Coins</CardTitle>
            <Coins className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.totalAvailableCoins.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${mockStats.totalPayments.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawal Requests</CardTitle>
          <CardDescription>Review and approve withdrawal requests from workers</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{withdrawal.worker_name}</p>
                        <p className="text-xs text-muted-foreground">{withdrawal.worker_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">${withdrawal.withdrawal_amount}</p>
                        <p className="text-xs text-muted-foreground">{withdrawal.withdrawal_coin} coins</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{withdrawal.payment_system}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{withdrawal.account_number}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(withdrawal.withdraw_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-chart-2 hover:bg-chart-2/90"
                        onClick={() => handleApproveWithdrawal(withdrawal)}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-muted-foreground">No pending withdrawal requests.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
