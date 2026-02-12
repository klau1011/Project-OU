import prisma from "@/lib/db/prisma";
import { altUniversitiesNames } from "@/data/universities";
import { redis } from "@/lib/db/redis";
import { Admission } from "@prisma/client";
import { filterOutliersAndSingleEntrySchools } from "@/lib/admissions";

const CACHE_KEY = "allAdmissions";
const CACHE_TTL = 60 * 60 * 24 * 7; // 1 week in seconds

const useAdmissions = async ({ query, university }: {
  query: string;
  university: string;
}) => {
  // Try to get from Redis cache first (skip cache in development)
  let admissions: Admission[];

  if (process.env.NODE_ENV !== "production") {
    admissions = await prisma.admission.findMany();
  } else {
    try {
      const cached = await redis.get(CACHE_KEY);
      if (cached) {
        admissions = JSON.parse(cached as string);
      } else {
        admissions = await prisma.admission.findMany();
        // Cache with TTL
        await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(admissions));
      }
    } catch {
      // Fallback to database if Redis fails
      admissions = await prisma.admission.findMany();
    }
  }

  // Data is pre-cleaned in JSON, but filter outliers for safety
  const cleanedAdmissions = filterOutliersAndSingleEntrySchools(admissions);

  // Normalize query
  const normalizedQuery = (!query || query === "all") ? "" : query.toLowerCase();

  // Filter by school
  let filteredAdmissions = cleanedAdmissions;
  if (university && university !== "all") {
    const schoolCriteria = altUniversitiesNames[university];
    if (schoolCriteria) {
      filteredAdmissions = filteredAdmissions.filter((admission) =>
        schoolCriteria.some((criteria) =>
          admission.School.toLowerCase().includes(criteria)
        )
      );
    }
  }

  // Filter by program name
  if (normalizedQuery) {
    filteredAdmissions = filteredAdmissions.filter((admission) =>
      admission.Program.toLowerCase().includes(normalizedQuery)
    );
  }

  // Calculate average
  const totalAverage = filteredAdmissions.length > 0
    ? (
        filteredAdmissions.reduce((sum, admission) => {
          const average = admission.Average;
          return !isNaN(average) ? sum + average : sum;
        }, 0) / filteredAdmissions.length
      ).toFixed(2)
    : "0.00";

  return { filteredAdmissions, totalAverage };
};

export default useAdmissions;
