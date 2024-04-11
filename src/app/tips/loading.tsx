import { FileQuestion } from "lucide-react";
import { Skeleton } from "../../components/Tip/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="mb-10 mt-5">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Community tips <FileQuestion size={30} />
        </h1>
        <p className="text-sm text-muted-foreground">
          A place for students to share helpful advice based on prior
          experiences
        </p>
      </div>
      <div className="mt-5 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded- border shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="flex justify-between leading-none tracking-tight">
              <Skeleton className="h-[20px] w-[144px] max-w-full" />
            </h3>
          </div>
          <div className="p-6 pt-0">
            <Skeleton className="w-[1512px] max-w-full" />
            <Skeleton className="w-[1512px] max-w-full" />
            <Skeleton className="w-[1512px] max-w-full" />
          </div>
          <div className="flex items-center p-6 pt-0">
            <Skeleton className="w-[96px] max-w-full" />
          </div>
        </div>
        <div className="rounded- border shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="flex justify-between leading-none tracking-tight">
              <Skeleton className="h-[20px] w-[144px] max-w-full" />
            </h3>
          </div>
          <div className="p-6 pt-0">
            <Skeleton className="w-[1512px] max-w-full" />
            <Skeleton className="w-[1512px] max-w-full" />
            <Skeleton className="w-[1512px] max-w-full" />
          </div>
          <div className="flex items-center p-6 pt-0">
            <Skeleton className="w-[96px] max-w-full" />
          </div>
        </div>
        <div className="rounded- border shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="flex justify-between leading-none tracking-tight">
              <Skeleton className="h-[20px] w-[144px] max-w-full" />
            </h3>
          </div>
          <div className="p-6 pt-0">
            <Skeleton className="w-[1512px] max-w-full" />
            <Skeleton className="w-[1512px] max-w-full" />
            <Skeleton className="w-[1512px] max-w-full" />
          </div>
          <div className="flex items-center p-6 pt-0">
            <Skeleton className="w-[96px] max-w-full" />
          </div>
        </div>
      </div>
    </>
  );
}
