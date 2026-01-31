import prisma from "@/lib/db/prisma";
import TipsPageClient from "./TipsPageClient";

const page = async () => {
  const tips = await prisma.tip.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      upvotes: true,
      _count: { select: { upvotes: true } },
    },
  });
  
  return <TipsPageClient tips={tips} />;
};

export default page;
