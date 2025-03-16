import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";
import { Thermometer, Droplets, AlertTriangle } from "lucide-react";
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
}

const MonitoringPanel = ({
  temperatureSensors = [
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
  humiditySensors = [
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
}: MonitoringPanelProps) => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<{ id: string; message: string }[]>([]);

  useEffect(() => {
    // Check for out-of-range conditions and generate alerts
    const newAlerts: { id: string; message: string }[] = [];

    temperatureSensors.forEach((sensor) => {
      if (sensor.value < sensor.minThreshold) {
        newAlerts.push({
          id: `temp-${sensor.id}-low`,
          message: `${sensor.name} temperature too low: ${sensor.value}${sensor.unit}`,
        });
      } else if (sensor.value > sensor.maxThreshold) {
        newAlerts.push({
          id: `temp-${sensor.id}-high`,
          message: `${sensor.name} temperature too high: ${sensor.value}${sensor.unit}`,
        });
      }
    });

    humiditySensors.forEach((sensor) => {
      if (sensor.value < sensor.minThreshold) {
        newAlerts.push({
          id: `hum-${sensor.id}-low`,
          message: `${sensor.name} humidity too low: ${sensor.value}${sensor.unit}`,
        });
      } else if (sensor.value > sensor.maxThreshold) {
        newAlerts.push({
          id: `hum-${sensor.id}-high`,
          message: `${sensor.name} humidity too high: ${sensor.value}${sensor.unit}`,
        });
      }
    });

    setAlerts(newAlerts);
  }, [temperatureSensors, humiditySensors]);

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
      <h2 className="text-xl font-bold mb-4">{t("Real-time Monitoring")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="bg-white border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Thermometer className="mr-2 h-5 w-5 text-red-500 animate-pulse" />
              {t("Temperature Monitoring")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {temperatureSensors.map((sensor) => (
                <div key={sensor.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{sensor.name}</span>
                    <span
                      className={`text-sm font-bold ${sensor.value < sensor.minThreshold || sensor.value > sensor.maxThreshold ? "text-red-500 animate-pulse" : "text-gray-700"}`}
                    >
                      {sensor.value}
                      {sensor.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {sensor.minThreshold}
                      {sensor.unit}
                    </span>
                    <Progress
                      value={getProgressValue(
                        sensor.value,
                        sensor.minThreshold,
                        sensor.maxThreshold,
                      )}
                      className={`h-2 transition-all duration-300 ${getProgressColor(sensor.value, sensor.minThreshold, sensor.maxThreshold)}`}
                    />
                    <span className="text-xs text-gray-500">
                      {sensor.maxThreshold}
                      {sensor.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Droplets className="mr-2 h-5 w-5 text-blue-500 animate-pulse" />
              {t("Humidity Monitoring")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {humiditySensors.map((sensor) => (
                <div key={sensor.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{sensor.name}</span>
                    <span
                      className={`text-sm font-bold ${sensor.value < sensor.minThreshold || sensor.value > sensor.maxThreshold ? "text-red-500 animate-pulse" : "text-gray-700"}`}
                    >
                      {sensor.value}
                      {sensor.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {sensor.minThreshold}
                      {sensor.unit}
                    </span>
                    <Progress
                      value={getProgressValue(
                        sensor.value,
                        sensor.minThreshold,
                        sensor.maxThreshold,
                      )}
                      className={`h-2 transition-all duration-300 ${getProgressColor(sensor.value, sensor.minThreshold, sensor.maxThreshold)}`}
                    />
                    <span className="text-xs text-gray-500">
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
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              variant="destructive"
              className="animate-pulse"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t("Warning")}</AlertTitle>
              <AlertDescription>{t(alert.message)}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonitoringPanel;
