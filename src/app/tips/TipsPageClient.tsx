"use client";

import { useState, useMemo } from "react";
import { Tip as TipModel } from "@prisma/client";
import Tip from "@/components/Tip/Tip";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileQuestion,
  Search,
  SortAsc,
  SortDesc,
  Sparkles,
  Clock,
  TrendingUp,
  Filter,
  Lightbulb,
  BookOpen,
  GraduationCap,
  FileText,
} from "lucide-react";
import PageHeader from "@/components/ui/page-header";

interface TipsPageClientProps {
  tips: TipModel[];
}

type SortOption = "newest" | "oldest" | "title";

// Categorize tips based on content keywords
const CATEGORIES = [
  { id: "all", label: "All Tips", icon: Sparkles },
  { id: "applications", label: "Applications", icon: FileText, keywords: ["application", "apply", "ouac", "supplement", "supp app", "personal statement"] },
  { id: "academics", label: "Academics", icon: BookOpen, keywords: ["grade", "average", "gpa", "course", "mark", "prerequisite", "top 6"] },
  { id: "admissions", label: "Admissions", icon: GraduationCap, keywords: ["admission", "accepted", "offer", "rejected", "waitlist", "defer"] },
  { id: "advice", label: "General Advice", icon: Lightbulb, keywords: ["advice", "tip", "recommend", "suggest", "help", "guide"] },
];

function categorize(tip: TipModel): string[] {
  const text = `${tip.title} ${tip.content}`.toLowerCase();
  const categories: string[] = [];
  
  for (const cat of CATEGORIES) {
    if (cat.id === "all") continue;
    if (cat.keywords?.some(kw => text.includes(kw))) {
      categories.push(cat.id);
    }
  }
  
  return categories.length > 0 ? categories : ["advice"];
}

export default function TipsPageClient({ tips }: TipsPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Process and categorize tips
  const categorizedTips = useMemo(() => {
    return tips.map(tip => ({
      ...tip,
      categories: categorize(tip),
    }));
  }, [tips]);

  // Filter and sort tips
  const filteredTips = useMemo(() => {
    let filtered = categorizedTips;

    // Simple text search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(tip =>
        tip.title.toLowerCase().includes(searchLower) ||
        tip.content.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(tip => tip.categories.includes(selectedCategory));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [categorizedTips, search, selectedCategory, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tips.length };
    categorizedTips.forEach(tip => {
      tip.categories.forEach((cat: string) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [categorizedTips, tips.length]);

  return (
    <div className="container py-8">
      <PageHeader
        title="Community Resources"
        description="A place for students to share helpful resources and advice based on prior experiences"
        icon={FileQuestion}
      />

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Tips</span>
            </div>
            <p className="text-2xl font-bold mt-1">{tips.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Applications</span>
            </div>
            <p className="text-2xl font-bold mt-1">{categoryCounts.applications || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Academics</span>
            </div>
            <p className="text-2xl font-bold mt-1">{categoryCounts.academics || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Admissions</span>
            </div>
            <p className="text-2xl font-bold mt-1">{categoryCounts.admissions || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tips..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("newest")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === "newest"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                <Clock className="w-4 h-4" />
                Newest
              </button>
              <button
                onClick={() => setSortBy("oldest")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === "oldest"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                <SortAsc className="w-4 h-4" />
                Oldest
              </button>
              <button
                onClick={() => setSortBy("title")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === "title"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                <SortDesc className="w-4 h-4" />
                A-Z
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.label}
                      <Badge
                        variant={selectedCategory === cat.id ? "secondary" : "outline"}
                        className="ml-1 h-5 px-1.5"
                      >
                        {count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredTips.length} of {tips.length} tips
          {search && ` matching "${search}"`}
        </p>
      </div>

      {/* Tips Grid */}
      {filteredTips.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTips.map((tip) => (
            <Tip key={tip.id} tip={tip} />
          ))}
        </div>
      ) : (
        <Card className="py-12">
          <CardContent className="text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No tips found</h3>
            <p className="text-muted-foreground">
              {search
                ? "Try adjusting your search terms"
                : "No tips in this category yet. Be the first to contribute!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
