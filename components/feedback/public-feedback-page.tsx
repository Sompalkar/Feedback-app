"use client";

import type React from "react";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  MessageSquare,
  Send,
  CheckCircle,
  Share2,
  Copy,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Board {
  id: string;
  name: string;
  slug: string;
  description?: string;
  board_categories: { id: string; name: string; color: string }[];
}

interface PublicFeedbackPageProps {
  board: Board;
}

export function PublicFeedbackPage({ board }: PublicFeedbackPageProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorName, setAuthorName] = useState("");

  // Share functionality
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!content.trim()) {
      setError("Please enter your feedback");
      setLoading(false);
      return;
    }

    if (content.trim().length < 10) {
      setError("Feedback must be at least 10 characters long");
      setLoading(false);
      return;
    }

    if (content.trim().length > 1000) {
      setError("Feedback must be less than 1000 characters");
      setLoading(false);
      return;
    }

    if (!categoryId) {
      setError("Please select a category");
      setLoading(false);
      return;
    }

    // Basic spam prevention - check for repeated characters
    const repeatedChars = /(.)\1{4,}/.test(content);
    if (repeatedChars) {
      setError("Please provide meaningful feedback");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase.from("feedback").insert([
        {
          board_id: board.id,
          category_id: categoryId,
          title: content.slice(0, 100), // Use first 100 chars as title
          description: content,
          author_name: authorName.trim() || null, // Set to null if empty
          status: "open",
        },
      ]);

      if (error) {
        console.error("Error submitting feedback:", error);
        setError("Failed to submit feedback. Please try again.");
      } else {
        setSuccess(true);
        setContent("");
        setCategoryId("");
        setAuthorName("");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thank you!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your feedback has been submitted successfully. It helps make
                  this product better!
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => setSuccess(false)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg"
                  >
                    Submit More Feedback
                  </Button>
                  <Button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    variant="outline"
                    className="w-full rounded-lg"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share This Board
                  </Button>
                </div>

                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Input value={shareUrl} readOnly className="text-sm" />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(shareUrl)}
                        className="shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {board.name}
              </h1>
            </div>
            {board.description && (
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {board.description}
              </p>
            )}
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Button
                onClick={() => setShowShareOptions(!showShareOptions)}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {showShareOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border p-3 z-10"
                >
                  <div className="flex items-center space-x-2 min-w-[300px]">
                    <Input value={shareUrl} readOnly className="text-sm" />
                    <Button size="sm" onClick={() => copyToClipboard(shareUrl)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Share Your Feedback
              </CardTitle>
              <p className="text-center text-gray-600">
                Your feedback is anonymous and helps improve this product. Be
                honest and constructive!
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={categoryId}
                    onValueChange={setCategoryId}
                    required
                  >
                    <SelectTrigger className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {board.board_categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
                </div>

                {/* Feedback Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Your Feedback *</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                    className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Minimum 10 characters</span>
                    <span
                      className={content.length > 1000 ? "text-red-500" : ""}
                    >
                      {content.length}/1000
                    </span>
                  </div>
                </div>

                {/* Optional Name */}
                <div className="space-y-2">
                  <Label htmlFor="authorName">Your Name (Optional)</Label>
                  <Input
                    id="authorName"
                    type="text"
                    placeholder="Leave blank to stay anonymous"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Adding your name helps the team follow up, but it's
                    completely optional.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !content.trim() || !categoryId}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Feedback...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </form>

              {/* Categories Display */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Available Categories:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {board.board_categories.map((category) => (
                    <Badge
                      key={category.id}
                      className="text-sm py-1 px-3"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                        border: `1px solid ${category.color}40`,
                      }}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
