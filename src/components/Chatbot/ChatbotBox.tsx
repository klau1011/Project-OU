import { cn } from "@/lib/utils";
import { Bot, X, Send, Sparkles, Trash2, AlertCircle, Clock } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useChat, type Message } from "ai/react";
import ChatMessage from "./ChatMessage";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";

interface ChatbotBoxProps {
  open: boolean;
  onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What's the top 6 average?",
  "When should I apply?",
  "Tips for supp apps?",
];

const ChatbotBox = ({ open, onClose }: ChatbotBoxProps) => {
  const { isSignedIn } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setMessages,
    isLoading,
    error,
    setInput,
  } = useChat({
    onError: (err: Error) => {
      // Parse error message from response
      try {
        const parsed = JSON.parse(err.message);
        setErrorMessage(parsed.error || "Something went wrong. Please try again.");
      } catch {
        setErrorMessage("Something went wrong. Please try again.");
      }
    },
    onFinish: () => {
      setErrorMessage(null);
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Clear error when chat is opened/closed
    setErrorMessage(null);
  }, [open]);

  const isUserLastMessage = messages[messages.length - 1]?.role === "user";

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([]);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage(null);
    originalHandleSubmit(e);
  };

  const isRateLimited = errorMessage?.includes("Rate limit");

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] sm:w-[400px] max-w-[400px] transition-all duration-300 ease-in-out",
        open 
          ? "opacity-100 translate-y-0 pointer-events-auto" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <div className="flex flex-col h-[min(500px,calc(100vh-120px))] rounded-2xl border bg-background shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-primary to-purple-500 text-primary-foreground">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary-foreground/20">
              <Sparkles className="w-4 h-4\" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs opacity-80">Ontario admissions help only</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Not signed in message */}
        {!isSignedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium mb-2">Sign in required</h4>
            <p className="text-sm text-muted-foreground">
              Please sign in to use the AI assistant.
            </p>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1" ref={scrollRef}>
              {messages.length === 0 && !error && !errorMessage && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-medium mb-1">How can I help?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask me about Ontario university admissions, programs, or application tips.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSuggestedQuestion(q)}
                        className="text-xs px-3 py-1.5 rounded-full border bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <ChatMessage 
                  message={{ role: message.role as "user" | "assistant" | "system", content: message.content }} 
                  key={message.id} 
                />
              ))}
              
              {isUserLastMessage && isLoading && (
                <ChatMessage
                  message={{ role: "assistant", content: "Thinking..." }}
                  isLoading
                />
              )}
              
              {(error || errorMessage) && (
                <div className={cn(
                  "flex items-start gap-3 p-3 rounded-lg",
                  isRateLimited ? "bg-yellow-500/10" : "bg-destructive/10"
                )}>
                  {isRateLimited ? (
                    <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      isRateLimited ? "text-yellow-700 dark:text-yellow-400" : "text-destructive"
                    )}>
                      {isRateLimited ? "Rate limit reached" : "Error"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {errorMessage || "Something went wrong. Please try again."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form 
              className="p-3 border-t bg-muted/30" 
              onSubmit={handleSubmit}
            >
              <div className="flex gap-2">
                <Input 
                  ref={inputRef} 
                  value={input} 
                  onChange={handleInputChange}
                  placeholder="Ask about Ontario admissions..."
                  className="flex-1 bg-background"
                  disabled={isLoading || isRateLimited}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading || !input.trim() || isRateLimited}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                This AI only answers Ontario university admissions questions
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatbotBox;
