"use client"

import { useAuth } from "@/contexts/auth-context"
import { WorkerHome } from "@/components/dashboard/worker-home"
import { BuyerHome } from "@/components/dashboard/buyer-home"
import { AdminHome } from "@/components/dashboard/admin-home"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case "worker":
      return <WorkerHome />
    case "buyer":
      return <BuyerHome />
    case "admin":
      return <AdminHome />
    default:
      return <div>Unknown role</div>
  }
}
