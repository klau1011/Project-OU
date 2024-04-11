import Navbar from "@/components/Navbar/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project OU - FAQ",
  description: "FAQ about applying to Ontario Universities from Ontario high school",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <Navbar />
      <main className="flex flex-col gap-3 justify-center m-auto max-w-4xl p-4 sm:py-[30px] sm:text-lg">{children}</main>
    </>
  );
}
