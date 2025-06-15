"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Folder,
  Plus,
  MessageSquare,
  MoreHorizontal,
  Eye,
  Trash2,
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

interface BoardsGridProps {
  boards: Board[];
}

export function BoardsGrid({ boards }: BoardsGridProps) {
  if (boards.length === 0) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Folder className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No boards yet
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create your first feedback board to start collecting valuable
            insights from your users.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/boards/new">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Board
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board, index) => (
        <motion.div
          key={board.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {board.name}
                  </CardTitle>
                  {board.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {board.description}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/boards/${board.slug}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" />
                        View Public Page
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Board
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{board.feedback?.[0]?.count || 0} feedback</span>
                  </div>
                  <div className="text-gray-500">/{board.slug}</div>
                </div>

                {/* Categories */}
                {board.board_categories &&
                  board.board_categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {board.board_categories.slice(0, 3).map((category) => (
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
                      {board.board_categories.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{board.board_categories.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                {/* Action Button */}
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                >
                  <Link href={`/boards/${board.slug}`} target="_blank">
                    <Eye className="h-4 w-4 mr-2" />
                    View Public Page
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Add New Board Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: boards.length * 0.1 }}
      >
        <Card className="shadow-lg border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm hover:border-blue-400 hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create New Board
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Start collecting feedback with a new board
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
            >
              <Link href="/boards/new">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
