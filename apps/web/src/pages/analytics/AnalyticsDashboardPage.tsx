/**
 * Analytics Dashboard — single map with Cooperatives + Health layers and heatmap.
 * No hero; compact stats and links only.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Shield,
  Heart,
  Download,
  ChevronDown,
  ChevronUp,
  BookOpen,
  AlertCircle,
  UsersRound,
  MapPin,
} from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { useVracData } from '@/hooks/useVracData';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  getLatestHWIScores,
  getActiveAlerts,
  getAlertDistribution,
} from '@/services/hwi/hwiService';
import {
  ANALYTICS_DATA_RANGE,
  HEALTH_INDEX_METHODOLOGY,
  ANALYTICS_REFERENCES,
} from '@/data/analyticsMethodology';
import type { HWIScoreWithPharmacy } from '@/services/hwi/hwiService';
import type { RegionHealthInfo } from '@/features/cooperatives/components/CanonicalDirectoryMap';
import CanonicalDirectoryMap from '@/features/cooperatives/components/CanonicalDirectoryMap';
import { getCanonicalDirectoryRecordsByStatus } from '@/features/cooperatives/api/canonicalDirectoryApi';
import type { CanonicalCooperativeDirectory } from '@/types';

const VRAC_REGION_TO_DISPLAY: Record<string, string> = {
  gontougo: 'Gontougo',
  la_me: 'La Mé',
  abidjan: 'Abidjan',
};

interface ComplianceSummary {
  totalCooperatives: number;
  averageReadinessScore: number;
  cooperativesWithGoodScores: number;
  totalViolations: number;
  documentationCoverageRate: number;
}

interface AnalyticsAggregate {
  health: {
    dataPoints: number;
    pharmacies: number;
    avgAntimalarialSharePct: number;
    years: number[];
    source: string;
  } | null;
  compliance: ComplianceSummary | null;
  hwi: {
    pharmacyCount: number;
    activeAlerts: number;
    criticalAlerts: number;
    avgScore: number;
    alertDistribution: Record<string, number>;
  } | null;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  to,
  variant = 'default',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  to?: string;
  variant?: 'default' | 'success' | 'warning' | 'muted';
}) {
  const variantClasses = {
    default: 'bg-white border-gray-200 text-gray-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    muted: 'bg-gray-50 border-gray-200 text-gray-600',
  };
  const content = (
    <div
      className={`rounded-xl border p-4 ${variantClasses[variant]} ${
        to ? 'hover:shadow-md transition-shadow' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium opacity-80">{title}</p>
          <p className="text-xl font-bold mt-0.5 truncate">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-75 line-clamp-2">{subtitle}</p>}
        </div>
        <Icon className="h-6 w-6 opacity-60 flex-shrink-0" />
      </div>
    </div>
  );
  if (to) return <Link to={to} className="block">{content}</Link>;
  return content;
}

export default function AnalyticsDashboardPage() {
  const navigate = useNavigate();
  const { healthIndex, loading: healthLoading, error: healthError, source: healthSource } = useVracData();
  const [compliance, setCompliance] = useState<ComplianceSummary | null>(null);
  const [complianceError, setComplianceError] = useState<string | null>(null);
  const [hwiData, setHwiData] = useState<{
    scores: HWIScoreWithPharmacy[];
    alerts: HWIScoreWithPharmacy[];
    distribution: any[];
  } | null>(null);
  const [hwiError, setHwiError] = useState<string | null>(null);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [directoryRecords, setDirectoryRecords] = useState<CanonicalCooperativeDirectory[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(false);

  // Region health from VRAC (for both Health map and Cooperatives map overlay)
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

  // Fetch directory records on mount for central map (Cooperatives + Health layers)
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

  // Fetch compliance summary
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;
    (async () => {
      try {
        const { data: statuses, error } = await supabase
          .from('cooperative_compliance_status')
          .select('*')
          .order('compliance_score', { ascending: false });
        if (error) throw error;
        const list = statuses || [];
        const total = list.length;
        const withGood = list.filter((s: any) => (s.readiness_score ?? s.compliance_score ?? 0) >= 75).length;
        const violations = list.reduce((sum: number, s: any) => sum + (s.child_labor_violations || 0), 0);
        const avgScore = total > 0
          ? list.reduce((sum: number, s: any) => sum + (s.readiness_score ?? s.compliance_score ?? 0), 0) / total
          : 0;
        setCompliance({
          totalCooperatives: total,
          averageReadinessScore: Math.round(avgScore * 10) / 10,
          cooperativesWithGoodScores: withGood,
          totalViolations: violations,
          documentationCoverageRate: total > 0 ? (withGood / total) * 100 : 0,
        });
        setComplianceError(null);
      } catch (e: any) {
        setComplianceError(e?.message || 'Failed to load compliance data');
        setCompliance(null);
      }
    })();
  }, []);

  // Fetch HWI summary
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    (async () => {
      try {
        const [scores, alerts, distribution] = await Promise.all([
          getLatestHWIScores(),
          getActiveAlerts(),
          getAlertDistribution(),
        ]);
        const dist: Record<string, number> = { green: 0, yellow: 0, red: 0, black: 0 };
        (distribution || []).forEach((d: any) => { if (d.alert_level != null) dist[d.alert_level] = d.count ?? 0; });
        setHwiData({ scores, alerts, distribution: Object.entries(dist).map(([level, count]) => ({ alert_level: level, count })) });
        setHwiError(null);
      } catch {
        setHwiError('HWI data requires database connection');
        setHwiData(null);
      }
    })();
  }, []);

  const healthSummary = useMemo(() => {
    if (!healthIndex.length) return null;
    const years = Array.from(new Set(healthIndex.map((h) => h.year))).sort((a, b) => a - b);
    const pharmacyIds = Array.from(new Set(healthIndex.map((h) => h.pharmacyId)));
    const avgShare = healthIndex.reduce((sum, h) => sum + h.antimalarialShare, 0) / healthIndex.length;
    return {
      dataPoints: healthIndex.length,
      pharmacies: pharmacyIds.length,
      avgAntimalarialSharePct: Math.round(avgShare * 1000) / 10,
      years,
      source: healthSource || 'static',
    };
  }, [healthIndex, healthSource]);

  const aggregate: AnalyticsAggregate = useMemo(
    () => ({
      health: healthSummary,
      compliance: compliance ?? null,
      hwi: hwiData
        ? {
            pharmacyCount: hwiData.scores.length,
            activeAlerts: hwiData.alerts.length,
            criticalAlerts: hwiData.alerts.filter((a) => a.alert_level === 'red' || a.alert_level === 'black').length,
            avgScore: hwiData.scores.length > 0
              ? Math.round((hwiData.scores.reduce((s, x) => s + (x.hwi_score || 0), 0) / hwiData.scores.length) * 100) / 100
              : 0,
            alertDistribution: (hwiData.distribution || []).reduce(
              (acc: Record<string, number>, d: any) => { if (d.alert_level != null) acc[d.alert_level] = d.count ?? 0; return acc; },
              {}
            ),
          }
        : null,
    }),
    [healthSummary, compliance, hwiData]
  );

  const exportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      dataRange: ANALYTICS_DATA_RANGE,
      aggregate: { health: aggregate.health, compliance: aggregate.compliance, hwi: aggregate.hwi },
      methodology: { healthIndex: HEALTH_INDEX_METHODOLOGY, references: ANALYTICS_REFERENCES },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_dashboard_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loading = healthLoading;
  const hasAnyData = aggregate.health || aggregate.compliance || aggregate.hwi;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Analytics', path: '/analytics' }]} />

        {/* Top bar: title + export + links */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Cooperatives & health by region
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/map" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg">
              <MapPin className="h-4 w-4" /> Map
            </Link>
            <Link to="/vrac" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
              <Activity className="h-4 w-4" /> Health
            </Link>
            <Link to="/directory" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
              <MapPin className="h-4 w-4" /> Directory
            </Link>
            <Link to="/compliance/child-labor" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
              <Shield className="h-4 w-4" /> Compliance
            </Link>
            <Link to="/hwi" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
              <Heart className="h-4 w-4" /> HWI
            </Link>
            <button onClick={exportJson} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        {loading && !hasAnyData && (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent" />
          </div>
        )}

        {healthError && !aggregate.health && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {healthError}. Run <code className="bg-amber-100 dark:bg-amber-800/50 px-1 rounded">npm run vrac:process</code> or configure Supabase.
            </p>
          </div>
        )}

        {/* Map: Cooperatives + Health layers, heatmap */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 mb-4">
          {directoryLoading && directoryRecords.length === 0 ? (
            <div className="flex items-center justify-center min-h-[min(65vh,640px)]">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : (
            <CanonicalDirectoryMap
              records={directoryRecords}
              height="min(65vh, 640px)"
              displayMode="both"
              regionHealth={Object.keys(regionHealth).length > 0 ? regionHealth : undefined}
              layerCooperatives={directoryRecords.length > 0}
              layerHealth={Object.keys(regionHealth).length > 0}
              onRegionClick={(region) => navigate(`/directory?region=${encodeURIComponent(region)}`)}
            />
          )}
        </div>

        {/* Single compact stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {aggregate.health && (
            <StatCard title="Health data points" value={aggregate.health.dataPoints} subtitle={`${aggregate.health.pharmacies} pharmacies`} icon={Activity} to="/vrac" />
          )}
          {aggregate.health && (
            <StatCard title="Antimalarial share" value={`${aggregate.health.avgAntimalarialSharePct}%`} subtitle="VRAC" icon={Activity} to="/vrac" />
          )}
          {aggregate.hwi && (
            <StatCard title="HWI" value={aggregate.hwi.pharmacyCount} subtitle={`${aggregate.hwi.activeAlerts} alerts`} icon={Heart} to="/hwi" variant={aggregate.hwi.activeAlerts > 0 ? 'warning' : 'success'} />
          )}
          {aggregate.compliance && (
            <StatCard title="Cooperatives" value={aggregate.compliance.totalCooperatives} subtitle={`≥75: ${aggregate.compliance.cooperativesWithGoodScores}`} icon={UsersRound} to="/directory" />
          )}
        </div>

        {/* Methodology collapsible */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setMethodologyOpen(!methodologyOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary-600" />
              Data sources & methodology
            </span>
            {methodologyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {methodologyOpen && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Health (VRAC)</h4>
                <p>{HEALTH_INDEX_METHODOLOGY.metric}</p>
                <p className="mt-1">{ANALYTICS_DATA_RANGE.health.label}. Source: {HEALTH_INDEX_METHODOLOGY.source}.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Compliance</h4>
                <p>Self-assessment readiness scores. Not a certification.</p>
              </div>
              <ul className="space-y-1 text-xs">
                {ANALYTICS_REFERENCES.map((ref) => (
                  <li key={ref.id}><strong>{ref.label}:</strong> {ref.note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {(complianceError || hwiError) && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
            {complianceError && <p>Compliance: {complianceError}</p>}
            {hwiError && <p>HWI: {hwiError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
