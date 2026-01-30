import { Skeleton } from "@/components/ui/skeleton";
import { School2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Admissions Data <School2 size={30} />
        </h1>
        <p className="text-sm text-muted-foreground">
          User submitted data across all admission cycles
        </p>
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-4 items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats bar skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="border-b bg-muted/50 p-3">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
        
        {/* Table rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="border-b last:border-0 p-3">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-10" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
