import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./dashboard/Header";
import InteractiveChart from "./dashboard/InteractiveChart";
import AlertNotification from "./dashboard/AlertNotification";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, ThermometerSun, Droplets, Clock } from "lucide-react";
import LanguageSwitcher from "./dashboard/LanguageSwitcher";
import { useTranslation } from "../hooks/useTranslation";

const Home = () => {
  const { t, language, setLanguage } = useTranslation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    title: "Temperature Alert",
    message:
      "Temperature in Sensor 3 is above the acceptable range (72.1°C). Please check the system.",
    type: "warning" as "warning" | "error" | "info",
  });

  // Simulate an alert after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const rooms = [
    { id: "room1", name: "Drying Room 1" },
    { id: "room2", name: "Drying Room 2" },
    { id: "room3", name: "Drying Room 3" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Language Switcher */}
        <div className="flex items-center justify-between">
          <Header />
          <LanguageSwitcher
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        {/* Interactive Chart Overview */}
        <Card className="w-full overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {t("Historical Data Overview")}
            </h2>
            <div className="h-[400px]">
              <InteractiveChart />
            </div>
          </CardContent>
        </Card>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-amber-100 mr-4">
                    <ThermometerSun className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold">{t(room.name)}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <ThermometerSun className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("Temperature")}
                      </p>
                      <p className="font-bold">65.2°C</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">{t("Humidity")}</p>
                      <p className="font-bold">45%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("Drying Time")}
                      </p>
                      <p className="font-bold">24 {t("hours")}</p>
                    </div>
                  </div>
                </div>

                <Link to={`/room/${room.id}`} className="w-full">
                  <Button className="w-full transition-all duration-300 hover:scale-105 group">
                    {t("View Room")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert Notification */}
        {showAlert && (
          <AlertNotification
            title={t(alertInfo.title)}
            message={t(alertInfo.message)}
            type={alertInfo.type}
            onClose={handleAlertClose}
            isVisible={showAlert}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
