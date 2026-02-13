import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getRegionCoordinates } from '@/lib/utils/cooperativeUtils';
import type { CanonicalCooperativeDirectory } from '@/types';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';
import { Layers, MapPin, Flame, Heart } from 'lucide-react';

// Fix Leaflet default icon paths for Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export type MapDisplayMode = 'markers' | 'heatmap' | 'both';

/** Heatmap metric: density = cooperatives per region; health = VRAC antimalarial burden */
export type HeatmapMetric = 'density' | 'health';

/** Health metrics per region (VRAC pharmacy surveillance). Key = region display name (e.g. Gontougo, La Mé, Abidjan). */
export interface RegionHealthInfo {
  antimalarialSharePct: number;
  antibioticSharePct?: number;
  harvestRisk?: 'low' | 'medium' | 'high';
}

interface CanonicalDirectoryMapProps {
  records: CanonicalCooperativeDirectory[];
  /** When provided, "View cooperatives" in the popup uses client-side navigation instead of full page load */
  onRegionClick?: (region: string) => void;
  /** Map height in pixels or CSS value. Default: min(70vh, 720px) */
  height?: string | number;
  /** Initial display mode: markers, heatmap (density circles), or both */
  displayMode?: MapDisplayMode;
  /** Optional health data by region (VRAC). When set, region tooltips/popups show health metrics and circles can be colored by burden. */
  regionHealth?: Record<string, RegionHealthInfo>;
  /** Initial layer visibility: cooperatives (markers + density). Default true when records.length > 0 */
  layerCooperatives?: boolean;
  /** Initial layer visibility: health (VRAC burden circles). Default true when regionHealth is set */
  layerHealth?: boolean;
  /** Initial heatmap metric when both layers available. Default 'health' when regionHealth set, else 'density' */
  heatmapMetric?: HeatmapMetric;
}

