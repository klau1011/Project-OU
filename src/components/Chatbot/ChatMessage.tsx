import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Message } from "ai/react";
import { Bot } from "lucide-react";
import Image from "next/image";

export default function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const isAIMessage = role === "assistant";
  const { user } = useUser();

  return (
    <>
      <div
        className={cn(
          "mb-3 flex items-center",
          isAIMessage ? "mr-2 justify-start" : "ms-5 justify-end",
        )}
      >
        {isAIMessage && <Bot size={40} className="mr-2 shrink-0" />}
        <p
          className={cn(
            "border px-3 whitespace-pre-line rounded-xl py-2.5",
            isAIMessage
              ? "bg-background"
              : "bg-primary text-primary-foreground",
          )}
        >
          {content}
        </p>
        {!isAIMessage && user?.imageUrl && (
          <Image
            src={user.imageUrl}
            alt="User profile picture"
            width={40}
            height={40}
            className="ml-2 h-10 w-10 rounded-full object-cover"
          />
        )}
      </div>
    </>
  );
}
