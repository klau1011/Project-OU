import { cn } from "@/lib/utils";
import { Bot, XCircle } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import ChatMessage from "./ChatMessage";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ChatbotBoxProps {
  open: boolean;
  onClose: () => void;
}

const ChatbotBox = ({ open, onClose }: ChatbotBoxProps) => {
  const {
    messages,

    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isUserLastMessage = messages[messages.length - 1]?.role === "user";

  return (
    <>
      <div
        className={cn(
          "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
          open ? "fixed" : "hidden",
        )}
      >
        <button onClick={onClose} className="mb-1 ms-auto block">
          <XCircle size={30} />
        </button>
        <div className="flex h-[600px] flex-col rounded-3xl border bg-background shadow-xl">
          <div className="mt-3 h-full overflow-y-auto px-2" ref={scrollRef}>
            {messages.map((message) => (
              <ChatMessage message={message} key={message.id} />
            ))}
            {isUserLastMessage && isLoading && (
              <ChatMessage
                message={{ role: "assistant", content: "Thinking..." }}
              />
            )}
            {!error && messages.length === 0 && (
              <div className="flex h-full items-center justify-center gap-3">
                <Bot />
                Ask the AI a question!
              </div>
            )}{" "}
          </div>
          <form className="bottom-0 m-3 flex gap-2" onSubmit={handleSubmit}>
            <Input ref={inputRef} value={input} onChange={handleInputChange} />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatbotBox;
