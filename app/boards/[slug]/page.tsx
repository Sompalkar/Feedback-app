import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PublicFeedbackPage } from "@/components/feedback/public-feedback-page"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BoardPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch board with categories - this is public data
  const { data: board, error } = await supabase
    .from("boards")
    .select(`
      *,
      board_categories(*)
    `)
    .eq("slug", slug)
    .single()

  if (error || !board) {
    notFound()
  }

  return <PublicFeedbackPage board={board} />
}
