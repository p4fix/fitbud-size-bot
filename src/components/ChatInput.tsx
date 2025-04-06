
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Ask about size recommendations..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          className="flex-grow"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || disabled}
          className="bg-fitbud-primary hover:bg-fitbud-secondary transition-colors"
        >
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
