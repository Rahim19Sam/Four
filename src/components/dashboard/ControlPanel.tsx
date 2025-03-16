import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Thermometer, Droplets, Fan, Clock } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface ControlPanelProps {
  onHeaterToggle?: (index: number, state: boolean) => void;
  onAirDryerToggle?: (state: boolean) => void;
  onFanToggle?: (index: number, state: boolean) => void;
  onTargetTempChange?: (value: number) => void;
  onTargetHumidityChange?: (value: number) => void;
  onDryingTimeChange?: (value: number) => void;
  isManualMode?: boolean;
}

const ControlPanel = ({
  onHeaterToggle = () => {},
  onAirDryerToggle = () => {},
  onFanToggle = () => {},
  onTargetTempChange = () => {},
  onTargetHumidityChange = () => {},
  onDryingTimeChange = () => {},
  isManualMode = true,
}: ControlPanelProps) => {
  const { t } = useTranslation();

  // State for device controls
  const [heaters, setHeaters] = useState([false, false]);
  const [airDryer, setAirDryer] = useState(false);
  const [fans, setFans] = useState([false, false]);

  // State for target parameters
  const [targetTemp, setTargetTemp] = useState(60);
  const [targetHumidity, setTargetHumidity] = useState(45);
  const [dryingTime, setDryingTime] = useState(24);

  // Handle heater toggle
  const handleHeaterToggle = (index: number) => {
    const newHeaters = [...heaters];
    newHeaters[index] = !newHeaters[index];
    setHeaters(newHeaters);
    onHeaterToggle(index, newHeaters[index]);
  };

  // Handle air dryer toggle
  const handleAirDryerToggle = () => {
    setAirDryer(!airDryer);
    onAirDryerToggle(!airDryer);
  };

  // Handle fan toggle
  const handleFanToggle = (index: number) => {
    const newFans = [...fans];
    newFans[index] = !newFans[index];
    setFans(newFans);
    onFanToggle(index, newFans[index]);
  };

  // Handle target temperature change
  const handleTargetTempChange = (value: number) => {
    setTargetTemp(value);
    onTargetTempChange(value);
  };

  // Handle target humidity change
  const handleTargetHumidityChange = (value: number) => {
    setTargetHumidity(value);
    onTargetHumidityChange(value);
  };

  // Handle drying time change
  const handleDryingTimeChange = (value: number) => {
    setDryingTime(value);
    onDryingTimeChange(value);
  };

  return (
    <Card className="w-full h-full bg-white border border-gray-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {t("Control Panel")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Manual Controls Section */}
          <div
            className={`${!isManualMode ? "opacity-50 pointer-events-none" : ""}`}
          >
            <h3 className="text-lg font-medium mb-3">{t("Manual Controls")}</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {/* Heaters */}
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("Heaters")}</p>
                <div className="flex space-x-2">
                  {heaters.map((active, index) => (
                    <Button
                      key={`heater-${index}`}
                      variant={active ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleHeaterToggle(index)}
                      className="flex items-center gap-2 transition-all duration-300 hover:scale-110"
                    >
                      <Thermometer className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                      <span>{index + 1}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Air Dryer */}
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("Air Dryer")}</p>
                <Button
                  variant={airDryer ? "default" : "outline"}
                  size="sm"
                  onClick={handleAirDryerToggle}
                  className="flex items-center gap-2 transition-all duration-300 hover:scale-110"
                >
                  <Droplets className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                  <span>{airDryer ? t("ON") : t("OFF")}</span>
                </Button>
              </div>

              {/* Fans */}
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("Fans")}</p>
                <div className="flex space-x-2">
                  {fans.map((active, index) => (
                    <Button
                      key={`fan-${index}`}
                      variant={active ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFanToggle(index)}
                      className="flex items-center gap-2 transition-all duration-300 hover:scale-110 group"
                    >
                      <Fan className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                      <span>{index + 1}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Target Parameters Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">
              {t("Target Parameters")}
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Target Temperature */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">
                    {t("Target Temperature")}
                  </p>
                  <p className="text-sm font-medium">{targetTemp}°C</p>
                </div>
                <div className="flex items-center gap-4">
                  <Thermometer className="h-4 w-4 text-orange-500 animate-pulse" />
                  <Slider
                    value={[targetTemp]}
                    min={20}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleTargetTempChange(value[0])}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={targetTemp}
                    onChange={(e) =>
                      handleTargetTempChange(Number(e.target.value))
                    }
                    min={20}
                    max={100}
                    className="w-20 h-8 transition-all duration-300 focus:ring-2 focus:ring-primary focus:scale-105"
                  />
                  <span className="text-sm self-center">°C</span>
                </div>
              </div>

              {/* Target Humidity */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{t("Target Humidity")}</p>
                  <p className="text-sm font-medium">{targetHumidity}%</p>
                </div>
                <div className="flex items-center gap-4">
                  <Droplets className="h-4 w-4 text-blue-500 animate-pulse" />
                  <Slider
                    value={[targetHumidity]}
                    min={10}
                    max={90}
                    step={1}
                    onValueChange={(value) =>
                      handleTargetHumidityChange(value[0])
                    }
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={targetHumidity}
                    onChange={(e) =>
                      handleTargetHumidityChange(Number(e.target.value))
                    }
                    min={10}
                    max={90}
                    className="w-20 h-8 transition-all duration-300 focus:ring-2 focus:ring-primary focus:scale-105"
                  />
                  <span className="text-sm self-center">%</span>
                </div>
              </div>

              {/* Drying Time */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{t("Drying Time")}</p>
                  <p className="text-sm font-medium">
                    {dryingTime} {t("hours")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="h-4 w-4 text-gray-500 animate-pulse" />
                  <Slider
                    value={[dryingTime]}
                    min={1}
                    max={72}
                    step={1}
                    onValueChange={(value) => handleDryingTimeChange(value[0])}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={dryingTime}
                    onChange={(e) =>
                      handleDryingTimeChange(Number(e.target.value))
                    }
                    min={1}
                    max={72}
                    className="w-20 h-8 transition-all duration-300 focus:ring-2 focus:ring-primary focus:scale-105"
                  />
                  <span className="text-sm self-center">{t("hours")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
