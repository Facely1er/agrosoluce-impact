/**
 * Health-only analytics map: VRAC pharmacy surveillance by region.
 * No cooperatives — focuses on regional health (antimalarial share, antibiotic, harvest risk).
 */

import { useMemo, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getRegionCoordinates } from '@/lib/utils/cooperativeUtils';
import { Heart } from 'lucide-react';
import type { RegionHealthInfo } from '@/features/cooperatives/components/CanonicalDirectoryMap';

function getHealthStyle(antimalarialSharePct: number): { fillColor: string; color: string } {
  if (antimalarialSharePct >= 15) return { fillColor: '#dc2626', color: '#b91c1c' };
  if (antimalarialSharePct >= 8) return { fillColor: '#ca8a04', color: '#a16207' };
  return { fillColor: '#16a34a', color: '#15803d' };
}

function HealthPopupContent({ region, health }: { region: string; health: RegionHealthInfo }) {
  return (
    <div className="text-left min-w-[200px] p-1">
      <h3 className="font-bold text-primary-600 mb-2 text-sm">{region}</h3>
      <div className="space-y-1 text-xs">
        <p className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5 text-amber-600" />
          <strong>Antimalarial share:</strong> {(health.antimalarialSharePct).toFixed(1)}%
        </p>
        {health.antibioticSharePct != null && (
          <p><strong>Antibiotic share:</strong> {(health.antibioticSharePct).toFixed(1)}%</p>
        )}
        {health.harvestRisk && (
          <p><strong>Harvest risk:</strong> {health.harvestRisk}</p>
        )}
      </div>
      <p className="text-gray-500 mt-2 pt-2 border-t border-gray-100 text-xs">
        VRAC pharmacy surveillance · Not cooperative locations
      </p>
    </div>
  );
}

function MapBoundsUpdater({ regionNames }: { regionNames: string[] }) {
  const map = useMap();
  useEffect(() => {
    if (regionNames.length === 0) return;
    const coords = regionNames.map((r) => getRegionCoordinates(r));
    if (coords.length === 0) return;
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
  }, [regionNames, map]);
  return null;
}

export interface AnalyticsHealthMapProps {
  regionHealth: Record<string, RegionHealthInfo>;
  height?: string | number;
}

export default function AnalyticsHealthMap({ regionHealth, height = 'min(60vh, 560px)' }: AnalyticsHealthMapProps) {
  const regionEntries = useMemo(
    () => Object.entries(regionHealth),
    [regionHealth]
  );
  const regionNames = useMemo(() => regionEntries.map(([r]) => r), [regionEntries]);
  const defaultCenter: [number, number] = [7.54, -5.55];
  const defaultZoom = 7;
  const mapHeight = typeof height === 'number' ? `${height}px` : height;

  if (regionEntries.length === 0) {
    return (
      <div
        className="rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500"
        style={{ height: mapHeight }}
      >
        <p className="text-sm">No regional health data. Run VRAC process or connect Supabase.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: mapHeight, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsUpdater regionNames={regionNames} />
        {regionEntries.map(([region, health]) => {
          const coords = getRegionCoordinates(region);
          const style = getHealthStyle(health.antimalarialSharePct);
          return (
            <CircleMarker
              key={region}
              center={coords}
              radius={28}
              pathOptions={{
                fillColor: style.fillColor,
                color: style.color,
                fillOpacity: 0.5,
                weight: 2,
                opacity: 0.9,
              }}
            >
              <Tooltip direction="top" offset={[0, -28]}>
                <HealthPopupContent region={region} health={health} />
              </Tooltip>
              <Popup>
                <HealthPopupContent region={region} health={health} />
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] border border-gray-200">
        <h4 className="font-semibold text-primary-600 mb-2 text-xs uppercase tracking-wide">
          Health burden (antimalarial %)
        </h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600 border border-white shadow" />
            <span>High (≥15%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 border border-white shadow" />
            <span>Medium (8–15%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-600 border border-white shadow" />
            <span>Lower (&lt;8%)</span>
          </div>
        </div>
        <p className="text-gray-500 mt-2 pt-2 border-t border-gray-100 text-[10px]">
          VRAC pharmacy surveillance · Regions only
        </p>
      </div>
    </div>
  );
}
