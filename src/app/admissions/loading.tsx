import { Skeleton } from "@/components/Tip/Skeleton";
import { School2 } from "lucide-react";

const Loading = () => {
  return (
    <>
      <div className="mb-10 mt-5">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Admissions Data <School2 size={30} />
        </h1>
        <p className="text-sm text-muted-foreground">
          User submitted data for the 2025 admission cycle
        </p>
      </div>
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </>
  );
};

const LoadingCard = () => (
  <>
    <div className="rounded-md border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h4 className="scroll-m-20 tracking-tight">
          <Skeleton className="w-[168px] max-w-full" />
        </h4>
        <p>
          <Skeleton className="w-[128px] max-w-full" />
        </p>
      </div>
      <div className="p-6 pt-0">
        <Skeleton className="w-[24px] max-w-full" />
      </div>
    </div>
  </>
);

export default Loading;
