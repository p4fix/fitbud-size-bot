
import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Separator } from "@/components/ui/separator";
import { useProfile } from "@/contexts/ProfileContext";
import { initializeGemini, generateResponse } from "@/services/geminiService";
import { getSizeRecommendation, clothingDatabase, capitalize } from "@/utils/sizeRecommendation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const initialMessages: ChatMessageProps[] = [
  {
    content: "Hi there! I'm your FitBud SmartSize Advisor. I can help you find the perfect clothing size based on your measurements and preferences. What are you shopping for today?",
    type: "bot",
    timestamp: new Date(),
  },
];

interface ChatContainerProps {
  onUpdateProfile?: () => void;
}

const ChatContainer = ({ onUpdateProfile }: ChatContainerProps) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profileData } = useProfile();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // No need to initialize Gemini API anymore
  useEffect(() => {
    // Simplified setup that doesn't rely on the Gemini API
    // Just using basic recommendations
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: ChatMessageProps = {
      content,
      type: "user",
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsTyping(true);

    try {
      // Check for clothing items in the message
      const lowerContent = content.toLowerCase();
      const itemTypes = ['jeans', 'shirts', 'dresses'];
      const matchingItem = itemTypes.find(item => lowerContent.includes(item));

      // Use the simplified keyword approach directly
      setTimeout(async () => {
        // Generate a simple response based on keywords
        const responseText = await generateResponse(content, profileData);
        
        // Add the response
        const botResponse: ChatMessageProps = {
          content: responseText,
          type: "bot",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        
        // If matched a clothing item, also add a recommendation card
        if (matchingItem) {
          setTimeout(() => {
            const recommendation = getSizeRecommendation(matchingItem, profileData);
            if (recommendation) {
              const recommendationMessage: ChatMessageProps = {
                content: "",
                type: "recommendation",
                recommendation: {
                  item: `${recommendation.brand.name} ${capitalize(matchingItem)}`,
                  brand: recommendation.brand.name,
                  recommendedSize: recommendation.size,
                  confidence: recommendation.confidence,
                },
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, recommendationMessage]);
            }
            setIsTyping(false);
          }, 1000);
        } else {
          setIsTyping(false);
        }
      }, 1500);
    } catch (error) {
      console.error("Error processing message:", error);
      // Handle error with a friendly message
      setMessages(prev => [
        ...prev, 
        {
          content: "I apologize, but I encountered an error processing your request. Let me help you with basic size recommendations instead.",
          type: "bot",
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto bg-fitbud-light rounded-lg overflow-hidden shadow-lg border">
      <ChatHeader onUpdateProfile={onUpdateProfile} />
      
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
