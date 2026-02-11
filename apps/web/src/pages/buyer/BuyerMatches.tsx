import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Package, CheckCircle, AlertCircle, Star, ExternalLink } from 'lucide-react';
import { getBuyerRequestById, getRequestMatches, updateMatchStatus } from '@/features/buyers/api';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { BuyerRequest, RequestMatch } from '@/domain/agro/types';
import { matchCooperativesToRequest } from '@/domain/agro/matching';

export default function BuyerMatches() {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<BuyerRequest | null>(null);
  const [matches, setMatches] = useState<RequestMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) {
      setError('Request ID is required');
      setLoading(false);
      return;
    }

    loadData();
  }, [requestId]);

  const loadData = async () => {
    if (!requestId) return;

    try {
      setLoading(true);
      setError(null);

      // Load request
      const { data: requestData, error: requestError } = await getBuyerRequestById(requestId);
      if (requestError || !requestData) {
        throw requestError || new Error('Request not found');
      }
      setRequest(requestData);

      // Load matches
      const { data: matchesData, error: matchesError } = await getRequestMatches(requestId);
      if (matchesError) {
        throw matchesError;
      }
      setMatches(matchesData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (matchId: string, newStatus: RequestMatch['status']) => {
    try {
      const { error } = await updateMatchStatus(matchId, newStatus);
      if (error) {
        throw error;
      }
      // Reload matches
      await loadData();
    } catch (err) {
      console.error('Error updating match status:', err);
    }
  };


  const getRiskBadgeColor = (risk?: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error || 'Request not found'}</p>
          <Link to="/buyer/request" className="mt-4 text-primary-600 hover:underline">
            Create a new request
          </Link>
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
          { label: 'Buyers', path: '/buyers' },
          { label: 'Buyer Portal', path: '/buyer' },
          { label: 'Matching Results' }
        ]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-xl shadow-lg p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      Matching Results
                    </h1>
                    <p className="text-white/90 text-lg">
                      Found {matches.length} cooperative{matches.length !== 1 ? 's' : ''} matching your requirements
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/buyer/request"
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
              >
                New Request
              </Link>
            </div>
          </div>
        </div>

        {/* Request Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Request</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Organization</p>
              <p className="font-medium">{request.buyerOrg}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Contact</p>
              <p className="font-medium">{request.buyerContactEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Commodity</p>
              <p className="font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                {request.commodity}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Target Country</p>
              <p className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {request.targetCountry}
              </p>
            </div>
            {request.minVolumeTons && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Volume Range</p>
                <p className="font-medium">
                  {request.minVolumeTons} - {request.maxVolumeTons || '∞'} tons
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-1">Requirements</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {request.requirements.eudrRequired && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded" title="EUDR-aligned documentation context required">EUDR-Aligned Documentation</span>
                )}
                {request.requirements.childLaborZeroTolerance && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded" title="Zero tolerance policy for child labor">Zero Tolerance Policy</span>
                )}
                {request.requirements.certifications?.map(cert => (
                  <span key={cert} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Matches List */}
        {matches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Matches Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any cooperatives matching your requirements. Try adjusting your filters.
            </p>
            <Link
              to="/buyer/request"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create New Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const coop = match.cooperative;
              if (!coop) return null;

              return (
                <div
                  key={match.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{coop.name}</h3>
                        {/* Match Score Badge */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full">
                            <Star className="h-4 w-4 text-primary-600 fill-primary-600" />
                            <span className="text-sm font-semibold text-primary-700">
                              {match.matchScore}% Match
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {coop.country && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {coop.country}
                            {coop.region && `, ${coop.region}`}
                          </span>
                        )}
                        {coop.commodity && (
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {coop.commodity}
                          </span>
                        )}
                        {coop.annualVolumeTons && (
                          <span>
                            {coop.annualVolumeTons.toLocaleString()} tons/year
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/cooperatives/${coop.id}`}
                      className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2"
                    >
                      View Profile
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* Match Reasons */}
                  {request && (() => {
                    const matchingResult = matchCooperativesToRequest(request, [coop]);
                    const reasons = matchingResult[0]?.reasons || [];
                    return reasons.length > 0 ? (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Why this match?
                        </p>
                        <ul className="space-y-1">
                          {reasons.map((reason, idx) => (
                            <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}

                  {/* Contextual Information */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coop.complianceFlags.eudrReady && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full" title="EUDR-aligned documentation context available (not a compliance determination)">
                        EUDR-Aligned Documentation
                      </span>
                    )}
                    {coop.complianceFlags.childLaborRisk && (
                      <span className={`px-3 py-1 text-sm rounded-full ${getRiskBadgeColor(coop.complianceFlags.childLaborRisk)}`} title="Contextual risk indicator (not a compliance determination)">
                        Child Labor Risk: {coop.complianceFlags.childLaborRisk.charAt(0).toUpperCase() + coop.complianceFlags.childLaborRisk.slice(1)}
                      </span>
                    )}
                    {coop.certifications.map(cert => (
                      <span key={cert} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full" title="Certification status (self-reported)">
                        {cert}
                      </span>
                    ))}
                  </div>

                  {/* Contact Information */}
                  {(coop.contactEmail || coop.contactPhone) && (
                    <div className="border-t pt-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Contact Information</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {coop.contactEmail && (
                          <a
                            href={`mailto:${coop.contactEmail}`}
                            className="flex items-center gap-2 text-primary-600 hover:underline"
                          >
                            <Mail className="h-4 w-4" />
                            {coop.contactEmail}
                          </a>
                        )}
                        {coop.contactPhone && (
                          <a
                            href={`tel:${coop.contactPhone}`}
                            className="flex items-center gap-2 text-primary-600 hover:underline"
                          >
                            <Phone className="h-4 w-4" />
                            {coop.contactPhone}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Match Actions */}
                  <div className="border-t pt-4 flex gap-2">
                    <select
                      value={match.status}
                      onChange={(e) => handleStatusChange(match.id, e.target.value as RequestMatch['status'])}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                      title="Update match status"
                      aria-label="Match status"
                    >
                      <option value="suggested">Suggested</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="contacted">Contacted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

