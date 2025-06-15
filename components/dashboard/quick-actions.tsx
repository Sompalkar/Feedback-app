"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Share2, BarChart3, Download, Settings } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function QuickActions() {
  const actions = [
    {
      title: "Create New Board",
      description: "Start collecting feedback with a new board",
      icon: Plus,
      href: "/boards/new",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      title: "View Analytics",
      description: "Analyze your feedback trends",
      icon: BarChart3,
      href: "/analytics",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Share Boards",
      description: "Get public links for your boards",
      icon: Share2,
      href: "/boards",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Export Data",
      description: "Download your feedback data",
      icon: Download,
      href: "/export",
      gradient: "from-orange-500 to-amber-500",
    },
  ]

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-lg transition-all duration-300 group"
              >
                <Link href={action.href}>
                  <div
                    className={`p-3 rounded-full bg-gradient-to-r ${action.gradient} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                  </div>
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
