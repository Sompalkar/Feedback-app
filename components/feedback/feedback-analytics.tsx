"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Users, MessageSquare, Calendar } from "lucide-react";
import { format, subDays, eachDayOfInterval } from "date-fns";

interface Board {
  id: string;
  name: string;
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

interface FeedbackAnalyticsProps {
  board: Board;
  feedback: Feedback[];
}

export function FeedbackAnalytics({ board, feedback }: FeedbackAnalyticsProps) {
  // Category distribution data
  const categoryData = board.board_categories.map((category) => ({
    name: category.name,
    value: feedback.filter((f) => f.board_categories?.name === category.name)
      .length,
    color: category.color,
  }));

  // Daily feedback trend (last 30 days)
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const dailyData = last30Days.map((date) => {
    const dayFeedback = feedback.filter((f) => {
      const feedbackDate = new Date(f.created_at);
      return (
        feedbackDate.getDate() === date.getDate() &&
        feedbackDate.getMonth() === date.getMonth() &&
        feedbackDate.getFullYear() === date.getFullYear()
      );
    });

    return {
      date: format(date, "MMM dd"),
      count: dayFeedback.length,
    };
  });

  // Weekly summary
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = subDays(new Date(), (i + 1) * 7);
    const weekEnd = subDays(new Date(), i * 7);
    const weekFeedback = feedback.filter((f) => {
      const feedbackDate = new Date(f.created_at);
      return feedbackDate >= weekStart && feedbackDate <= weekEnd;
    });
    weeklyData.unshift({
      week: `Week ${4 - i}`,
      count: weekFeedback.length,
    });
  }

  // Stats
  const totalFeedback = feedback.length;
  const uniqueAuthors = new Set(
    feedback.filter((f) => f.author_name).map((f) => f.author_name)
  ).size;
  const averageLength =
    Math.round(
      feedback.reduce((sum, f) => sum + f.description.length, 0) /
        feedback.length
    ) || 0;
  const thisWeekCount = feedback.filter(
    (f) => new Date(f.created_at) > subDays(new Date(), 7)
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalFeedback}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {thisWeekCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Named Authors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {uniqueAuthors}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Length</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageLength}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Feedback Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
