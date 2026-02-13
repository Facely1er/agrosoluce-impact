/**
 * Map — core feature: integrated cooperatives + health by region with layers and heatmap.
 * Full-viewport map; minimal chrome.
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { useVracData } from '@/hooks/useVracData';
import type { RegionHealthInfo } from '@/features/cooperatives/components/CanonicalDirectoryMap';
import CanonicalDirectoryMap from '@/features/cooperatives/components/CanonicalDirectoryMap';
import { getCanonicalDirectoryRecordsByStatus } from '@/features/cooperatives/api/canonicalDirectoryApi';
import type { CanonicalCooperativeDirectory } from '@/types';

const VRAC_REGION_TO_DISPLAY: Record<string, string> = {
  gontougo: 'Gontougo',
  la_me: 'La Mé',
  abidjan: 'Abidjan',
};

export default function MapPage() {
  const navigate = useNavigate();
  const { healthIndex } = useVracData();
  const [directoryRecords, setDirectoryRecords] = useState<CanonicalCooperativeDirectory[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);

  const regionHealth = useMemo((): Record<string, RegionHealthInfo> => {
    if (!healthIndex.length) return {};
    const byRegion: Record<string, { shares: number[]; antibiotic?: number[]; risks: ('low' | 'medium' | 'high')[] }> = {};
    for (const h of healthIndex) {
      const regionKey = (h as any).regionId || (h.regionLabel && (h.regionLabel as string).replace(/\s*\(.*\)$/, '').trim()) || '';
      const displayName = VRAC_REGION_TO_DISPLAY[regionKey.toLowerCase()] || regionKey || (h.regionLabel?.split(' ')[0]);
      if (!displayName) continue;
      if (!byRegion[displayName]) byRegion[displayName] = { shares: [], antibiotic: [], risks: [] };
      byRegion[displayName].shares.push(h.antimalarialShare * 100);
      if ((h as any).antibioticShare != null) (byRegion[displayName].antibiotic ??= []).push((h as any).antibioticShare * 100);
      if ((h as any).harvestAlignedRisk) byRegion[displayName].risks.push((h as any).harvestAlignedRisk);
    }
    const out: Record<string, RegionHealthInfo> = {};
    for (const [name, data] of Object.entries(byRegion)) {
      const avgShare = data.shares.length ? data.shares.reduce((a, b) => a + b, 0) / data.shares.length : 0;
      const avgAntibiotic = data.antibiotic?.length
        ? data.antibiotic.reduce((a, b) => a + b, 0) / data.antibiotic.length
        : undefined;
      const worstRisk = data.risks.includes('high') ? 'high' : data.risks.includes('medium') ? 'medium' : data.risks[0];
      out[name] = { antimalarialSharePct: avgShare, antibioticSharePct: avgAntibiotic, harvestRisk: worstRisk };
    }
    return out;
  }, [healthIndex]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setDirectoryLoading(true);
      try {
        const result = await getCanonicalDirectoryRecordsByStatus('active');
        if (!cancelled && result.data) setDirectoryRecords(result.data);
      } catch {
        if (!cancelled) setDirectoryRecords([]);
      } finally {
        if (!cancelled) setDirectoryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-none px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Map', path: '/map' }]} />
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Cooperatives & health by region
          </h1>
          <button
            type="button"
            onClick={() => navigate('/directory')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg"
          >
            <MapPin className="h-4 w-4" />
            View directory
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full">
        {directoryLoading && directoryRecords.length === 0 ? (
          <div className="h-full min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <CanonicalDirectoryMap
            records={directoryRecords}
            height="calc(100vh - 140px)"
            displayMode="both"
            regionHealth={Object.keys(regionHealth).length > 0 ? regionHealth : undefined}
            layerCooperatives={directoryRecords.length > 0}
            layerHealth={Object.keys(regionHealth).length > 0}
            onRegionClick={(region) => navigate(`/directory?region=${encodeURIComponent(region)}`)}
          />
        )}
      </div>
    </div>
  );
}
