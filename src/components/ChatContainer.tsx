
import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Separator } from "@/components/ui/separator";

const initialMessages: ChatMessageProps[] = [
  {
    content: "Hi there! I'm your FitBud SmartSize Advisor. I can help you find the perfect clothing size based on your measurements and preferences. What are you shopping for today?",
    type: "bot",
    timestamp: new Date(),
  },
];

const ChatContainer = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessageProps = {
      content,
      type: "user",
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsTyping(true);

    // Simulate bot thinking and responding
    setTimeout(() => {
      let botResponse: ChatMessageProps;
      
      // Simple response logic based on user input
      if (content.toLowerCase().includes("jeans") || content.toLowerCase().includes("pants")) {
        botResponse = {
          content: "I've analyzed your profile and found a great recommendation for jeans.",
          type: "bot",
          timestamp: new Date(),
        };
        
        setMessages((prevMessages) => [...prevMessages, botResponse]);
        
        // Add product recommendation after a short delay
        setTimeout(() => {
          const recommendation: ChatMessageProps = {
            content: "",
            type: "recommendation",
            recommendation: {
              item: "Classic Straight Jeans",
              brand: "TrendyFit",
              recommendedSize: "32W x 30L",
              confidence: "high",
            },
            timestamp: new Date(),
          };
          setMessages((prevMessages) => [...prevMessages, recommendation]);
          setIsTyping(false);
        }, 1000);
      } else if (content.toLowerCase().includes("shirt") || content.toLowerCase().includes("t-shirt")) {
        botResponse = {
          content: "Based on your measurements, here's my recommendation for a t-shirt:",
          type: "bot",
          timestamp: new Date(),
        };
        
        setMessages((prevMessages) => [...prevMessages, botResponse]);
        
        // Add product recommendation after a short delay
        setTimeout(() => {
          const recommendation: ChatMessageProps = {
            content: "",
            type: "recommendation",
            recommendation: {
              item: "Premium Cotton T-Shirt",
              brand: "ComfortWear",
              recommendedSize: "Medium",
              confidence: "medium",
            },
            timestamp: new Date(),
          };
          setMessages((prevMessages) => [...prevMessages, recommendation]);
          setIsTyping(false);
        }, 1000);
      } else {
        botResponse = {
          content: "I can help you find the right size for any clothing item. Just tell me what specific item you're looking for, like 'jeans from Levi's' or 'Nike running shoes', and I'll provide a personalized size recommendation based on your profile.",
          type: "bot",
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
        setIsTyping(false);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto bg-fitbud-light rounded-lg overflow-hidden shadow-lg border">
      <ChatHeader />
      
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-fitbud-light mr-2 border">
              <div className="w-4 h-4 rounded-full bg-fitbud-primary animate-pulse-slow"></div>
            </div>
            <div className="bg-fitbud-light rounded-lg p-3 rounded-tl-none">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatContainer;
