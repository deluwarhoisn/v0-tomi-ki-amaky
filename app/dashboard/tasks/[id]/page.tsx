"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Coins, Users, User, ArrowLeft, Loader2 } from "lucide-react"

// Mock task data - replace with API call
const mockTask = {
  _id: "1",
  task_title: "Watch YouTube video and leave a comment",
  task_detail:
    "Please watch the full video (at least 5 minutes) and leave a meaningful comment about the content. The comment should be at least 20 words and relevant to the video topic. Do not use generic comments like 'nice video' or 'great content'.",
  buyer_name: "John Smith",
  buyer_email: "john@example.com",
  completion_date: "2026-01-15",
  payable_amount: 10,
  required_workers: 25,
  submission_info: "Submit a screenshot showing your comment with timestamp visible",
  task_image_url: "/youtube-task-thumbnail.png",
}

export default function TaskDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [submissionDetails, setSubmissionDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!submissionDetails.trim()) {
      toast({
        title: "Submission required",
        description: "Please provide your submission details.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call - replace with actual API
    setTimeout(() => {
      toast({
        title: "Submission sent!",
        description: "Your work has been submitted for review.",
      })
      setIsSubmitting(false)
      router.push("/dashboard/my-submissions")
    }, 1500)
  }

  return (
    <ProtectedRoute allowedRoles={["worker"]}>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Task Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="aspect-video bg-secondary">
                <img
                  src={mockTask.task_image_url || "/placeholder.svg?height=400&width=800&query=task"}
                  alt={mockTask.task_title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-foreground">{mockTask.task_title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <User className="h-4 w-4" />
                      Posted by {mockTask.buyer_name}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    <Coins className="mr-1 h-4 w-4" />
                    {mockTask.payable_amount} coins
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Task Details</h3>
                  <p className="text-muted-foreground leading-relaxed">{mockTask.task_detail}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">What to Submit</h3>
                  <p className="text-muted-foreground">{mockTask.submission_info}</p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(mockTask.completion_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{mockTask.required_workers} slots remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submission Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Submit Your Work</CardTitle>
                <CardDescription>Provide proof of task completion</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="submission">Submission Details</Label>
                    <Textarea
                      id="submission"
                      placeholder="Paste your screenshot URL or describe your submission..."
                      value={submissionDetails}
                      onChange={(e) => setSubmissionDetails(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Include links to screenshots or other proof as required.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit for Review"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
