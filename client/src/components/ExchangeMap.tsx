import { useRef } from "react";
import { Group } from "three";
import WorldMap from "./WorldMap";
import ExchangeMarker from "./ExchangeMarker";
import LatencyConnection from "./LatencyConnection";
import NetworkTopology from "./NetworkTopology";
import VolumeFlow from "./VolumeFlow";
import LatencyHeatmap from "./LatencyHeatmap";
import { exchanges } from "../data/exchanges";
import { cloudRegions } from "../data/cloudRegions";
import { useMapStore } from "../lib/stores/useMapStore";
import { useRealLatencyData } from "../hooks/useRealLatencyData";

export default function ExchangeMap() {
  const groupRef = useRef<Group>(null);
  const { visibleProviders, showConnections, latencyFilter } = useMapStore();
  const { latencyData } = useRealLatencyData();

  // Filter exchanges based on visible providers
  const filteredExchanges = exchanges.filter(exchange => 
    visibleProviders.includes(exchange.cloudProvider)
  );

  // Filter regions based on visible providers
  const filteredRegions = cloudRegions.filter(region => 
    visibleProviders.includes(region.provider)
  );

  return (
    <group ref={groupRef}>
      {/* World Map Sphere */}
      <WorldMap />
      
      {/* Latency Heatmap Overlay */}
      <LatencyHeatmap />
      
      {/* Exchange Markers */}
      {filteredExchanges.map((exchange) => (
        <ExchangeMarker
          key={exchange.id}
          exchange={exchange}
        />
      ))}
      
      {/* Cloud Region Markers */}
      {filteredRegions.map((region) => (
        <ExchangeMarker
          key={`region-${region.id}`}
          exchange={{
            ...region,
            name: region.regionName,
            cloudProvider: region.provider,
            type: 'region'
          }}
        />
      ))}
      
      {/* Network Topology */}
      <NetworkTopology />
      
      {/* Volume Flow Particles */}
      <VolumeFlow />
      
      {/* Latency Connections */}
      {showConnections && filteredExchanges.map((exchange) => {
        const nearbyRegions = filteredRegions.filter(region => 
          region.provider === exchange.cloudProvider
        );
        
        return nearbyRegions.map((region) => {
          const latency = latencyData[`${exchange.id}-${region.id}`];
          if (!latency) return null;
          
          // Apply latency filter
          if (latency < latencyFilter.min || latency > latencyFilter.max) return null;
          
          return (
            <LatencyConnection
              key={`${exchange.id}-${region.id}`}
              start={exchange}
              end={region}
              latency={latency}
            />
          );
        });
      })}
    </group>
  );
}
