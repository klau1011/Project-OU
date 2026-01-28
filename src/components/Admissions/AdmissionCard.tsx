"use client";

import { Admission } from "@prisma/client";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface AdmissionCardProps {
  admission: Admission;
}

const getCompetitivenessInfo = (average: number) => {
  if (average >= 95) return { label: "Very High", color: "bg-red-500", textColor: "text-red-600" };
  if (average >= 90) return { label: "High", color: "bg-orange-500", textColor: "text-orange-600" };
  if (average >= 85) return { label: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600" };
  if (average >= 80) return { label: "Accessible", color: "bg-green-500", textColor: "text-green-600" };
  return { label: "Open", color: "bg-blue-500", textColor: "text-blue-600" };
};

export default function AdmissionCard({ admission }: AdmissionCardProps) {
  const pct = Number.isFinite(admission.Average) ? admission.Average : 0;
  
  const { pctLabel, barWidth, competitiveness } = useMemo(() => ({
    pctLabel: pct.toLocaleString(undefined, { maximumFractionDigits: 1 }),
    barWidth: Math.max(0, Math.min(100, pct)),
    competitiveness: getCompetitivenessInfo(pct),
  }), [pct]);

  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight line-clamp-2">
          {admission.Program}
        </CardTitle>
        <CardDescription className="text-sm">{admission.School}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-3xl font-bold">{pctLabel}</span>
            <span className="text-xl text-muted-foreground">%</span>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full bg-opacity-10 ${competitiveness.textColor}`}
            style={{ backgroundColor: `${competitiveness.color}20` }}>
            {competitiveness.label}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${competitiveness.color}`}
            style={{ width: `${barWidth}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Average ${pctLabel} percent`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
