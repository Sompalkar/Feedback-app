"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface NotificationSettingsProps {
  boardId: string
  boardName: string
}

export function NotificationSettings({ boardId, boardName }: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [notificationEmail, setNotificationEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [boardId])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("board_settings").select("*").eq("board_id", boardId).single()

      if (data) {
        setEmailNotifications(data.email_notifications)
        setNotificationEmail(data.notification_email || "")
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const supabase = createClient()

      const { error } = await supabase.from("board_settings").upsert({
        board_id: boardId,
        email_notifications: emailNotifications,
        notification_email: notificationEmail || null,
      })

      if (error) throw error

      toast.success("Settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save settings")
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <span>Notification Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            Configure email notifications for <strong>{boardName}</strong>. You'll receive an email when new feedback is
            submitted.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Email Notifications</Label>
            <p className="text-sm text-gray-600">Receive email alerts when new feedback is submitted</p>
          </div>
          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </div>

        {emailNotifications && (
          <div className="space-y-2">
            <Label htmlFor="notificationEmail">Notification Email</Label>
            <Input
              id="notificationEmail"
              type="email"
              placeholder="Enter email address for notifications"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">Leave blank to use your account email</p>
          </div>
        )}

        <Button
          onClick={saveSettings}
          disabled={saving}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  )
}
