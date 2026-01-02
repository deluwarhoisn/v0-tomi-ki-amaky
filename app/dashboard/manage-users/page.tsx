"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import type { UserRole } from "@/contexts/auth-context"
import { Trash2 } from "lucide-react"

// Mock data
const initialUsers = [
  {
    _id: "1",
    name: "John Smith",
    email: "john@example.com",
    photoURL: "/professional-man-avatar.png",
    role: "buyer" as UserRole,
    coin: 450,
  },
  {
    _id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    photoURL: "/professional-woman-avatar.png",
    role: "worker" as UserRole,
    coin: 1250,
  },
  {
    _id: "3",
    name: "Mike Chen",
    email: "mike@example.com",
    photoURL: "/business-man-avatar.png",
    role: "buyer" as UserRole,
    coin: 890,
  },
  {
    _id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    photoURL: "/young-woman-avatar.png",
    role: "worker" as UserRole,
    coin: 2100,
  },
  {
    _id: "5",
    name: "Alex Brown",
    email: "alex@example.com",
    photoURL: "/casual-man-avatar.png",
    role: "admin" as UserRole,
    coin: 0,
  },
]

type User = (typeof initialUsers)[0]

export default function ManageUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState(initialUsers)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role: newRole } : user)))
    toast({
      title: "Role Updated",
      description: `User role has been changed to ${newRole}.`,
    })
  }

  const handleDeleteUser = () => {
    if (!deletingUser) return
    setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id))
    toast({
      title: "User Deleted",
      description: `${deletingUser.name} has been removed from the platform.`,
      variant: "destructive",
    })
    setDeletingUser(null)
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-destructive text-destructive-foreground"
      case "buyer":
        return "bg-chart-2 text-card"
      case "worker":
        return "bg-primary text-primary-foreground"
      default:
        return ""
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
          <p className="text-muted-foreground">View and manage all platform users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Total {users.length} users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Coins</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{user.coin}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(value: UserRole) => handleRoleChange(user._id, value)}
                        >
                          <SelectTrigger className="w-[120px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="worker">Worker</SelectItem>
                            <SelectItem value="buyer">Buyer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="destructive" size="sm" onClick={() => setDeletingUser(user)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold">{deletingUser?.name}</span>? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
}
