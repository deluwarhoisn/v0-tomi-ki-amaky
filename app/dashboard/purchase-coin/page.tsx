"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Coins, CreditCard, Loader2, Check } from "lucide-react"

const coinPackages = [
  { coins: 10, price: 1, popular: false },
  { coins: 150, price: 10, popular: false },
  { coins: 500, price: 20, popular: true },
  { coins: 1000, price: 35, popular: false },
]

export default function PurchaseCoinPage() {
  const { user, updateUserCoin } = useAuth()
  const { toast } = useToast()
  const [selectedPackage, setSelectedPackage] = useState<(typeof coinPackages)[0] | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")

  const handlePurchase = async () => {
    if (!selectedPackage || !user) return

    // Basic validation
    if (!cardNumber || !expiry || !cvc) {
      toast({
        title: "Missing card details",
        description: "Please fill in all card details.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      updateUserCoin(user.coin + selectedPackage.coins)
      toast({
        title: "Payment successful!",
        description: `${selectedPackage.coins} coins have been added to your account.`,
      })
      setSelectedPackage(null)
      setCardNumber("")
      setExpiry("")
      setCvc("")
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchase Coins</h1>
          <p className="text-muted-foreground">Buy coins to create tasks and pay workers</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold text-foreground">{user?.coin || 0} coins</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Coins className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coinPackages.map((pkg) => (
            <Card
              key={pkg.coins}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                pkg.popular ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedPackage(pkg)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Best Value
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-bold text-foreground">{pkg.coins}</CardTitle>
                <CardDescription>coins</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-primary">${pkg.price}</p>
                <p className="text-xs text-muted-foreground mt-1">${(pkg.price / pkg.coins).toFixed(3)} per coin</p>
                <Button className="w-full mt-4" variant={pkg.popular ? "default" : "outline"}>
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Modal */}
        <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Purchase</DialogTitle>
              <DialogDescription>
                You are purchasing {selectedPackage?.coins} coins for ${selectedPackage?.price}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{selectedPackage?.coins} Coins</p>
                  <p className="text-sm text-muted-foreground">One-time purchase</p>
                </div>
                <p className="text-2xl font-bold text-primary">${selectedPackage?.price}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="card"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                This is a demo payment. In production, this would use Stripe for secure payments.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPackage(null)}>
                Cancel
              </Button>
              <Button onClick={handlePurchase} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Pay ${selectedPackage?.price}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
