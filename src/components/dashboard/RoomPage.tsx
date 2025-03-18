import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import MonitoringPanel from "./MonitoringPanel";
import ControlPanel from "./ControlPanel";
import OperationModeSelector from "./OperationModeSelector";
import CountdownTimer from "./CountdownTimer";
import EmergencyStopButton from "./EmergencyStopButton";
import DoorStatusButton from "./DoorStatusButton";
import AlertNotification from "./AlertNotification";
import { Button } from "../ui/button";
import { ArrowLeft, Save, Download, FileDown } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const [operationMode, setOperationMode] = useState<"manual" | "automatic">(
    "manual",
  );
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isEmergencyStop, setIsEmergencyStop] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    title: "Temperature Alert",
    message:
      "Temperature in Sensor 3 is above the acceptable range (72.1°C). Please check the system.",
    type: "warning" as "warning" | "error" | "info",
  });
  const [targetTemp, setTargetTemp] = useState(60);
  const [targetHumidity, setTargetHumidity] = useState(45);
  const [dryingTime, setDryingTime] = useState(24);
  const [timerRemainingSeconds, setTimerRemainingSeconds] = useState(24 * 3600);

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
        setTargetTemp(parsedData.targetTemp || 60);
        setTargetHumidity(parsedData.targetHumidity || 45);
        setDryingTime(parsedData.dryingTime || 24);
        setTimerRemainingSeconds(parsedData.timerRemainingSeconds || 24 * 3600);
      } catch (e) {
        console.error("Error loading saved room data", e);
      }
    }
  }, [roomId]);

  const handleModeChange = (mode: "manual" | "automatic") => {
    setOperationMode(mode);

    // If switching to automatic mode, reset emergency stop
    if (mode === "automatic") {
      setIsEmergencyStop(false);
    }

    saveRoomData();
  };

  const handleDoorToggle = (isOpen: boolean) => {
    setIsDoorOpen(isOpen);

    if (isOpen && operationMode === "automatic") {
      // Show alert when door is opened during automatic operation
      setAlertInfo({
        title: t("Door Opened"),
        message: t(
          "Door has been opened. All devices have been stopped for safety. Close the door to resume operation.",
        ),
        type: "warning",
      });
      setShowAlert(true);
    }
  };

  const handleEmergencyStop = (isActive: boolean) => {
    setIsEmergencyStop(isActive);

    if (isActive) {
      // Show alert when emergency stop is activated
      setAlertInfo({
        title: t("Emergency Stop Activated"),
        message: t(
          "All systems have been shut down. Please check the equipment before restarting.",
        ),
        type: "error",
      });
      setShowAlert(true);
      setOperationMode("manual");
    }

    saveRoomData();
  };

  const saveRoomData = () => {
    if (!roomId) return;

    // Save current room state to localStorage
    const roomData = {
      operationMode,
      targetTemp,
      targetHumidity,
      dryingTime,
      timerRemainingSeconds,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(`room-${roomId}`, JSON.stringify(roomData));
  };

  const handleAlertClose = () => {
    setShowAlert(false);
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
    setOperationMode("manual");
    saveRoomData();
  };

  const handleTargetTempChange = (value: number) => {
    setTargetTemp(value);
    saveRoomData();
  };

  const handleTargetHumidityChange = (value: number) => {
    setTargetHumidity(value);
    saveRoomData();
  };

  const handleDryingTimeChange = (value: number) => {
    setDryingTime(value);
    saveRoomData();
  };

  const handleTimerUpdate = (remainingSeconds: number) => {
    setTimerRemainingSeconds(remainingSeconds);
    saveRoomData();
  };

  const handleExportData = () => {
    if (!roomId) return;

    const roomData = {
      roomId,
      roomName: getRoomName(),
      operationMode,
      targetTemp,
      targetHumidity,
      dryingTime,
      timerRemainingSeconds,
      exportTime: new Date().toISOString(),
    };

    // Create a CSV string
    const csvContent = Object.entries(roomData)
      .map(([key, value]) => `${key},${value}`)
      .join("\n");

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${roomId}-data-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAlertFromMonitoring = (
    alerts: { id: string; message: string; type: string }[],
  ) => {
    if (alerts.length > 0) {
      // Show the most severe alert (error takes precedence over warning)
      const errorAlert = alerts.find((alert) => alert.type === "error");
      const warningAlert = alerts.find((alert) => alert.type === "warning");
      const alertToShow = errorAlert || warningAlert;

      if (alertToShow && !showAlert) {
        setAlertInfo({
          title: alertToShow.type === "error" ? t("Error") : t("Warning"),
          message: t(alertToShow.message),
          type: alertToShow.type as "warning" | "error" | "info",
        });
        setShowAlert(true);
      }
    }
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={saveRoomData}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              {t("Save")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-1"
            >
              <FileDown className="h-4 w-4" />
              {t("Export")}
            </Button>
            <DoorStatusButton
              onDoorToggle={handleDoorToggle}
              initialStatus={isDoorOpen}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Monitoring Panel */}
            <MonitoringPanel
              roomName={getRoomName()}
              isDoorOpen={isDoorOpen}
              isEmergencyStop={isEmergencyStop}
              onAlertChange={handleAlertFromMonitoring}
            />

            {/* Control Panel */}
            <ControlPanel
              isManualMode={operationMode === "manual"}
              isDoorOpen={isDoorOpen}
              isEmergencyStop={isEmergencyStop}
              onTargetTempChange={handleTargetTempChange}
              onTargetHumidityChange={handleTargetHumidityChange}
              onDryingTimeChange={handleDryingTimeChange}
              onTimerSync={(hours) => setTimerRemainingSeconds(hours * 3600)}
            />
          </div>

          <div className="space-y-6">
            {/* Operation Mode Selector */}
            <OperationModeSelector
              currentMode={operationMode}
              onModeChange={handleModeChange}
              manualStatus={operationMode === "manual" ? "active" : "inactive"}
              automaticStatus={
                operationMode === "automatic"
                  ? isDoorOpen || isEmergencyStop
                    ? "error"
                    : "active"
                  : "inactive"
              }
            />

            {/* Countdown Timer */}
            <CountdownTimer
              initialHours={dryingTime}
              isRunning={
                operationMode === "automatic" && !isDoorOpen && !isEmergencyStop
              }
              isAutoMode={operationMode === "automatic"}
              isDoorOpen={isDoorOpen}
              isEmergencyStop={isEmergencyStop}
              onComplete={handleCountdownComplete}
              onTimerUpdate={handleTimerUpdate}
            />
          </div>
        </div>

        {/* Emergency Stop Button */}
        <EmergencyStopButton
          onClick={handleEmergencyStop}
          initialState={isEmergencyStop}
        />

        {/* Alert Notification - Fixed position in the top-right corner */}
        {showAlert && (
          <div className="fixed top-4 right-4 z-50">
            <AlertNotification
              title={t(alertInfo.title)}
              message={t(alertInfo.message)}
              type={alertInfo.type}
              onClose={handleAlertClose}
              isVisible={showAlert}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
