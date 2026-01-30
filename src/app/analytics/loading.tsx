import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="mb-10 mt-5">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Admissions Analytics
          <BarChart3 className="h-8 w-8" />
        </h1>
        <p className="text-sm text-muted-foreground">
          Deep dive into Ontario university admissions data with interactive charts and insights
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="rounded-lg border p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
