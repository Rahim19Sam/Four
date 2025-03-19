import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent } from "../ui/dialog";
import { Eye, Bell, X, BarChart3, Play, Power } from "lucide-react";
import InteractiveChart from "./InteractiveChart";
import NotificationCenter, { AlertItem } from "./NotificationCenter";
import { useTranslation } from "../../hooks/useTranslation";
import LanguageSwitcher from "./LanguageSwitcher";
import TemperatureAnimation from "./TemperatureAnimation";
import AlertNotification from "./AlertNotification";

const RoomGrid = () => {
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const [fullScreenChartRoom, setFullScreenChartRoom] = useState<string | null>(
    null,
  );
  const [systemAlerts, setSystemAlerts] = useState<AlertItem[]>([]);
  const [showNotificationTable, setShowNotificationTable] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const rooms = [
    {
      id: "room1",
      name: "Drying Room 1",
      status: "online", // online, offline, warning
      temperature: "65.2°C",
      humidity: "45%",
    },
    {
      id: "room2",
      name: "Drying Room 2",
      status: "warning",
      temperature: "72.1°C",
      humidity: "58%",
    },
    {
      id: "room3",
      name: "Drying Room 3",
      status: "online",
      temperature: "67.5°C",
      humidity: "52%",
    },
  ];

  // Load alerts from localStorage on component mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem("system-alerts");
    if (savedAlerts) {
      try {
        setSystemAlerts(JSON.parse(savedAlerts));
      } catch (e) {
        console.error("Error loading saved alerts", e);
      }
    }
  }, []);

  // Handle alerts from all rooms
  const handleRoomAlerts = (
    roomId: string,
    roomName: string,
    alerts: { id: string; message: string; type: string }[],
  ) => {
    const newAlerts = alerts.map((alert) => ({
      id: `${roomId}-${alert.id}`,
      roomId,
      roomName,
      message: alert.message,
      type: alert.type as "warning" | "error" | "info",
      timestamp: new Date().toISOString(),
      dismissed: false,
    }));

    // Only add new alerts that don't already exist
    if (newAlerts.length > 0) {
      setSystemAlerts((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const filteredNewAlerts = newAlerts.filter(
          (a) => !existingIds.has(a.id),
        );

        const updatedAlerts = [...prev, ...filteredNewAlerts];
        // Save to localStorage
        localStorage.setItem("system-alerts", JSON.stringify(updatedAlerts));
        return updatedAlerts;
      });
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setSystemAlerts((prev) => {
      const updatedAlerts = prev
        .map((alert) =>
          alert.id === alertId ? { ...alert, dismissed: true } : alert,
        )
        .filter((alert) => alert.id !== alertId || !alert.dismissed);

      // Save to localStorage
      localStorage.setItem("system-alerts", JSON.stringify(updatedAlerts));
      return updatedAlerts;
    });
  };

  const handleDismissAllAlerts = () => {
    setSystemAlerts([]);
    localStorage.removeItem("system-alerts");
  };

  const handleFullScreenChart = (roomId: string) => {
    setFullScreenChartRoom(roomId);
  };

  const closeFullScreenChart = () => {
    setFullScreenChartRoom(null);
  };

  const navigateToRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "warning":
        return "bg-amber-500 animate-pulse";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return t("System Online");
      case "offline":
        return t("System Offline");
      case "warning":
        return t("System Warning");
      default:
        return t("Unknown Status");
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setShowAlert(true);
  };

  return (
    <div className="w-full max-w-[98vw] mx-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold">
          {t("Tobacco Drying Room Control System")}
        </h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
          <Button
            onClick={() => setShowNotificationTable(true)}
            className="relative flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
            variant="outline"
          >
            <Bell className="h-5 w-5 text-amber-500" />
            {t("Notifications")}
            {systemAlerts.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 animate-pulse"
              >
                {systemAlerts.length}
              </Badge>
            )}
          </Button>
          <Button
            onClick={() => handleFullScreenChart("overview")}
            className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
            variant="outline"
          >
            <BarChart3 className="h-5 w-5 text-blue-500" />
            {t("System Overview")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white h-[450px]"
          >
            <CardContent className="p-0 h-full">
              <div className="p-4 border-b border-gray-100 h-full flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">{t(room.name)}</h2>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${getStatusColor(room.status)}`}
                    ></div>
                    <span className="text-sm font-medium">
                      {getStatusText(room.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-orange-50 p-3 rounded-lg flex flex-col items-center">
                    <span className="text-sm text-gray-600">
                      {t("Temperature")}
                    </span>
                    <span className="text-2xl font-bold text-orange-600 animate-pulse">
                      {room.temperature}
                    </span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center">
                    <span className="text-sm text-gray-600">
                      {t("Humidity")}
                    </span>
                    <span className="text-2xl font-bold text-blue-600 animate-pulse">
                      {room.humidity}
                    </span>
                  </div>
                </div>

                <div className="flex-grow h-[220px] mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                  <TemperatureAnimation roomId={room.id} />
                </div>

                <Button
                  onClick={() => navigateToRoom(room.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 hover:shadow-md transform hover:scale-105 mb-4"
                >
                  <Eye className="h-4 w-4 animate-pulse" />
                  {t("View Details")}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-2 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                    <Button
                      variant="outline"
                      className="w-full h-10 flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                      onClick={() => {
                        // Set auto mode for this room
                        const roomData = localStorage.getItem(
                          `room-${room.id}`,
                        );
                        if (roomData) {
                          try {
                            const parsedData = JSON.parse(roomData);
                            const updatedData = {
                              ...parsedData,
                              operationMode: "automatic",
                              isAutoPlay: true,
                              isHardStop: false,
                            };
                            localStorage.setItem(
                              `room-${room.id}`,
                              JSON.stringify(updatedData),
                            );

                            // Update device states
                            const savedDeviceStates = localStorage.getItem(
                              `${room.id}-device-states`,
                            );
                            const deviceStates = savedDeviceStates
                              ? JSON.parse(savedDeviceStates)
                              : {};
                            const updatedStates = {
                              ...deviceStates,
                              heaters: [true, true, true, true],
                              airDryer: true,
                              // fans remain unchanged
                            };
                            localStorage.setItem(
                              `${room.id}-device-states`,
                              JSON.stringify(updatedStates),
                            );

                            // Force refresh
                            navigate(`/room/${room.id}`);
                          } catch (e) {
                            console.error("Error updating room data", e);
                          }
                        }
                      }}
                    >
                      <Play className="h-4 w-4 transition-all duration-300 hover:scale-110 hover:animate-pulse" />
                      <span className="text-sm">{t("Auto Start")}</span>
                    </Button>
                  </Card>
                  <Card className="p-2 bg-gradient-to-br from-red-50 to-white border border-red-100">
                    <Button
                      variant="outline"
                      className="w-full h-10 flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                      onClick={() => {
                        // Set emergency stop for this room
                        const roomData = localStorage.getItem(
                          `room-${room.id}`,
                        );
                        if (roomData) {
                          try {
                            const parsedData = JSON.parse(roomData);
                            const updatedData = {
                              ...parsedData,
                              operationMode: "manual",
                              isAutoPlay: false,
                              isHardStop: true,
                            };
                            localStorage.setItem(
                              `room-${room.id}`,
                              JSON.stringify(updatedData),
                            );

                            // Update device states
                            const savedDeviceStates = localStorage.getItem(
                              `${room.id}-device-states`,
                            );
                            const deviceStates = savedDeviceStates
                              ? JSON.parse(savedDeviceStates)
                              : {};
                            const updatedStates = {
                              ...deviceStates,
                              heaters: [false, false, false, false],
                              airDryer: false,
                              fans: [false, false],
                            };
                            localStorage.setItem(
                              `${room.id}-device-states`,
                              JSON.stringify(updatedStates),
                            );

                            // Force refresh
                            navigate(`/room/${room.id}`);
                          } catch (e) {
                            console.error("Error updating room data", e);
                          }
                        }
                      }}
                    >
                      <Power className="h-4 w-4 transition-all duration-300 hover:scale-110 hover:text-red-600" />
                      <span className="text-sm">{t("Emergency Stop")}</span>
                    </Button>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notification Table Dialog */}
      <Dialog
        open={showNotificationTable}
        onOpenChange={setShowNotificationTable}
      >
        <DialogContent className="max-w-4xl w-[90vw] max-h-[80vh] overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              {t("System Notifications")}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDismissAllAlerts}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                {t("Dismiss All")}
              </Button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {systemAlerts.length > 0 ? (
              <div className="space-y-2">
                {systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border flex justify-between items-start ${
                      alert.type === "error"
                        ? "bg-red-50 border-red-200"
                        : alert.type === "warning"
                          ? "bg-amber-50 border-amber-200"
                          : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {alert.roomName} -{" "}
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                      <p className="text-sm mt-1">{t(alert.message)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissAlert(alert.id)}
                      className="h-8 hover:bg-gray-200"
                    >
                      {t("Dismiss")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {t("No active notifications")}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-screen chart dialog */}
      <Dialog
        open={fullScreenChartRoom !== null}
        onOpenChange={closeFullScreenChart}
      >
        <DialogContent className="max-w-5xl w-[90vw] h-[80vh] p-6">
          <div className="h-full">
            <h2 className="text-2xl font-bold mb-4">
              {fullScreenChartRoom === "overview"
                ? t("System Overview")
                : rooms.find((r) => r.id === fullScreenChartRoom)?.name}{" "}
              - {t("Detailed Data Analysis")}
            </h2>
            <div className="h-[calc(100%-3rem)]">
              <InteractiveChart />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Notification Center */}
      <NotificationCenter
        alerts={systemAlerts}
        onDismissAlert={handleDismissAlert}
      />

      {/* Language Change Alert */}
      {showAlert && (
        <AlertNotification
          title={t("Language Changed")}
          message={t("The interface language has been updated successfully.")}
          type="info"
          onClose={() => setShowAlert(false)}
          isVisible={showAlert}
        />
      )}
    </div>
  );
};

export default RoomGrid;
