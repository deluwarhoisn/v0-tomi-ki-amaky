"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Notification {
  _id: string
  message: string
  toEmail: string
  actionRoute: string
  time: string
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "_id" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock initial notifications
const mockNotifications: Notification[] = [
  {
    _id: "1",
    message: "You have earned 10 coins from John Smith for completing 'Watch YouTube video'",
    toEmail: "worker@example.com",
    actionRoute: "/dashboard",
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    _id: "2",
    message: "Your withdrawal request of $20 has been approved",
    toEmail: "worker@example.com",
    actionRoute: "/dashboard/withdrawals",
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    _id: "3",
    message: "New submission received for 'Sign up for newsletter' from Alice Brown",
    toEmail: "buyer@example.com",
    actionRoute: "/dashboard",
    time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
  },
  {
    _id: "4",
    message: "Your submission for 'Download mobile app' was rejected. Please try again.",
    toEmail: "worker@example.com",
    actionRoute: "/dashboard/my-submissions",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
  },
]

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: Omit<Notification, "_id" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      _id: Date.now().toString(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
