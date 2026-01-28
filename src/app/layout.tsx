import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Project OU - Ontario University Admissions Guide",
    template: "%s | Project OU",
  },
  description: "Your intelligent central source for Ontario university admissions. Access admission data, community tips, GPA calculator, and program comparisons.",
  keywords: ["Ontario universities", "university admissions", "OUAC", "GPA calculator", "university comparison", "high school guide"],
  authors: [{ name: "Project OU Team" }],
  openGraph: {
    title: "Project OU - Ontario University Admissions Guide",
    description: "Your intelligent central source for Ontario university admissions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
