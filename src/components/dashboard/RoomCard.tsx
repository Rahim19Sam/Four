import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Save, Upload, Download, Maximize2 } from "lucide-react";
import MonitoringPanel from "./MonitoringPanel";
import ControlPanel from "./ControlPanel";
import OperationModeSelector from "./OperationModeSelector";
import InteractiveChart from "./InteractiveChart";

interface RoomCardProps {
  roomId: string;
  roomName: string;
  onFullScreenChart?: (roomId: string) => void;
}

const RoomCard = ({
  roomId,
  roomName,
  onFullScreenChart = () => {},
}: RoomCardProps) => {
  const [operationMode, setOperationMode] = useState<"manual" | "automatic">(
    "manual",
  );

  // Load data from localStorage on component mount
  React.useEffect(() => {
    const savedData = localStorage.getItem(`room-${roomId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setOperationMode(parsedData.operationMode || "manual");
        // You would also load other room-specific state here
      } catch (e) {
        console.error("Error loading saved room data", e);
      }
    }
  }, [roomId]);

  const handleModeChange = (mode: "manual" | "automatic") => {
    setOperationMode(mode);
    saveRoomData();
  };

  const saveRoomData = () => {
    // Save current room state to localStorage
    const roomData = {
      operationMode,
      // Add other room-specific state here
    };
    localStorage.setItem(`room-${roomId}`, JSON.stringify(roomData));
  };

  const loadBackup = () => {
    const savedData = localStorage.getItem(`room-${roomId}-backup`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setOperationMode(parsedData.operationMode || "manual");
        // You would also load other room-specific state here
      } catch (e) {
        console.error("Error loading backup data", e);
      }
    }
  };

  const exportData = () => {
    // Generate CSV data for historical data
    const csvData = generateCSV();

    // Create a blob and download it
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${roomName.replace(/\s+/g, "-")}-data.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = () => {
    // This would be replaced with actual historical data
    let csvContent =
      "Timestamp,Temperature1,Temperature2,Temperature3,Temperature4,Humidity1,Humidity2\n";

    // Generate 24 hours of mock data
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(
        now.getTime() - (23 - i) * 60 * 60 * 1000,
      ).toISOString();
      const temp1 = (25 + Math.sin(i / 3) * 5 + Math.random() * 2).toFixed(1);
      const temp2 = (27 + Math.sin(i / 3 + 1) * 4 + Math.random() * 2).toFixed(
        1,
      );
      const temp3 = (
        26 +
        Math.sin(i / 3 + 2) * 4.5 +
        Math.random() * 2
      ).toFixed(1);
      const temp4 = (
        28 +
        Math.sin(i / 3 + 3) * 3.5 +
        Math.random() * 2
      ).toFixed(1);
      const hum1 = (55 + Math.cos(i / 4) * 10 + Math.random() * 5).toFixed(1);
      const hum2 = (50 + Math.cos(i / 4 + 2) * 15 + Math.random() * 5).toFixed(
        1,
      );

      csvContent += `${timestamp},${temp1},${temp2},${temp3},${temp4},${hum1},${hum2}\n`;
    }

    return csvContent;
  };

  const handleChartClick = () => {
    onFullScreenChart(roomId);
  };

  const createBackup = () => {
    const currentData = localStorage.getItem(`room-${roomId}`);
    if (currentData) {
      localStorage.setItem(`room-${roomId}-backup`, currentData);
    }
  };

  return (
    <Card className="w-full h-full overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">{roomName}</CardTitle>
            <Badge
              className={
                operationMode === "manual"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }
            >
              {operationMode === "manual" ? "Manual" : "Automatic"}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => {
                saveRoomData();
                createBackup();
              }}
            >
              <Save className="h-3 w-3" />
              Save Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs hover:bg-amber-50 hover:text-amber-600 transition-colors"
              onClick={loadBackup}
            >
              <Upload className="h-3 w-3" />
              Load Backup
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs hover:bg-green-50 hover:text-green-600 transition-colors"
              onClick={exportData}
            >
              <Download className="h-3 w-3" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3">
            {/* Monitoring Panel */}
            <div className="h-[200px] overflow-hidden">
              <MonitoringPanel />
            </div>

            {/* Control Panel */}
            <div className="h-[250px] overflow-auto">
              <ControlPanel isManualMode={operationMode === "manual"} />
            </div>
          </div>

          <div className="space-y-3">
            {/* Operation Mode Selector */}
            <div>
              <OperationModeSelector
                currentMode={operationMode}
                onModeChange={handleModeChange}
                manualStatus={
                  operationMode === "manual" ? "active" : "inactive"
                }
                automaticStatus={
                  operationMode === "automatic" ? "active" : "inactive"
                }
              />
            </div>

            {/* Interactive Chart with fullscreen button */}
            <div className="h-[300px] relative group">
              <div
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleChartClick}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white/80 hover:bg-white"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-full cursor-pointer" onClick={handleChartClick}>
                <InteractiveChart />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
