import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Programs - Project OU",
  description: "Compare Ontario university programs side by side",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
