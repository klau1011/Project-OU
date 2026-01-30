import PageHeader from "@/components/ui/page-header";
import AnalyticsDashboard from "@/components/Admissions/AnalyticsDashboard";
import prisma from "@/lib/db/prisma";
import { redis } from "@/lib/db/redis";
import { Admission } from "@/lib/types";
import { filterOutliersAndSingleEntrySchools } from "@/lib/admissions";
import { BarChart3 } from "lucide-react";

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

export default async function AnalyticsPage() {
  const admissions = await getAdmissions();

  return (
    <div className="container py-8">
      <PageHeader
        title="Admissions Analytics"
        description="Deep dive into Ontario university admissions data with interactive charts and insights"
        icon={BarChart3}
      />
      
      <div className="mt-8">
        <AnalyticsDashboard admissions={admissions} />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Admissions Analytics | Project OU",
  description: "Interactive analytics dashboard for Ontario university admissions data - explore trends, compare universities, and find insights.",
};
