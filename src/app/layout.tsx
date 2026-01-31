import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingChatbot from "@/components/Chatbot/FloatingChatbot";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <body className={`${inter.className} min-h-screen bg-background antialiased`}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange
          >
            <QueryProvider>
              <Navbar />
              <main className="animate-fade-in">
                {children}
              </main>
              <FloatingChatbot />
              <Toaster richColors closeButton position="bottom-right" />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
