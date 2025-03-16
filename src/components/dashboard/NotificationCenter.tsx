import React, { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useTranslation } from "../../hooks/useTranslation";

export interface AlertItem {
  id: string;
  roomId: string;
  roomName: string;
  message: string;
  type: "warning" | "error" | "info";
  timestamp: string;
  dismissed?: boolean;
}

interface NotificationCenterProps {
  alerts?: AlertItem[];
  onDismissAlert?: (alertId: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  alerts = [],
  onDismissAlert = () => {},
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<AlertItem[]>([]);
  const [historicalAlerts, setHistoricalAlerts] = useState<AlertItem[]>([]);
  const [showHistorical, setShowHistorical] = useState(false);

  // Load alerts from localStorage on component mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem("historical-alerts");
    if (savedAlerts) {
      try {
        setHistoricalAlerts(JSON.parse(savedAlerts));
      } catch (e) {
        console.error("Error loading saved alerts", e);
      }
    }
  }, []);

  // Update active alerts when alerts prop changes
  useEffect(() => {
    setActiveAlerts(alerts.filter((alert) => !alert.dismissed));

    // Add new alerts to historical alerts
    const newHistoricalAlerts = [...historicalAlerts];

    alerts.forEach((alert) => {
      if (!historicalAlerts.some((ha) => ha.id === alert.id)) {
        newHistoricalAlerts.push(alert);
      }
    });

    if (newHistoricalAlerts.length !== historicalAlerts.length) {
      setHistoricalAlerts(newHistoricalAlerts);
      localStorage.setItem(
        "historical-alerts",
        JSON.stringify(newHistoricalAlerts),
      );
    }
  }, [alerts]);

  const handleDismiss = (alertId: string) => {
    onDismissAlert(alertId);

    // Update historical alerts
    const updatedHistorical = historicalAlerts.map((alert) =>
      alert.id === alertId ? { ...alert, dismissed: true } : alert,
    );

    setHistoricalAlerts(updatedHistorical);
    localStorage.setItem(
      "historical-alerts",
      JSON.stringify(updatedHistorical),
    );
  };

  const handleClearAll = () => {
    activeAlerts.forEach((alert) => onDismissAlert(alert.id));
  };

  const handleClearHistory = () => {
    setHistoricalAlerts([]);
    localStorage.removeItem("historical-alerts");
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-amber-200 bg-amber-50";
      case "info":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-white shadow-lg hover:shadow-xl border border-gray-200 p-0 relative transition-all duration-300 hover:scale-105"
          variant="outline"
        >
          <Bell className="h-6 w-6 text-gray-700" />
          {activeAlerts.length > 0 && (
            <Badge
              className="absolute -top-2 -right-2 bg-red-500 text-white animate-pulse"
              variant="destructive"
            >
              {activeAlerts.length}
            </Badge>
          )}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl w-[90vw] max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("Notification Center")}
                {activeAlerts.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {activeAlerts.length}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistorical(!showHistorical)}
                >
                  {showHistorical ? t("Current Alerts") : t("Alert History")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={showHistorical ? handleClearHistory : handleClearAll}
                >
                  {showHistorical ? t("Clear History") : t("Clear All")}
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {showHistorical
                ? t("View and manage all historical alerts")
                : t("View and manage current system alerts")}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-3 p-1">
              {(showHistorical ? historicalAlerts : activeAlerts).length > 0 ? (
                (showHistorical ? historicalAlerts : activeAlerts).map(
                  (alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getAlertColor(alert.type)} ${alert.dismissed ? "opacity-60" : ""}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                          {getAlertIcon(alert.type)}
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {alert.roomName}
                              <span className="text-xs font-normal text-gray-500">
                                {new Date(alert.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{t(alert.message)}</p>
                          </div>
                        </div>
                        {!alert.dismissed && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDismiss(alert.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {showHistorical
                    ? t("No historical alerts")
                    : t("No active alerts")}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationCenter;
