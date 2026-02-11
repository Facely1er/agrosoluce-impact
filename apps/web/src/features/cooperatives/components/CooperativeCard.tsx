import { Link } from 'react-router-dom';
import { MapPin, Building2, CheckCircle, Clock } from 'lucide-react';
import type { Cooperative } from '@/types';
import ComplianceBadge from '@/components/cooperatives/ComplianceBadge';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';

interface CooperativeCardProps {
  cooperative: Cooperative;
}

export default function CooperativeCard({ cooperative }: CooperativeCardProps) {
  const { t } = useI18n();
  
  // Support both database (is_verified) and legacy (status) verification fields
  const isVerified = cooperative.is_verified ?? cooperative.status === 'verified';
  
  // Support both database (sector/department) and legacy (secteur/departement) fields
  const sector = cooperative.sector || cooperative.secteur || '';
  const department = cooperative.department || cooperative.departement;
  
  // Context-first: Get commodity, country, region for context line
  const commodity = (cooperative as any).commodity || '';
  const commodityLabel = commodity 
    ? EUDR_COMMODITIES_IN_SCOPE.find(c => c.id === commodity.toLowerCase().replace(/\s+/g, '_'))?.label || commodity
    : null;
  const country = cooperative.country || 'CI';
  const countryCode = country.length === 2 ? country : 'CI';
  const region = cooperative.region || '';

  return (
    <Link
      to={`/cooperatives/${cooperative.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-secondary-500 dark:border-secondary-400 hover:border-primary-500 dark:hover:border-primary-400"
    >
      {/* Context line - shown first (product-first, region-aware, coverage-aware) */}
      {(commodityLabel || countryCode || region) && (
        <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
          {commodityLabel && <span className="font-semibold">{commodityLabel}</span>}
          {commodityLabel && (countryCode || region) && <span> • </span>}
          {countryCode && <span>{countryCode}</span>}
          {countryCode && region && <span> • </span>}
          {region && <span>{region}</span>}
        </div>
      )}

      {/* Cooperative name - formatted, shown after context */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1">
          {cooperative.name}
        </h3>
        {isVerified ? (
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
            <CheckCircle className="h-4 w-4" />
            {t.cooperative.verified}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-sm">
            <Clock className="h-4 w-4" />
            {t.cooperative.pending}
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span>{cooperative.region}</span>
          {department && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>{department}</span>
            </>
          )}
        </div>
        {sector && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <span>{sector}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <ComplianceBadge cooperativeId={cooperative.id} />
        {cooperative.natureActiviteTags && cooperative.natureActiviteTags.length > 0 && (
          <>
            {cooperative.natureActiviteTags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </>
        )}
      </div>
    </Link>
  );
}

