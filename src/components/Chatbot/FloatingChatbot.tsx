"use client";

import { usePathname } from "next/navigation";
import ChatbotButton from "./ChatbotButton";

// Pages that involve admissions data - don't show chatbot here
const EXCLUDED_PATHS = [
  "/admissions",
  "/programs",
  "/compare",
  "/analytics",
  "/chance-me",
];

export default function FloatingChatbot() {
  const pathname = usePathname();
  
  // Don't show on excluded paths
  const shouldHide = EXCLUDED_PATHS.some(path => pathname.startsWith(path));
  
  if (shouldHide) {
    return null;
  }

  return <ChatbotButton floating />;
}
