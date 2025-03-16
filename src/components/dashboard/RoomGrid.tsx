import React, { useState } from "react";
import RoomCard from "./RoomCard";
import { Dialog, DialogContent } from "../ui/dialog";
import InteractiveChart from "./InteractiveChart";

const RoomGrid = () => {
  const [fullScreenChartRoom, setFullScreenChartRoom] = useState<string | null>(
    null,
  );

  const rooms = [
    { id: "room1", name: "Drying Room 1" },
    { id: "room2", name: "Drying Room 2" },
    { id: "room3", name: "Drying Room 3" },
  ];

  const handleFullScreenChart = (roomId: string) => {
    setFullScreenChartRoom(roomId);
  };

  const closeFullScreenChart = () => {
    setFullScreenChartRoom(null);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="h-[500px]">
            <RoomCard
              roomId={room.id}
              roomName={room.name}
              onFullScreenChart={handleFullScreenChart}
            />
          </div>
        ))}
      </div>

      {/* Full-screen chart dialog */}
      <Dialog
        open={fullScreenChartRoom !== null}
        onOpenChange={closeFullScreenChart}
      >
        <DialogContent className="max-w-5xl w-[90vw] h-[80vh] p-6">
          <div className="h-full">
            <h2 className="text-2xl font-bold mb-4">
              {rooms.find((r) => r.id === fullScreenChartRoom)?.name} - Detailed
              Data Analysis
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
