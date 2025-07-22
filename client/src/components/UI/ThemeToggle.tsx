import { Moon, Sun } from "lucide-react";
import { useMapStore } from "../../lib/stores/useMapStore";

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useMapStore();

  return (
    <button
      onClick={toggleDarkMode}
      className={`fixed top-4 right-20 z-30 p-3 rounded-lg transition-all ${
        isDarkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg'
      }`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}