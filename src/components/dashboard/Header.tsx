import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, ThermometerSun, Activity } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface HeaderProps {
  title?: string;
  date?: Date;
  systemStatus?: "online" | "offline" | "warning";
}

const Header = ({
  title = "Tobacco Drying Room Control System",
  date = new Date(),
  systemStatus = "online",
}: HeaderProps) => {
  const { t, language } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : language === "fr" ? "fr-FR" : "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  ).format(currentTime);

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-red-500",
    warning: "bg-yellow-500",
  };

  const statusText = {
    online: "System Online",
    offline: "System Offline",
    warning: "System Warning",
  };

  return (
    <Card className="w-full p-4 shadow-md bg-white border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <ThermometerSun className="h-8 w-8 text-amber-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-slate-800">{t(title)}</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-600 animate-pulse" />
            <span className="text-sm text-slate-600">{formattedDate}</span>
          </div>

          <Badge
            variant="outline"
            className={`flex items-center gap-1 px-3 py-1 ${statusColors[systemStatus]} transition-all duration-300 hover:scale-105`}
          >
            <Activity className="h-4 w-4 text-white animate-pulse" />
            <span className="text-white font-medium">
              {t(statusText[systemStatus])}
            </span>
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default Header;
