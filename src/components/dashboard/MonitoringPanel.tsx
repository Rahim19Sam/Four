import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";
import {
  Thermometer,
  Droplets,
  AlertTriangle,
  WifiOff,
  DoorOpen,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface SensorData {
  id: number;
  name: string;
  value: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
}

interface MonitoringPanelProps {
  temperatureSensors?: SensorData[];
  humiditySensors?: SensorData[];
  roomName?: string;
  isDoorOpen?: boolean;
  isEmergencyStop?: boolean;
  onAlertChange?: (
    alerts: { id: string; message: string; type: string }[],
  ) => void;
}

const MonitoringPanel = ({
  temperatureSensors: initialTempSensors = [
    {
      id: 1,
      name: "Sensor 1",
      value: 65.2,
      unit: "°C",
      minThreshold: 60,
      maxThreshold: 70,
    },
    {
      id: 2,
      name: "Sensor 2",
      value: 68.7,
      unit: "°C",
      minThreshold: 60,
      maxThreshold: 70,
    },
    {
      id: 3,
      name: "Sensor 3",
      value: 72.1,
      unit: "°C",
      minThreshold: 60,
      maxThreshold: 70,
    },
    {
      id: 4,
      name: "Sensor 4",
      value: 67.5,
      unit: "°C",
      minThreshold: 60,
      maxThreshold: 70,
    },
  ],
  humiditySensors: initialHumSensors = [
    {
      id: 1,
      name: "Humidity 1",
      value: 45,
      unit: "%",
      minThreshold: 40,
      maxThreshold: 60,
    },
    {
      id: 2,
      name: "Humidity 2",
      value: 58,
      unit: "%",
      minThreshold: 40,
      maxThreshold: 60,
    },
  ],
  roomName = "Drying Room",
  isDoorOpen = false,
  isEmergencyStop = false,
  onAlertChange = () => {},
}: MonitoringPanelProps) => {
  const { t } = useTranslation();
  const [temperatureSensors, setTemperatureSensors] =
    useState<SensorData[]>(initialTempSensors);
  const [humiditySensors, setHumiditySensors] =
    useState<SensorData[]>(initialHumSensors);
  const [alerts, setAlerts] = useState<
    { id: string; message: string; type: string }[]
  >([]);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(true);

  // Simulate sensor data changes
  useEffect(() => {
    const simulationInterval = setInterval(() => {
      // Randomly update temperature sensors
      setTemperatureSensors((prev) =>
        prev.map((sensor) => ({
          ...sensor,
          value: Math.max(
            sensor.minThreshold - 5,
            Math.min(
              sensor.maxThreshold + 5,
              sensor.value + (Math.random() * 2 - 1) * 0.5,
            ),
          ),
        })),
      );

      // Randomly update humidity sensors
      setHumiditySensors((prev) =>
        prev.map((sensor) => ({
          ...sensor,
          value: Math.max(
            sensor.minThreshold - 5,
            Math.min(
              sensor.maxThreshold + 5,
              sensor.value + (Math.random() * 2 - 1) * 0.8,
            ),
          ),
        })),
      );

      // Randomly simulate connection issues (1% chance)
      if (Math.random() < 0.01) {
        setConnectionStatus((prev) => !prev);
      }
    }, 2000);

    return () => clearInterval(simulationInterval);
  }, []);

  // Check for out-of-range conditions and generate alerts
  useEffect(() => {
    const newAlerts: { id: string; message: string; type: string }[] = [];

    // Add door open alert
    if (isDoorOpen) {
      newAlerts.push({
        id: `door-open`,
        message: `${roomName}: Door is open. All devices stopped.`,
        type: "warning",
      });
    }

    // Add emergency stop alert
    if (isEmergencyStop) {
      newAlerts.push({
        id: `emergency-stop`,
        message: `${roomName}: Emergency stop activated. All systems shut down.`,
        type: "error",
      });
    }

    // Add connection status alert
    if (!connectionStatus) {
      newAlerts.push({
        id: `connection-error`,
        message: `${roomName}: Communication error. Check network connection.`,
        type: "error",
      });
    }

    // Add temperature alerts
    temperatureSensors.forEach((sensor) => {
      if (sensor.value < sensor.minThreshold) {
        newAlerts.push({
          id: `temp-${sensor.id}-low`,
          message: `${roomName}: ${sensor.name} temperature too low: ${sensor.value.toFixed(1)}${sensor.unit}`,
          type: "warning",
        });
      } else if (sensor.value > sensor.maxThreshold) {
        newAlerts.push({
          id: `temp-${sensor.id}-high`,
          message: `${roomName}: ${sensor.name} temperature too high: ${sensor.value.toFixed(1)}${sensor.unit}`,
          type: "error",
        });
      }
    });

    // Add humidity alerts
    humiditySensors.forEach((sensor) => {
      if (sensor.value < sensor.minThreshold) {
        newAlerts.push({
          id: `hum-${sensor.id}-low`,
          message: `${roomName}: ${sensor.name} humidity too low: ${sensor.value.toFixed(1)}${sensor.unit}`,
          type: "warning",
        });
      } else if (sensor.value > sensor.maxThreshold) {
        newAlerts.push({
          id: `hum-${sensor.id}-high`,
          message: `${roomName}: ${sensor.name} humidity too high: ${sensor.value.toFixed(1)}${sensor.unit}`,
          type: "error",
        });
      }
    });

    setAlerts(newAlerts);
    onAlertChange(newAlerts);
  }, [
    temperatureSensors,
    humiditySensors,
    isDoorOpen,
    isEmergencyStop,
    connectionStatus,
    roomName,
    onAlertChange,
  ]);

  const getProgressColor = (value: number, min: number, max: number) => {
    if (value < min || value > max) return "bg-red-500";
    if (value < min + (max - min) * 0.2 || value > max - (max - min) * 0.2)
      return "bg-amber-500";
    return "bg-green-500";
  };

  const getProgressValue = (value: number, min: number, max: number) => {
    // Calculate percentage within range (clamped between 0-100)
    const range = max - min;
    const percentage = ((value - min) / range) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          {!connectionStatus && (
            <WifiOff className="mr-2 h-5 w-5 text-red-500 animate-pulse" />
          )}
          {isDoorOpen && (
            <DoorOpen className="mr-2 h-5 w-5 text-amber-500 animate-pulse" />
          )}
          {t("Real-time Monitoring")}
        </h2>
        <div className="flex items-center">
          <div
            className={`h-3 w-3 rounded-full mr-2 ${connectionStatus ? "bg-green-500" : "bg-red-500 animate-pulse"}`}
          ></div>
          <span className="text-sm font-medium">
            {connectionStatus ? t("Connected") : t("Connection Error")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <Card className="bg-gradient-to-br from-orange-50 to-white border border-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Thermometer className="mr-2 h-5 w-5 text-red-500 animate-pulse" />
              {t("Temperature Monitoring")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {temperatureSensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className="space-y-2 p-3 rounded-lg bg-white border border-orange-50 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">{sensor.name}</span>
                    <span
                      className={`text-lg font-bold ${sensor.value < sensor.minThreshold || sensor.value > sensor.maxThreshold ? "text-red-500 animate-pulse" : "text-gray-700"}`}
                    >
                      {sensor.value.toFixed(1)}
                      {sensor.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 min-w-10 text-right">
                      {sensor.minThreshold}
                      {sensor.unit}
                    </span>
                    <Progress
                      value={getProgressValue(
                        sensor.value,
                        sensor.minThreshold,
                        sensor.maxThreshold,
                      )}
                      className={`h-3 transition-all duration-300 ${getProgressColor(sensor.value, sensor.minThreshold, sensor.maxThreshold)}`}
                    />
                    <span className="text-xs text-gray-500 min-w-10">
                      {sensor.maxThreshold}
                      {sensor.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Droplets className="mr-2 h-5 w-5 text-blue-500 animate-pulse" />
              {t("Humidity Monitoring")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {humiditySensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className="space-y-2 p-3 rounded-lg bg-white border border-blue-50 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">{sensor.name}</span>
                    <span
                      className={`text-lg font-bold ${sensor.value < sensor.minThreshold || sensor.value > sensor.maxThreshold ? "text-red-500 animate-pulse" : "text-gray-700"}`}
                    >
                      {sensor.value.toFixed(1)}
                      {sensor.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 min-w-10 text-right">
                      {sensor.minThreshold}
                      {sensor.unit}
                    </span>
                    <Progress
                      value={getProgressValue(
                        sensor.value,
                        sensor.minThreshold,
                        sensor.maxThreshold,
                      )}
                      className={`h-3 transition-all duration-300 ${getProgressColor(sensor.value, sensor.minThreshold, sensor.maxThreshold)}`}
                    />
                    <span className="text-xs text-gray-500 min-w-10">
                      {sensor.maxThreshold}
                      {sensor.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-100 rounded-lg">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={alert.type === "error" ? "destructive" : "default"}
              className={`${alert.type === "error" ? "bg-red-50 text-red-800 border-red-200" : "bg-amber-50 text-amber-800 border-amber-200"} animate-pulse`}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {alert.type === "error" ? t("Error") : t("Warning")}
              </AlertTitle>
              <AlertDescription>{t(alert.message)}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonitoringPanel;
