import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NotificationSettings } from "@/components/settings/notification-settings"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BoardSettingsPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Fetch board by slug and verify ownership
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("*")
    .eq("slug", slug)
    .eq("owner_id", user.id)
    .single()

  if (boardError || !board) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Board Settings</h1>
          <p className="text-gray-600 mt-2">Configure settings for "{board.name}"</p>
        </div>

        <NotificationSettings boardId={board.id} boardName={board.name} />
      </main>
    </div>
  )
}
