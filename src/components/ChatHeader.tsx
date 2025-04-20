
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm z-10">
      <div className="flex items-center gap-2">
        <Avatar className="w-10 h-10">
          <AvatarImage 
            src="/lovable-uploads/c98001f0-b32f-4dd3-ab33-e8034d876077.png" 
            alt="FitBud Logo" 
            className="object-contain"
          />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-bold text-lg text-fitbud-dark">FitBud</h1>
          <p className="text-xs text-gray-500">SmartSize Advisor</p>
        </div>
      </div>
      <button className="text-sm text-fitbud-primary hover:text-fitbud-secondary transition-colors">
        Update Profile
      </button>
    </header>
  );
};

export default ChatHeader;
