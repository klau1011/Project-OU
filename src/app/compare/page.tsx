"use client";

import { useState, useMemo, useEffect } from "react";
import { Sparkles, Plus, X, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ontarioUniversitiesNames } from "@/data/universities";

interface Program {
  id: string;
  school: string;
  program: string;
  average: number;
}

// Sample data - in production this would come from your API/database
const samplePrograms: Program[] = [
  { id: "1", school: "University of Toronto", program: "Computer Science", average: 93 },
  { id: "2", school: "University of Waterloo", program: "Computer Science", average: 95 },
  { id: "3", school: "University of Toronto", program: "Engineering Science", average: 95 },
  { id: "4", school: "McMaster University", program: "Health Sciences", average: 96 },
  { id: "5", school: "Queen's University", program: "Commerce", average: 90 },
  { id: "6", school: "University of Waterloo", program: "Software Engineering", average: 96 },
  { id: "7", school: "McMaster University", program: "Engineering", average: 88 },
  { id: "8", school: "University of Toronto", program: "Rotman Commerce", average: 92 },
  { id: "9", school: "Queen's University", program: "Engineering", average: 89 },
  { id: "10", school: "University of Ottawa", program: "Computer Science", average: 85 },
  { id: "11", school: "Carleton University", program: "Computer Science", average: 83 },
  { id: "12", school: "Toronto Metropolitan University", program: "Computer Science", average: 84 },
  { id: "13", school: "Wilfrid Laurier University", program: "BBA", average: 87 },
  { id: "14", school: "York University", program: "Schulich BBA", average: 89 },
];

export default function ComparePage() {
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "average">("average");

  const filteredPrograms = useMemo(() => {
    let filtered = samplePrograms;

    if (filterUniversity !== "all") {
      const uniName = ontarioUniversitiesNames.find(u => u.value === filterUniversity)?.name;
      if (uniName) {
        filtered = filtered.filter(p => 
          p.school.toLowerCase().includes(uniName.toLowerCase().replace("University", "").trim())
        );
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.school.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "average") return b.average - a.average;
      return a.program.localeCompare(b.program);
    });
  }, [searchTerm, filterUniversity, sortBy]);

  const addProgram = (program: Program) => {
    if (selectedPrograms.length < 4 && !selectedPrograms.find(p => p.id === program.id)) {
      setSelectedPrograms((prev) => [...prev, program]);
    }
  };

  const removeProgram = (id: string) => {
    setSelectedPrograms((prev) => prev.filter((p) => p.id !== id));
  };

  const getCompetitivenessLabel = (avg: number) => {
    if (avg >= 95) return { label: "Very Competitive", color: "text-red-500" };
    if (avg >= 90) return { label: "Competitive", color: "text-orange-500" };
    if (avg >= 85) return { label: "Moderate", color: "text-yellow-500" };
    return { label: "Accessible", color: "text-green-500" };
  };

  const maxAverage = Math.max(...selectedPrograms.map(p => p.average), 0);
  const minAverage = Math.min(...selectedPrograms.map(p => p.average), 100);
  const avgDifference = selectedPrograms.length > 1 ? maxAverage - minAverage : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Compare Programs <Sparkles className="h-8 w-8" />
        </h1>
        <p className="text-sm text-muted-foreground">
          Select up to 4 programs to compare side by side
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Selection Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Find Programs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Select value={filterUniversity} onValueChange={setFilterUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by university" />
                </SelectTrigger>
                <SelectContent>
                  {ontarioUniversitiesNames.map((uni) => (
                    <SelectItem key={uni.value} value={uni.value}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSortBy(sortBy === "average" ? "name" : "average")}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort by {sortBy === "average" ? "Name" : "Average"}
              </Button>

              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredPrograms.map((program) => {
                  const isSelected = selectedPrograms.find(p => p.id === program.id);
                  return (
                    <button
                      key={program.id}
                      onClick={() => !isSelected && addProgram(program)}
                      disabled={isSelected !== undefined || selectedPrograms.length >= 4}
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 opacity-50"
                          : selectedPrograms.length >= 4
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{program.program}</p>
                          <p className="text-xs text-muted-foreground">{program.school}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{program.average}%</p>
                          {!isSelected && selectedPrograms.length < 4 && (
                            <Plus className="h-4 w-4 text-muted-foreground ml-auto" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Panel */}
        <div className="lg:col-span-2">
          {selectedPrograms.length === 0 ? (
            <Card className="flex h-[400px] items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Sparkles className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p className="text-lg font-medium">No programs selected</p>
                <p className="text-sm">Select programs from the list to compare</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Selected Programs Cards */}
              <div className={`grid gap-4 ${
                selectedPrograms.length === 1 ? "grid-cols-1" :
                selectedPrograms.length === 2 ? "grid-cols-2" :
                selectedPrograms.length === 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
              }`}>
                {selectedPrograms.map((program) => {
                  const comp = getCompetitivenessLabel(program.average);
                  return (
                    <Card key={program.id} className="relative">
                      <button
                        onClick={() => removeProgram(program.id)}
                        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <CardContent className="pt-8">
                        <h3 className="font-semibold text-lg mb-1 pr-6">{program.program}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{program.school}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Average Required</p>
                            <p className="text-3xl font-bold">{program.average}%</p>
                          </div>
                          
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary transition-all"
                              style={{ width: `${program.average}%` }}
                            />
                          </div>

                          <p className={`text-xs font-medium ${comp.color}`}>
                            {comp.label}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Comparison Summary */}
              {selectedPrograms.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Comparison Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Highest Average</p>
                        <p className="text-2xl font-bold text-red-500">{maxAverage}%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedPrograms.find(p => p.average === maxAverage)?.program}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Lowest Average</p>
                        <p className="text-2xl font-bold text-green-500">{minAverage}%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedPrograms.find(p => p.average === minAverage)?.program}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Range Difference</p>
                        <p className="text-2xl font-bold">{avgDifference}%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Between selected programs
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Visual Comparison</h4>
                      <div className="space-y-3">
                        {selectedPrograms
                          .sort((a, b) => b.average - a.average)
                          .map((program) => (
                            <div key={program.id} className="flex items-center gap-3">
                              <div className="w-32 text-sm truncate">{program.program}</div>
                              <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary transition-all duration-500"
                                  style={{ width: `${program.average}%` }}
                                />
                              </div>
                              <div className="w-12 text-right font-medium">{program.average}%</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
