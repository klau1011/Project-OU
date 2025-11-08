import AdmissionCard from "@/components/Admissions/AdmissionCard";
import Search from "@/components/ui/search";
import { School2 } from "lucide-react";
import useAdmissions from "./hooks/useAdmissions";
import { Admission } from "@prisma/client";

export interface SearchParamsInterface {
  query?: string;
  university?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParamsInterface;
}) {
  const query = searchParams?.query?.trim() ?? "";
  const university = searchParams?.university ?? "all";

  const { filteredAdmissions, totalAverage } = await useAdmissions({
    query,
    university,
  });

  // sort by highest average first for a predictable order
  const sorted = [...filteredAdmissions].sort(
    (a: Admission, b: Admission) => b.Average - a.Average
  );

  const showStats =
    sorted.length > 0 && (query.length > 0 || university !== "all");

const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

const raw = typeof totalAverage === "string" ? Number(totalAverage) : totalAverage;
const formattedAvg =
  typeof raw === "number" && Number.isFinite(raw)
    ? formatter.format(raw)
    : null;


  return (
    <>
      <div className="mb-10 mt-5">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Admissions Data <School2 size={30} />
        </h1>
        <p className="text-sm text-muted-foreground">
          User submitted data for the 2025 admission cycle
        </p>

        <div className="mt-6">
          <Search placeholder="Search for programs..." />
        </div>
      </div>

      {showStats && formattedAvg && (
        <div
          className="mb-5 grid grid-cols-1 gap-2 text-sm font-medium leading-none md:grid-cols-3"
          aria-live="polite"
        >
          <p>
            Average for{" "}
            {query ? (
              <>
                search "<span className="font-semibold">{query}</span>"
              </>
            ) : (
              <>
                university "<span className="font-semibold">{university}</span>"
              </>
            )}
            : <span className="font-semibold">{formattedAvg}%</span>
          </p>
          <p>
            Count: <span className="font-semibold">{sorted.length}</span>
          </p>
          <p className="text-muted-foreground">
            Sorted by highest average first
          </p>
        </div>
      )}

      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No admissions found. Try a different search or clear filters.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((admission) => (
          <AdmissionCard key={admission.id} admission={admission} />
        ))}
      </div>
    </>
  );
}
