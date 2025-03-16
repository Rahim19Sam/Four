import React, { useState } from "react";
import { Button } from "../ui/button";
import { Power } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface EmergencyStopButtonProps {
  onClick?: (isActive: boolean) => void;
  initialState?: boolean;
}

const EmergencyStopButton = ({
  onClick = () => {},
  initialState = false,
}: EmergencyStopButtonProps) => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(initialState);

  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
    onClick(newState);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        variant={isActive ? "destructive" : "default"}
        size="icon"
        className={`h-16 w-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${isActive ? "bg-red-600 hover:bg-red-700 animate-pulse-slow" : "bg-green-600 hover:bg-green-700"} border-4 border-white`}
        onClick={handleClick}
      >
        <Power className={`h-8 w-8 ${isActive ? "animate-pulse" : ""}`} />
      </Button>
    </div>
  );
};

export default EmergencyStopButton;
