"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Globe, BarChart3, MessageSquare, Users } from "lucide-react"

const features = [
  {
    name: "Anonymous Feedback",
    description:
      "Collect honest feedback without barriers. Users can submit feedback anonymously, encouraging more genuine responses.",
    icon: MessageSquare,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Public & Private",
    description:
      "Create public feedback boards for everyone to contribute, while keeping your dashboard private and secure.",
    icon: Globe,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Real-time Analytics",
    description:
      "Get instant insights with beautiful charts and analytics. Track feedback trends and make data-driven decisions.",
    icon: BarChart3,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Team Collaboration",
    description: "Work together with your team. Share boards, assign feedback, and collaborate on improvements.",
    icon: Users,
    gradient: "from-orange-500 to-red-500",
  },
  {
    name: "Lightning Fast",
    description:
      "Built with modern technology for blazing fast performance. Your users will love the smooth experience.",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    name: "Secure & Private",
    description: "Enterprise-grade security with row-level security policies. Your data is safe and private.",
    icon: Shield,
    gradient: "from-indigo-500 to-purple-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Powerful features for better feedback
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform provides all the tools you need to collect, analyze, and act on feedback effectively.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className={`rounded-lg bg-gradient-to-r ${feature.gradient} p-2 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
