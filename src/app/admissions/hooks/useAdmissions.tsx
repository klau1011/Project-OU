import prisma from "@/lib/db/prisma";
import { SearchParamsInterface } from "../page";
import { altUniversitiesNames } from "@/data/universities";
import { redis } from "@/lib/db/redis";

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
      (admission) =>
        schoolCriteria.some((criteria) =>
          admission.School.toLowerCase().includes(criteria),
        ),
    );
  }

  let filteredAdmissions = filteredAdmissionsBySchool;
  if (query) {
    filteredAdmissions = filteredAdmissionsBySchool.filter((admission) =>
      admission.Program.toLowerCase().includes(query.toLowerCase()),
    );
  }

  const totalAverage = (
    filteredAdmissions.reduce((sum, admission) => {
      const average = parseFloat(admission.Average);
      return !isNaN(average) ? sum + average : sum;
    }, 0) / filteredAdmissions.length
  ).toFixed(2);

  return { filteredAdmissions, totalAverage };
};

export default useAdmissions;
