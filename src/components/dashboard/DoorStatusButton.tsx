import React, { useState } from "react";
import { Button } from "../ui/button";
import { DoorOpen, DoorClosed } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface DoorStatusButtonProps {
  onDoorToggle?: (isOpen: boolean) => void;
  initialStatus?: boolean;
}

const DoorStatusButton = ({
  onDoorToggle = () => {},
  initialStatus = false,
}: DoorStatusButtonProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(initialStatus);

  const handleToggle = () => {
    const newStatus = !isOpen;
    setIsOpen(newStatus);
    onDoorToggle(newStatus);
  };

  return (
    <Button
      onClick={handleToggle}
      variant={isOpen ? "destructive" : "outline"}
      className="flex items-center gap-2 h-14 px-4 transition-all duration-300 hover:scale-105 text-base"
      size="lg"
    >
      {isOpen ? (
        <DoorOpen className="h-6 w-6 mr-2 animate-pulse" />
      ) : (
        <DoorClosed className="h-6 w-6 mr-2" />
      )}
      {isOpen ? t("Door Open") : t("Door Closed")}
    </Button>
  );
};

export default DoorStatusButton;
