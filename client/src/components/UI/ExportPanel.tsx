import { useState } from "react";
import { Download, FileImage, FileText, FileSpreadsheet, X } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useMapStore } from "../../lib/stores/useMapStore";
import { useLatencyData } from "../../hooks/useLatencyData";
import { exchanges } from "../../data/exchanges";
import { cloudRegions } from "../../data/cloudRegions";

export default function ExportPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { visibleProviders, latencyFilter, selectedExchange } = useMapStore();
  const { latencyData, historicalData } = useLatencyData();

  const exportAsJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      settings: {
        visibleProviders,
        latencyFilter,
        selectedExchange
      },
      currentLatencyData: latencyData,
      historicalData,
      exchanges: exchanges.filter(ex => visibleProviders.includes(ex.cloudProvider)),
      cloudRegions: cloudRegions.filter(region => visibleProviders.includes(region.provider))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadFile(blob, `crypto-exchange-data-${Date.now()}.json`);
  };

  const exportAsCSV = () => {
    const csvData = [];
    csvData.push(['Exchange', 'Cloud Provider', 'Latitude', 'Longitude', 'Volume 24h', 'Current Latency']);
    
    exchanges
      .filter(ex => visibleProviders.includes(ex.cloudProvider))
      .forEach(exchange => {
        const latency = Object.entries(latencyData)
          .filter(([key]) => key.startsWith(exchange.id))
          .map(([, lat]) => lat)
          .reduce((sum, lat, _, arr) => sum + lat / arr.length, 0);
        
        csvData.push([
          exchange.name,
          exchange.cloudProvider,
          exchange.latitude.toString(),
          exchange.longitude.toString(),
          exchange.volume24h?.toString() || '0',
          Math.round(latency || 0).toString()
        ]);
      });
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `crypto-exchange-report-${Date.now()}.csv`);
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      
      // Title
      pdf.setFontSize(20);
      pdf.text('Cryptocurrency Exchange Infrastructure Report', 20, 30);
      
      // Timestamp
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);
      
      // Settings
      pdf.setFontSize(14);
      pdf.text('Current Settings:', 20, 65);
      pdf.setFontSize(10);
      pdf.text(`Visible Providers: ${visibleProviders.join(', ')}`, 25, 75);
      pdf.text(`Latency Filter: ${latencyFilter.min}ms - ${latencyFilter.max}ms`, 25, 85);
      
      // Statistics
      const allLatencies = Object.values(latencyData);
      const avgLatency = allLatencies.reduce((sum, lat) => sum + lat, 0) / allLatencies.length;
      const minLatency = Math.min(...allLatencies);
      const maxLatency = Math.max(...allLatencies);
      
      pdf.setFontSize(14);
      pdf.text('Latency Statistics:', 20, 105);
      pdf.setFontSize(10);
      pdf.text(`Average Latency: ${Math.round(avgLatency)}ms`, 25, 115);
      pdf.text(`Minimum Latency: ${minLatency}ms`, 25, 125);
      pdf.text(`Maximum Latency: ${maxLatency}ms`, 25, 135);
      pdf.text(`Active Connections: ${allLatencies.length}`, 25, 145);
      
      // Exchange list
      pdf.setFontSize(14);
      pdf.text('Active Exchanges:', 20, 165);
      
      let yPos = 175;
      exchanges
        .filter(ex => visibleProviders.includes(ex.cloudProvider))
        .slice(0, 15) // Limit for PDF space
        .forEach(exchange => {
          pdf.setFontSize(9);
          pdf.text(`${exchange.name} (${exchange.cloudProvider})`, 25, yPos);
          yPos += 8;
        });
      
      pdf.save(`crypto-exchange-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `crypto-exchange-visualization-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
      }
    } catch (error) {
      console.error('Image export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-4 left-4 z-30">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-all flex items-center gap-2"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>
      ) : (
        <div className="bg-black bg-opacity-90 rounded-lg p-4 text-white min-w-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Download size={16} />
              Export Data
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={exportAsJSON}
              disabled={isExporting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FileText size={14} />
              Export as JSON
            </button>

            <button
              onClick={exportAsCSV}
              disabled={isExporting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet size={14} />
              Export as CSV
            </button>

            <button
              onClick={exportAsPDF}
              disabled={isExporting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FileText size={14} />
              Export as PDF Report
            </button>

            <button
              onClick={exportAsImage}
              disabled={isExporting}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FileImage size={14} />
              Export as Image
            </button>

            {isExporting && (
              <div className="text-center text-sm text-gray-400 mt-2">
                Generating export...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}