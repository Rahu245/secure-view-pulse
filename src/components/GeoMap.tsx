import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { ThreatData } from "@/data/mockThreats";

interface GeoMapProps {
  threats: ThreatData[];
}

const severityColors: Record<string, string> = {
  critical: '#e63946',
  high: '#e07a30',
  medium: '#e6b422',
  low: '#38b764',
};

const severityRadius: Record<string, number> = {
  critical: 8,
  high: 6,
  medium: 5,
  low: 4,
};

// Curved line helper: generate arc points between two coords
function curvedPoints(from: [number, number], to: [number, number], segments = 30): [number, number][] {
  const points: [number, number][] = [];
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const dist = Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
  const arcHeight = dist * 0.3;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = from[0] * (1 - t) + to[0] * t + Math.sin(Math.PI * t) * arcHeight * 0.3;
    const lng = from[1] * (1 - t) + to[1] * t;
    points.push([lat, lng]);
  }
  return points;
}

// Component to animate the map view
function MapUpdater() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

const GeoMap = ({ threats }: GeoMapProps) => {
  const displayThreats = useMemo(() => threats.slice(0, 25), [threats]);

  // Group attacks by origin for aggregated markers
  const attackOrigins = useMemo(() => {
    const origins: Record<string, { coords: [number, number]; count: number; maxSeverity: string; country: string }> = {};
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    displayThreats.forEach(t => {
      const key = t.country;
      if (!origins[key]) {
        origins[key] = { coords: t.attackerCoords, count: 0, maxSeverity: t.severity, country: t.country };
      }
      origins[key].count++;
      if (severityOrder[t.severity as keyof typeof severityOrder] < severityOrder[origins[key].maxSeverity as keyof typeof severityOrder]) {
        origins[key].maxSeverity = t.severity;
      }
    });
    return Object.values(origins);
  }, [displayThreats]);

  return (
    <div className="cyber-card overflow-hidden relative">
      <div className="flex items-center justify-between p-4 pb-0">
        <h2 className="text-sm font-semibold text-foreground">Geospatial Risk Map</h2>
        <div className="flex items-center gap-3 text-[10px]">
          {Object.entries(severityColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="capitalize text-muted-foreground">{level}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[400px] relative" style={{ zIndex: 1 }}>
        <MapContainer
          center={[25, 10]}
          zoom={2}
          minZoom={2}
          maxZoom={6}
          scrollWheelZoom={true}
          className="h-full w-full"
          style={{
            background: 'hsl(222, 47%, 8%)',
            borderRadius: '0 0 0.75rem 0.75rem',
          }}
          attributionControl={false}
        >
          <MapUpdater />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Attack arc lines */}
          {displayThreats.map((t) => {
            const points = curvedPoints(t.attackerCoords, t.targetCoords);
            return (
              <Polyline
                key={`line-${t.id}`}
                positions={points}
                pathOptions={{
                  color: severityColors[t.severity],
                  weight: t.severity === 'critical' ? 2.5 : 1.5,
                  opacity: 0.5,
                  dashArray: '6 4',
                }}
              />
            );
          })}

          {/* Origin markers */}
          {attackOrigins.map((origin) => (
            <CircleMarker
              key={`origin-${origin.country}`}
              center={origin.coords}
              radius={Math.min(origin.count * 3 + 5, 20)}
              pathOptions={{
                color: severityColors[origin.maxSeverity],
                fillColor: severityColors[origin.maxSeverity],
                fillOpacity: 0.25,
                weight: 2,
                opacity: 0.8,
              }}
            >
              <Tooltip
                direction="top"
                className="cyber-tooltip"
                permanent={false}
              >
                <div className="text-xs space-y-0.5" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e0e8f0', background: 'transparent' }}>
                  <div className="font-bold">{origin.country}</div>
                  <div>Attacks: {origin.count}</div>
                  <div>Max Severity: <span style={{ color: severityColors[origin.maxSeverity], textTransform: 'uppercase', fontWeight: 'bold' }}>{origin.maxSeverity}</span></div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Target markers (cyan dots) */}
          {displayThreats.map((t) => (
            <CircleMarker
              key={`target-${t.id}`}
              center={t.targetCoords}
              radius={3}
              pathOptions={{
                color: '#00f0ff',
                fillColor: '#00f0ff',
                fillOpacity: 0.6,
                weight: 1,
              }}
            >
              <Tooltip direction="top" className="cyber-tooltip">
                <div className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e0e8f0' }}>
                  <div>Target: {t.targetIp}</div>
                  <div>{t.targetCountry} · Port {t.port}</div>
                  <div>Type: {t.attackType}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default GeoMap;
