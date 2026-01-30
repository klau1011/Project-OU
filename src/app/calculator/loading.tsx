import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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
              <div className="space-y-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-20" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex gap-3 rounded-lg border p-4 items-center">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-14 w-32 mx-auto" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
