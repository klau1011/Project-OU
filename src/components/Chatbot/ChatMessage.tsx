import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Bot, User } from "lucide-react";
import Image from "next/image";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant" | "system";
    content: string;
  };
  isLoading?: boolean;
}

export default function ChatMessage({
  message: { role, content },
  isLoading = false,
}: ChatMessageProps) {
  const isAIMessage = role === "assistant";
  const { user } = useUser();

  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        isAIMessage ? "justify-start" : "justify-end"
      )}
    >
      {isAIMessage && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm",
          isAIMessage
            ? "bg-muted rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm",
          isLoading && "animate-pulse"
        )}
      >
        <p className="whitespace-pre-line leading-relaxed">{content}</p>
      </div>

      {!isAIMessage && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="User"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-primary-foreground" />
          )}
        </div>
      )}
    </div>
  );
}
