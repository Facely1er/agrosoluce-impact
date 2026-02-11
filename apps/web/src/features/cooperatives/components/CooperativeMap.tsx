import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRegionCoordinates } from '@/lib/utils/cooperativeUtils';
import type { Cooperative } from '@/types';

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

interface CooperativeMapProps {
  cooperatives: Cooperative[];
  onRegionClick?: (region: string) => void;
}

export default function CooperativeMap({ cooperatives, onRegionClick }: CooperativeMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([7.54, -5.55], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Calculate cooperative counts per region
    const regionCounts: Record<string, number> = {};
    cooperatives.forEach(coop => {
      regionCounts[coop.region] = (regionCounts[coop.region] || 0) + 1;
    });

    // Add markers for each region
    Object.entries(regionCounts).forEach(([region, count]) => {
      const coords = getRegionCoordinates(region);

      // Determine marker color based on count
      let color = '#90CAF9'; // Blue for 1-19
      if (count >= 100) {
        color = '#2E7D32'; // Green for 100+
      } else if (count >= 50) {
        color = '#FF7900'; // Orange for 50-99
      } else if (count >= 20) {
        color = '#FFC107'; // Yellow for 20-49
      }

      // Create custom icon
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${count}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Create marker
      const marker = L.marker(coords, { icon }).addTo(map);

      // Create popup element with filter button
      const popupDiv = document.createElement('div');
      popupDiv.style.cssText = 'text-align: center; padding: 8px; min-width: 200px;';
      popupDiv.innerHTML = `
        <strong style="color: #FF7900; font-size: 14px; display: block; margin-bottom: 8px;">${region}</strong>
        <div style="margin-bottom: 8px;">
          <span style="font-size: 16px; font-weight: bold; color: #2E7D32;">${count}</span>
          <span style="font-size: 14px; color: #666;"> coopérative${count > 1 ? 's' : ''}</span>
        </div>
        ${onRegionClick ? `
          <button 
            class="filter-region-btn"
            data-region="${region}"
            style="
              display: inline-block;
              padding: 6px 12px;
              background-color: #F97316;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              font-weight: 500;
              margin-top: 8px;
            "
          >
            Filtrer par région →
          </button>
        ` : ''}
      `;
      
      // Add click handler to button
      if (onRegionClick) {
        const button = popupDiv.querySelector('.filter-region-btn') as HTMLButtonElement;
        if (button) {
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            onRegionClick(region);
          });
        }
      }
      
      marker.bindPopup(popupDiv);
      
      // Also allow clicking the marker itself to filter
      if (onRegionClick) {
        marker.on('click', () => {
          onRegionClick(region);
        });
      }
      
      markersRef.current.push(marker);
    });

    // Resize map to fit container
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      // Cleanup handled by refs
    };
  }, [cooperatives]);

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="h-[600px] w-full rounded-lg" />
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-[250px]">
        <h4 className="font-semibold text-secondary-600 mb-2 text-sm">Légende</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-600 border-2 border-white shadow"></div>
            <span>100+ coopératives</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-secondary-500 border-2 border-white shadow"></div>
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

