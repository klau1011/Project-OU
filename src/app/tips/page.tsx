import Tip from "@/components/Tip/Tip";
import prisma from "@/lib/db/prisma";
import { FileQuestion } from "lucide-react";
import Loading from "./loading";

const page = async () => {
  const tips = await prisma.tip.findMany();
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
        {tips.map((tip) => (
          <Tip key={tip.id} tip={tip} />
        ))}
      </div>
    </>
  );
};

export default page;
