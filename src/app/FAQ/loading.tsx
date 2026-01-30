import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-12 w-3/4 max-w-md" />
        <Skeleton className="h-5 w-1/2 max-w-sm" />
      </div>

      {/* Search input */}
      <Skeleton className="h-10 w-full max-w-sm" />

      {/* FAQ items */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border-b pb-4">
            <Skeleton className="h-6 w-full max-w-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
