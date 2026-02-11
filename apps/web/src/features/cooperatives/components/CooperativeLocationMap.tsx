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

interface CooperativeLocationMapProps {
  cooperative: Cooperative;
}

export default function CooperativeLocationMap({ cooperative }: CooperativeLocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Determine coordinates - prefer GPS coordinates, fallback to region coordinates
    let coordinates: [number, number];
    if (cooperative.latitude && cooperative.longitude) {
      coordinates = [cooperative.latitude, cooperative.longitude];
    } else {
      coordinates = getRegionCoordinates(cooperative.region || '');
    }

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(coordinates, 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(coordinates, 10);
    }

    const map = mapRef.current;

    // Clear existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Create custom icon for the cooperative
    const cooperativeIcon = L.divIcon({
      className: 'custom-cooperative-marker',
      html: `<div style="background-color: #FF7900; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">📍</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Create marker
    const marker = L.marker(coordinates, { icon: cooperativeIcon }).addTo(map);

    // Add popup with cooperative information
    const popupContent = `
      <div style="text-align: center; padding: 8px; min-width: 200px;">
        <strong style="color: #FF7900; font-size: 16px; display: block; margin-bottom: 8px;">${cooperative.name}</strong>
        <div style="font-size: 14px; color: #333; margin-bottom: 4px;">
          <strong>Région:</strong> ${cooperative.region || 'N/A'}
        </div>
        ${cooperative.department || cooperative.departement ? `
          <div style="font-size: 14px; color: #333; margin-bottom: 4px;">
            <strong>Département:</strong> ${cooperative.department || cooperative.departement}
          </div>
        ` : ''}
        ${cooperative.sector || cooperative.secteur ? `
          <div style="font-size: 14px; color: #333; margin-bottom: 4px;">
            <strong>Secteur:</strong> ${cooperative.sector || cooperative.secteur}
          </div>
        ` : ''}
        ${cooperative.latitude && cooperative.longitude ? `
          <div style="font-size: 12px; color: #666; margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
            GPS: ${cooperative.latitude.toFixed(4)}, ${cooperative.longitude.toFixed(4)}
          </div>
        ` : ''}
      </div>
    `;
    marker.bindPopup(popupContent);
    markerRef.current = marker;

    // Open popup by default
    marker.openPopup();

    // Resize map to fit container
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [cooperative]);

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="h-[500px] w-full rounded-lg border border-gray-200" />
      <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong className="text-blue-800">📍 Emplacement:</strong>{' '}
        {cooperative.latitude && cooperative.longitude ? (
          <>
            Coordonnées GPS précises ({cooperative.latitude.toFixed(4)}, {cooperative.longitude.toFixed(4)})
          </>
        ) : (
          <>
            Position estimée basée sur la région {cooperative.region || 'N/A'}
          </>
        )}
      </div>
    </div>
  );
}

