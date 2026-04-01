import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ThreatData } from "@/data/mockThreats";

interface GeoMapProps {
  threats: ThreatData[];
  blockedIps?: string[];
}

const severityColors: Record<string, string> = {
  critical: '#e63946',
  high: '#e07a30',
  medium: '#e6b422',
  low: '#38b764',
};

function curvedPoints(from: [number, number], to: [number, number], segments = 30): [number, number][] {
  const points: [number, number][] = [];
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

const GeoMap = ({ threats, blockedIps = [] }: GeoMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const blockedSet = useMemo(() => new Set(blockedIps), [blockedIps]);

  const displayThreats = useMemo(() => threats.slice(0, 25), [threats]);

  const attackOrigins = useMemo(() => {
    const origins: Record<string, { coords: [number, number]; count: number; maxSeverity: string; country: string; blocked: boolean }> = {};
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    displayThreats.forEach(t => {
      const key = t.country;
      const isBlocked = blockedSet.has(t.attackerIp);
      if (!origins[key]) {
        origins[key] = { coords: t.attackerCoords, count: 0, maxSeverity: t.severity, country: t.country, blocked: isBlocked };
      }
      origins[key].count++;
      if (isBlocked) origins[key].blocked = true;
      if (severityOrder[t.severity as keyof typeof severityOrder] < severityOrder[origins[key].maxSeverity as keyof typeof severityOrder]) {
        origins[key].maxSeverity = t.severity;
      }
    });
    return Object.values(origins);
  }, [displayThreats, blockedSet]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [25, 10],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png").addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.clearLayers();

    displayThreats.forEach((t) => {
      const isBlocked = blockedSet.has(t.attackerIp);
      const points = curvedPoints(t.attackerCoords, t.targetCoords);
      L.polyline(points, {
        color: isBlocked ? '#991b1b' : severityColors[t.severity],
        weight: t.severity === 'critical' ? 2.5 : 1.5,
        opacity: isBlocked ? 0.3 : 0.5,
        dashArray: isBlocked ? '3 6' : '6 4',
      }).addTo(layerRef.current!);
    });

    attackOrigins.forEach((origin) => {
      const marker = L.circleMarker(origin.coords, {
        radius: Math.min(origin.count * 3 + 5, 20),
        color: origin.blocked ? '#dc2626' : '#c4b5fd',
        fillColor: origin.blocked ? '#991b1b' : severityColors[origin.maxSeverity],
        fillOpacity: origin.blocked ? 0.5 : 0.35,
        weight: 2,
        opacity: 0.8,
      }).addTo(layerRef.current!);

      marker.bindTooltip(
        `<div style="font-family: JetBrains Mono, monospace; font-size: 11px; color: #c4b5fd;">
          <div style="font-weight: bold; color: #e9d5ff;">${origin.blocked ? '🚫 ' : ''}${origin.country}</div>
          <div>Attacks: ${origin.count}</div>
          ${origin.blocked ? '<div style="color: #ef4444; font-weight: bold;">BLOCKED</div>' : ''}
          <div>Max Severity: <span style="color: ${severityColors[origin.maxSeverity]}; text-transform: uppercase; font-weight: bold;">${origin.maxSeverity}</span></div>
        </div>`,
        { className: 'cyber-tooltip' }
      );
    });

    displayThreats.forEach((t) => {
      const marker = L.circleMarker(t.targetCoords, {
        radius: 3,
        color: '#a78bfa',
        fillColor: '#c4b5fd',
        fillOpacity: 0.6,
        weight: 1,
      }).addTo(layerRef.current!);

      marker.bindTooltip(
        `<div style="font-family: JetBrains Mono, monospace; font-size: 11px; color: #c4b5fd;">
          <div style="color: #e9d5ff;">Target: ${t.targetIp}</div>
          <div>${t.targetCountry} · Port ${t.port}</div>
          <div>Type: ${t.attackType}</div>
        </div>`,
        { className: 'cyber-tooltip' }
      );
    });
  }, [displayThreats, attackOrigins, blockedSet]);

  const handleRecenter = () => { mapRef.current?.setView([25, 10], 2, { animate: true }); };
  const handleZoomIn = () => { mapRef.current?.zoomIn(1, { animate: true }); };
  const handleZoomOut = () => { mapRef.current?.zoomOut(1, { animate: true }); };

  return (
    <div className="cyber-card overflow-hidden relative">
      <div className="flex items-center justify-between p-4 pb-0">
        <h2 className="text-sm font-semibold" style={{ color: '#e9d5ff' }}>Geospatial Risk Map</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button onClick={handleZoomIn} className="cyber-btn text-[10px] px-2 py-1">+</button>
            <button onClick={handleZoomOut} className="cyber-btn text-[10px] px-2 py-1">−</button>
            <button onClick={handleRecenter} className="cyber-btn text-[10px] px-2 py-1">⌂</button>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            {Object.entries(severityColors).map(([level, color]) => (
              <div key={level} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }} />
                <span className="capitalize" style={{ color: '#a78bfa' }}>{level}</span>
              </div>
            ))}
            {blockedIps.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-destructive" style={{ boxShadow: '0 0 8px rgba(220,38,38,0.4)' }} />
                <span style={{ color: '#a78bfa' }}>blocked</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-12 right-4 z-10 flex flex-col gap-1 text-[10px] font-mono rounded-lg p-2" style={{ background: 'rgba(26, 15, 60, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid #4c1d9540', color: '#a78bfa' }}>
        <div>Live Threats: <span className="font-bold" style={{ color: '#c4b5fd' }}>{displayThreats.length}</span></div>
        <div>Origins: <span className="font-bold" style={{ color: '#c4b5fd' }}>{attackOrigins.length}</span></div>
        {blockedIps.length > 0 && (
          <div>Blocked: <span className="font-bold text-destructive">{blockedIps.length}</span></div>
        )}
      </div>
      <div
        ref={containerRef}
        className="h-[400px]"
        style={{ zIndex: 1, background: '#0f0a1e', borderRadius: '0 0 0.75rem 0.75rem' }}
      />
    </div>
  );
};

export default GeoMap;
