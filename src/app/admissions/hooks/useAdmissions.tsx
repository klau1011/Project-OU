import prisma from "@/lib/db/prisma";
import { SearchParamsInterface } from "../page";
import { altUniversitiesNames } from "@/data/universities";
import { redis } from "@/lib/db/redis";
import { Admission } from "@prisma/client";

const useAdmissions = async ({ query, university }: SearchParamsInterface) => {
  let admissions: any = await redis.get("allAdmissions");

  if (!admissions) {
    admissions = await prisma.admission.findMany();
    await redis.set('allAdmissions', JSON.stringify(admissions));
  } else {
    admissions = JSON.parse(admissions);
  }
    

  if (query === "all") {
    query = "";
  }

  let filteredAdmissionsBySchool = admissions;
  if (university) {
    const schoolCriteria = altUniversitiesNames[university];
    filteredAdmissionsBySchool = filteredAdmissionsBySchool.filter(
      (admission: Admission) =>
        schoolCriteria.some((criteria) =>
          admission.School.toLowerCase().includes(criteria),
        ),
    );
  }

  let filteredAdmissions = filteredAdmissionsBySchool;
  if (query && query !== undefined) {
    filteredAdmissions = filteredAdmissionsBySchool.filter((admission: Admission) =>
      admission.Program.toLowerCase().includes(query.toLowerCase()),
    );
  }

  const totalAverage = (
    filteredAdmissions.reduce((sum: number, admission: Admission) => {
      const average = admission.Average
      return !isNaN(average) ? sum + average : sum;
    }, 0) / filteredAdmissions.length
  ).toFixed(2);

  return { filteredAdmissions, totalAverage };
};

export default useAdmissions;
