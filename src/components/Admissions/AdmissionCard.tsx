"use client";

import { Admission } from "@prisma/client";
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

export default function AdmissionCard({ admission }: AdmissionCardProps) {
  const pct = Number.isFinite(admission.Average) ? admission.Average : 0;
  const pctLabel = pct.toLocaleString(undefined, { maximumFractionDigits: 2 });

  // clamp for the tiny progress bar
  const barWidth = Math.max(0, Math.min(100, pct));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{admission.Program}</CardTitle>
        <CardDescription className="text-sm">{admission.School}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-2 text-2xl font-semibold">{pctLabel}%</div>

        <div className="h-2 w-full rounded bg-muted">
          <div
            className="h-2 rounded bg-primary"
            style={{ width: `${barWidth}%` }}
            aria-label={`Average ${pctLabel} percent`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
