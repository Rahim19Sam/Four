import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Thermometer, Droplets, Fan, Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface ControlPanelProps {
  onHeaterToggle?: (index: number, state: boolean) => void;
  onAirDryerToggle?: (state: boolean) => void;
  onFanToggle?: (index: number, state: boolean) => void;
  onTargetTempChange?: (value: number) => void;
  onTargetHumidityChange?: (value: number) => void;
  onDryingTimeChange?: (value: number) => void;
  isManualMode?: boolean;
  isDoorOpen?: boolean;
  isEmergencyStop?: boolean;
  onTimerSync?: (hours: number) => void;
}

const ControlPanel = ({
  onHeaterToggle = () => {},
  onAirDryerToggle = () => {},
  onFanToggle = () => {},
  onTargetTempChange = () => {},
  onTargetHumidityChange = () => {},
  onDryingTimeChange = () => {},
  onTimerSync = () => {},
  isManualMode = true,
  isDoorOpen = false,
  isEmergencyStop = false,
}: ControlPanelProps) => {
  const { t } = useTranslation();

  // State for device controls
  const [heaters, setHeaters] = useState([false, false, false, false]);
  const [airDryer, setAirDryer] = useState(false);
  const [fans, setFans] = useState([false, false]);

  // State for target parameters
  const [targetTemp, setTargetTemp] = useState(60);
  const [targetHumidity, setTargetHumidity] = useState(45);
  const [dryingTime, setDryingTime] = useState(1440); // Changed to minutes (24 hours * 60)

  // Load saved device states from localStorage on component mount
  useEffect(() => {
    const roomId = localStorage.getItem("currentRoomId");
    if (roomId) {
      const savedDeviceStates = localStorage.getItem(`${roomId}-device-states`);
      if (savedDeviceStates) {
        try {
          const parsedStates = JSON.parse(savedDeviceStates);
          setHeaters(parsedStates.heaters || [false, false, false, false]);
          setAirDryer(parsedStates.airDryer || false);
          setFans(parsedStates.fans || [false, false]);
          setTargetTemp(parsedStates.targetTemp || 60);
          setTargetHumidity(parsedStates.targetHumidity || 45);
          setDryingTime(parsedStates.dryingTime || 24);
        } catch (e) {
          console.error("Error loading saved device states", e);
        }
      }
    }
  }, []);

  // Effect to handle automatic mode
  useEffect(() => {
    if (!isManualMode) {
      // In automatic mode, activate all heaters and air dryer, but not fans
      const newHeaters = [true, true, true, true];
      setHeaters(newHeaters);
      setAirDryer(true);

      // Notify parent components about device states
      newHeaters.forEach((state, index) => {
        onHeaterToggle(index, state);
      });
      onAirDryerToggle(true);

      // Sync timer with drying time (convert minutes to hours)
      onTimerSync(dryingTime / 60);

      // Save the current state to localStorage
      saveDeviceStates();
    }
  }, [isManualMode, dryingTime, onHeaterToggle, onAirDryerToggle, onTimerSync]);

  // Save device states to localStorage
  const saveDeviceStates = () => {
    const roomId = localStorage.getItem("currentRoomId");
    if (roomId) {
      const deviceStates = {
        heaters,
        airDryer,
        fans,
        targetTemp,
        targetHumidity,
        dryingTime,
      };
      localStorage.setItem(
        `${roomId}-device-states`,
        JSON.stringify(deviceStates),
      );
    }
  };

  // Effect to handle door open or emergency stop
  useEffect(() => {
    if (isDoorOpen || isEmergencyStop) {
      // Turn off all devices
      const newHeaters = [false, false, false, false];
      setHeaters(newHeaters);
      setAirDryer(false);
      setFans([false, false]);

      // Notify parent components
      newHeaters.forEach((state, index) => {
        onHeaterToggle(index, state);
      });
      onAirDryerToggle(false);
      fans.forEach((state, index) => {
        onFanToggle(index, state);
      });
    }
  }, [
    isDoorOpen,
    isEmergencyStop,
    onHeaterToggle,
    onAirDryerToggle,
    onFanToggle,
  ]);

  // Handle heater toggle
  const handleHeaterToggle = (index: number) => {
    if (isDoorOpen || isEmergencyStop) return;

    const newHeaters = [...heaters];
    newHeaters[index] = !newHeaters[index];
    setHeaters(newHeaters);
    onHeaterToggle(index, newHeaters[index]);
    saveDeviceStates();
  };

  // Handle air dryer toggle
  const handleAirDryerToggle = () => {
    if (isDoorOpen || isEmergencyStop) return;

    setAirDryer(!airDryer);
    onAirDryerToggle(!airDryer);
    saveDeviceStates();
  };

  // Handle fan toggle
  const handleFanToggle = (index: number) => {
    if (isDoorOpen || isEmergencyStop) return;

    const newFans = [...fans];
    newFans[index] = !newFans[index];
    setFans(newFans);
    onFanToggle(index, newFans[index]);
    saveDeviceStates();
  };

  // Handle target temperature change
  const handleTargetTempChange = (value: number) => {
    setTargetTemp(value);
    onTargetTempChange(value);
    saveDeviceStates();
  };

  // Handle target humidity change
  const handleTargetHumidityChange = (value: number) => {
    setTargetHumidity(value);
    onTargetHumidityChange(value);
    saveDeviceStates();
  };

  // Handle drying time change
  const handleDryingTimeChange = (value: number) => {
    setDryingTime(value);
    onDryingTimeChange(value);
    onTimerSync(value / 60); // Convert minutes to hours for timer sync
    saveDeviceStates();
  };

  return (
    <Card className="w-full h-full bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Thermometer className="mr-2 h-5 w-5 text-orange-500" />
          {t("Control Panel")}
          {(isDoorOpen || isEmergencyStop) && (
            <div className="ml-auto flex items-center text-red-500 animate-pulse">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">
                {isDoorOpen
                  ? t("Door Open - Devices Stopped")
                  : t("Emergency Stop Active")}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Manual Controls Section - Enlarged */}
          <div
            className={`${!isManualMode || isDoorOpen || isEmergencyStop ? "opacity-50 pointer-events-none" : ""}`}
          >
            <h3 className="text-lg font-medium mb-3">{t("Manual Controls")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Heaters */}
              <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-100">
                <p className="text-base font-medium">{t("Heaters")}</p>
                <div className="grid grid-cols-2 gap-3">
                  {heaters.map((active, index) => (
                    <Button
                      key={`heater-${index}`}
                      variant={active ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleHeaterToggle(index)}
                      className={`flex items-center justify-center gap-2 h-16 transition-all duration-300 hover:scale-105 ${active ? "bg-orange-500 hover:bg-orange-600" : "border-orange-300"}`}
                    >
                      <div className="relative">
                        <Thermometer
                          className={`h-6 w-6 transition-all duration-300 ${active ? "text-white animate-pulse scale-110" : "text-orange-500"}`}
                        />
                        {active && (
                          <div className="absolute -inset-1 bg-orange-300 rounded-full opacity-30 animate-ping"></div>
                        )}
                      </div>
                      <span className="text-base font-medium">
                        {t("Heater")} {index + 1}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Air Dryer */}
              <div className="space-y-2 p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
                <p className="text-base font-medium">{t("Air Dryer")}</p>
                <Button
                  variant={airDryer ? "default" : "outline"}
                  size="lg"
                  onClick={handleAirDryerToggle}
                  className={`flex items-center justify-center gap-2 h-16 w-full transition-all duration-300 hover:scale-105 ${airDryer ? "bg-blue-500 hover:bg-blue-600" : "border-blue-300"}`}
                >
                  <div className="relative">
                    <Droplets
                      className={`h-6 w-6 transition-all duration-300 ${airDryer ? "text-white animate-pulse scale-110" : "text-blue-500"}`}
                    />
                    {airDryer && (
                      <div className="absolute -inset-1 bg-blue-300 rounded-full opacity-30 animate-ping"></div>
                    )}
                  </div>
                  <span className="text-base font-medium">
                    {airDryer ? t("ON") : t("OFF")}
                  </span>
                </Button>
              </div>

              {/* Fans - Isolated */}
              <div className="space-y-2 p-4 bg-gradient-to-br from-cyan-50 to-white rounded-lg border border-cyan-100">
                <p className="text-base font-medium">{t("Fans")}</p>
                <div className="grid grid-cols-2 gap-3">
                  {fans.map((active, index) => (
                    <Button
                      key={`fan-${index}`}
                      variant={active ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleFanToggle(index)}
                      className={`flex items-center justify-center gap-2 h-16 transition-all duration-300 hover:scale-105 ${active ? "bg-cyan-500 hover:bg-cyan-600" : "border-cyan-300"}`}
                    >
                      <div className="relative">
                        <Fan
                          className={`h-6 w-6 transition-all duration-300 ${active ? "text-white animate-spin" : "text-cyan-500"}`}
                        />
                        {active && (
                          <div className="absolute -inset-1 bg-cyan-300 rounded-full opacity-30 animate-ping"></div>
                        )}
                      </div>
                      <span className="text-base font-medium">
                        {t("Fan")} {index + 1}
                      </span>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Target Temperature */}
              <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
                    <p className="text-base font-medium">
                      {t("Target Temperature")}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-orange-600">
                    {targetTemp}°C
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[targetTemp]}
                    min={20}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleTargetTempChange(value[0])}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    value={targetTemp}
                    onChange={(e) =>
                      handleTargetTempChange(Number(e.target.value))
                    }
                    min={20}
                    max={100}
                    className="w-24 h-10 transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:scale-105"
                  />
                  <span className="text-base self-center font-medium">°C</span>
                </div>
              </div>

              {/* Target Humidity */}
              <div className="space-y-2 p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                    <p className="text-base font-medium">
                      {t("Target Humidity")}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {targetHumidity}%
                  </p>
                </div>
                <div className="flex items-center gap-4">
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
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    value={targetHumidity}
                    onChange={(e) =>
                      handleTargetHumidityChange(Number(e.target.value))
                    }
                    min={10}
                    max={90}
                    className="w-24 h-10 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105"
                  />
                  <span className="text-base self-center font-medium">%</span>
                </div>
              </div>

              {/* Drying Time - Changed to minutes */}
              <div className="space-y-2 p-4 bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    <p className="text-base font-medium">{t("Drying Time")}</p>
                  </div>
                  <p className="text-lg font-bold text-amber-600">
                    {dryingTime} {t("minutes")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[dryingTime]}
                    min={60}
                    max={4320}
                    step={30}
                    onValueChange={(value) => handleDryingTimeChange(value[0])}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    value={dryingTime}
                    onChange={(e) =>
                      handleDryingTimeChange(Number(e.target.value))
                    }
                    min={60}
                    max={4320}
                    step={30}
                    className="w-24 h-10 transition-all duration-300 focus:ring-2 focus:ring-amber-500 focus:scale-105"
                  />
                  <span className="text-base self-center font-medium">
                    {t("minutes")}
                  </span>
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
