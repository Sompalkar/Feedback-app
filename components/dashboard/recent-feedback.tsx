"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

interface Feedback {
  id: string
  content: string
  author_name?: string
  created_at: string
  boards: { name: string }
  board_categories?: { name: string; color: string }
}

interface RecentFeedbackProps {
  feedback: Feedback[]
}

export function RecentFeedback({ feedback }: RecentFeedbackProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          <span>Recent Feedback</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {feedback.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
            <p className="text-gray-600">Feedback will appear here once people start submitting.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {feedback.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 bg-white/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {item.boards.name}
                    </Badge>
                    {item.board_categories && (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${item.board_categories.color}20`,
                          color: item.board_categories.color,
                        }}
                      >
                        {item.board_categories.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{item.content}</p>
                {item.author_name && <p className="text-xs text-gray-500">— {item.author_name}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
