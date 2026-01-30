"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import ChatbotBox from "./ChatbotBox";
import { cn } from "@/lib/utils";

interface ChatbotButtonProps {
  /** If true, shows as a floating button in the corner */
  floating?: boolean;
  /** Custom className for the button */
  className?: string;
}

export default function ChatbotButton({ floating = false, className }: ChatbotButtonProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  if (floating) {
    return (
      <>
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className={cn(
            "fixed bottom-4 right-4 z-40 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
            isChatbotOpen && "rotate-0",
            className
          )}
          aria-label={isChatbotOpen ? "Close chat" : "Open chat"}
        >
          {isChatbotOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
        <ChatbotBox open={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
          className
        )}
      >
        <MessageCircle className="w-4 h-4" />
        AI Chat
      </button>
      <ChatbotBox open={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
}
