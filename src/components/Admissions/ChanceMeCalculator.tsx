"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Target,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
  GraduationCap,
  Calculator,
} from "lucide-react";
import { Admission } from "@/lib/types";

interface ChanceMeCalculatorProps {
  admissions: Admission[];
}

interface ChanceResult {
  program: string;
  school: string;
  avgAdmittedAverage: number;
  minAverage: number;
  maxAverage: number;
  dataPoints: number;
  yourChance: "high" | "medium" | "low" | "reach";
  percentile: number;
  recommendation: string;
}

export default function ChanceMeCalculator({ admissions }: ChanceMeCalculatorProps) {
  const [average, setAverage] = useState<string>("");
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [programSearch, setProgramSearch] = useState<string>("");
  const [results, setResults] = useState<ChanceResult[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Get unique programs with stats
  const programStats = useMemo(() => {
    const stats: Record<string, { 
      program: string; 
      school: string; 
      averages: number[];
      total: number;
      count: number;
    }> = {};

    admissions.forEach(a => {
      const key = `${a.Program}|${a.School}`;
      if (!stats[key]) {
        stats[key] = {
          program: a.Program,
          school: a.School,
          averages: [],
          total: 0,
          count: 0,
        };
      }
      stats[key].averages.push(a.Average);
      stats[key].total += a.Average;
      stats[key].count++;
    });

    return Object.entries(stats)
      .filter(([_, s]) => s.count >= 2) // Need at least 2 data points
      .map(([key, s]) => ({
        key,
        program: s.program,
        school: s.school,
        avgAverage: s.total / s.count,
        minAverage: Math.min(...s.averages),
        maxAverage: Math.max(...s.averages),
        count: s.count,
        averages: s.averages.sort((a, b) => a - b),
      }))
      .sort((a, b) => b.count - a.count);
  }, [admissions]);

  // Filter programs based on search
  const filteredPrograms = useMemo(() => {
    if (!programSearch.trim()) return programStats.slice(0, 20);
    const search = programSearch.toLowerCase();
    return programStats.filter(p => 
      p.program.toLowerCase().includes(search) || 
      p.school.toLowerCase().includes(search)
    ).slice(0, 20);
  }, [programStats, programSearch]);

  const toggleProgram = (key: string) => {
    setSelectedPrograms(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : prev.length < 10 
          ? [...prev, key]
          : prev
    );
  };

  const calculateChances = () => {
    const userAvg = parseFloat(average);
    if (isNaN(userAvg) || userAvg < 0 || userAvg > 100) return;

    const newResults: ChanceResult[] = selectedPrograms.map(key => {
      const program = programStats.find(p => p.key === key);
      if (!program) return null;

      // Calculate percentile (what % of admitted students had a lower average)
      const lowerCount = program.averages.filter(a => a < userAvg).length;
      const percentile = (lowerCount / program.averages.length) * 100;

      // Determine chance level
      let chance: "high" | "medium" | "low" | "reach";
      let recommendation: string;

      if (userAvg >= program.avgAverage + 3) {
        chance = "high";
        recommendation = "You're well above the average admitted student. Strong candidate!";
      } else if (userAvg >= program.avgAverage - 2) {
        chance = "medium";
        recommendation = "You're competitive for this program. Focus on supplementary applications if required.";
      } else if (userAvg >= program.minAverage) {
        chance = "low";
        recommendation = "This is a reach but possible. Consider this a stretch goal and have backup options.";
      } else {
        chance = "reach";
        recommendation = "This will be challenging. Consider strengthening your application with extracurriculars.";
      }

      return {
        program: program.program,
        school: program.school,
        avgAdmittedAverage: program.avgAverage,
        minAverage: program.minAverage,
        maxAverage: program.maxAverage,
        dataPoints: program.count,
        yourChance: chance,
        percentile,
        recommendation,
      };
    }).filter(Boolean) as ChanceResult[];

    setResults(newResults.sort((a, b) => b.percentile - a.percentile));
    setHasCalculated(true);
  };

  const getChanceColor = (chance: string) => {
    switch (chance) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-orange-500";
      case "reach": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getChanceIcon = (chance: string) => {
    switch (chance) {
      case "high": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "medium": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "low": return <TrendingDown className="w-5 h-5 text-orange-500" />;
      case "reach": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Enter Your Information
          </CardTitle>
          <CardDescription>
            Input your top 6 average and select programs you're interested in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Average Input */}
          <div className="space-y-2">
            <Label htmlFor="average" className="text-sm font-medium">
              Your Top 6 Average (%)
            </Label>
            <div className="flex gap-4 items-center">
              <Input
                id="average"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 92.5"
                value={average}
                onChange={(e) => setAverage(e.target.value)}
                className="max-w-[200px]"
              />
              {average && (
                <span className="text-sm text-muted-foreground">
                  {parseFloat(average) >= 95 ? "🔥 Excellent!" :
                   parseFloat(average) >= 90 ? "💪 Very strong" :
                   parseFloat(average) >= 85 ? "👍 Solid" :
                   parseFloat(average) >= 80 ? "📚 Good foundation" : "Keep working!"}
                </span>
              )}
            </div>
          </div>

          {/* Program Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Select Programs (max 10) - {selectedPrograms.length} selected
            </Label>
            <Input
              placeholder="Search for programs or universities..."
              value={programSearch}
              onChange={(e) => setProgramSearch(e.target.value)}
            />
            
            <ScrollArea className="h-[300px] rounded-lg border p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredPrograms.map((p) => (
                  <div
                    key={p.key}
                    onClick={() => toggleProgram(p.key)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedPrograms.includes(p.key)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <p className="font-medium text-sm truncate">{p.program}</p>
                    <p className="text-xs opacity-80 truncate">{p.school}</p>
                    <p className="text-xs opacity-60 mt-1">
                      Avg: {p.avgAverage.toFixed(1)}% • {p.count} data points
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Button 
            onClick={calculateChances}
            disabled={!average || selectedPrograms.length === 0}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Calculate My Chances
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {hasCalculated && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Your Results
            </CardTitle>
            <CardDescription>
              Based on {admissions.length.toLocaleString()} historical admission data points
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.yourChance === "high").length}
                </p>
                <p className="text-xs text-muted-foreground">Safety Schools</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {results.filter(r => r.yourChance === "medium").length}
                </p>
                <p className="text-xs text-muted-foreground">Target Schools</p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {results.filter(r => r.yourChance === "low").length}
                </p>
                <p className="text-xs text-muted-foreground">Reach Schools</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {results.filter(r => r.yourChance === "reach").length}
                </p>
                <p className="text-xs text-muted-foreground">Stretch Goals</p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              {results.map((result, i) => (
                <div 
                  key={i} 
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {getChanceIcon(result.yourChance)}
                      <div>
                        <h4 className="font-semibold">{result.program}</h4>
                        <p className="text-sm text-muted-foreground">{result.school}</p>
                      </div>
                    </div>
                    <Badge className={`${getChanceColor(result.yourChance)} text-white`}>
                      {result.yourChance.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Avg Admitted</p>
                      <p className="font-semibold">{result.avgAdmittedAverage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Range</p>
                      <p className="font-semibold">{result.minAverage.toFixed(1)}% - {result.maxAverage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Your Percentile</p>
                      <p className="font-semibold">{result.percentile.toFixed(0)}th</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data Points</p>
                      <p className="font-semibold">{result.dataPoints}</p>
                    </div>
                  </div>

                  {/* Visual percentile bar */}
                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getChanceColor(result.yourChance)} transition-all`}
                        style={{ width: `${Math.min(100, result.percentile)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      You score higher than {result.percentile.toFixed(0)}% of admitted students
                    </p>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground italic">
                    💡 {result.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Application Strategy Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Apply to a mix of safety, target, and reach schools</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Your Grade 12 marks matter most - focus on first semester grades</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Supplementary applications can make or break competitive programs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Apply early - some programs have rolling admissions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Research program-specific requirements (portfolios, interviews, etc.)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
