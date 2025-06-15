import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BoardsGrid } from "@/components/boards/boards-grid"

export default async function BoardsPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Fetch user's boards with feedback counts and categories
  const { data: boards } = await supabase
    .from("boards")
    .select(`
      *,
      feedback(count),
      board_categories(*)
    `)
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Boards</h1>
          <p className="text-gray-600 mt-2">Manage your feedback boards and view submissions.</p>
        </div>

        <BoardsGrid boards={boards || []} />
      </main>
    </div>
  )
}
