import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import MonitoringPanel from "./MonitoringPanel";
import ControlPanel from "./ControlPanel";
import OperationModeSelector from "./OperationModeSelector";
import CountdownTimer from "./CountdownTimer";
import EmergencyStopButton from "./EmergencyStopButton";
import AlertNotification from "./AlertNotification";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [operationMode, setOperationMode] = useState<"manual" | "automatic">(
    "manual",
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    title: "Temperature Alert",
    message:
      "Temperature in Sensor 3 is above the acceptable range (72.1°C). Please check the system.",
    type: "warning" as "warning" | "error" | "info",
  });

  // Get room name based on roomId
  const getRoomName = () => {
    const rooms = [
      { id: "room1", name: "Drying Room 1" },
      { id: "room2", name: "Drying Room 2" },
      { id: "room3", name: "Drying Room 3" },
    ];
    return rooms.find((room) => room.id === roomId)?.name || "Unknown Room";
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    if (!roomId) return;

    const savedData = localStorage.getItem(`room-${roomId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setOperationMode(parsedData.operationMode || "manual");
      } catch (e) {
        console.error("Error loading saved room data", e);
      }
    }

    // Simulate an alert after component mount
    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [roomId]);

  const handleModeChange = (mode: "manual" | "automatic") => {
    setOperationMode(mode);
    saveRoomData();
  };

  const saveRoomData = () => {
    if (!roomId) return;

    // Save current room state to localStorage
    const roomData = {
      operationMode,
      // Add other room-specific state here
    };
    localStorage.setItem(`room-${roomId}`, JSON.stringify(roomData));
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleEmergencyStop = () => {
    // In a real application, this would trigger an emergency stop protocol
    setAlertInfo({
      title: t("Emergency Stop Activated"),
      message: t(
        "All systems have been shut down. Please check the equipment before restarting.",
      ),
      type: "error",
    });
    setShowAlert(true);
    setOperationMode("manual");
    saveRoomData();
  };

  const handleCountdownComplete = () => {
    setAlertInfo({
      title: t("Drying Process Complete"),
      message: t(
        "The drying process has completed. Please check the product quality.",
      ),
      type: "info",
    });
    setShowAlert(true);
  };

  if (!roomId) {
    return (
      <div>
        {t("Room not found")}.{" "}
        <Button onClick={() => navigate("/")}>{t("Go back")}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back button and Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            className="transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <Header title={`${t(getRoomName())} - ${t("Control System")}`} />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Monitoring Panel */}
            <MonitoringPanel />

            {/* Control Panel */}
            <ControlPanel isManualMode={operationMode === "manual"} />
          </div>

          <div className="space-y-6">
            {/* Operation Mode Selector */}
            <OperationModeSelector
              currentMode={operationMode}
              onModeChange={handleModeChange}
              manualStatus={operationMode === "manual" ? "active" : "inactive"}
              automaticStatus={
                operationMode === "automatic" ? "active" : "inactive"
              }
            />

            {/* Countdown Timer */}
            <CountdownTimer
              initialHours={24}
              isRunning={operationMode === "automatic"}
              onComplete={handleCountdownComplete}
            />
          </div>
        </div>

        {/* Emergency Stop Button */}
        <EmergencyStopButton onClick={handleEmergencyStop} />

        {/* Alert Notification */}
        {showAlert && (
          <AlertNotification
            title={t(alertInfo.title)}
            message={t(alertInfo.message)}
            type={alertInfo.type}
            onClose={handleAlertClose}
            isVisible={showAlert}
          />
        )}
      </div>
    </div>
  );
};

export default RoomPage;
