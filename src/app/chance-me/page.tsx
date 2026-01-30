import PageHeader from "@/components/ui/page-header";
import ChanceMeCalculator from "@/components/Admissions/ChanceMeCalculator";
import prisma from "@/lib/db/prisma";
import { redis } from "@/lib/db/redis";
import { Admission } from "@/lib/types";
import { filterOutliersAndSingleEntrySchools } from "@/lib/admissions";
import { Target } from "lucide-react";

const CACHE_KEY = "allAdmissions";

async function getAdmissions(): Promise<Admission[]> {
  if (process.env.NODE_ENV === "production") {
    try {
      const cached = await redis.get(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached as string);
      }
    } catch {
      // Redis error, fall through to DB
    }
  }

  const admissions = await prisma.admission.findMany();
  
  if (process.env.NODE_ENV === "production") {
    try {
      await redis.setex(CACHE_KEY, 3600, JSON.stringify(admissions));
    } catch {
      // Cache write failed, continue
    }
  }

  // Data is pre-cleaned in JSON, but filter outliers for safety
  return filterOutliersAndSingleEntrySchools(admissions as Admission[]);
}

export default async function ChanceMePage() {
  const admissions = await getAdmissions();

  return (
    <div className="container py-8">
      <PageHeader
        title="Chance Me Calculator"
        description="Find out your chances of admission based on historical data from real applicants"
        icon={Target}
      />
      
      <div className="mt-8">
        <ChanceMeCalculator admissions={admissions} />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Chance Me Calculator | Project OU",
  description: "Calculate your chances of admission to Ontario universities based on your average and historical admission data.",
};
