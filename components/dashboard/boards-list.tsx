"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Folder,
  Plus,
  ExternalLink,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Board {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  feedback?: { count: number }[];
  board_categories?: { name: string; color: string }[];
}

interface BoardsListProps {
  boards: Board[];
}

export function BoardsList({ boards }: BoardsListProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Folder className="h-5 w-5 text-blue-600" />
          <span>My Boards</span>
        </CardTitle>
        <Button
          asChild
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
        >
          <Link href="/boards/new">
            <Plus className="h-4 w-4 mr-2" />
            New Board
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {boards.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No boards yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first feedback board to get started.
            </p>
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
            {boards.map((board, index) => (
              <motion.div
                key={board.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {board.name}
                    </h3>
                    {board.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {board.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {board.feedback?.[0]?.count || 0} feedback
                      </span>
                      <span>/{board.slug}</span>
                    </div>
                    {board.board_categories &&
                      board.board_categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {board.board_categories.map((category) => (
                            <Badge
                              key={category.name}
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: `${category.color}20`,
                                color: category.color,
                              }}
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                    >
                      <Link href={`/boards/${board.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                    >
                      <Link href={`/boards/${board.slug}/feedback`}>
                        <BarChart3 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
