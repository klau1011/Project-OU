"use client";

import { useState, useMemo, useCallback } from "react";
import { Calculator, Plus, Trash2, RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  name: string;
  grade: string;
  isTop6: boolean;
}

const GRADE_RANGES = [
  { label: "90-100%", min: 90, description: "A+" },
  { label: "80-89%", min: 80, description: "A" },
  { label: "70-79%", min: 70, description: "B" },
  { label: "60-69%", min: 60, description: "C" },
  { label: "50-59%", min: 50, description: "D" },
  { label: "Below 50%", min: 0, description: "F" },
];

const COMMON_COURSES = [
  "English (ENG4U)",
  "Advanced Functions (MHF4U)",
  "Calculus & Vectors (MCV4U)",
  "Physics (SPH4U)",
  "Chemistry (SCH4U)",
  "Biology (SBI4U)",
  "Data Management (MDM4U)",
  "Computer Science (ICS4U)",
  "Economics (CIA4U)",
  "Business Leadership (BOH4M)",
];

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function CalculatorPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: generateId(), name: "", grade: "", isTop6: true },
    { id: generateId(), name: "", grade: "", isTop6: true },
    { id: generateId(), name: "", grade: "", isTop6: true },
    { id: generateId(), name: "", grade: "", isTop6: true },
    { id: generateId(), name: "", grade: "", isTop6: true },
    { id: generateId(), name: "", grade: "", isTop6: true },
  ]);

  const addCourse = useCallback(() => {
    setCourses((prev) => [
      ...prev,
      { id: generateId(), name: "", grade: "", isTop6: false },
    ]);
  }, []);

  const removeCourse = useCallback((id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCourse = useCallback((id: string, field: keyof Course, value: string | boolean) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }, []);

  const resetAll = useCallback(() => {
    setCourses([
      { id: generateId(), name: "", grade: "", isTop6: true },
      { id: generateId(), name: "", grade: "", isTop6: true },
      { id: generateId(), name: "", grade: "", isTop6: true },
      { id: generateId(), name: "", grade: "", isTop6: true },
      { id: generateId(), name: "", grade: "", isTop6: true },
      { id: generateId(), name: "", grade: "", isTop6: true },
    ]);
  }, []);

  const { top6Average, allCoursesAverage, validCourses } = useMemo(() => {
    const coursesWithGrades = courses.filter(
      (c) => c.grade !== "" && !isNaN(parseFloat(c.grade))
    );

    const allAvg =
      coursesWithGrades.length > 0
        ? coursesWithGrades.reduce((sum, c) => sum + parseFloat(c.grade), 0) /
          coursesWithGrades.length
        : 0;

    // Get top 6 by highest grades
    const sortedByGrade = [...coursesWithGrades].sort(
      (a, b) => parseFloat(b.grade) - parseFloat(a.grade)
    );
    const top6Courses = sortedByGrade.slice(0, 6);
    const top6Avg =
      top6Courses.length > 0
        ? top6Courses.reduce((sum, c) => sum + parseFloat(c.grade), 0) /
          top6Courses.length
        : 0;

    return {
      top6Average: top6Avg,
      allCoursesAverage: allAvg,
      validCourses: coursesWithGrades.length,
    };
  }, [courses]);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 dark:text-green-400";
    if (grade >= 80) return "text-blue-600 dark:text-blue-400";
    if (grade >= 70) return "text-yellow-600 dark:text-yellow-400";
    if (grade >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          GPA Calculator <Calculator className="h-8 w-8" />
        </h1>
        <p className="text-sm text-muted-foreground">
          Calculate your top 6 average for Ontario university admissions
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Course Input Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>
                  Enter your Grade 12 U/M courses and their marks
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={resetAll}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div
                    key={course.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                  >
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Course name (e.g., Advanced Functions)"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                        list={`courses-${course.id}`}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <datalist id={`courses-${course.id}`}>
                        {COMMON_COURSES.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Grade %"
                        min="0"
                        max="100"
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      
                      {courses.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCourse(course.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addCourse}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Average</CardTitle>
              <CardDescription>
                Based on {validCourses} course{validCourses !== 1 ? "s" : ""} entered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Top 6 Average</p>
                <p className={`text-5xl font-bold ${getGradeColor(top6Average)}`}>
                  {validCourses > 0 ? top6Average.toFixed(1) : "—"}%
                </p>
              </div>
              
              {validCourses > 6 && (
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">All Courses Average</p>
                  <p className={`text-2xl font-semibold ${getGradeColor(allCoursesAverage)}`}>
                    {allCoursesAverage.toFixed(1)}%
                  </p>
                </div>
              )}

              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(top6Average, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Ontario universities typically use your <strong>top 6 U/M courses</strong> to 
                calculate your admission average.
              </p>
              <p>
                Required courses (like English) must be included. The system automatically 
                selects your highest marks.
              </p>
              <p>
                Different programs may have specific course requirements that affect which 
                marks are used.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Ranges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {GRADE_RANGES.map((range) => (
                  <div key={range.label} className="flex justify-between">
                    <span className="text-muted-foreground">{range.label}</span>
                    <span className="font-medium">{range.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
