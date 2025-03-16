import React, { useState, useEffect } from "react";
import RoomCard from "./RoomCard";
import { Dialog, DialogContent } from "../ui/dialog";
import InteractiveChart from "./InteractiveChart";
import NotificationCenter, { AlertItem } from "./NotificationCenter";
import { useTranslation } from "../../hooks/useTranslation";

const RoomGrid = () => {
  const { t } = useTranslation();
  const [fullScreenChartRoom, setFullScreenChartRoom] = useState<string | null>(
    null,
  );
  const [systemAlerts, setSystemAlerts] = useState<AlertItem[]>([]);

  const rooms = [
    { id: "room1", name: "Drying Room 1" },
    { id: "room2", name: "Drying Room 2" },
    { id: "room3", name: "Drying Room 3" },
  ];

  // Handle alerts from all rooms
  const handleRoomAlerts = (
    roomId: string,
    roomName: string,
    alerts: { id: string; message: string; type: string }[],
  ) => {
    const newAlerts = alerts.map((alert) => ({
      id: `${roomId}-${alert.id}-${Date.now()}`,
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
        return [...prev, ...filteredNewAlerts];
      });
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setSystemAlerts((prev) =>
      prev
        .map((alert) =>
          alert.id === alertId ? { ...alert, dismissed: true } : alert,
        )
        .filter((alert) => alert.id !== alertId || !alert.dismissed),
    );
  };

  const handleFullScreenChart = (roomId: string) => {
    setFullScreenChartRoom(roomId);
  };

  const closeFullScreenChart = () => {
    setFullScreenChartRoom(null);
  };

  return (
    <div className="w-full max-w-[98vw] mx-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        {t("Tobacco Drying Room Control System")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-150px)]">
        {rooms.map((room) => (
          <div key={room.id} className="h-full">
            <RoomCard
              roomId={room.id}
              roomName={room.name}
              onFullScreenChart={handleFullScreenChart}
              onAlertChange={(alerts) =>
                handleRoomAlerts(room.id, room.name, alerts)
              }
            />
          </div>
        ))}
      </div>

      {/* Notification Center */}
      <NotificationCenter
        alerts={systemAlerts}
        onDismissAlert={handleDismissAlert}
      />

      {/* Full-screen chart dialog */}
      <Dialog
        open={fullScreenChartRoom !== null}
        onOpenChange={closeFullScreenChart}
      >
        <DialogContent className="max-w-5xl w-[90vw] h-[80vh] p-6">
          <div className="h-full">
            <h2 className="text-2xl font-bold mb-4">
              {rooms.find((r) => r.id === fullScreenChartRoom)?.name} -{" "}
              {t("Detailed Data Analysis")}
            </h2>
            <div className="h-[calc(100%-3rem)]">
              <InteractiveChart />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomGrid;
