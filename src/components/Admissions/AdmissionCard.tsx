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
import { Calendar, CheckCircle, XCircle, DollarSign, FileText, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";

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

const getDecisionInfo = (decision?: string | null) => {
  if (!decision) return null;
  const d = decision.toLowerCase();
  if (d === 'offer') return { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" };
  if (d === 'rejected') return { icon: XCircle, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" };
  return null;
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return null;
  }
};

export default function AdmissionCard({ admission }: AdmissionCardProps) {
  const pct = Number.isFinite(admission.Average) ? admission.Average : 0;
  
  const { pctLabel, barWidth, competitiveness, decisionInfo, formattedDecisionDate, formattedScholarship } = useMemo(() => ({
    pctLabel: pct.toLocaleString(undefined, { maximumFractionDigits: 1 }),
    barWidth: Math.max(0, Math.min(100, pct)),
    competitiveness: getCompetitivenessInfo(pct),
    decisionInfo: getDecisionInfo(admission.Decision),
    formattedDecisionDate: formatDate(admission.DecisionDate),
    formattedScholarship: admission.Scholarship ? `$${admission.Scholarship.toLocaleString()}` : null,
  }), [pct, admission.Decision, admission.DecisionDate, admission.Scholarship]);

  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight line-clamp-2">
              {admission.Program}
            </CardTitle>
            <CardDescription className="text-sm flex items-center gap-1 mt-1">
              {admission.School}
              {admission.OUACCode && (
                <span className="text-xs text-muted-foreground">({admission.OUACCode})</span>
              )}
            </CardDescription>
          </div>
          {decisionInfo && (
            <Badge variant="outline" className={`${decisionInfo.bgColor} ${decisionInfo.color} border-0 shrink-0`}>
              <decisionInfo.icon className="w-3 h-3 mr-1" />
              {admission.Decision}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
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

        {/* Additional Info Section */}
        <div className="flex flex-wrap gap-2 pt-2">
          {formattedScholarship && (
            <Badge variant="secondary" className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              <DollarSign className="w-3 h-3 mr-1" />
              {formattedScholarship}
            </Badge>
          )}
          {formattedDecisionDate && (
            <Badge variant="secondary" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {formattedDecisionDate}
            </Badge>
          )}
          {admission.Group && (
            <Badge variant="outline" className="text-xs">
              Group {admission.Group}
            </Badge>
          )}
          {admission.HasSuppApp && (
            <Badge variant="outline" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Supp App
            </Badge>
          )}
          {admission.Province && (
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {admission.Province}
            </Badge>
          )}
        </div>

        {/* Comments Section */}
        {admission.Comments && (
          <p className="text-xs text-muted-foreground line-clamp-2 pt-1 border-t">
            {admission.Comments}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
