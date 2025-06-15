"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, Palette, LinkIcon, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createBoardWithCategories } from "@/supabase/database-utils";
import { createClient } from "@/lib/supabase/client";

const CATEGORY_COLORS = [
  "#3B82F6", "#8B5CF6", "#EF4444", "#10B981", 
  "#F59E0B", "#EC4899", "#6366F1", "#14B8A6"
];

interface Category {
  name: string;
  color: string;
}

export function CreateBoardForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([
    { name: "General", color: "#3B82F6" },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
    setSlug(generatedSlug);
  };

  const addCategory = () => {
    if (newCategoryName.trim() && categories.length < 8) {
      const isDuplicate = categories.some(
        cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
      );

      if (isDuplicate) {
        setError("Category name already exists");
        return;
      }

      const newCategory: Category = {
        name: newCategoryName.trim(),
        color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length],
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setError("");
    }
  };

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required");
      setLoading(false);
      return;
    }

    if (slug.length < 3) {
      setError("Slug must be at least 3 characters long");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to create a board");
        setLoading(false);
        return;
      }

      const result = await createBoardWithCategories(
        {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          owner_id: user.id,
        },
        categories
      );

      if (!result.success) {
        setError(result.error || "Failed to create board");
        setLoading(false);
        return;
      }

      router.push(`/boards/${result.board?.slug}`);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Feedback Board
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-800">
                <strong>Default Setup:</strong> Your board includes a "General" category automatically.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Board Name *</Label>
              <Input
                id="name"
                placeholder="e.g., My Product Feedback"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-l-lg border border-r-0">
                  /board/
                </span>
                <Input
                  id="slug"
                  placeholder="my-product-feedback"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="rounded-l-none"
                />
              </div>
              <p className="text-xs text-gray-500">
                This will be your public URL. Only letters, numbers, and hyphens allowed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell people what kind of feedback you're looking for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-600" />
                <Label>Feedback Categories</Label>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <motion.div
                    key={`${category.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge
                      className="text-sm py-1 px-3 flex items-center space-x-2"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                        border: `1px solid ${category.color}40`,
                      }}
                    >
                      <span>{category.name}</span>
                      {categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              {categories.length < 8 && (
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add category..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addCategory}
                    disabled={!newCategoryName.trim()}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Categories help organize feedback. You can add up to 8 categories.
              </p>
            </div>

            {slug && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 text-sm">
                  <LinkIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">
                    Your public feedback page:
                  </span>
                </div>
                <p className="font-mono text-blue-600 mt-1">
                  {typeof window !== "undefined" ? window.location.origin : ""}
                  /boards/{slug}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !name.trim() || !slug.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Board...
                  </>
                ) : (
                  "Create Board"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}