import { useState } from "react";
import { AlertCircle, X, ExternalLink } from "lucide-react";
import { useRealLatencyData } from "../../hooks/useRealLatencyData";

export default function ApiSetupBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { hasApiKey, error } = useRealLatencyData();

  if (hasApiKey || isDismissed) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">API Key Status</h3>
          <p className="text-xs mb-2 opacity-90">
            {hasApiKey 
              ? "API key detected! The system will attempt to use real Cloudflare data with intelligent fallback to enhanced mock data."
              : "No API key found. Using enhanced mock data with realistic patterns."
            }
          </p>
          <div className="flex gap-2">
            <a
              href="https://developers.cloudflare.com/radar/get-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded flex items-center gap-1 transition-colors"
            >
              Get API Key <ExternalLink size={10} />
            </a>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              Maybe later
            </button>
          </div>
          {error && (
            <p className="text-xs mt-1 opacity-80">
              API Error: {error}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-white opacity-70 hover:opacity-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}