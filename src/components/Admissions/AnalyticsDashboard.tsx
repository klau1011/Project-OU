"use client";

import { useMemo, useState } from "react";
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
  ScatterChart,
  Scatter,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  School,
  GraduationCap,
  Calculator,
  Filter,
  ChevronDown,
  Award,
  Clock,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Admission } from "@/lib/types";

interface AnalyticsDashboardProps {
  admissions: Admission[];
}

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

const AVERAGE_RANGES = [
  { range: "95-100", min: 95, max: 100, label: "95%+" },
  { range: "90-94", min: 90, max: 94.99, label: "90-94%" },
  { range: "85-89", min: 85, max: 89.99, label: "85-89%" },
  { range: "80-84", min: 80, max: 84.99, label: "80-84%" },
  { range: "75-79", min: 75, max: 79.99, label: "75-79%" },
  { range: "<75", min: 0, max: 74.99, label: "<75%" },
];

export default function AnalyticsDashboard({ admissions }: AnalyticsDashboardProps) {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");

  const analytics = useMemo(() => {
    // Filter data based on selections
    let filtered = admissions;
    if (selectedUniversity !== "all") {
      filtered = filtered.filter(a => a.School === selectedUniversity);
    }
    if (selectedProgram !== "all") {
      filtered = filtered.filter(a => 
        a.Program.toLowerCase().includes(selectedProgram.toLowerCase())
      );
    }

    // Basic stats
    const totalRecords = filtered.length;
    const averages = filtered.map(a => a.Average).filter(a => !isNaN(a) && a > 0);
    const overallAverage = averages.length > 0 
      ? averages.reduce((a, b) => a + b, 0) / averages.length 
      : null;
    const minAverage = averages.length > 0 ? Math.min(...averages) : null;
    const maxAverage = averages.length > 0 ? Math.max(...averages) : null;
    const medianAverage = averages.length > 0 
      ? [...averages].sort((a, b) => a - b)[Math.floor(averages.length / 2)] 
      : null;

    // Standard deviation
    const stdDev = averages.length > 0 && overallAverage !== null
      ? Math.sqrt(averages.reduce((sum, avg) => sum + Math.pow(avg - overallAverage, 2), 0) / averages.length)
      : null;

    // University breakdown
    const universityStats: Record<string, { count: number; total: number; min: number; max: number }> = {};
    filtered.forEach(a => {
      if (!universityStats[a.School]) {
        universityStats[a.School] = { count: 0, total: 0, min: 100, max: 0 };
      }
      universityStats[a.School].count++;
      universityStats[a.School].total += a.Average;
      universityStats[a.School].min = Math.min(universityStats[a.School].min, a.Average);
      universityStats[a.School].max = Math.max(universityStats[a.School].max, a.Average);
    });

    const universityData = Object.entries(universityStats)
      .map(([name, stats]) => ({
        name: name.length > 25 ? name.substring(0, 22) + "..." : name,
        fullName: name,
        count: stats.count,
        average: Number((stats.total / stats.count).toFixed(1)),
        min: stats.min,
        max: stats.max,
        range: Number((stats.max - stats.min).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count);

    // Program category breakdown
    const programCategories: Record<string, { count: number; total: number }> = {};
    const categoryKeywords: Record<string, string[]> = {
      "Computer Science": ["computer", "computing", "software", "data science", "ai", "machine learning"],
      "Engineering": ["engineering", "mechanical", "electrical", "civil", "chemical"],
      "Business": ["business", "commerce", "accounting", "finance", "marketing", "management"],
      "Health Sciences": ["health", "nursing", "kinesiology", "medical", "pharmacy", "life science"],
      "Arts & Humanities": ["arts", "english", "history", "philosophy", "music", "drama", "film"],
      "Science": ["science", "biology", "chemistry", "physics", "mathematics", "math"],
      "Social Sciences": ["psychology", "sociology", "economics", "political", "criminology"],
      "Other": [],
    };

    filtered.forEach(a => {
      const program = a.Program.toLowerCase();
      let category = "Other";
      
      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => program.includes(kw))) {
          category = cat;
          break;
        }
      }

      if (!programCategories[category]) {
        programCategories[category] = { count: 0, total: 0 };
      }
      programCategories[category].count++;
      programCategories[category].total += a.Average;
    });

    const categoryData = Object.entries(programCategories)
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        average: Number((stats.total / stats.count).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count);

    // Average distribution
    const distributionData = AVERAGE_RANGES.map(range => ({
      range: range.label,
      count: filtered.filter(a => a.Average >= range.min && a.Average <= range.max).length,
    }));

    // Top competitive programs (highest averages)
    const programStats: Record<string, { count: number; total: number; averages: number[] }> = {};
    filtered.forEach(a => {
      const key = `${a.Program}|${a.School}`;
      if (!programStats[key]) {
        programStats[key] = { count: 0, total: 0, averages: [] };
      }
      programStats[key].count++;
      programStats[key].total += a.Average;
      programStats[key].averages.push(a.Average);
    });

    const topPrograms = Object.entries(programStats)
      .filter(([_, stats]) => stats.count >= 2) // Only programs with multiple data points
      .map(([key, stats]) => {
        const [program, school] = key.split("|");
        return {
          program: program.length > 40 ? program.substring(0, 37) + "..." : program,
          fullProgram: program,
          school: school.length > 25 ? school.substring(0, 22) + "..." : school,
          fullSchool: school,
          count: stats.count,
          average: Number((stats.total / stats.count).toFixed(1)),
          min: Math.min(...stats.averages),
          max: Math.max(...stats.averages),
        };
      })
      .sort((a, b) => b.average - a.average)
      .slice(0, 15);

    // Most accessible programs (lowest averages with offers)
    const accessiblePrograms = Object.entries(programStats)
      .filter(([_, stats]) => stats.count >= 2)
      .map(([key, stats]) => {
        const [program, school] = key.split("|");
        return {
          program: program.length > 40 ? program.substring(0, 37) + "..." : program,
          fullProgram: program,
          school: school.length > 25 ? school.substring(0, 22) + "..." : school,
          fullSchool: school,
          count: stats.count,
          average: Number((stats.total / stats.count).toFixed(1)),
        };
      })
      .sort((a, b) => a.average - b.average)
      .slice(0, 10);

    // Scholarship data
    const scholarshipData = filtered
      .filter(a => a.Scholarship && a.Scholarship > 0)
      .map(a => ({
        program: a.Program.length > 20 ? a.Program.substring(0, 17) + "..." : a.Program,
        school: a.School,
        average: a.Average,
        scholarship: a.Scholarship!,
      }))
      .sort((a, b) => b.scholarship - a.scholarship)
      .slice(0, 20);

    // Scatter plot data for average vs university prestige (by average)
    const scatterData = universityData.map(u => ({
      name: u.name,
      x: u.count,
      y: u.average,
    }));

    // Get unique values for filters
    const universities = Array.from(new Set(admissions.map(a => a.School))).sort();
    const programKeywords = [
      "Computer Science", "Engineering", "Business", "Nursing", 
      "Biology", "Psychology", "Economics", "Mathematics"
    ];

    return {
      totalRecords,
      overallAverage,
      minAverage,
      maxAverage,
      medianAverage,
      stdDev,
      universityData,
      categoryData,
      distributionData,
      topPrograms,
      accessiblePrograms,
      scholarshipData,
      scatterData,
      universities,
      programKeywords,
    };
  }, [admissions, selectedUniversity, selectedProgram]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">University</label>
              <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {analytics.universities.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Program Type</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {analytics.programKeywords.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Records</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics.totalRecords.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg. Average</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics.overallAverage !== null ? `${analytics.overallAverage.toFixed(1)}%` : "N/A"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Highest</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics.maxAverage !== null ? `${analytics.maxAverage.toFixed(1)}%` : "N/A"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Lowest</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics.minAverage !== null ? `${analytics.minAverage.toFixed(1)}%` : "N/A"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Median</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics.medianAverage !== null ? `${analytics.medianAverage.toFixed(1)}%` : "N/A"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Universities</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics.universityData.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Average Distribution
            </CardTitle>
            <CardDescription>
              How admission averages are distributed across ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.distributionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="range" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Program Categories Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Programs by Category
            </CardTitle>
            <CardDescription>
              Distribution of admissions data across program types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* University Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="w-5 h-5" />
            {analytics.universityData.length === 1 ? "University Details" : "University Comparison"}
          </CardTitle>
          <CardDescription>
            {analytics.universityData.length === 1
              ? `Admission average for ${analytics.universityData[0]?.fullName}`
              : "Average admission percentages by university (sorted by data points)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: Math.max(300, analytics.universityData.length * 40) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={analytics.universityData} 
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" domain={[70, 100]} className="text-xs" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150} 
                  className="text-xs"
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Bar dataKey="average" fill="#10b981" radius={[0, 4, 4, 0]} name="Average %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Volume vs Average Scatter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            University Popularity vs Competitiveness
          </CardTitle>
          <CardDescription>
            Each dot represents a university - X axis is number of data points, Y axis is average admission %
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Data Points" 
                  className="text-xs"
                  label={{ value: 'Number of Data Points', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Average" 
                  domain={[75, 100]} 
                  className="text-xs"
                  label={{ value: 'Avg %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Scatter 
                  data={analytics.scatterData} 
                  fill="#8b5cf6"
                  name="University"
                >
                  {analytics.scatterData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Programs Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Competitive */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              {analytics.topPrograms.length === 1 ? "Most Competitive Program" : "Most Competitive Programs"}
            </CardTitle>
            <CardDescription>
              {analytics.topPrograms.length === 1
                ? "Program with the highest average admission percentage"
                : "Programs with the highest average admission percentages (min 2 data points)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {analytics.topPrograms.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" title={p.fullProgram}>
                        {p.program}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" title={p.fullSchool}>
                        {p.school}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <Badge variant="destructive" className="font-bold">
                        {p.average}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {p.count} {p.count === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Most Accessible */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-500" />
              {analytics.accessiblePrograms.length === 1 ? "Most Accessible Program" : "Most Accessible Programs"}
            </CardTitle>
            <CardDescription>
              {analytics.accessiblePrograms.length === 1
                ? "Program with the lowest average admission percentage"
                : "Programs with the lowest average admission percentages (min 2 data points)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {analytics.accessiblePrograms.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" title={p.fullProgram}>
                        {p.program}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" title={p.fullSchool}>
                        {p.school}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <Badge className="bg-green-500 font-bold">
                        {p.average}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {p.count} {p.count === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Scholarship Analysis */}
      {analytics.scholarshipData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Scholarship Data
            </CardTitle>
            <CardDescription>
              Reported scholarship amounts correlated with admission averages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number" 
                    dataKey="average" 
                    name="Average" 
                    domain={[80, 100]}
                    className="text-xs"
                    label={{ value: 'Admission Average (%)', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="scholarship" 
                    name="Scholarship"
                    className="text-xs"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    label={{ value: 'Scholarship ($)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Scatter data={analytics.scholarshipData} fill="#f59e0b" name="Scholarship" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {analytics.scholarshipData.slice(0, 4).map((s, i) => (
                <div key={i} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium truncate">{s.program}</p>
                  <p className="text-lg font-bold text-yellow-600">${s.scholarship.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{s.average}% avg</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-background/80 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Average Range</h4>
              <p className="text-sm text-muted-foreground">
                {analytics.minAverage !== null && analytics.maxAverage !== null && analytics.stdDev !== null ? (
                  <>
                    Admission averages range from <span className="font-bold text-foreground">{analytics.minAverage.toFixed(1)}%</span> to{" "}
                    <span className="font-bold text-foreground">{analytics.maxAverage.toFixed(1)}%</span>, with a standard deviation of{" "}
                    <span className="font-bold text-foreground">{analytics.stdDev.toFixed(1)}%</span>.
                  </>
                ) : (
                  "No data available for the current filter."
                )}
              </p>
            </div>
            <div className="p-4 bg-background/80 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Most Popular Category</h4>
              <p className="text-sm text-muted-foreground">
                {analytics.categoryData[0] && (
                  <>
                    <span className="font-bold text-foreground">{analytics.categoryData[0].name}</span> programs have the most data with{" "}
                    <span className="font-bold text-foreground">{analytics.categoryData[0].count}</span> entries.
                  </>
                )}
              </p>
            </div>
            <div className="p-4 bg-background/80 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Target Average</h4>
              <p className="text-sm text-muted-foreground">
                {analytics.medianAverage !== null && analytics.overallAverage !== null && analytics.stdDev !== null ? (
                  <>
                    The median admission average is <span className="font-bold text-foreground">{analytics.medianAverage.toFixed(1)}%</span>.
                    Aim for above <span className="font-bold text-foreground">{(analytics.overallAverage + analytics.stdDev).toFixed(1)}%</span> for competitive programs.
                  </>
                ) : (
                  "Apply filter to see target recommendations."
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
