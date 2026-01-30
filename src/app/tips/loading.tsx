import { FileQuestion } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const TipCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-4 w-24" />
    </CardFooter>
  </Card>
);

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Community resources and tips <FileQuestion size={30} />
        </h1>
        <p className="text-sm text-muted-foreground">
          A place for students to share helpful resources and advice based on prior
          experiences
        </p>
      </div>

      {/* Tips grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <TipCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
