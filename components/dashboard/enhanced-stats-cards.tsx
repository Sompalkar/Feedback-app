"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Folder, Tag, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface EnhancedStatsCardsProps {
  totalBoards: number
  totalFeedback: number
  totalCategories: number
  thisWeekFeedback: number
}

export function EnhancedStatsCards({
  totalBoards,
  totalFeedback,
  totalCategories,
  thisWeekFeedback,
}: EnhancedStatsCardsProps) {
  const stats = [
    {
      name: "Total Boards",
      value: totalBoards,
      icon: Folder,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      name: "Total Feedback",
      value: totalFeedback,
      icon: MessageSquare,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      name: "This Week",
      value: thisWeekFeedback,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      name: "Categories",
      value: totalCategories,
      icon: Tag,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      change: "+5%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card
            className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <span
                      className={`text-xs font-medium ${
                        stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs last month</p>
                </div>
                <motion.div
                  className={`p-3 rounded-full bg-gradient-to-r ${stat.gradient} shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
