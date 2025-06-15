import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EnhancedDashboard } from "@/components/dashboard/enhanced-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Fetch user's boards with feedback counts
  const { data: boards } = await supabase
    .from("boards")
    .select(`
      *,
      feedback(count),
      board_categories(*)
    `)
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch recent feedback across all user's boards
  const { data: recentFeedback } = await supabase
    .from("feedback")
    .select(`
      *,
      boards!inner(name, owner_id),
      board_categories(name, color)
    `)
    .eq("boards.owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Calculate enhanced stats
  const totalBoards = boards?.length || 0
  const totalFeedback = boards?.reduce((sum, board) => sum + (board.feedback?.[0]?.count || 0), 0) || 0

  // Calculate this week's feedback
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const thisWeekFeedback = recentFeedback?.filter((f) => new Date(f.created_at) > oneWeekAgo).length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EnhancedDashboard
          boards={boards || []}
          recentFeedback={recentFeedback || []}
          totalBoards={totalBoards}
          totalFeedback={totalFeedback}
          thisWeekFeedback={thisWeekFeedback}
        />
      </main>
    </div>
  )
}
