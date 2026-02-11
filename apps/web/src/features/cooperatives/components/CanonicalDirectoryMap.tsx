import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getRegionCoordinates } from '@/lib/utils/cooperativeUtils';
import type { CanonicalCooperativeDirectory } from '@/types';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';

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

interface CanonicalDirectoryMapProps {
  records: CanonicalCooperativeDirectory[];
}

// Component to update map bounds when records change
function MapUpdater({ records }: { records: CanonicalCooperativeDirectory[] }) {
  const map = useMap();

  useEffect(() => {
    if (records.length === 0) return;

    const coordinates: [number, number][] = [];
    records.forEach(record => {
      const region = record.regionName || record.region;
      if (region) {
        const coords = getRegionCoordinates(region);
        coordinates.push(coords);
      }
    });

    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [records, map]);

  return null;
}

export default function CanonicalDirectoryMap({ records }: CanonicalDirectoryMapProps) {
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

  // Default center for Côte d'Ivoire
  const defaultCenter: [number, number] = [7.54, -5.55];
  const defaultZoom = records.length === 0 ? 7 : 8;

  return (
    <div className="relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater records={records} />
        
        {Object.entries(regionData).map(([region, data]) => {
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
                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
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
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-[250px] border border-gray-200">
        <h4 className="font-semibold text-secondary-600 mb-3 text-sm">Légende</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow"></div>
            <span>100+ coopératives</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow"></div>
            <span>50-99 coopératives</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
            <span>20-49 coopératives</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-400 border-2 border-white shadow"></div>
            <span>1-19 coopératives</span>
          </div>
        </div>
      </div>
    </div>
  );
}

