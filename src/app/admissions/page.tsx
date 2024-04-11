import AdmissionCard from "@/components/Admissions/AdmissionCard";
import Search from "@/components/ui/search";
import prisma from "@/lib/db/prisma";
import { School2 } from "lucide-react";
import { altUniversitiesNames } from "@/data/universities";
import useAdmissions from "./hooks/useAdmissions";

export interface SearchParamsInterface {
  query?: string;
  university?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParamsInterface;
}) {
  const query = searchParams?.query || "";
  const { filteredAdmissions, totalAverage } = await useAdmissions({
    query,
    university: searchParams?.university,
  });

  return (
    <>
      <div className="mb-10 mt-5">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Admissions Data <School2 size={30} />
        </h1>
        <p className="text-sm text-muted-foreground">
          User submitted data for the 2023 admission cycle
        </p>
        <div className="mb-0 mt-10">
          <Search placeholder="Search for programs..." />
        </div>
      </div>
      {filteredAdmissions.length === 0 && <p>No admissions found</p>}
      {filteredAdmissions.length > 0 &&
        query &&
        !Number.isNaN(totalAverage) && (
          <div className="left-1 mb-5 text-sm font-medium leading-none flex flex-col gap-1.5" >
          <p >
            Average for search "{query}" : {totalAverage} % 
          </p>
          <p>Count: {filteredAdmissions.length}</p>
          </div>
          
        )}
      <div className="sm: grid grid-cols-2 gap-8 lg:grid-cols-3">
        {filteredAdmissions?.map((admission) => {
          return <AdmissionCard key={admission.id} admission={admission} />;
        })}
      </div>
    </>
  );
}
