import { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertCircle, MapPin, Package } from 'lucide-react';
import { findSuppliers, type BuyerRequirements, type MatchResult } from '../services/matchingService';
import type { Cooperative } from '@/types';
import { useCooperatives } from '@/hooks/useCooperatives';

interface MatchingResultsProps {
  requirements: BuyerRequirements;
  onSelectMatch?: (match: MatchResult) => void;
}

export default function MatchingResults({ requirements, onSelectMatch }: MatchingResultsProps) {
  const { cooperatives } = useCooperatives();
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooperatives.length > 0) {
      performMatching();
    }
  }, [requirements, cooperatives]);

  const performMatching = async () => {
    setLoading(true);
    setError(null);

    try {
      const matches = await findSuppliers(requirements, cooperatives);
      setResults(matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Recherche de fournisseurs correspondants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Erreur: {error}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Aucun fournisseur correspondant trouvé</p>
        <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Résultats de correspondance ({results.length})
        </h3>
      </div>

      <div className="space-y-4">
        {results.map((match, index) => (
          <div
            key={`${match.product.id}-${index}`}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-5 w-5 text-primary-600" />
                  <h4 className="text-lg font-semibold text-gray-900">{match.product.name}</h4>
                  <span
                    className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(
                      match.matchScore
                    )}`}
                  >
                    {match.matchScore}% de correspondance
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{match.cooperative.name}</span>
                  {match.cooperative.region && (
                    <span className="flex items-center gap-1 ml-2">
                      <MapPin className="h-4 w-4" />
                      {match.cooperative.region}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Prix:</span> {match.product.price} {match.product.currency || 'XOF'}{' '}
                  / {match.product.unit || 'kg'}
                  {match.product.quantity_available && (
                    <>
                      {' • '}
                      <span className="font-medium">Disponible:</span> {match.product.quantity_available}{' '}
                      {match.product.unit || 'kg'}
                    </>
                  )}
                </div>
              </div>
            </div>

            {match.matchReasons.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 mb-1">Points forts:</div>
                <div className="flex flex-wrap gap-2">
                  {match.matchReasons.map((reason, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.missingRequirements && match.missingRequirements.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 mb-1">Points à améliorer:</div>
                <div className="flex flex-wrap gap-2">
                  {match.missingRequirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {onSelectMatch && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => onSelectMatch(match)}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Contacter ce fournisseur
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

