import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-12 w-3/4 max-w-lg" />
        <Skeleton className="h-6 w-1/2 max-w-md" />
      </div>

      {/* Timeline cards */}
      <div className="grid gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1 flex items-center justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex gap-2">
                    <Skeleton className="h-2 w-2 rounded-full mt-2" />
                    <Skeleton className="h-5 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
