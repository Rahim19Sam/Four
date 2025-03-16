import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ZoomIn, ZoomOut, MoveHorizontal, RefreshCw } from "lucide-react";

interface DataPoint {
  timestamp: string;
  value: number;
}

interface ChartData {
  temperature: {
    sensor1: DataPoint[];
    sensor2: DataPoint[];
    sensor3: DataPoint[];
    sensor4: DataPoint[];
  };
  humidity: {
    sensor1: DataPoint[];
    sensor2: DataPoint[];
  };
}

interface InteractiveChartProps {
  data?: ChartData;
  onTimeRangeChange?: (range: string) => void;
  onRefresh?: () => void;
}

const generateMockData = (): ChartData => {
  const now = new Date();
  const data: ChartData = {
    temperature: {
      sensor1: [],
      sensor2: [],
      sensor3: [],
      sensor4: [],
    },
    humidity: {
      sensor1: [],
      sensor2: [],
    },
  };

  // Generate 24 hours of data points (one per hour)
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(
      now.getTime() - (23 - i) * 60 * 60 * 1000,
    ).toISOString();

    // Temperature data (varying between 20-35°C)
    data.temperature.sensor1.push({
      timestamp,
      value: 25 + Math.sin(i / 3) * 5 + Math.random() * 2,
    });
    data.temperature.sensor2.push({
      timestamp,
      value: 27 + Math.sin(i / 3 + 1) * 4 + Math.random() * 2,
    });
    data.temperature.sensor3.push({
      timestamp,
      value: 26 + Math.sin(i / 3 + 2) * 4.5 + Math.random() * 2,
    });
    data.temperature.sensor4.push({
      timestamp,
      value: 28 + Math.sin(i / 3 + 3) * 3.5 + Math.random() * 2,
    });

    // Humidity data (varying between 40-70%)
    data.humidity.sensor1.push({
      timestamp,
      value: 55 + Math.cos(i / 4) * 10 + Math.random() * 5,
    });
    data.humidity.sensor2.push({
      timestamp,
      value: 50 + Math.cos(i / 4 + 2) * 15 + Math.random() * 5,
    });
  }

  return data;
};

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data = generateMockData(),
  onTimeRangeChange = () => {},
  onRefresh = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("temperature");
  const [timeRange, setTimeRange] = useState("24h");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    onTimeRangeChange(value);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleRefresh = () => {
    onRefresh();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const dx = (e.clientX - dragStart.x) / zoomLevel;
      const dy = (e.clientY - dragStart.y) / zoomLevel;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse up outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  // This would be replaced with actual chart rendering code using Chart.js
  useEffect(() => {
    if (chartRef.current) {
      // In a real implementation, this is where we would initialize and update the Chart.js chart
      console.log("Chart would be updated with:", {
        activeTab,
        timeRange,
        zoomLevel,
        data,
      });
    }
  }, [activeTab, timeRange, zoomLevel, data]);

  return (
    <Card className="w-full h-full bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Historical Data</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="6h">Last 6 Hours</SelectItem>
                <SelectItem value="12h">Last 12 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoveHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
          </TabsList>
          <TabsContent value="temperature" className="w-full">
            <div
              ref={chartRef}
              className="w-full h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-md border border-gray-200 relative overflow-hidden"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* Placeholder for the temperature chart */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p>Temperature Chart Visualization</p>
                  <p className="text-sm">
                    Showing data from 4 sensors over {timeRange}
                  </p>
                  <p className="text-xs mt-2">
                    Zoom level: {zoomLevel.toFixed(1)}x
                  </p>
                </div>
              </div>
              {/* This would be replaced with actual Chart.js rendering */}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs">Sensor 1</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs">Sensor 2</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs">Sensor 3</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-xs">Sensor 4</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="humidity" className="w-full">
            <div
              className="w-full h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-md border border-gray-200 relative overflow-hidden"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* Placeholder for the humidity chart */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p>Humidity Chart Visualization</p>
                  <p className="text-sm">
                    Showing data from 2 sensors over {timeRange}
                  </p>
                  <p className="text-xs mt-2">
                    Zoom level: {zoomLevel.toFixed(1)}x
                  </p>
                </div>
              </div>
              {/* This would be replaced with actual Chart.js rendering */}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs">Sensor 1</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs">Sensor 2</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InteractiveChart;
