import AdmissionsTable from "@/components/Admissions/AdmissionsTable";
import Search from "@/components/ui/search";
import { Badge } from "@/components/ui/badge";
import { School2, TrendingUp } from "lucide-react";
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
  const query = searchParams?.query?.trim() ?? "";
  const university = searchParams?.university ?? "all";

  const { filteredAdmissions, totalAverage } = await useAdmissions({
    query,
    university,
  });

  const hasFilter = query.length > 0 || university !== "all";

  const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  });

  const raw =
    typeof totalAverage === "string" ? Number(totalAverage) : totalAverage;
  const formattedAvg =
    typeof raw === "number" && Number.isFinite(raw)
      ? formatter.format(raw)
      : null;

  return (
    <>
      <div className="mb-8 mt-5">
        <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Admissions Data <School2 size={30} />
        </h1>
        <p className="text-sm text-muted-foreground">
          User submitted data across all admission cycles
        </p>

        <div className="mt-6">
          <Search placeholder="Search for programs..." />
        </div>
      </div>

      {/* Results summary bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm" aria-live="polite">
        <span className="text-muted-foreground">
          {filteredAdmissions.length.toLocaleString()} results
          {hasFilter && formattedAvg && (
            <>
              {" "}
              <span className="mx-1">•</span>
              <TrendingUp className="inline w-3.5 h-3.5 mr-1" />
              avg {formattedAvg}%
            </>
          )}
        </span>
        {query && (
          <Badge variant="secondary" className="font-normal">
            Search: {query}
          </Badge>
        )}
        {university !== "all" && (
          <Badge variant="secondary" className="font-normal">
            {university}
          </Badge>
        )}
      </div>

      {filteredAdmissions.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No admissions found. Try a different search or clear filters.
        </p>
      )}

      <AdmissionsTable admissions={filteredAdmissions} />
    </>
  );
}
