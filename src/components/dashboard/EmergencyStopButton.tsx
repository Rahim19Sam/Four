import React from "react";
import { Button } from "../ui/button";
import { Power } from "lucide-react";

interface EmergencyStopButtonProps {
  onClick?: () => void;
}

const EmergencyStopButton = ({
  onClick = () => {},
}: EmergencyStopButtonProps) => {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        variant="destructive"
        size="icon"
        className="h-16 w-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-pulse-slow bg-red-600 hover:bg-red-700 border-4 border-white"
        onClick={onClick}
      >
        <Power className="h-8 w-8 animate-pulse" />
      </Button>
    </div>
  );
};

export default EmergencyStopButton;
