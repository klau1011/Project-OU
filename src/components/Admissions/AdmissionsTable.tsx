"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  DollarSign,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdmissionEntry {
  id: string;
  School: string;
  Program: string;
  Average: number;
  Decision?: string | null;
  OUACCode?: string | null;
  DecisionDate?: string | null;
  Scholarship?: number | null;
}

interface AdmissionsTableProps {
  admissions: AdmissionEntry[];
}

type SortField = "Program" | "School" | "Average" | "Decision" | "DecisionDate" | "Scholarship";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 50;

const getDecisionIcon = (decision?: string | null) => {
  if (!decision) return null;
  const d = decision.toLowerCase();
  if (d === "offer") return <CheckCircle className="w-4 h-4 text-green-600" />;
  if (d === "rejected") return <XCircle className="w-4 h-4 text-red-600" />;
  if (d === "waitlisted") return <Clock className="w-4 h-4 text-yellow-600" />;
  if (d === "deferred") return <Clock className="w-4 h-4 text-orange-600" />;
  return <HelpCircle className="w-4 h-4 text-muted-foreground" />;
};

const getAverageColor = (average: number) => {
  if (average >= 95) return "text-red-600 dark:text-red-400";
  if (average >= 90) return "text-orange-600 dark:text-orange-400";
  if (average >= 85) return "text-yellow-600 dark:text-yellow-400";
  if (average >= 80) return "text-green-600 dark:text-green-400";
  return "text-blue-600 dark:text-blue-400";
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

const decisionOrder: Record<string, number> = {
  offer: 1,
  waitlisted: 2,
  deferred: 3,
  rejected: 4,
};

export default function AdmissionsTable({ admissions }: AdmissionsTableProps) {
  const [sortField, setSortField] = useState<SortField>("Average");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...admissions].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "Program":
          comparison = a.Program.localeCompare(b.Program);
          break;
        case "School":
          comparison = a.School.localeCompare(b.School);
          break;
        case "Average":
          comparison = a.Average - b.Average;
          break;
        case "Decision":
          const aOrder = decisionOrder[a.Decision?.toLowerCase() ?? ""] ?? 5;
          const bOrder = decisionOrder[b.Decision?.toLowerCase() ?? ""] ?? 5;
          comparison = aOrder - bOrder;
          break;
        case "DecisionDate":
          const aDate = a.DecisionDate ? new Date(a.DecisionDate).getTime() : 0;
          const bDate = b.DecisionDate ? new Date(b.DecisionDate).getTime() : 0;
          comparison = aDate - bDate;
          break;
        case "Scholarship":
          comparison = (a.Scholarship ?? 0) - (b.Scholarship ?? 0);
          break;
      }

      return sortDirection === "desc" ? -comparison : comparison;
    });

    return sorted;
  }, [admissions, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  // Reset page when sort changes
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const SortableHeader = ({
    field,
    children,
    className = "",
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead className={className}>
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 font-medium hover:text-foreground transition-colors group"
      >
        {children}
        {sortField === field ? (
          sortDirection === "desc" ? (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
      </button>
    </TableHead>
  );

  if (admissions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No admissions found. Try a different search or clear filters.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <SortableHeader field="Program">Program</SortableHeader>
              <SortableHeader field="School">School</SortableHeader>
              <SortableHeader field="Average" className="text-center">
                Avg
              </SortableHeader>
              <SortableHeader field="Decision" className="text-center">
                Decision
              </SortableHeader>
              <SortableHeader
                field="DecisionDate"
                className="text-center hidden md:table-cell"
              >
                Date
              </SortableHeader>
              <SortableHeader
                field="Scholarship"
                className="text-right hidden lg:table-cell"
              >
                Scholarship
              </SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((admission) => (
              <TableRow key={admission.id}>
                <TableCell>
                  <div className="font-medium line-clamp-1">
                    {admission.Program}
                  </div>
                  {admission.OUACCode && (
                    <span className="text-xs text-muted-foreground">
                      {admission.OUACCode}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1 text-muted-foreground">
                    {admission.School}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`font-semibold ${getAverageColor(admission.Average)}`}
                  >
                    {admission.Average.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1.5">
                    {getDecisionIcon(admission.Decision)}
                    <span className="hidden sm:inline text-xs capitalize">
                      {admission.Decision || "—"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-muted-foreground hidden md:table-cell">
                  {formatDate(admission.DecisionDate)}
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell">
                  {admission.Scholarship ? (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    >
                      <DollarSign className="w-3 h-3" />
                      {admission.Scholarship.toLocaleString()}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)} of{" "}
            {sortedData.length.toLocaleString()} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            <div className="flex items-center gap-1">
              {/* Show first page */}
              {currentPage > 2 && (
                <>
                  <Button
                    variant={currentPage === 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 p-0"
                  >
                    1
                  </Button>
                  {currentPage > 3 && (
                    <span className="text-muted-foreground px-1">...</span>
                  )}
                </>
              )}
              {/* Show nearby pages */}
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(currentPage - 1, totalPages - 2)) + i;
                if (page < 1 || page > totalPages) return null;
                if (page === 1 && currentPage > 2) return null;
                if (page === totalPages && currentPage < totalPages - 1) return null;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
              {/* Show last page */}
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <span className="text-muted-foreground px-1">...</span>
                  )}
                  <Button
                    variant={currentPage === totalPages ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 p-0"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
