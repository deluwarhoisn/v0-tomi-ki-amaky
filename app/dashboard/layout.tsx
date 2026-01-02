"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import { ProtectedRoute } from "@/components/protected-route"
import { NotificationPopup } from "@/components/notification-popup"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Coins,
  Home,
  ListTodo,
  FileText,
  Wallet,
  PlusCircle,
  ClipboardList,
  CreditCard,
  History,
  Users,
  ShieldCheck,
  LogOut,
  Menu,
  Bell,
  Github,
  Facebook,
  Linkedin,
} from "lucide-react"

const workerNavItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/tasks", label: "Task List", icon: ListTodo },
  { href: "/dashboard/my-submissions", label: "My Submissions", icon: FileText },
  { href: "/dashboard/withdrawals", label: "Withdrawals", icon: Wallet },
]

const buyerNavItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/add-task", label: "Add New Tasks", icon: PlusCircle },
  { href: "/dashboard/my-tasks", label: "My Task's", icon: ClipboardList },
  { href: "/dashboard/purchase-coin", label: "Purchase Coin", icon: CreditCard },
  { href: "/dashboard/payment-history", label: "Payment History", icon: History },
]

const adminNavItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/manage-users", label: "Manage Users", icon: Users },
  { href: "/dashboard/manage-tasks", label: "Manage Task", icon: ShieldCheck },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const getNavItems = () => {
    if (!user) return []
    switch (user.role) {
      case "worker":
        return workerNavItems
      case "buyer":
        return buyerNavItems
      case "admin":
        return adminNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-7xl px-4">
            {/* Top Row: Logo, User Info, Notification */}
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">T</span>
                </div>
                <span className="text-xl font-bold text-foreground">TaskFlow</span>
              </Link>

              {/* Right Side: Coin, User Info, Notification */}
              <div className="flex items-center gap-4">
                {/* Available Coin | User Image */}
                <div className="hidden items-center gap-3 sm:flex">
                  <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{user?.coin || 0}</span>
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </div>

                {/* User Role | User Name */}
                <div className="hidden flex-col text-right sm:flex">
                  <span className="text-sm font-medium text-foreground">{user?.name}</span>
                  <span className="text-xs capitalize text-muted-foreground">{user?.role}</span>
                </div>

                {/* Notification */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                  <NotificationPopup isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="sm:hidden">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt={user?.name || "User"} />
                        <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <p className="font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs capitalize text-primary">{user?.role}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{user?.coin || 0} coins</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Logout Button (Desktop) */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden text-destructive hover:text-destructive sm:flex"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>

                {/* Mobile Menu Toggle */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64 p-0">
                    <div className="flex h-full flex-col">
                      <div className="border-b border-border p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt={user?.name || "User"} />
                            <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user?.name}</p>
                            <p className="text-xs capitalize text-muted-foreground">{user?.role}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Coins className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{user?.coin || 0} coins</span>
                        </div>
                      </div>
                      <nav className="flex-1 p-4">
                        {navItems.map((item) => {
                          const isActive = pathname === item.href
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                              }`}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </Link>
                          )
                        })}
                      </nav>
                      <div className="border-t border-border p-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Navigation Links (Below Navbar) */}
            <nav className="hidden border-t border-border lg:block">
              <div className="flex items-center gap-1 py-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-background">
          <div className="mx-auto max-w-7xl p-4 lg:p-6">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-muted-foreground">© 2026 TaskFlow. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
