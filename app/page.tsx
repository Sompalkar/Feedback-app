"use client";

import { LandingNavbar } from "@/components/layout/landing-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  MessageSquare,
  BarChart3,
  Users,
  Zap,
  Shield,
  Rocket,
  Lock,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function LandingPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const companyLogos = [
    {
      name: "Google",
      logo: "/logos/google.svg",
      width: 120,
      height: 40,
    },
    {
      name: "Microsoft",
      logo: "/logos/microsoft.svg",
      width: 140,
      height: 40,
    },
    {
      name: "Apple",
      logo: "/logos/apple.svg",
      width: 100,
      height: 40,
    },
    {
      name: "Amazon",
      logo: "/logos/amazon.svg",
      width: 120,
      height: 40,
    },
    {
      name: "Meta",
      logo: "/logos/meta.svg",
      width: 100,
      height: 40,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl opacity-20"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-20"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm mb-8"
            >
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">
                The Ultimate Feedback Management Platform
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Collect and Manage
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Feedback{" "}
              </span>
              Like a Pro
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Create beautiful feedback boards, collect anonymous insights, and
              make data-driven decisions. Perfect for product managers, event
              organizers, and teams.
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {[
                "Anonymous Feedback",
                "Real-time Analytics",
                "Team Collaboration",
                "Secure & Private",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {feature}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg border-2 hover:bg-white/50 transition-all duration-300"
              >
                <Link href="/features">Learn More</Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col items-center gap-6"
            >
              <p className="text-sm text-gray-500">
                Trusted by innovative teams
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-75">
                {companyLogos.map((company) => (
                  <div
                    key={company.name}
                    className="relative h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={company.width}
                      height={company.height}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Floating Animation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <h3 className="text-5xl font-bold text-gray-900 mb-2 relative">
                  10K+
                </h3>
              </div>
              <p className="text-gray-600 text-lg">Active Users</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <h3 className="text-5xl font-bold text-gray-900 mb-2 relative">
                  50K+
                </h3>
              </div>
              <p className="text-gray-600 text-lg">Feedback Collected</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <h3 className="text-5xl font-bold text-gray-900 mb-2 relative">
                  99%
                </h3>
              </div>
              <p className="text-gray-600 text-lg">Satisfaction Rate</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Enhanced Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features for better feedback
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              {
                icon: Users,
                title: "Anonymous Feedback",
                description:
                  "Collect honest feedback without barriers. Users can submit feedback anonymously, encouraging more genuine responses.",
              },
              {
                icon: Shield,
                title: "Public & Private",
                description:
                  "Create public feedback boards for everyone to contribute, while keeping your dashboard private and secure.",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description:
                  "Get instant insights with beautiful charts and analytics. Track feedback trends and make data-driven decisions.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Work together with your team. Share boards, assign feedback, and collaborate on improvements.",
              },
              {
                icon: Rocket,
                title: "Lightning Fast",
                description:
                  "Built with modern technology for blazing fast performance. Your users will love the smooth experience.",
              },
              {
                icon: Lock,
                title: "Secure & Private",
                description:
                  "Enterprise-grade security with row-level security policies. Your data is safe and private.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our users have to say about Feedback Hub
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              {
                quote:
                  "Feedback Hub has transformed how we collect and manage user feedback. The anonymous feature is a game-changer!",
                author: "Sarah Johnson",
                role: "Product Manager",
              },
              {
                quote:
                  "The analytics and insights we get from Feedback Hub have helped us make better product decisions.",
                author: "Michael Chen",
                role: "Team Lead",
              },
              {
                quote:
                  "Setting up feedback boards is incredibly easy, and the real-time updates keep us informed.",
                author: "Emily Rodriguez",
                role: "Event Organizer",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-purple-600/50" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using Feedback Hub to build better
              products.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/signup">
                  Create Your First Board
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg transition-all duration-300"
              >
                <Link href="/features">View Features</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
