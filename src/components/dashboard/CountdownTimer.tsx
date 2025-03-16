import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Clock, Bell, BellOff } from "lucide-react";
import { Button } from "../ui/button";

interface CountdownTimerProps {
  initialHours?: number;
  initialMinutes?: number;
  onComplete?: () => void;
  isRunning?: boolean;
}

const CountdownTimer = ({
  initialHours = 24,
  initialMinutes = 0,
  onComplete = () => {},
  isRunning = false,
}: CountdownTimerProps) => {
  const [totalSeconds, setTotalSeconds] = useState(
    initialHours * 3600 + initialMinutes * 60,
  );
  const [running, setRunning] = useState(isRunning);
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmMuted, setAlarmMuted] = useState(false);

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
          return prev - 1;
        });
      }, 1000);
    } else if (totalSeconds === 0 && !alarmMuted) {
      setAlarmActive(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, totalSeconds, onComplete, alarmMuted]);

  // Format time as HH:MM:SS
  const formatTime = () => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = () => {
    const initialTotal = initialHours * 3600 + initialMinutes * 60;
    return (totalSeconds / initialTotal) * 100;
  };

  const toggleTimer = () => {
    setRunning(!running);
    if (totalSeconds === 0) {
      setTotalSeconds(initialHours * 3600 + initialMinutes * 60);
    }
  };

  const resetTimer = () => {
    setRunning(false);
    setTotalSeconds(initialHours * 3600 + initialMinutes * 60);
    setAlarmActive(false);
  };

  const toggleAlarm = () => {
    setAlarmMuted(!alarmMuted);
    setAlarmActive(false);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 border-none shadow-none overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Clock className="mr-2 h-5 w-5 text-amber-500 animate-pulse" />
          Drying Countdown
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
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${alarmActive && !alarmMuted ? "text-red-500 animate-pulse" : ""}`}
            >
              {formatTime()}
            </div>
          </div>

          <Progress
            value={progressPercentage()}
            className="h-2 bg-gray-200"
            indicatorClassName={`${alarmActive && !alarmMuted ? "animate-pulse bg-red-500" : "bg-amber-500"}`}
          />

          <div className="flex justify-center space-x-2">
            <Button
              onClick={toggleTimer}
              className={`transition-all duration-300 hover:scale-105 ${running ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
              size="sm"
            >
              {running ? "Pause" : totalSeconds === 0 ? "Restart" : "Start"}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              size="sm"
              className="transition-all duration-300 hover:scale-105"
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
