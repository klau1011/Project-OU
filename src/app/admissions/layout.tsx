import Navbar from "@/components/Navbar/Navbar";
import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Project OU - Admissions",
  description: "Includes previous admissions data for Ontario university programs",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <main className="m-auto max-w-6xl p-4">{children}</main>
      </Suspense>
    </>
  );
}
