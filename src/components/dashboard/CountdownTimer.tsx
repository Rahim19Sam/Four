import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Clock, Bell, BellOff, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "../../hooks/useTranslation";

interface CountdownTimerProps {
  initialHours?: number;
  initialMinutes?: number;
  onComplete?: () => void;
  isRunning?: boolean;
  isAutoMode?: boolean;
  isDoorOpen?: boolean;
  isEmergencyStop?: boolean;
  onTimerUpdate?: (remainingSeconds: number) => void;
}

const CountdownTimer = ({
  initialHours = 24,
  initialMinutes = 0,
  onComplete = () => {},
  isRunning = false,
  isAutoMode = false,
  isDoorOpen = false,
  isEmergencyStop = false,
  onTimerUpdate = () => {},
}: CountdownTimerProps) => {
  const { t } = useTranslation();
  const [totalSeconds, setTotalSeconds] = useState(
    initialHours * 3600 + initialMinutes * 60,
  );
  const [running, setRunning] = useState(isRunning);
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmMuted, setAlarmMuted] = useState(false);
  const [estimatedEndTime, setEstimatedEndTime] = useState<Date | null>(null);

  // Update running state when isAutoMode changes
  useEffect(() => {
    if (isAutoMode && !isDoorOpen && !isEmergencyStop) {
      setRunning(true);
    } else if (!isAutoMode) {
      setRunning(false);
    }
  }, [isAutoMode, isDoorOpen, isEmergencyStop]);

  // Stop timer if door is opened or emergency stop is activated
  useEffect(() => {
    if (isDoorOpen || isEmergencyStop) {
      setRunning(false);
    }
  }, [isDoorOpen, isEmergencyStop]);

  // Update timer when initialHours changes
  useEffect(() => {
    if (!running) {
      setTotalSeconds(initialHours * 3600 + initialMinutes * 60);
    }
  }, [initialHours, initialMinutes, running]);

  // Calculate estimated end time
  useEffect(() => {
    if (running && totalSeconds > 0) {
      const endTime = new Date();
      endTime.setSeconds(endTime.getSeconds() + totalSeconds);
      setEstimatedEndTime(endTime);
    } else if (!running || totalSeconds === 0) {
      setEstimatedEndTime(null);
    }
  }, [running, totalSeconds]);

  // Timer countdown logic
  useEffect(() => {
    let interval: number | undefined;

    if (running && totalSeconds > 0) {
      interval = window.setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setRunning(false);
            setAlarmActive(true);
            onComplete();
            return 0;
          }
          const newValue = prev - 1;
          onTimerUpdate(newValue);
          return newValue;
        });
      }, 1000);
    } else if (totalSeconds === 0 && !alarmMuted) {
      setAlarmActive(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, totalSeconds, onComplete, alarmMuted, onTimerUpdate]);

  // Format time as HH:MM:SS
  const formatTime = () => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Format estimated end time
  const formatEndTime = () => {
    if (!estimatedEndTime) return "--:--";
    return estimatedEndTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const progressPercentage = () => {
    const initialTotal = initialHours * 3600 + initialMinutes * 60;
    return (totalSeconds / initialTotal) * 100;
  };

  const toggleTimer = () => {
    if (isDoorOpen || isEmergencyStop) return;

    const newRunningState = !running;
    setRunning(newRunningState);
    if (totalSeconds === 0) {
      setTotalSeconds(initialHours * 3600 + initialMinutes * 60);
    }
  };

  const resetTimer = () => {
    setRunning(false);
    setTotalSeconds(initialHours * 3600 + initialMinutes * 60);
    setAlarmActive(false);
    onTimerUpdate(initialHours * 3600 + initialMinutes * 60);
  };

  const toggleAlarm = () => {
    setAlarmMuted(!alarmMuted);
    setAlarmActive(false);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Clock className="mr-2 h-5 w-5 text-amber-500 animate-pulse" />
          {t("Drying Countdown")}
          {alarmActive && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto animate-bounce text-red-500"
              onClick={toggleAlarm}
            >
              {alarmMuted ? (
                <BellOff className="h-5 w-5" />
              ) : (
                <Bell className="h-5 w-5" />
              )}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-white rounded-lg border border-amber-100 shadow-sm">
            <div
              className={`text-4xl font-bold ${alarmActive && !alarmMuted ? "text-red-500 animate-pulse" : "text-amber-600"}`}
            >
              {formatTime()}
            </div>

            {estimatedEndTime && (
              <div className="text-sm text-gray-500 mt-2">
                {t("Estimated completion")}: {formatEndTime()}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{t("Progress")}:</span>
              <span>{Math.round(progressPercentage())}%</span>
            </div>
            <Progress
              value={progressPercentage()}
              className="h-3 bg-gray-200"
              indicatorClassName={`${alarmActive && !alarmMuted ? "animate-pulse bg-red-500" : running ? "bg-green-500" : "bg-amber-500"}`}
            />
          </div>

          <div className="flex justify-center space-x-3">
            <Button
              onClick={toggleTimer}
              disabled={isDoorOpen || isEmergencyStop || isAutoMode}
              className={`transition-all duration-300 hover:scale-105 h-12 ${running ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} ${isDoorOpen || isEmergencyStop || isAutoMode ? "opacity-50 cursor-not-allowed" : ""}`}
              size="lg"
            >
              {running ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  {t("Pause")}
                </>
              ) : totalSeconds === 0 ? (
                <>
                  <RotateCcw className="mr-2 h-5 w-5" />
                  {t("Restart")}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  {t("Start")}
                </>
              )}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              disabled={isDoorOpen || isEmergencyStop || isAutoMode}
              className={`transition-all duration-300 hover:scale-105 h-12 ${isDoorOpen || isEmergencyStop || isAutoMode ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              {t("Reset")}
            </Button>
          </div>

          {isAutoMode && (
            <div className="text-center text-sm bg-blue-50 p-2 rounded-lg border border-blue-100">
              {t("Automatic mode active - timer controlled by system")}
            </div>
          )}

          {(isDoorOpen || isEmergencyStop) && (
            <div className="text-center text-sm bg-red-50 p-2 rounded-lg border border-red-100 text-red-700">
              {isDoorOpen
                ? t("Timer paused - Door is open")
                : t("Timer paused - Emergency stop active")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