// Component to update map bounds when records or region names change
function MapUpdater({
  records,
  regionNames,
}: {
  records: CanonicalCooperativeDirectory[];
  regionNames: string[];
}) {
  const map = useMap();

  useEffect(() => {
    const coordinates: [number, number][] = [];
    records.forEach(record => {
      const region = record.regionName || record.region;
      if (region) {
        const coords = getRegionCoordinates(region);
        coordinates.push(coords);
      }
    });
    if (coordinates.length === 0 && regionNames.length > 0) {
      regionNames.forEach(region => {
        coordinates.push(getRegionCoordinates(region));
      });
    }
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [records, regionNames, map]);

  return null;
}

// Heat intensity to radius (pixels) and opacity; maxCount scales the heat
function getHeatStyle(count: number, maxCount: number) {
  const ratio = maxCount > 0 ? count / maxCount : 0;
  const radius = Math.min(80, 20 + ratio * 120);
  const opacity = 0.25 + ratio * 0.45;
  if (ratio >= 0.75) return { radius, opacity, fillColor: '#dc2626', color: '#b91c1c' };
  if (ratio >= 0.5) return { radius, opacity, fillColor: '#ea580c', color: '#c2410c' };
  if (ratio >= 0.25) return { radius, opacity, fillColor: '#ca8a04', color: '#a16207' };
  return { radius, opacity, fillColor: '#2563eb', color: '#1d4ed8' };
}

// Color circle by health burden (antimalarial share %): green < 8%, yellow 8–15%, red > 15%
function getHealthStyle(antimalarialSharePct: number): { fillColor: string; color: string } {
  if (antimalarialSharePct >= 15) return { fillColor: '#dc2626', color: '#b91c1c' };
  if (antimalarialSharePct >= 8) return { fillColor: '#ca8a04', color: '#a16207' };
  return { fillColor: '#16a34a', color: '#15803d' };
}

function HealthTooltipContent({ region, health }: { region: string; health: RegionHealthInfo }) {
  return (
    <div className="text-left">
      <span className="font-semibold">{region}</span>
      <br />
      <span className="text-xs text-amber-700">
        <Heart className="inline h-3 w-3 mr-0.5" />
        Antimalarial: {(health.antimalarialSharePct).toFixed(1)}%
      </span>
      {health.antibioticSharePct != null && (
        <>
          <br />
          <span className="text-xs text-gray-600">Antibiotic: {(health.antibioticSharePct).toFixed(1)}%</span>
        </>
      )}
      {health.harvestRisk && (
        <>
          <br />
          <span className="text-xs text-gray-600">Harvest risk: {health.harvestRisk}</span>
        </>
      )}
    </div>
  );
}

export default function CanonicalDirectoryMap({
  records,
  onRegionClick,
  height = 'min(70vh, 720px)',
  displayMode: initialMode = 'both',
  regionHealth,
  layerCooperatives: initialLayerCoop,
  layerHealth: initialLayerHealth,
  heatmapMetric: initialHeatmapMetric,
}: CanonicalDirectoryMapProps) {
  const [displayMode, setDisplayMode] = useState<MapDisplayMode>(initialMode);
  const [layerCooperatives, setLayerCooperatives] = useState(
    () => initialLayerCoop ?? records.length > 0
  );
  const [layerHealth, setLayerHealth] = useState(
    () => initialLayerHealth ?? (regionHealth != null && Object.keys(regionHealth).length > 0)
  );
  const [heatmapMetric, setHeatmapMetric] = useState<HeatmapMetric>(
    () => initialHeatmapMetric ?? (regionHealth && Object.keys(regionHealth).length > 0 ? 'health' : 'density')
  );

  // Calculate cooperative counts per region
  const regionData: Record<string, { count: number; records: CanonicalCooperativeDirectory[] }> = {};
  records.forEach(record => {
    const region = record.regionName || record.region || 'Unspecified';
    if (!regionData[region]) {
      regionData[region] = { count: 0, records: [] };
    }
    regionData[region].count += 1;
    regionData[region].records.push(record);
  });

  // When no directory records but health data exists, include health-only regions for the map
  const healthOnlyRegions = regionHealth
    ? Object.keys(regionHealth).filter(r => !regionData[r])
    : [];
  healthOnlyRegions.forEach(region => {
    regionData[region] = { count: 0, records: [] };
  });

  const maxCount = Math.max(0, ...Object.values(regionData).map(d => d.count));
  const regionEntries = Object.entries(regionData);
  const hasHealthData = regionHealth != null && Object.keys(regionHealth).length > 0;

  // Default center for Côte d'Ivoire
  const defaultCenter: [number, number] = [7.54, -5.55];
  const defaultZoom = records.length === 0 ? 7 : 8;
  const mapHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: mapHeight, width: '100%', borderRadius: '0.5rem' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater records={records} regionNames={regionEntries.map(([r]) => r)} />

        {/* Heatmap layer: density or health burden circles — visible when layer matches heatmap metric */}
        {(displayMode === 'heatmap' || displayMode === 'both') &&
          (heatmapMetric === 'health' ? layerHealth : layerCooperatives) &&
          regionEntries.map(([region, data]) => {
            const coords = getRegionCoordinates(region);
            const health = regionHealth?.[region];
            const useHealthStyle = heatmapMetric === 'health' && health;
            const style = useHealthStyle
              ? { ...getHealthStyle(health.antimalarialSharePct), radius: 20 + (data.count / Math.max(maxCount, 1)) * 60, opacity: 0.45 }
              : getHeatStyle(data.count, maxCount);
            const pathOpts = useHealthStyle
              ? { fillColor: style.fillColor, color: style.color, fillOpacity: style.opacity ?? 0.45, weight: 2, opacity: 0.8 }
              : { fillColor: style.fillColor, color: style.color, fillOpacity: style.opacity, weight: 2, opacity: 0.8 };
            return (
              <CircleMarker
                key={`heat-${region}`}
                center={coords}
                radius={style.radius}
                pathOptions={pathOpts}
                eventHandlers={{
                  click: () => onRegionClick?.(region),
                }}
              >
                <Tooltip permanent={false} direction="top" offset={[0, -style.radius]}>
                  {health ? (
                    <>
                      <HealthTooltipContent region={region} health={health} />
                      <br />
                      <span className="text-gray-500 text-xs">{data.count} coopérative{data.count !== 1 ? 's' : ''} · Click to filter</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">{region}</span>
                      <br />
                      <span>{data.count} coopérative{data.count !== 1 ? 's' : ''}</span>
                      <br />
                      <span className="text-gray-500 text-xs">Click to filter</span>
                    </>
                  )}
                </Tooltip>
              </CircleMarker>
            );
          })}

        {/* Markers with popups — only when Cooperatives layer is on; skip health-only regions (count 0) */}
        {layerCooperatives && (displayMode === 'markers' || displayMode === 'both') &&
          regionEntries.filter(([, data]) => data.count > 0).map(([region, data]) => {
          const coords = getRegionCoordinates(region);
          
          // Determine marker color based on count
          let color = '#60A5FA'; // Blue for 1-19
          if (data.count >= 100) {
            color = '#22C55E'; // Green for 100+
          } else if (data.count >= 50) {
            color = '#F97316'; // Orange for 50-99
          } else if (data.count >= 20) {
            color = '#EAB308'; // Yellow for 20-49
          }

          // Get commodities for this region
          const commodities = new Set<string>();
          data.records.forEach(record => {
            if (record.commodities && record.commodities.length > 0) {
              record.commodities.forEach(c => commodities.add(c));
            }
          });

          const commodityLabels = Array.from(commodities)
            .map(c => EUDR_COMMODITIES_IN_SCOPE.find(e => e.id === c)?.label || c)
            .join(', ');

          return (
            <Marker key={region} position={coords} icon={L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; cursor: pointer;">${data.count}</div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })}>
              <Popup>
                <div style={{ minWidth: '200px', padding: '8px' }}>
                  <h3 style={{ fontWeight: 'bold', color: '#F97316', marginBottom: '8px', fontSize: '14px' }}>
                    {region}
                  </h3>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '16px', color: '#22C55E' }}>
                      {data.count}
                    </strong>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      {' '}coopérative{data.count > 1 ? 's' : ''}
                    </span>
                  </div>
                  {commodityLabels && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                      <strong>Commodities:</strong> {commodityLabels}
                    </div>
                  )}
                  {regionHealth?.[region] && (
                    <div style={{ fontSize: '12px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                      <strong style={{ color: '#b45309' }}>Health (VRAC)</strong>
                      <div style={{ color: '#666', marginTop: '4px' }}>
                        Antimalarial share: {(regionHealth[region].antimalarialSharePct).toFixed(1)}%
                        {regionHealth[region].antibioticSharePct != null && (
                          <span> · Antibiotic: {(regionHealth[region].antibioticSharePct).toFixed(1)}%</span>
                        )}
                        {regionHealth[region].harvestRisk && (
                          <span> · Harvest risk: {regionHealth[region].harvestRisk}</span>
                        )}
                      </div>
                    </div>
                  )}
                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                    {onRegionClick ? (
                      <button
                        type="button"
                        onClick={() => onRegionClick(region)}
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: '#F97316',
                          color: 'white',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          border: 'none'
                        }}
                      >
                        View cooperatives →
                      </button>
                    ) : (
                      <a
                        href={`/directory?region=${encodeURIComponent(region)}`}
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: '#F97316',
                          color: 'white',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        View cooperatives →
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Layer and display mode controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex flex-col gap-0.5">
          <span className="px-2 py-1 text-xs font-semibold text-gray-600 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" /> Layers
          </span>
          {(records.length > 0 || hasHealthData) && (
            <>
              {records.length > 0 && (
                <label className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layerCooperatives}
                    onChange={() => setLayerCooperatives((v) => !v)}
                    className="rounded"
                  />
                  <MapPin className="h-3.5 w-3.5" /> Cooperatives
                </label>
              )}
              {hasHealthData && (
                <label className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layerHealth}
                    onChange={() => setLayerHealth((v) => !v)}
                    className="rounded"
                  />
                  <Heart className="h-3.5 w-3.5" /> Health (VRAC)
                </label>
              )}
              {hasHealthData && (displayMode === 'heatmap' || displayMode === 'both') && (
                <div className="px-2 py-1.5 border-t border-gray-100 mt-0.5">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Heatmap color</span>
                  <div className="flex gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setHeatmapMetric('density')}
                      className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        heatmapMetric === 'density' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Density
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeatmapMetric('health')}
                      className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        heatmapMetric === 'health' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Health
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex flex-col gap-0.5">
          <span className="px-2 py-1 text-xs font-semibold text-gray-600 flex items-center gap-1">View</span>
          <button
            type="button"
            onClick={() => setDisplayMode('both')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              displayMode === 'both' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" /> Markers + Heat
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('markers')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              displayMode === 'markers' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" /> Markers only
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('heatmap')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              displayMode === 'heatmap' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Flame className="h-3.5 w-3.5" /> Heatmap only
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-[260px] border border-gray-200">
        <h4 className="font-semibold text-secondary-600 mb-3 text-sm">
          {(displayMode === 'heatmap' || displayMode === 'both') && heatmapMetric === 'health'
            ? 'Health burden (antimalarial share %)'
            : displayMode === 'heatmap' || displayMode === 'both'
              ? 'Density (cooperatives per region)'
              : 'Légende'}
        </h4>
        {(displayMode === 'heatmap' || displayMode === 'both') && heatmapMetric === 'health' ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow" />
              <span>High (≥15%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-white shadow" />
              <span>Medium (8–15%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-600 border-2 border-white shadow" />
              <span>Lower (&lt;8%)</span>
            </div>
            <p className="text-gray-500 mt-2 pt-2 border-t border-gray-100">VRAC pharmacy surveillance</p>
          </div>
        ) : displayMode === 'heatmap' ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow" />
              <span>High density</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow" />
              <span>Medium–high</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-white shadow" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow" />
              <span>Lower density</span>
            </div>
            <p className="text-gray-500 mt-2 pt-2 border-t border-gray-100">Click a region to filter</p>
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow" />
              <span>100+ coopératives</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow" />
              <span>50-99 coopératives</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-white shadow" />
              <span>20-49 coopératives</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-400 border-2 border-white shadow" />
              <span>1-19 coopératives</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

