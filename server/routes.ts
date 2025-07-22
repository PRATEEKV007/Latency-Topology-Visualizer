import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Generate server-side mock data
  function generateServerMockData() {
    return {
      result: {
        series: [{
          values: Array.from({ length: 24 }, (_, i) => [
            new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
            (Math.random() * 100 + 20).toFixed(2)
          ])
        }]
      }
    };
  }

  // Cloudflare Radar API proxy to handle CORS
  app.get("/api/radar/netflows", async (req, res) => {
    try {
      const apiKey = process.env.VITE_CLOUDFLARE_API_KEY;
      
      console.log("Server API Key check:", !!apiKey, apiKey?.length);
      
      if (!apiKey) {
        return res.json({ 
          success: false, 
          fallback: true,
          message: "No API key configured - using enhanced mock data",
          data: generateServerMockData()
        });
      }

      // Try different Cloudflare Radar endpoints
      const endpoints = [
        "https://api.cloudflare.com/client/v4/radar/netflows/timeseries?dateRange=1d&format=json",
        "https://api.cloudflare.com/client/v4/radar/quality/iqi/timeseries?dateRange=1d&format=json",
        "https://api.cloudflare.com/client/v4/radar/datasets"
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });

          console.log(`Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log("Success! Data received:", JSON.stringify(data).substring(0, 200));
            return res.json({ success: true, data, endpoint });
          } else {
            const errorText = await response.text();
            console.log(`Failed with ${response.status}: ${errorText}`);
          }
        } catch (fetchError: unknown) {
          console.log(`Fetch error for ${endpoint}:`, fetchError);
        }
      }

      // If all endpoints fail, return enhanced mock data with API status
      console.log("All API endpoints failed, returning enhanced mock data");
      res.json({ 
        success: false, 
        fallback: true,
        message: "API endpoints returned errors - using enhanced mock data",
        data: generateServerMockData()
      });

    } catch (error: unknown) {
      console.error("Cloudflare API error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.json({ 
        success: false, 
        fallback: true,
        message: `Server error: ${errorMessage} - using enhanced mock data`,
        data: generateServerMockData()
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
