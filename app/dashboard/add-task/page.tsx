"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ImageIcon, Calculator } from "lucide-react"

export default function AddTaskPage() {
  const { user, updateUserCoin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    task_title: "",
    task_detail: "",
    required_workers: "",
    payable_amount: "",
    completion_date: "",
    submission_info: "",
    task_image_url: "",
  })

  const totalCost =
    formData.required_workers && formData.payable_amount
      ? Number(formData.required_workers) * Number(formData.payable_amount)
      : 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    // Validate all fields
    if (
      !formData.task_title ||
      !formData.task_detail ||
      !formData.required_workers ||
      !formData.payable_amount ||
      !formData.completion_date ||
      !formData.submission_info
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough coins
    if (totalCost > user.coin) {
      toast({
        title: "Not enough coins",
        description: "You don't have enough coins for this task. Please purchase more coins.",
        variant: "destructive",
      })
      router.push("/dashboard/purchase-coin")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Deduct coins
      updateUserCoin(user.coin - totalCost)

      toast({
        title: "Task created!",
        description: `Your task has been created successfully. ${totalCost} coins have been deducted.`,
      })

      setIsSubmitting(false)
      router.push("/dashboard/my-tasks")
    }, 1500)
  }

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Task</h1>
          <p className="text-muted-foreground">Create a new task for workers to complete</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
                <CardDescription>Fill in the details for your new task</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task_title">Task Title *</Label>
                    <Input
                      id="task_title"
                      name="task_title"
                      placeholder="e.g., Watch my YouTube video and make a comment"
                      value={formData.task_title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task_detail">Task Description *</Label>
                    <Textarea
                      id="task_detail"
                      name="task_detail"
                      placeholder="Provide detailed instructions for workers..."
                      value={formData.task_detail}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="required_workers">Required Workers *</Label>
                      <Input
                        id="required_workers"
                        name="required_workers"
                        type="number"
                        placeholder="e.g., 100"
                        min="1"
                        value={formData.required_workers}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payable_amount">Payment per Worker (coins) *</Label>
                      <Input
                        id="payable_amount"
                        name="payable_amount"
                        type="number"
                        placeholder="e.g., 10"
                        min="1"
                        value={formData.payable_amount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="completion_date">Completion Deadline *</Label>
                    <Input
                      id="completion_date"
                      name="completion_date"
                      type="date"
                      value={formData.completion_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="submission_info">Submission Requirements *</Label>
                    <Textarea
                      id="submission_info"
                      name="submission_info"
                      placeholder="What should workers submit as proof? e.g., Screenshot with timestamp"
                      value={formData.submission_info}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task_image_url">
                      <span className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Task Image URL (optional)
                      </span>
                    </Label>
                    <Input
                      id="task_image_url"
                      name="task_image_url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.task_image_url}
                      onChange={handleChange}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting || totalCost > (user?.coin || 0)}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Task...
                      </>
                    ) : (
                      "Create Task"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Cost Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Workers</span>
                    <span className="text-foreground">{formData.required_workers || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment each</span>
                    <span className="text-foreground">{formData.payable_amount || 0} coins</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Total Cost</span>
                      <span className="text-primary">{totalCost} coins</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Your Balance</span>
                    <span className="text-foreground">{user?.coin || 0} coins</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">After Task</span>
                    <span className={totalCost > (user?.coin || 0) ? "text-destructive" : "text-chart-2"}>
                      {(user?.coin || 0) - totalCost} coins
                    </span>
                  </div>
                </div>

                {totalCost > (user?.coin || 0) && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">Insufficient coins</p>
                    <p className="text-xs text-destructive/80 mt-1">
                      You need {totalCost - (user?.coin || 0)} more coins.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={() => router.push("/dashboard/purchase-coin")}
                    >
                      Purchase Coins
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
