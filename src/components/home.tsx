import React, { useState, useEffect } from "react";
import Header from "./dashboard/Header";
import RoomGrid from "./dashboard/RoomGrid";
import AlertNotification from "./dashboard/AlertNotification";

const Home = () => {
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

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Header />

        {/* Room Grid */}
        <RoomGrid />

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
