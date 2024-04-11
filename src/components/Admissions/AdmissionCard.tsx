"use client";

import { Admission } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface AdmissionCardProps {
  admission: Admission;
}

export default function AdmissionCard({ admission }: AdmissionCardProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {admission.Program}
          </h4>
          <p>{admission.School}</p>
        </CardHeader>
        <CardContent>{Math.round(admission.Average * 100) / 100}%</CardContent>
      </Card>
    </>
  );
}
