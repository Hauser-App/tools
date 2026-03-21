import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  status: "sent" | "delivered";
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void;
  className?: string;
}

const ChatInterface = ({
  onSendMessage,
  className = "",
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi, I can help you analyze potential business acquisitions and explain valuation concepts. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
      status: "delivered",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    if (onSendMessage) {
      onSendMessage(inputValue);
    }

    try {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I understand your question about business valuation. Let me help you analyze that.",
        sender: "ai",
        timestamp: new Date(),
        status: "delivered",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in chat:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[600px] bg-background pt-2 rounded-[20px] overflow-hidden">
      <Card className="bg-[#262626] border-none">
        <div className="flex flex-col p-6">
          {/* Header */}
          <div className="border-b border-[#3a3a3a] flex items-center gap-2 pb-4">
            <span className="text-[#BBB7AF] font-semibold text-xl">
              AI Assistant
            </span>
          </div>

          {/* Messages Area */}
          <div className="h-[360px] flex-1 py-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-[#c0ff02] text-black" : "bg-[#3a3a3a] text-white"}`}
                >
                  <p className="text-base">{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${message.sender === "user" ? "text-black/70" : "text-white/70"}`}
                  >
                    {message.timestamp.toLocaleTimeString()} · {message.status}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-[#3a3a3a] pt-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about business valuation..."
                className="flex-1 bg-[#3a3a3a] border-none text-white"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                className="bg-[#c0ff02] hover:bg-[#c0ff02]/90 text-black"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
