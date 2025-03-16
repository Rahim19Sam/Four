import React, { useEffect, useRef, useState } from "react";
import { Thermometer, Droplets } from "lucide-react";

interface TemperatureAnimationProps {
  roomId: string;
}

const TemperatureAnimation: React.FC<TemperatureAnimationProps> = ({
  roomId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);

  // Generate random data for the animation
  const generateData = () => {
    const baseTemp = 65 + Math.random() * 10;
    const baseHumidity = 45 + Math.random() * 15;

    const data = [];
    for (let i = 0; i < 100; i++) {
      const timeOffset = i / 100;
      // Create wave patterns with some randomness
      const temp =
        baseTemp +
        Math.sin(timeOffset * Math.PI * 2) * 3 +
        (Math.random() - 0.5) * 2;
      const humidity =
        baseHumidity +
        Math.cos(timeOffset * Math.PI * 2) * 5 +
        (Math.random() - 0.5) * 3;
      data.push({ temp, humidity, time: timeOffset });
    }
    return data;
  };

  const [data] = useState(generateData());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up animation loop
    const animationFrame = requestAnimationFrame(function animate() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(255, 248, 240, 0.8)");
      gradient.addColorStop(1, "rgba(240, 249, 255, 0.8)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw temperature line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - (data[0].temp - 60) * (canvas.height / 20));

      // Draw temperature area
      const tempGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      tempGradient.addColorStop(0, "rgba(255, 99, 132, 0.3)");
      tempGradient.addColorStop(1, "rgba(255, 99, 132, 0.0)");

      for (let i = 0; i < data.length; i++) {
        const x = i * (canvas.width / data.length);
        const y = canvas.height - (data[i].temp - 60) * (canvas.height / 20);
        ctx.lineTo(x, y);
      }

      // Complete temperature area
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fillStyle = tempGradient;
      ctx.fill();

      // Draw temperature line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - (data[0].temp - 60) * (canvas.height / 20));

      for (let i = 0; i < data.length; i++) {
        const x = i * (canvas.width / data.length);
        const y = canvas.height - (data[i].temp - 60) * (canvas.height / 20);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(255, 99, 132, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw humidity line
      ctx.beginPath();
      ctx.moveTo(
        0,
        canvas.height - (data[0].humidity - 30) * (canvas.height / 50),
      );

      for (let i = 0; i < data.length; i++) {
        const x = i * (canvas.width / data.length);
        const y =
          canvas.height - (data[i].humidity - 30) * (canvas.height / 50);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(54, 162, 235, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw animated cursor
      const cursorPosition = Math.floor(time * data.length) % data.length;
      if (cursorPosition >= 0 && cursorPosition < data.length) {
        const x = cursorPosition * (canvas.width / data.length);
        const tempY =
          canvas.height -
          (data[cursorPosition].temp - 60) * (canvas.height / 20);
        const humidityY =
          canvas.height -
          (data[cursorPosition].humidity - 30) * (canvas.height / 50);

        // Temperature point
        ctx.beginPath();
        ctx.arc(x, tempY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 99, 132, 1)";
        ctx.fill();

        // Humidity point
        ctx.beginPath();
        ctx.arc(x, humidityY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(54, 162, 235, 1)";
        ctx.fill();

        // Draw current values
        ctx.font = "12px Arial";
        ctx.fillStyle = "rgba(255, 99, 132, 1)";
        ctx.fillText(
          `${data[cursorPosition].temp.toFixed(1)}°C`,
          x + 10,
          tempY - 10,
        );

        ctx.fillStyle = "rgba(54, 162, 235, 1)";
        ctx.fillText(
          `${data[cursorPosition].humidity.toFixed(1)}%`,
          x + 10,
          humidityY - 10,
        );
      }

      // Update time
      setTime((prev) => prev + 0.001);

      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [data, time]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
        <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-md shadow-sm">
          <Thermometer className="h-4 w-4 text-red-500" />
          <span className="text-xs font-medium">Temperature</span>
        </div>
        <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-md shadow-sm">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-medium">Humidity</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={400}
        height={200}
      />
    </div>
  );
};

export default TemperatureAnimation;
