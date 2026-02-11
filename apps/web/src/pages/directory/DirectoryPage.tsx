import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Building2, X, ClipboardList, Grid3x3, List, MapPin } from 'lucide-react';
import {
  getCanonicalDirectoryRecords,
  getCanonicalDirectoryRecordsByStatus,
} from '@/features/cooperatives/api/canonicalDirectoryApi';
import CanonicalDirectoryCard from '@/features/cooperatives/components/CanonicalDirectoryCard';
import CanonicalDirectoryMap from '@/features/cooperatives/components/CanonicalDirectoryMap';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { CanonicalCooperativeDirectory } from '@/types';
import type { EudrCommodity } from '@/types';
import type { CoverageBand } from '@/types';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';

// Helper function to get coverage band for a coop + commodity
// Note: This is a placeholder - can be enhanced with real per-commodity lookup when available
function getCoverageBandForCommodity(
  coop: CanonicalCooperativeDirectory,
  commodity: EudrCommodity
): CoverageBand | null {
  // For now, if the coop has that commodity at all, fall back to its main coverageBand.
  // If you already have per-commodity metrics, plug them in instead.
  if (!coop.commodities?.includes(commodity)) return null;

  // Assuming coop.coverageBand exists; adjust if needed
  return coop.coverageBand ?? null;
}

// Helper to derive commodities from primary_crop for backward compatibility
function getCommoditiesFromRecord(record: CanonicalCooperativeDirectory): EudrCommodity[] {
  if (record.commodities && record.commodities.length > 0) {
    return record.commodities;
  }
  
  // Fallback: try to map primary_crop to EUDR commodity
  if (record.primary_crop) {
    const cropLower = record.primary_crop.toLowerCase();
    const commodityMap: Record<string, EudrCommodity> = {
      'cocoa': 'cocoa',
      'cacao': 'cocoa',
      'coffee': 'coffee',
      'café': 'coffee',
      'palm': 'palm_oil',
      'palm oil': 'palm_oil',
      'rubber': 'rubber',
      'soy': 'soy',
      'soja': 'soy',
      'cattle': 'cattle',
      'wood': 'wood',
      'timber': 'wood',
    };
    
    for (const [key, value] of Object.entries(commodityMap)) {
      if (cropLower.includes(key)) {
        return [value];
      }
    }
  }
  
  return [];
}

