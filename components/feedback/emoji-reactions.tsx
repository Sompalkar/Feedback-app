"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Reaction {
  emoji: string
  count: number
}

interface EmojiReactionsProps {
  feedbackId: string
}

const AVAILABLE_EMOJIS = ["👍", "👎", "❤️", "😊", "😢", "😮", "🔥", "🎉"]

export function EmojiReactions({ feedbackId }: EmojiReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReactions()
  }, [feedbackId])

  const fetchReactions = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("feedback_reactions")
        .select("emoji, count")
        .eq("feedback_id", feedbackId)

      if (error) throw error
      setReactions(data || [])
    } catch (error) {
      console.error("Error fetching reactions:", error)
    }
  }

  const addReaction = async (emoji: string) => {
    if (loading) return
    setLoading(true)

    try {
      const supabase = createClient()

      // Check if reaction already exists
      const { data: existing } = await supabase
        .from("feedback_reactions")
        .select("*")
        .eq("feedback_id", feedbackId)
        .eq("emoji", emoji)
        .single()

      if (existing) {
        // Increment count
        const { error } = await supabase
          .from("feedback_reactions")
          .update({ count: existing.count + 1 })
          .eq("id", existing.id)

        if (error) throw error
      } else {
        // Create new reaction
        const { error } = await supabase.from("feedback_reactions").insert({
          feedback_id: feedbackId,
          emoji,
          count: 1,
        })

        if (error) throw error
      }

      await fetchReactions()
      toast.success("Reaction added!")
    } catch (error) {
      toast.error("Failed to add reaction")
      console.error("Error adding reaction:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Display existing reactions */}
      {reactions.map((reaction) => (
        <motion.div
          key={reaction.emoji}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1 text-sm"
        >
          <span>{reaction.emoji}</span>
          <span className="text-gray-600">{reaction.count}</span>
        </motion.div>
      ))}

      {/* Add reaction button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-gray-100" disabled={loading}>
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-4 gap-1">
            {AVAILABLE_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => addReaction(emoji)}
                disabled={loading}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
