import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FeedbackViewer } from "@/components/feedback/feedback-viewer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BoardFeedbackPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Fetch board by slug and verify ownership
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select(
      `
      *,
      board_categories(*)
    `
    )
    .eq("slug", slug)
    .eq("owner_id", user.id)
    .single();

  if (boardError || !board) {
    notFound();
  }

  // Fetch all feedback for this board
  const { data: feedback } = await supabase
    .from("feedback")
    .select(
      `
      *,
      board_categories(name, color)
    `
    )
    .eq("board_id", board.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeedbackViewer board={board} feedback={feedback || []} />
      </main>
    </div>
  );
}
