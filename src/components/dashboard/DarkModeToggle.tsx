import React from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import { useTranslation } from "../../hooks/useTranslation";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  isDarkMode,
  onToggle,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col items-center justify-center mr-1">
        {isDarkMode ? (
          <Moon className="h-4 w-4 text-indigo-400" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </div>
      <Switch
        checked={isDarkMode}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-amber-400"
        aria-label={
          isDarkMode ? t("Switch to Light Mode") : t("Switch to Dark Mode")
        }
      />
      <span className="text-xs font-medium ml-1 text-gray-700 dark:text-gray-300">
        {isDarkMode ? t("Dark") : t("Light")}
      </span>
    </div>
  );
};

export default DarkModeToggle;
