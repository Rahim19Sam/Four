import React, { useState, useEffect } from "react";
import Header from "./dashboard/Header";
import MonitoringPanel from "./dashboard/MonitoringPanel";
import ControlPanel from "./dashboard/ControlPanel";
import OperationModeSelector from "./dashboard/OperationModeSelector";
import InteractiveChart from "./dashboard/InteractiveChart";
import AlertNotification from "./dashboard/AlertNotification";

const Home = () => {
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

  // Simulate an alert after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleModeChange = (mode: "manual" | "automatic") => {
    setOperationMode(mode);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Monitoring Panel */}
            <MonitoringPanel />

            {/* Control Panel */}
            <ControlPanel isManualMode={operationMode === "manual"} />
          </div>

          {/* Right Column */}
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

            {/* Interactive Chart */}
            <InteractiveChart />
          </div>
        </div>

        {/* Alert Notification */}
        {showAlert && (
          <AlertNotification
            title={alertInfo.title}
            message={alertInfo.message}
            type={alertInfo.type}
            onClose={handleAlertClose}
            isVisible={showAlert}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
