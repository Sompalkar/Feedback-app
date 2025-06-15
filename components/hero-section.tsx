"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"

interface HeroSectionProps {
  user: User | null
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <div className="mb-8 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-500/20">
              <MessageSquare className="mr-2 h-4 w-4" />
              Collect feedback like never before
            </div>

            {/* Main heading */}
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              Build Better Products with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Real Feedback
              </span>
            </h1>

            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
              Create beautiful feedback boards, collect anonymous insights, and make data-driven decisions. Perfect for
              product managers, event organizers, and teams.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 py-6 text-lg font-semibold border-2 hover:bg-gray-50"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-3 mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Feedback Collected</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-3 mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">99%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
