import { Bot } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import ChatbotBox from "./ChatbotBox";

export default function ChatbotButton() {

    const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <>
    <Button onClick={() => setIsChatbotOpen(!isChatbotOpen)}>
      <Bot size={20} className="mr-2" />
      AI Chat
    </Button>
    <ChatbotBox open={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
}
