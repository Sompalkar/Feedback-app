"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, TrendingUp, Users, Star, Plus, BarChart3, Calendar, Clock, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

interface Board {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  feedback?: { count: number }[]
  board_categories?: { name: string; color: string }[]
}

interface Feedback {
  id: string
  content: string
  author_name?: string
  created_at: string
  boards: { name: string }
  board_categories?: { name: string; color: string }
}

interface EnhancedDashboardProps {
  boards: Board[]
  recentFeedback: Feedback[]
  totalBoards: number
  totalFeedback: number
  thisWeekFeedback: number
}

export function EnhancedDashboard({
  boards,
  recentFeedback,
  totalBoards,
  totalFeedback,
  thisWeekFeedback,
}: EnhancedDashboardProps) {
  const stats = [
    {
      name: "Total Boards",
      value: totalBoards,
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      name: "Total Feedback",
      value: totalFeedback,
      icon: Star,
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
      name: "Active Users",
      value: new Set(recentFeedback.filter((f) => f.author_name).map((f) => f.author_name)).size,
      icon: Users,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      change: "+15%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-blue-100 mb-6">Here's what's happening with your feedback boards today.</p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full backdrop-blur-sm"
            >
              <Link href="/boards/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Board
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-black hover:bg-white/10 rounded-full backdrop-blur-sm"
            >
              <Link href="/boards">
                <BarChart3 className="h-4 w-4 mr-2" />
                View All Boards
              </Link>
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card
              className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <span
                        className={`text-xs font-medium flex items-center ${
                          stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        <ArrowUpRight className="h-3 w-3 mr-1" />
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
                {/* Decorative gradient */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Boards */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Recent Boards</span>
              </CardTitle>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link href="/boards">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {boards.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No boards yet</h3>
                  <p className="text-gray-600 mb-6">Create your first feedback board to get started.</p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                  >
                    <Link href="/boards/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Board
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {boards.slice(0, 3).map((board, index) => (
                    <motion.div
                      key={board.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {board.name}
                          </h3>
                          {board.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{board.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {board.feedback?.[0]?.count || 0} feedback
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDistanceToNow(new Date(board.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          {board.board_categories && board.board_categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {board.board_categories.slice(0, 3).map((category) => (
                                <Badge
                                  key={category.name}
                                  variant="secondary"
                                  className="text-xs"
                                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                >
                                  {category.name}
                                </Badge>
                              ))}
                              {board.board_categories.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{board.board_categories.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Link href={`/boards/${board.slug}/feedback`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        <div>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Recent Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentFeedback.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No feedback yet</h3>
                  <p className="text-sm text-gray-600">Feedback will appear here once submitted.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentFeedback.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all duration-300 bg-white/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.boards.name}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{item.content}</p>
                      {item.author_name && <p className="text-xs text-gray-500 mt-1">— {item.author_name}</p>}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
