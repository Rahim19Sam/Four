import React, { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

interface AlertNotificationProps {
  title?: string;
  message?: string;
  type?: "warning" | "error" | "info";
  onClose?: () => void;
  isVisible?: boolean;
}

const AlertNotification = ({
  title = "Temperature Alert",
  message = "Temperature in Sensor 2 is above the acceptable range (30°C). Please check the system.",
  type = "warning",
  onClose = () => {},
  isVisible = true,
}: AlertNotificationProps) => {
  const [visible, setVisible] = useState(isVisible);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  if (!visible) return null;

  const alertStyles = {
    warning: "bg-amber-50 border-amber-500 text-amber-800",
    error: "bg-red-50 border-red-500 text-red-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96 shadow-lg rounded-md overflow-hidden bg-white">
      <Alert className={`border-l-4 ${alertStyles[type]}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <AlertTitle className="font-semibold">{title}</AlertTitle>
              <AlertDescription className="text-sm mt-1">
                {message}
              </AlertDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1 -mr-1"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-end mt-2">
          <Button
            variant="outline"
            size="sm"
            className="mr-2 text-xs"
            onClick={handleClose}
          >
            Dismiss
          </Button>
          <Button
            size="sm"
            className="text-xs bg-amber-600 hover:bg-amber-700"
            onClick={handleClose}
          >
            View Details
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default AlertNotification;
