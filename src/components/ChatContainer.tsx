
import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Separator } from "@/components/ui/separator";
import { useProfile } from "@/contexts/ProfileContext";
import { initializeGemini, generateResponse, createPromptWithContext } from "@/services/geminiService";
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
  const [isGeminiReady, setIsGeminiReady] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profileData } = useProfile();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Gemini API on component mount
  useEffect(() => {
    const setup = async () => {
      try {
        const success = await initializeGemini();
        setIsGeminiReady(success);
        if (!success) {
          setApiError("Unable to connect to AI service. Using basic recommendations instead.");
          setMessages(prev => [
            ...prev, 
            {
              content: "I'm having trouble connecting to my AI brain. I'll still help you with basic recommendations based on your measurements.",
              type: "bot",
              timestamp: new Date()
            }
          ]);
        } else {
          console.log("Gemini API initialized successfully");
          setApiError(null);
        }
      } catch (error) {
        console.error("Gemini initialization error:", error);
        setIsGeminiReady(false);
        setApiError("Failed to initialize AI service. Using basic recommendations instead.");
        toast({
          title: "Connection Error",
          description: "Failed to initialize the AI service. Using basic recommendations instead.",
          variant: "destructive"
        });
      }
    };
    
    setup();
  }, [toast]);

  const handleSendMessage = async (content: string) => {
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

      // Generate response
      if (isGeminiReady) {
        console.log("Using Gemini API for response");
        try {
          // Create a proper prompt with all necessary context
          const prompt = createPromptWithContext(content, profileData, clothingDatabase);
          
          // Generate response from Gemini API
          const responseText = await generateResponse(prompt, profileData);
          
          // Add the AI response
          const botResponse: ChatMessageProps = {
            content: responseText || "I understand your question about clothing sizes. Let me help with that.",
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
        } catch (error) {
          console.error("Error with Gemini API:", error);
          // Fall back to basic response if Gemini fails
          handleFallbackResponse(content, matchingItem);
          
          // Set error state and show toast
          setApiError("AI service temporarily unavailable. Using basic recommendations instead.");
          toast({
            title: "AI Service Error",
            description: "Using basic responses while our AI service recovers.",
            variant: "destructive"
          });
        }
      } else {
        console.log("Using fallback response system");
        // Use fallback responses if Gemini is not available
        handleFallbackResponse(content, matchingItem);
      }
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

  const handleFallbackResponse = (content: string, matchingItem: string | undefined) => {
    let botResponse: ChatMessageProps;
    
    if (matchingItem) {
      botResponse = {
        content: `I can help with ${matchingItem}! Based on your measurements, here's what I recommend:`,
        type: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Add product recommendation
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
      botResponse = {
        content: "I can help you find the right size for any clothing item. Just tell me what specific item you're looking for, like 'jeans', 'shirts', or 'dresses', and I'll provide a personalized recommendation based on your profile.",
        type: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto bg-fitbud-light rounded-lg overflow-hidden shadow-lg border">
      <ChatHeader onUpdateProfile={onUpdateProfile} />
      
      {apiError && (
        <Alert variant="destructive" className="mx-4 mt-2">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Connection Notice</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}
      
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
