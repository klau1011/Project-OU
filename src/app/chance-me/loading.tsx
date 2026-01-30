import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "lucide-react";

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="mb-10 mt-5">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Chance Me Calculator
          <Target className="h-8 w-8" />
        </h1>
        <p className="text-sm text-muted-foreground">
          Find out your chances of admission based on historical data from real applicants
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Input card skeleton */}
        <div className="rounded-lg border p-6 space-y-6">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-4 items-end">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
