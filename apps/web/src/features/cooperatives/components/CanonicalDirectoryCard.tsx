import { Link } from 'react-router-dom';
import { MapPin, Sprout, FileText } from 'lucide-react';
import type { CanonicalCooperativeDirectory } from '@/types';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';

interface CanonicalDirectoryCardProps {
  record: CanonicalCooperativeDirectory;
}

export default function CanonicalDirectoryCard({ record }: CanonicalDirectoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-gray-500';
      case 'archived':
        return 'text-gray-400';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'archived':
        return 'Archivé';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  // Context-first: Get commodity, country, region for context line
  const primaryCommodity = record.commodities && record.commodities.length > 0 
    ? record.commodities[0] 
    : null;
  const commodityLabel = primaryCommodity
    ? EUDR_COMMODITIES_IN_SCOPE.find(c => c.id === primaryCommodity)?.label || primaryCommodity
    : (record.primary_crop || null);
  const countryCode = record.countryCode || (record.country && record.country.length === 2 ? record.country : 'CI') || 'CI';
  const region = record.regionName || record.region || '';

  return (
    <Link
      to={`/directory/${record.coop_id}`}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-secondary-500"
    >
      {/* Context line - shown first (product-first, region-aware, coverage-aware) */}
      {(commodityLabel || countryCode || region) && (
        <div className="text-xs text-gray-600 mb-2">
          {commodityLabel && <span className="font-semibold">{commodityLabel}</span>}
          {commodityLabel && (countryCode || region) && <span> • </span>}
          {countryCode && <span>{countryCode}</span>}
          {countryCode && region && <span> • </span>}
          {region && <span>{region}</span>}
        </div>
      )}

      {/* Cooperative name - formatted, shown after context */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {record.name}
        </h3>
        <span className={`text-sm font-medium ${getStatusColor(record.record_status)}`}>
          {getStatusLabel(record.record_status)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {record.country && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{record.country}</span>
            {record.region && (
              <>
                <span className="text-gray-300">•</span>
                <span>{record.region}</span>
              </>
            )}
            {record.department && (
              <>
                <span className="text-gray-300">•</span>
                <span>{record.department}</span>
              </>
            )}
          </div>
        )}
        {record.primary_crop && !record.commodities && (
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{record.primary_crop}</span>
          </div>
        )}
        {record.coverageBand && (
          <div className="text-xs text-gray-500">
            Documentation coverage: {record.coverageBand.charAt(0).toUpperCase() + record.coverageBand.slice(1)}
          </div>
        )}
        {record.source_registry && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">{record.source_registry}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

