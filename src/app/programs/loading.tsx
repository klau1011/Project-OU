import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="mb-10 mt-5">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Program Finder
          <Search className="h-8 w-8" />
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore and compare programs across all Ontario universities with powerful filtering
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Search bar skeleton */}
        <div className="rounded-lg border p-6">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Results header skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-6 space-y-4">
              <div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
