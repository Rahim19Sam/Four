import React from "react";
import RoomGrid from "./dashboard/RoomGrid";
import { useTranslation } from "../hooks/useTranslation";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <RoomGrid />
    </div>
  );
};

export default Home;
