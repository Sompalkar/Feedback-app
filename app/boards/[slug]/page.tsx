import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PublicFeedbackPage } from "@/components/feedback/public-feedback-page";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BoardPage({ params }: PageProps) {
  const supabase = await createClient();
  const { data: board } = await supabase
    .from("boards")
    .select("*, board_categories(*)")
    .eq("slug", params.slug)
    .single();

  if (!board) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {board.name}
            </h1>
            <p className="text-gray-600">{board.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href={`/boards/${board.slug}/feedback`}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                View All Feedback
              </Button>
            </Link>
          </div>
        </div>

        <PublicFeedbackPage board={board} />
      </div>
    </div>
  );
}
