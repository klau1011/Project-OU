import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { redis } from "@/lib/db/redis";
import { applyProgramNameMap } from "@/lib/admissions";

const CACHE_KEY = "allAdmissions";
const CACHE_TTL = 60 * 60 * 24 * 7; // 1 week in seconds

export async function GET() {
  try {
    // Try to get from Redis cache first (skip cache in development)
    if (process.env.NODE_ENV === "production") {
      try {
        const cached = await redis.get(CACHE_KEY);
        if (cached) {
          return NextResponse.json(JSON.parse(cached as string));
        }
      } catch {
        // Redis error, continue to DB
      }
    }

    // Fetch from database
    const admissions = await prisma.admission.findMany();
    const normalizedAdmissions = applyProgramNameMap(admissions);

    // Cache the result
    if (process.env.NODE_ENV === "production") {
      try {
        await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(normalizedAdmissions));
      } catch {
        // Cache write failed, continue
      }
    }

    return NextResponse.json(normalizedAdmissions);
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch admissions data" },
      { status: 500 }
    );
  }
}
