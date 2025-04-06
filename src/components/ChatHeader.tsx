
import { Tshirt } from "lucide-react";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm z-10">
      <div className="flex items-center gap-2">
        <div className="bg-fitbud-primary rounded-full p-2 text-white">
          <Tshirt size={24} />
        </div>
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
