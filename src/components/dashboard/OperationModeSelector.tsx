import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

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
  const { t } = useTranslation();
  const [mode, setMode] = useState<"manual" | "automatic">(currentMode);

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? "automatic" : "manual";
    setMode(newMode);
    onModeChange(newMode);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">
          {t("Operation Mode")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span
                className={`font-medium ${mode === "manual" ? "text-primary" : "text-gray-500"}`}
              >
                {t("Manual")}
              </span>
              <div className="mt-1">
                {manualStatus === "active" && mode === "manual" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> {t("Active")}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    {t("Inactive")}
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
                {t("Automatic")}
              </span>
              <div className="mt-1">
                {automaticStatus === "active" && mode === "automatic" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> {t("Active")}
                  </Badge>
                ) : automaticStatus === "error" ? (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    <AlertCircle className="mr-1 h-3 w-3" /> {t("Error")}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    {t("Inactive")}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {mode === "manual" ? (
              <p>{t("Manual control of all devices")}</p>
            ) : (
              <p>{t("System maintains target conditions automatically")}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-400 pt-0">
        {mode === "automatic"
          ? t(
              "The system will automatically adjust devices to maintain target conditions",
            )
          : t("You have full control over all devices in the drying room")}
      </CardFooter>
    </Card>
  );
};

export default OperationModeSelector;
