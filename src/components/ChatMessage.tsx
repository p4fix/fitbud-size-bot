import { cn } from "@/lib/utils";
import { ArrowDown, Check, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type MessageType = "user" | "bot" | "recommendation";

export interface ChatMessageProps {
  content: string;
  type: MessageType;
  recommendation?: {
    item: string;
    brand: string;
    recommendedSize: string;
    confidence: "high" | "medium" | "low";
    image?: string;
  };
  timestamp?: Date;
}

const ChatMessage = ({ content, type, recommendation, timestamp = new Date() }: ChatMessageProps) => {
  const isUser = type === "user";
  const isRecommendation = type === "recommendation";
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConfidenceColor = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4 chatbot-message-appear",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%]",
          isUser ? "flex-row-reverse" : "flex-row",
          isRecommendation ? "max-w-md" : ""
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            isUser ? "bg-fitbud-primary ml-2" : "bg-fitbud-light mr-2 border"
          )}
        >
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Avatar className="w-full h-full">
              <AvatarImage 
                src="/lovable-uploads/c98001f0-b32f-4dd3-ab33-e8034d876077.png" 
                alt="FitBud Logo" 
                className="object-contain"
              />
              <AvatarFallback>FB</AvatarFallback>
            </Avatar>
          )}
        </div>

        <div>
          {isRecommendation && recommendation ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-fitbud-dark">{recommendation.item}</h3>
                  <span className={cn("text-xs font-medium", getConfidenceColor(recommendation.confidence))}>
                    {recommendation.confidence.charAt(0).toUpperCase() + recommendation.confidence.slice(1)} confidence
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Brand: {recommendation.brand}</p>
                <div className="flex items-center">
                  <Check size={16} className="text-green-500 mr-1" />
                  <p className="text-sm font-medium">Recommended size: {recommendation.recommendedSize}</p>
                </div>

                <Separator className="my-3" />
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Based on your profile</span>
                  <div className="flex items-center gap-1 text-fitbud-primary cursor-pointer hover:underline">
                    See details <ArrowDown size={12} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "rounded-lg p-3 min-w-[120px]",
                isUser
                  ? "bg-fitbud-primary text-white rounded-tr-none"
                  : "bg-fitbud-light text-fitbud-dark rounded-tl-none"
              )}
            >
              <p className="text-sm">{content}</p>
              <div className={cn("text-right mt-1 text-xs opacity-70", isUser ? "text-fitbud-light" : "text-gray-500")}>
                {formatTime(timestamp)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