export default function DirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState<CanonicalCooperativeDirectory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Context-first filter controls (product-first, region-aware, coverage-aware)
  // Default: Cocoa, CI (Côte d'Ivoire), All regions, All coverage levels
  // Check URL params for region filter from map clicks
  const regionFromUrl = searchParams.get('region');
  const [selectedCommodity, setSelectedCommodity] = useState<EudrCommodity | 'all'>('cocoa');
  const [selectedCountry, setSelectedCountry] = useState<string>('CI'); // Côte d'Ivoire as v1 default
  const [selectedRegion, setSelectedRegion] = useState<string>(regionFromUrl || 'all');
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageBand | 'all'>('all');
  
  // Legacy filters (keeping for backward compatibility)
  const [statusFilter, setStatusFilter] = useState<'active' | 'all'>('active');
  const [pilotFilter, setPilotFilter] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'list'>('map'); // Map is default landing view
  const [workspaceOnly, setWorkspaceOnly] = useState(false);

  // Handle URL parameter for region filter (from map clicks)
  useEffect(() => {
    if (regionFromUrl && regionFromUrl !== selectedRegion) {
      setSelectedRegion(regionFromUrl);
      // Switch to grid view when region is selected from map
      setViewMode('grid');
    }
  }, [regionFromUrl]);

  // Update URL when region filter changes (but not on initial load if URL param exists)
  useEffect(() => {
    if (selectedRegion !== 'all' && selectedRegion !== regionFromUrl) {
      setSearchParams({ region: selectedRegion }, { replace: true });
    } else if (selectedRegion === 'all' && regionFromUrl) {
      setSearchParams({}, { replace: true });
    }
  }, [selectedRegion, regionFromUrl, setSearchParams]);

  // Fetch records on mount and when filters change
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);

      try {
        let result;

        // For now, fetch all active records and filter client-side
        // This allows us to use the new commodity/region/coverage filters
        if (statusFilter === 'active') {
          result = await getCanonicalDirectoryRecordsByStatus('active');
        } else {
          result = await getCanonicalDirectoryRecords();
        }

        if (result.error) {
          throw result.error;
        }

        setRecords(result.data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching directory records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [statusFilter]);

  // Derive filter options from data (context-aware filtering)
  const countries = useMemo(
    () =>
      Array.from(
        new Set(
          records
            .map((c) => c.countryCode || c.country)
            .filter(Boolean)
        )
      ).sort(),
    [records]
  );

  const regions = useMemo(
    () =>
      Array.from(
        new Set(
          records
            .filter((c) =>
              selectedCountry === 'all' ? true : (c.countryCode || c.country) === selectedCountry
            )
            .map((c) => c.regionName || c.region || 'Unspecified')
        )
      ).sort(),
    [records, selectedCountry]
  );

  // Derive available commodities from records (only show commodities that exist in data)
  const availableCommodities = useMemo(() => {
    const commoditySet = new Set<EudrCommodity>();
    records.forEach((record) => {
      const commodities = getCommoditiesFromRecord(record);
      commodities.forEach((commodity) => commoditySet.add(commodity));
    });
    return Array.from(commoditySet).sort((a, b) => {
      const labelA = EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === a)?.label || a;
      const labelB = EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === b)?.label || b;
      return labelA.localeCompare(labelB);
    });
  }, [records]);

  // Adjust default commodity if 'cocoa' is not available
  useEffect(() => {
    if (availableCommodities.length > 0 && selectedCommodity === 'cocoa' && !availableCommodities.includes('cocoa')) {
      // If cocoa is not available, default to first available commodity
      setSelectedCommodity(availableCommodities[0]);
    }
  }, [availableCommodities, selectedCommodity]);

  // Apply context-first filters: commodity, geography, coverage
  const filteredRecords = useMemo(() => {
    let filtered = records;

    // Apply pilot filter if set (client-side)
    if (pilotFilter) {
      filtered = filtered.filter(record => 
        record.pilot_id === pilotFilter || 
        record.pilot_label?.toLowerCase() === pilotFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.name.toLowerCase().includes(search) ||
        record.country?.toLowerCase().includes(search) ||
        record.region?.toLowerCase().includes(search) ||
        record.department?.toLowerCase().includes(search) ||
        record.primary_crop?.toLowerCase().includes(search) ||
        record.source_registry?.toLowerCase().includes(search)
      );
    }

    // Apply new filters
    return filtered.filter((coop) => {
      // 1) commodity filter
      if (selectedCommodity !== 'all') {
        const coopCommodities = getCommoditiesFromRecord(coop);
        if (!coopCommodities.includes(selectedCommodity)) return false;
      }

      // 2) country filter
      const coopCountry = coop.countryCode || coop.country;
      if (selectedCountry !== 'all' && coopCountry !== selectedCountry) {
        return false;
      }

      // 3) region filter
      if (selectedRegion !== 'all') {
        const region = coop.regionName || coop.region || 'Unspecified';
        if (region !== selectedRegion) return false;
      }

      // 4) coverage filter (per selected commodity if any)
      if (selectedCoverage !== 'all') {
        if (selectedCommodity === 'all') {
          // If all commodities are selected, fall back to coop-level coverage if present
          const band = coop.coverageBand;
          if (!band || band !== selectedCoverage) return false;
        } else {
          const band = getCoverageBandForCommodity(coop, selectedCommodity);
          if (!band || band !== selectedCoverage) return false;
        }
      }

      return true;
    });
  }, [records, searchTerm, pilotFilter, selectedCommodity, selectedCountry, selectedRegion, selectedCoverage]);

  const stats = useMemo(() => {
    const active = records.filter(r => r.record_status === 'active').length;
    const uniqueCountries = new Set(records.map(r => r.countryCode || r.country).filter(Boolean)).size;
    const uniqueCommodities = new Set(
      records.flatMap(r => getCommoditiesFromRecord(r))
    ).size;
    return {
      total: records.length,
      active,
      countries: uniqueCountries,
      commodities: uniqueCommodities,
    };
  }, [records]);

  const clearFilters = () => {
    // Reset to first available commodity (or 'cocoa' if available, otherwise first in list)
    const defaultCommodity = availableCommodities.includes('cocoa') 
      ? 'cocoa' 
      : (availableCommodities[0] || 'all');
    setSelectedCommodity(defaultCommodity);
    setSelectedCountry('CI');
    setSelectedRegion('all');
    setSelectedCoverage('all');
    setSearchTerm('');
    setStatusFilter('active');
    setPilotFilter('');
  };

  // Determine default commodity for hasActiveFilters check
  const defaultCommodity = availableCommodities.includes('cocoa') 
    ? 'cocoa' 
    : (availableCommodities[0] || 'all');

  const hasActiveFilters = 
    selectedCommodity !== defaultCommodity ||
    selectedCountry !== 'CI' ||
    selectedRegion !== 'all' ||
    selectedCoverage !== 'all' ||
    searchTerm ||
    statusFilter !== 'active' ||
    pilotFilter;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du répertoire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Erreur de chargement: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Directory', path: '/directory' }
        ]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Canonical Cooperative Directory
                </h1>
                <p className="text-white/90 text-lg">
                  Verified cooperative records with documentation coverage and compliance metrics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-primary-500">
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {stats.total.toLocaleString()}
            </div>
            <div className="text-gray-600 text-sm">Enregistrements dans le répertoire</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.active.toLocaleString()}
            </div>
            <div className="text-gray-600 text-sm">Actifs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-secondary-500">
            <div className="text-3xl font-bold text-secondary-600 mb-1">
              {stats.countries}
            </div>
            <div className="text-gray-600 text-sm">Pays</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.commodities}
            </div>
            <div className="text-gray-600 text-sm">Commodités</div>
          </div>
        </div>

        {/* Context-first filters bar (product-first, region-aware, coverage-aware) */}
        <section className="mb-4 space-y-2 bg-white rounded-lg shadow-md p-6">
          <p className="text-xs text-gray-600 mb-4">
            Filter cooperatives by EUDR commodity, geography, and documentation coverage to support sourcing and due-diligence planning.
          </p>

          <div className="flex flex-wrap gap-3 items-center text-xs">
            {/* Commodity */}
            <label className="flex items-center gap-1">
              <span className="font-medium">Commodity</span>
              <select
                value={selectedCommodity}
                onChange={(e) =>
                  setSelectedCommodity(e.target.value as EudrCommodity | 'all')
                }
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="all">All commodities</option>
                {availableCommodities.map((commodityId) => {
                  const commodity = EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === commodityId);
                  return (
                    <option key={commodityId} value={commodityId}>
                      {commodity?.label || commodityId}
                    </option>
                  );
                })}
              </select>
            </label>

            {/* Country */}
            <label className="flex items-center gap-1">
              <span className="font-medium">Country</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="all">All</option>
                {countries.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>

            {/* Region */}
            <label className="flex items-center gap-1">
              <span className="font-medium">Region</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="all">All</option>
                {regions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            {/* Coverage */}
            <label className="flex items-center gap-1">
              <span className="font-medium">Coverage</span>
              <select
                value={selectedCoverage}
                onChange={(e) =>
                  setSelectedCoverage(
                    e.target.value === 'all'
                      ? 'all'
                      : (e.target.value as CoverageBand)
                  )
                }
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="all">All levels</option>
                <option value="substantial">Substantial</option>
                <option value="partial">Partial</option>
                <option value="limited">Limited</option>
              </select>
            </label>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-900 bg-gray-100 rounded transition-colors"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </section>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Résultats ({filteredRecords.length})
            </h2>
          </div>

          {/* Context-first display: product/region/coverage shown before cooperative names */}
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-xs text-gray-500 mt-4">
                No cooperatives match the current filters. Try broadening commodity, region, or coverage level.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-secondary-600 hover:text-secondary-700 underline text-sm"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <>
              {/* View mode toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded ${viewMode === 'map' ? 'bg-secondary-100 text-secondary-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Map view"
                  >
                    <MapPin className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-secondary-100 text-secondary-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Grid view"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-secondary-100 text-secondary-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                {viewMode !== 'map' && (
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={workspaceOnly}
                      onChange={(e) => setWorkspaceOnly(e.target.checked)}
                      className="rounded"
                    />
                    <span>Show only cooperatives with workspace</span>
                  </label>
                )}
              </div>

              {/* Results display */}
              {viewMode === 'map' ? (
                <div className="bg-white rounded-lg overflow-hidden">
                  <CanonicalDirectoryMap records={filteredRecords.filter(coop => !workspaceOnly || coop.coop_id)} />
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRecords
                    .filter(coop => !workspaceOnly || coop.coop_id) // Filter by workspace if enabled
                    .map((coop) => (
                      <CanonicalDirectoryCard key={coop.coop_id} record={coop} />
                    ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredRecords
                    .filter(coop => !workspaceOnly || coop.coop_id) // Filter by workspace if enabled
                    .map((coop) => {
                      const regionLabel = coop.regionName || coop.region || 'Unspecified region';
                      const countryLabel = coop.countryCode || coop.country || 'Unknown';

                      const primaryCommodity =
                        selectedCommodity === 'all'
                          ? getCommoditiesFromRecord(coop)[0] ?? null
                          : selectedCommodity;

                      const commodityLabel = primaryCommodity
                        ? EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === primaryCommodity)?.label ??
                          'Multi-commodity'
                        : 'Multi-commodity';

                      const coverageBand = coop.coverageBand;
                      const coverageLabel = coverageBand
                        ? coverageBand.charAt(0).toUpperCase() + coverageBand.slice(1)
                        : 'Not available';

                      return (
                        <li key={coop.coop_id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                          {/* Context line */}
                          <div className="text-xs text-gray-600 mb-2">
                            <span className="font-semibold">{commodityLabel}</span>{' '}
                            • {countryLabel}{' '}
                            • {regionLabel}
                          </div>

                          {/* Coop name - formatted according to workflow (not displayed directly) */}
                          <h2 className="text-base font-semibold mb-2">{coop.name}</h2>

                          {/* Coverage snippet (commodity-aware if possible) */}
                          <div className="text-xs text-gray-600 mb-3">
                            <span>
                              Documentation coverage: {coverageLabel}
                            </span>
                          </div>

                          {/* Status and CTA */}
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium ${
                              coop.record_status === 'active' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {coop.record_status === 'active' ? 'Actif' : coop.record_status}
                            </span>
                            <a
                              href={`/directory/${coop.coop_id}`}
                              className="text-xs font-medium underline text-secondary-600 hover:text-secondary-700"
                            >
                              View profile →
                            </a>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
