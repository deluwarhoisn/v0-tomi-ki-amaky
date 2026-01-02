"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/contexts/notification-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, CheckCheck, X } from "lucide-react"

interface NotificationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()
  const router = useRouter()
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    markAsRead(notification._id)
    router.push(notification.actionRoute)
    onClose()
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (!isOpen) return null

  return (
    <div
      ref={popupRef}
      className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border bg-card shadow-lg sm:w-96"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Notifications</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
            <CheckCheck className="mr-1 h-3 w-3" />
            Mark all read
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-80">
        {notifications.length > 0 ? (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <button
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full px-4 py-3 text-left transition-colors hover:bg-secondary ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {!notification.read && <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                  <div className={`flex-1 ${notification.read ? "pl-5" : ""}`}>
                    <p
                      className={`text-sm leading-relaxed ${notification.read ? "text-muted-foreground" : "text-foreground"}`}
                    >
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatTime(notification.time)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
