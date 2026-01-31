import PageHeader from "@/components/ui/page-header";
import ProgramFinder from "@/components/Admissions/ProgramFinder";
import prisma from "@/lib/db/prisma";
import { redis } from "@/lib/db/redis";
import { Admission } from "@/lib/types";
import { filterOutliersAndSingleEntrySchools } from "@/lib/admissions";
import { Search } from "lucide-react";

// Disable caching - always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function ProgramFinderPage() {
  const admissions = await getAdmissions();

  return (
    <div className="container py-8">
      <PageHeader
        title="Program Finder"
        description="Explore and compare programs across all Ontario universities with powerful filtering"
        icon={Search}
      />
      
      <div className="mt-8">
        <ProgramFinder admissions={admissions} />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Program Finder | Project OU",
  description: "Search and filter Ontario university programs by average, school, and more.",
};
