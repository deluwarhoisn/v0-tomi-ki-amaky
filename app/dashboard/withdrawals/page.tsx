"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Wallet, DollarSign, AlertCircle, Loader2 } from "lucide-react"

export default function WithdrawalsPage() {
  const { user, updateUserCoin } = useAuth()
  const { toast } = useToast()
  const [coinToWithdraw, setCoinToWithdraw] = useState("")
  const [paymentSystem, setPaymentSystem] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userCoins = user?.coin || 0
  const withdrawalAmount = coinToWithdraw ? Number(coinToWithdraw) / 20 : 0 // 20 coins = 1 dollar
  const canWithdraw = userCoins >= 200 // Minimum 200 coins = $10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const coins = Number(coinToWithdraw)

    if (coins < 200) {
      toast({
        title: "Minimum not met",
        description: "You need to withdraw at least 200 coins ($10).",
        variant: "destructive",
      })
      return
    }

    if (coins > userCoins) {
      toast({
        title: "Insufficient coins",
        description: "You don't have enough coins for this withdrawal.",
        variant: "destructive",
      })
      return
    }

    if (!paymentSystem || !accountNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Withdrawal requested!",
        description: `Your withdrawal of $${withdrawalAmount.toFixed(2)} has been submitted for processing.`,
      })
      setCoinToWithdraw("")
      setAccountNumber("")
      setPaymentSystem("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <ProtectedRoute allowedRoles={["worker"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Withdrawals</h1>
          <p className="text-muted-foreground">Convert your coins to cash</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Earnings Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Your Earnings
              </CardTitle>
              <CardDescription>Current balance and withdrawal rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div>
                  <p className="text-sm text-muted-foreground">Available Coins</p>
                  <p className="text-3xl font-bold text-foreground">{userCoins}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Withdrawal Value</p>
                  <p className="text-2xl font-bold text-primary">${(userCoins / 20).toFixed(2)}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Conversion Rate</p>
                <p className="text-muted-foreground">20 coins = $1.00</p>
                <p className="text-xs text-muted-foreground mt-1">Minimum withdrawal: 200 coins ($10)</p>
              </div>

              {!canWithdraw && (
                <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Insufficient Balance</p>
                    <p className="text-xs text-destructive/80">
                      You need at least 200 coins to make a withdrawal. Keep completing tasks!
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Withdrawal Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Request Withdrawal
              </CardTitle>
              <CardDescription>Fill in the details to withdraw your earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coins">Coins to Withdraw</Label>
                  <Input
                    id="coins"
                    type="number"
                    placeholder="Enter amount (min 200)"
                    value={coinToWithdraw}
                    onChange={(e) => setCoinToWithdraw(e.target.value)}
                    min="200"
                    max={userCoins}
                    disabled={!canWithdraw}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Withdrawal Amount ($)</Label>
                  <Input
                    id="amount"
                    type="text"
                    value={withdrawalAmount ? `$${withdrawalAmount.toFixed(2)}` : "$0.00"}
                    disabled
                    className="bg-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Method</Label>
                  <Select value={paymentSystem} onValueChange={setPaymentSystem} disabled={!canWithdraw}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="rocket">Rocket</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Account Number</Label>
                  <Input
                    id="account"
                    type="text"
                    placeholder="Enter your account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    disabled={!canWithdraw}
                  />
                </div>

                {canWithdraw ? (
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Request Withdrawal"
                    )}
                  </Button>
                ) : (
                  <p className="text-center text-sm text-destructive font-medium py-2">Insufficient coins</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
