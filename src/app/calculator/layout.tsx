import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPA Calculator - Project OU",
  description: "Calculate your Ontario high school average for university applications",
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
