import { useState, useEffect } from "react";

interface LatencyData {
  [key: string]: number;
}

interface HistoricalPoint {
  timestamp: number;
  latency: number;
}

interface HistoricalData {
  [timeRange: string]: HistoricalPoint[];
}

export function useLatencyData() {
  const [latencyData, setLatencyData] = useState<LatencyData>({});
  const [historicalData, setHistoricalData] = useState<HistoricalData>({});

  // Generate mock real-time latency data
  useEffect(() => {
    const generateLatencyData = () => {
      const exchanges = [
        "binance-us-east", "binance-eu-west", "binance-asia-singapore",
        "okx-hong-kong", "okx-us-central",
        "bybit-singapore", "bybit-london",
        "deribit-netherlands", "coinbase-us-west", "kraken-germany",
        "bitfinex-tokyo", "huobi-seoul", "kucoin-australia"
      ];

      const regions = [
        "aws-us-east-1", "aws-us-west-2", "aws-eu-west-1", "aws-ap-southeast-1", "aws-ap-northeast-1",
        "gcp-us-central1", "gcp-us-west1", "gcp-europe-west1", "gcp-asia-east2", "gcp-asia-northeast3",
        "azure-eastus", "azure-westus2", "azure-northeurope", "azure-southeastasia", "azure-uksouth",
        "azure-australiaeast", "azure-germanywestcentral"
      ];

      const newLatencyData: LatencyData = {};

      // Generate latency between exchanges and nearby regions
      exchanges.forEach(exchange => {
        // Each exchange connects to 2-4 nearby regions
        const connectionCount = 2 + Math.floor(Math.random() * 3);
        const shuffledRegions = [...regions].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < connectionCount; i++) {
          const region = shuffledRegions[i];
          const key = `${exchange}-${region}`;
          
          // Generate realistic latency based on geographic proximity
          const baseLatency = 20 + Math.random() * 100;
          const variation = (Math.random() - 0.5) * 20;
          newLatencyData[key] = Math.max(5, Math.round(baseLatency + variation));
        }
      });

      setLatencyData(newLatencyData);
    };

    // Generate initial data
    generateLatencyData();

    // Update latency data every 5 seconds
    const interval = setInterval(generateLatencyData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Generate mock historical data
  useEffect(() => {
    const generateHistoricalData = () => {
      const now = Date.now();
      const ranges = {
        '1h': { points: 60, interval: 60 * 1000 }, // 1 minute intervals
        '24h': { points: 24, interval: 60 * 60 * 1000 }, // 1 hour intervals  
        '7d': { points: 7, interval: 24 * 60 * 60 * 1000 }, // 1 day intervals
        '30d': { points: 30, interval: 24 * 60 * 60 * 1000 } // 1 day intervals
      };

      const newHistoricalData: HistoricalData = {};

      Object.entries(ranges).forEach(([range, config]) => {
        const points: HistoricalPoint[] = [];
        
        for (let i = config.points - 1; i >= 0; i--) {
          const timestamp = now - (i * config.interval);
          const baseLatency = 50 + Math.random() * 50;
          const dailyPattern = Math.sin((timestamp / (24 * 60 * 60 * 1000)) * 2 * Math.PI) * 10;
          const randomVariation = (Math.random() - 0.5) * 20;
          
          points.push({
            timestamp,
            latency: Math.max(10, Math.round(baseLatency + dailyPattern + randomVariation))
          });
        }
        
        newHistoricalData[range] = points;
      });

      setHistoricalData(newHistoricalData);
    };

    generateHistoricalData();
    
    // Update historical data every minute
    const interval = setInterval(generateHistoricalData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { latencyData, historicalData };
}
