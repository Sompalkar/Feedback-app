import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CreateBoardForm } from "@/components/boards/create-board-form"

export default async function NewBoardPage() {
  const supabase = await createClient()

  // Get current user - protect this route
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Board</h1>
          <p className="text-gray-600 mt-2">
            Set up a new feedback board to start collecting insights from your users.
          </p>
        </div>

        <CreateBoardForm />
      </main>
    </div>
  )
}
