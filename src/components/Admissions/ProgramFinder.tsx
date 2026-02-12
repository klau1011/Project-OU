"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  School,
  Target,
  Users,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
} from "lucide-react";
import { Admission } from "@/lib/types";

interface ProgramFinderProps {
  admissions: Admission[];
}

interface ProgramData {
  program: string;
  school: string;
  avgAverage: number;
  minAverage: number;
  maxAverage: number;
  count: number;
  hasScholarships: boolean;
  hasSuppApp: boolean;
}

type SortField = "program" | "school" | "avgAverage" | "count" | "minAverage";
type SortDirection = "asc" | "desc";

export default function ProgramFinder({ admissions }: ProgramFinderProps) {
  const [search, setSearch] = useState("");
  const [minAvg, setMinAvg] = useState("");
  const [maxAvg, setMaxAvg] = useState("");
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("count");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [onlyScholarships, setOnlyScholarships] = useState(false);

  // Process program data - data is pre-cleaned in JSON, group by Program + School
  const { programs, schools } = useMemo(() => {
    const programMap: Record<string, ProgramData & { scholarshipCount: number; suppAppCount: number }> = {};
    const schoolSet = new Set<string>();

    admissions.forEach(a => {
      schoolSet.add(a.School);
      
      // Group by Program + School (data is already normalized in JSON)
      const key = `${a.Program}|${a.School}`;
      
      if (!programMap[key]) {
        programMap[key] = {
          program: a.Program,
          school: a.School,
          avgAverage: 0,
          minAverage: 100,
          maxAverage: 0,
          count: 0,
          hasScholarships: false,
          hasSuppApp: false,
          scholarshipCount: 0,
          suppAppCount: 0,
        };
      }

      programMap[key].count++;
      programMap[key].avgAverage += a.Average;
      programMap[key].minAverage = Math.min(programMap[key].minAverage, a.Average);
      programMap[key].maxAverage = Math.max(programMap[key].maxAverage, a.Average);
      
      if (a.Scholarship && a.Scholarship > 0) {
        programMap[key].hasScholarships = true;
        programMap[key].scholarshipCount++;
      }
      if (a.HasSuppApp) {
        programMap[key].hasSuppApp = true;
        programMap[key].suppAppCount++;
      }
    });

    const programs = Object.values(programMap)
      .map(p => ({
        ...p,
        avgAverage: p.avgAverage / p.count,
      }));

    // Count admissions per school for popularity sorting
    const schoolCounts: Record<string, number> = {};
    admissions.forEach(a => {
      schoolCounts[a.School] = (schoolCounts[a.School] || 0) + 1;
    });

    // Sort schools by count (most popular first)
    const sortedSchools = Array.from(schoolSet)
      .sort((a, b) => (schoolCounts[b] || 0) - (schoolCounts[a] || 0));

    return {
      programs,
      schools: sortedSchools,
    };
  }, [admissions]);

  // Filter and sort programs
  const filteredPrograms = useMemo(() => {
    let filtered = programs;

    // Text search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.program.toLowerCase().includes(searchLower) ||
        p.school.toLowerCase().includes(searchLower)
      );
    }

    // Average range filter
    if (minAvg) {
      const min = parseFloat(minAvg);
      if (!isNaN(min)) {
        filtered = filtered.filter(p => p.avgAverage >= min);
      }
    }
    if (maxAvg) {
      const max = parseFloat(maxAvg);
      if (!isNaN(max)) {
        filtered = filtered.filter(p => p.avgAverage <= max);
      }
    }

    // School filter
    if (selectedSchools.length > 0) {
      filtered = filtered.filter(p => selectedSchools.includes(p.school));
    }

    // Scholarship filter
    if (onlyScholarships) {
      filtered = filtered.filter(p => p.hasScholarships);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "program":
          comparison = a.program.localeCompare(b.program);
          break;
        case "school":
          comparison = a.school.localeCompare(b.school);
          break;
        case "avgAverage":
          comparison = a.avgAverage - b.avgAverage;
          break;
        case "minAverage":
          comparison = a.minAverage - b.minAverage;
          break;
        case "count":
          comparison = a.count - b.count;
          break;
      }
      return sortDirection === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [programs, search, minAvg, maxAvg, selectedSchools, sortField, sortDirection, onlyScholarships]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleSchool = (school: string) => {
    setSelectedSchools(prev =>
      prev.includes(school)
        ? prev.filter(s => s !== school)
        : [...prev, school]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setMinAvg("");
    setMaxAvg("");
    setSelectedSchools([]);
    setOnlyScholarships(false);
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded hover:bg-muted transition-colors ${
        sortField === field ? "text-primary bg-primary/10" : "text-muted-foreground"
      }`}
    >
      {label}
      {sortField === field && (
        sortDirection === "desc" ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search programs or universities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Average Range (%)</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minAvg}
                      onChange={(e) => setMinAvg(e.target.value)}
                      className="w-20 sm:w-20"
                      inputMode="decimal"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxAvg}
                      onChange={(e) => setMaxAvg(e.target.value)}
                      className="w-20 sm:w-20"
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Options</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="scholarships"
                      checked={onlyScholarships}
                      onCheckedChange={(checked) => setOnlyScholarships(checked === true)}
                    />
                    <label htmlFor="scholarships" className="text-sm cursor-pointer">
                      Programs with scholarship data
                    </label>
                  </div>
                </div>

                <div className="flex items-end">
                  <Button variant="ghost" onClick={clearFilters} className="text-sm">
                    Clear all filters
                  </Button>
                </div>
              </div>

              {/* School Selection */}
              <div className="space-y-2">
                <Label className="text-sm">Filter by University ({selectedSchools.length} selected)</Label>
                <ScrollArea className="h-[120px] rounded-lg border p-2">
                  <div className="flex flex-wrap gap-2">
                    {schools.map(school => (
                      <Badge
                        key={school}
                        variant={selectedSchools.includes(school) ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => toggleSchool(school)}
                      >
                        {school.length > 30 ? school.substring(0, 27) + "..." : school}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            {filteredPrograms.length.toLocaleString()} Programs Found
          </h2>
          <p className="text-sm text-muted-foreground">
            From {new Set(filteredPrograms.map(p => p.school)).size} universities
          </p>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 overflow-x-auto pb-2 -mb-2">
          <SortButton field="count" label="Data Points" />
          <SortButton field="avgAverage" label="Average" />
          <SortButton field="minAverage" label="Min Average" />
          <SortButton field="program" label="Program Name" />
          <SortButton field="school" label="University" />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.slice(0, 50).map((p, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base leading-tight line-clamp-2">
                {p.program}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <School className="w-3 h-3" />
                {p.school}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-muted rounded">
                    <p className="text-lg font-bold">{p.avgAverage.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <p className="text-lg font-bold">{p.minAverage.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Min</p>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <p className="text-lg font-bold">{p.maxAverage.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Max</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {p.count} entries
                  </Badge>
                  {p.hasScholarships && (
                    <Badge className="text-xs bg-emerald-500">
                      💰 Scholarships
                    </Badge>
                  )}
                  {p.hasSuppApp && (
                    <Badge variant="outline" className="text-xs">
                      📝 Supp App
                    </Badge>
                  )}
                </div>

                {/* Competitiveness indicator */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Competitiveness</span>
                    <span className={
                      p.avgAverage >= 95 ? "text-red-500" :
                      p.avgAverage >= 90 ? "text-orange-500" :
                      p.avgAverage >= 85 ? "text-yellow-500" :
                      "text-green-500"
                    }>
                      {p.avgAverage >= 95 ? "Very High" :
                       p.avgAverage >= 90 ? "High" :
                       p.avgAverage >= 85 ? "Moderate" :
                       "Accessible"}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        p.avgAverage >= 95 ? "bg-red-500" :
                        p.avgAverage >= 90 ? "bg-orange-500" :
                        p.avgAverage >= 85 ? "bg-yellow-500" :
                        "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(100, p.avgAverage)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms.length > 50 && (
        <p className="text-center text-muted-foreground text-sm">
          Showing 50 of {filteredPrograms.length} programs. Use filters to narrow down results.
        </p>
      )}

      {filteredPrograms.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No programs found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
