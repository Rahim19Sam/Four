import React, { useState } from "react";
import { Switch } from "../ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface OperationModeSelectorProps {
  onModeChange?: (mode: "manual" | "automatic") => void;
  currentMode?: "manual" | "automatic";
  manualStatus?: "active" | "inactive";
  automaticStatus?: "active" | "inactive" | "error";
}

const OperationModeSelector = ({
  onModeChange = () => {},
  currentMode = "manual",
  manualStatus = "active",
  automaticStatus = "inactive",
}: OperationModeSelectorProps) => {
  const [mode, setMode] = useState<"manual" | "automatic">(currentMode);

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? "automatic" : "manual";
    setMode(newMode);
    onModeChange(newMode);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Operation Mode</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span
                className={`font-medium ${mode === "manual" ? "text-primary" : "text-gray-500"}`}
              >
                Manual
              </span>
              <div className="mt-1">
                {manualStatus === "active" && mode === "manual" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>

            <div className="mx-4">
              <Switch
                checked={mode === "automatic"}
                onCheckedChange={handleModeChange}
              />
            </div>

            <div className="flex flex-col">
              <span
                className={`font-medium ${mode === "automatic" ? "text-primary" : "text-gray-500"}`}
              >
                Automatic
              </span>
              <div className="mt-1">
                {automaticStatus === "active" && mode === "automatic" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                  </Badge>
                ) : automaticStatus === "error" ? (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    <AlertCircle className="mr-1 h-3 w-3" /> Error
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {mode === "manual" ? (
              <p>Manual control of all devices</p>
            ) : (
              <p>System maintains target conditions automatically</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-400 pt-0">
        {mode === "automatic"
          ? "The system will automatically adjust devices to maintain target conditions"
          : "You have full control over all devices in the drying room"}
      </CardFooter>
    </Card>
  );
};

export default OperationModeSelector;
