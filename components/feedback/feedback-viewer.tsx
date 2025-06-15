"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Filter,
  Search,
  Calendar,
  User,
  ExternalLink,
  Copy,
  BarChart3,
  Download,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { FeedbackAnalytics } from "./feedback-analytics";
import { EmojiReactions } from "./emoji-reactions";

interface Board {
  id: string;
  name: string;
  slug: string;
  description?: string;
  board_categories: { id: string; name: string; color: string }[];
}

interface Feedback {
  id: string;
  title: string;
  description: string;
  author_name?: string;
  created_at: string;
  board_categories?: { name: string; color: string };
}

interface FeedbackViewerProps {
  board: Board;
  feedback: Feedback[];
}

export function FeedbackViewer({ board, feedback }: FeedbackViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Filter and sort feedback
  const filteredFeedback = feedback
    .filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);
      const matchesCategory =
        selectedCategory === "all" ||
        item.board_categories?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  // Calculate stats
  const totalFeedback = feedback.length;
  const categoryCounts = board.board_categories.map((category) => ({
    ...category,
    count: feedback.filter((f) => f.board_categories?.name === category.name)
      .length,
  }));

  const copyPublicLink = async () => {
    const publicUrl = `${window.location.origin}/board/${board.slug}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Public link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const exportFeedback = () => {
    // Create CSV content
    const headers = ["Date", "Category", "Content", "Author"];
    const csvContent = [
      headers.join(","),
      ...filteredFeedback.map((item) =>
        [
          new Date(item.created_at).toLocaleDateString(),
          item.board_categories?.name || "Uncategorized",
          `"${item.description.replace(/"/g, '""')}"`, // Escape quotes
          item.author_name || "Anonymous",
        ].join(",")
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${board.slug}-feedback-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Feedback exported successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{board.name}</h1>
          <p className="text-gray-600 mt-2">
            View and manage feedback for your board
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={exportFeedback}
            variant="outline"
            className="rounded-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Feedback Analytics</DialogTitle>
              </DialogHeader>
              <FeedbackAnalytics board={board} feedback={feedback} />
            </DialogContent>
          </Dialog>
          <Button
            onClick={copyPublicLink}
            variant="outline"
            className="rounded-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Public Link
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
          >
            <Link href={`/board/${board.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Page
            </Link>
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Feedback
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {totalFeedback}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {
                      feedback.filter(
                        (f) =>
                          new Date(f.created_at) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length
                    }{" "}
                    this week
                  </p>
                </div>
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {categoryCounts.slice(0, 3).map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {category.name}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {category.count}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((category.count / totalFeedback) * 100) || 0}%
                      of total
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-full shadow-lg"
                    style={{ backgroundColor: category.color }}
                  >
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Filters */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {board.board_categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(value: "newest" | "oldest") => setSortBy(value)}
            >
              <SelectTrigger className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Feedback List */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span>Feedback ({filteredFeedback.length})</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFeedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feedback.length === 0
                  ? "No feedback yet"
                  : "No feedback matches your filters"}
              </h3>
              <p className="text-gray-600 mb-6">
                {feedback.length === 0
                  ? "Share your public link to start collecting feedback!"
                  : "Try adjusting your search or filter criteria."}
              </p>
              {feedback.length === 0 && (
                <Button
                  onClick={copyPublicLink}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Public Link
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {item.board_categories && (
                        <Badge
                          className="text-sm py-1 px-3"
                          style={{
                            backgroundColor: `${item.board_categories.color}20`,
                            color: item.board_categories.color,
                            border: `1px solid ${item.board_categories.color}40`,
                          }}
                        >
                          {item.board_categories.name}
                        </Badge>
                      )}
                      {item.author_name && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          {item.author_name}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {item.description}
                  </p>

                  {/* Emoji Reactions */}
                  <EmojiReactions feedbackId={item.id} />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
