import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Sprout, FileText, Globe, Shield, AlertTriangle, Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { getCanonicalDirectoryRecordById } from '@/features/cooperatives/api/canonicalDirectoryApi';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { CanonicalCooperativeDirectory } from '@/types';
import {
  computeContextualRisks,
  computeRegulatoryContext,
} from '@/services/enrichmentService';
import {
  HIGH_DEFORESTATION_RISK_COUNTRIES,
  MEDIUM_DEFORESTATION_RISK_COUNTRIES,
  EUDR_PRODUCER_COUNTRIES,
  CHILD_LABOR_RISK_CROPS,
} from '@/config/enrichmentConfig';
import { getCoverageMetrics } from '@/features/coverage/api/coverageApi';
import type { CoverageMetrics } from '@/services/coverageService';
import { getCountryPackByCode, getCountryPackByName } from '@/data/countryPacks';
import { getCommodityPackByName } from '@/data/commodityPacks';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function DirectoryDetailPage() {
  const { coop_id } = useParams<{ coop_id: string }>();
  const { t } = useI18n();
  const [record, setRecord] = useState<CanonicalCooperativeDirectory | null>(null);
  const [coverageMetrics, setCoverageMetrics] = useState<CoverageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countryContextExpanded, setCountryContextExpanded] = useState(false);
  const [commodityContextExpanded, setCommodityContextExpanded] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!coop_id) {
        setError('Cooperative ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [recordResult, coverageResult] = await Promise.all([
          getCanonicalDirectoryRecordById(coop_id),
          getCoverageMetrics(coop_id),
        ]);

        if (recordResult.error) {
          throw recordResult.error;
        }
        if (!recordResult.data) {
          throw new Error('Record not found');
        }
        setRecord(recordResult.data);

        if (!coverageResult.error && coverageResult.data) {
          setCoverageMetrics(coverageResult.data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching directory record:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [coop_id]);

  // Derive market context
  const marketContext = record ? {
    country: record.country || 'Non spécifié',
    region: record.region || 'Non spécifié',
    primaryCrop: record.primary_crop || 'Non spécifié',
    isHighDeforestationRisk: HIGH_DEFORESTATION_RISK_COUNTRIES.includes(record.country as any),
    isMediumDeforestationRisk: MEDIUM_DEFORESTATION_RISK_COUNTRIES.includes(record.country as any),
    isEudrProducerCountry: EUDR_PRODUCER_COUNTRIES.includes(record.country as any),
    isChildLaborRiskCrop: CHILD_LABOR_RISK_CROPS.some(crop => 
      (record.primary_crop || '').toLowerCase().includes(crop.toLowerCase())
    ),
  } : null;

  // Derive market context for display
  const marketContextData = record ? (() => {
    // Convert canonical record to cooperative-like object for enrichment functions
    const cooperativeLike = {
      country: record.country || '',
      commodity: record.primary_crop || '',
      region: record.region,
      department: record.department,
    } as any;

    const contextualRisks = computeContextualRisks(cooperativeLike);
    const regulatoryContext = computeRegulatoryContext(cooperativeLike, ['EU']); // Assume EU buyer for EUDR check

    return {
      contextualRisks,
      regulatoryContext,
    };
  })() : null;

  // Get coverage description text
  const getCoverageDescription = (coveragePercentage: number): string => {
    if (coveragePercentage < 30) {
      return 'Limited documentation available';
    } else if (coveragePercentage >= 30 && coveragePercentage <= 70) {
      return 'Partial documentation available';
    } else {
      return 'Substantial documentation available';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Enregistrement non trouvé'}</p>
          <Link
            to="/directory"
            className="text-secondary-600 hover:text-secondary-700"
          >
            Retour au répertoire
          </Link>
        </div>
      </div>
    );
  }


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


  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Directory', path: '/directory' },
          { label: record?.name || 'Cooperative' }
        ]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-xl shadow-lg p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {record.name}
                </h1>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/30`}>
                  {getStatusLabel(record.record_status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Identity */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary-600" />
            Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Informations Générales</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Nom</div>
                      <div className="font-medium text-gray-900">{record.name}</div>
                    </div>
                  </div>
                  {record.country && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Pays</div>
                        <div className="font-medium text-gray-900">{record.country}</div>
                      </div>
                    </div>
                  )}
                  {record.region && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Région</div>
                        <div className="font-medium text-gray-900">{record.region}</div>
                      </div>
                    </div>
                  )}
                  {record.department && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Département</div>
                        <div className="font-medium text-gray-900">{record.department}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Activité</h3>
                <div className="space-y-3">
                  {record.primary_crop && (
                    <div className="flex items-start gap-3">
                      <Sprout className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Culture Principale</div>
                        <div className="font-medium text-gray-900">{record.primary_crop}</div>
                      </div>
                    </div>
                  )}
                  {record.commodities && record.commodities.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Sprout className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Commodities</div>
                        <div className="font-medium text-gray-900">
                          {record.commodities.map((c, idx) => (
                            <span key={c}>
                              {c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')}
                              {idx < record.commodities!.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {record.source_registry && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Source du Registre</div>
                        <div className="font-medium text-gray-900">{record.source_registry}</div>
                      </div>
                    </div>
                  )}
                  {record.created_at && (
                    <div>
                      <div className="text-sm text-gray-500">Date de Création</div>
                      <div className="font-medium text-gray-900">
                        {new Date(record.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Market Context Snapshot */}
        {marketContext && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary-600" />
              Market Context Snapshot
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="text-sm text-gray-500 mb-1">Pays</div>
                  <div className="font-medium text-gray-900">{marketContext.country}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="text-sm text-gray-500 mb-1">Région</div>
                  <div className="font-medium text-gray-900">{marketContext.region}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="text-sm text-gray-500 mb-1">Culture Principale</div>
                  <div className="font-medium text-gray-900">{marketContext.primaryCrop}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="text-sm text-gray-500 mb-1">Pays Producteur EUDR</div>
                  <div className="font-medium text-gray-900">
                    {marketContext.isEudrProducerCountry ? 'Oui' : 'Non'}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Risques Contextuels</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">Risque de Déforestation:</span>
                    <span className={`font-medium ${
                      marketContext.isHighDeforestationRisk ? 'text-red-600' :
                      marketContext.isMediumDeforestationRisk ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {marketContext.isHighDeforestationRisk ? 'Élevé' :
                       marketContext.isMediumDeforestationRisk ? 'Moyen' :
                       'Non évalué'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">Risque de Travail des Enfants:</span>
                    <span className={`font-medium ${
                      marketContext.isChildLaborRiskCrop ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {marketContext.isChildLaborRiskCrop ? 'Potentiel' : 'Non identifié'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Commodities & Documentation Coverage */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary-600" />
            Commodities & Documentation Coverage
          </h2>
          <div className="space-y-4">
            {record.commodities && record.commodities.length > 0 ? (
              <div className="space-y-4">
                {record.commodities.map((commodityId) => {
                  const commodity = EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === commodityId);
                  const commodityLabel = commodity?.label || commodityId;
                  const coverageBand = record.coverageBand;
                  const coverageLabel = coverageBand
                    ? coverageBand.charAt(0).toUpperCase() + coverageBand.slice(1)
                    : 'Not available';
                  
                  return (
                    <div key={commodityId} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{commodityLabel}</h3>
                        <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                          {coverageLabel}
                        </span>
                      </div>
                      {coverageMetrics && (
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Coverage</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {Math.round(coverageMetrics.coverage_percentage)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Documents</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {coverageMetrics.required_docs_present} / {coverageMetrics.required_docs_total}
                            </div>
                          </div>
                        </div>
                      )}
                      {!coverageMetrics && (
                        <p className="text-sm text-gray-600 mt-2">No documentation submitted</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600">No commodities specified</p>
              </div>
            )}
            {coverageMetrics && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Info className="inline h-4 w-4 mr-1" />
                  Documentation coverage information may include cooperative self-reported data and does not constitute certification, verification, or regulatory approval.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Documentation Coverage Snapshot (Detailed) */}
        {coverageMetrics && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary-600" />
              Documentation Coverage Snapshot
            </h2>
            <div className="space-y-4">
              {/* Coverage Description */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="text-lg font-medium text-gray-900">
                  {getCoverageDescription(coverageMetrics.coverage_percentage)}
                </div>
              </div>

              {/* Coverage Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Required Documents Total</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {coverageMetrics.required_docs_total}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Required Documents Present</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {coverageMetrics.required_docs_present}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Coverage Percentage</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {Math.round(coverageMetrics.coverage_percentage)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contextual Risks and Regulatory Context (if market context data exists) */}
        {marketContextData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary-600" />
              Contextual Information
            </h2>
            <div className="space-y-6">
              {/* Contextual Risks */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contextual Risks</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Deforestation Zone</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {marketContextData.contextualRisks?.deforestation_zone || 'Not evaluated'}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Protected Area Overlap</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {marketContextData.contextualRisks?.protected_area_overlap || 'Not evaluated'}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Climate Risk</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {marketContextData.contextualRisks?.climate_risk || 'Not evaluated'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Regulatory Context */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Regulatory Context</h3>
                <div className="space-y-3">
                  <div className="flex items-start justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">EUDR Applicable</h4>
                        <p className="text-sm text-gray-600">
                          European Union Deforestation Regulation
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {marketContextData.regulatoryContext?.eudr_applicable ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Child Labor Due Diligence</h4>
                        <p className="text-sm text-gray-600">
                          Due diligence required for this crop
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {marketContextData.regulatoryContext?.child_labor_due_diligence_required ? 'Required' : 'Not required'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Country Context */}
        {record && (() => {
          const countryPack = record.country 
            ? (getCountryPackByCode(record.country) || getCountryPackByName(record.country))
            : null;
          
          if (!countryPack) {
            return null;
          }
          
          return (
            <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
              <button
                onClick={() => setCountryContextExpanded(!countryContextExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary-600" />
                  Country Context
                </h2>
                {countryContextExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {countryContextExpanded && (
                <div className="px-6 pb-6 space-y-6 border-t border-gray-200">
                  {/* Land Tenure Overview */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Land Tenure Overview</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {countryPack.land_tenure_overview}
                      </p>
                    </div>
                  </div>
                  
                  {/* Commonly Accepted Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Commonly Accepted Documents</h3>
                    <ul className="space-y-2">
                      {countryPack.commonly_accepted_documents.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Known Limitations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Known Limitations</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <ul className="space-y-2">
                        {countryPack.known_limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Language Notes */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.directory.languageNotes}</h3>
                    <ul className="space-y-2">
                      {countryPack.language_notes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Public Sources */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Public Sources</h3>
                    <ul className="space-y-2">
                      {countryPack.public_sources.map((source, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ExternalLink className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                            >
                              {source.title}
                            </a>
                            {source.description && (
                              <p className="text-xs text-gray-500 mt-1">{source.description}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Disclaimer */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Informational Content Only</p>
                        <p>
                          This country context information is provided for reference purposes only. 
                          It describes common practices and limitations but does not evaluate compliance 
                          or make determinations about specific cooperatives or farmers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Section 5: Commodity Context */}
        {record && (() => {
          const commodityPack = record.primary_crop 
            ? getCommodityPackByName(record.primary_crop)
            : null;
          
          if (!commodityPack) {
            return null;
          }
          
          return (
            <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
              <button
                onClick={() => setCommodityContextExpanded(!commodityContextExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sprout className="h-6 w-6 text-primary-600" />
                  Commodity Context (Informational)
                </h2>
                {commodityContextExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {commodityContextExpanded && (
                <div className="px-6 pb-6 space-y-6 border-t border-gray-200">
                  {/* Typical Supply Chain */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Typical Supply Chain</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {commodityPack.typical_supply_chain}
                      </p>
                    </div>
                  </div>
                  
                  {/* Common Document Patterns */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Document Patterns</h3>
                    <ul className="space-y-2">
                      {commodityPack.common_document_patterns.map((pattern, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Buyer Expectations Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyer Expectations Summary</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {commodityPack.buyer_expectations_summary}
                      </p>
                    </div>
                  </div>
                  
                  {/* Known Challenges */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Known Challenges</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <ul className="space-y-2">
                        {commodityPack.known_challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Reference Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Reference Links</h3>
                    <ul className="space-y-2">
                      {commodityPack.reference_links.map((link, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ExternalLink className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                            >
                              {link.title}
                            </a>
                            {link.description && (
                              <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Disclaimer */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Informational Content Only</p>
                        <p>
                          This commodity context information is provided for reference purposes only. 
                          It describes common patterns and expectations but does not evaluate adequacy, 
                          sufficiency, or compliance of any specific cooperative's documentation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Section 6: Disclaimer */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-yellow-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-6 w-6 text-yellow-600" />
            Disclaimer
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>Important:</strong> Information may include self-reported data and does not constitute certification, verification, or regulatory approval. 
              This view structures supplier-provided information to support due-diligence processes. It is not a certification or compliance determination. 
              Responsibility for due care and final sourcing decisions remains with buyers and operators.
            </p>
            <p className="pt-2 border-t border-gray-200">
              <strong className="text-gray-900">Data Source:</strong> {record.source_registry || 'Not specified'}
            </p>
            <p className="text-xs text-gray-500 italic">
              Last updated: {record.created_at ? new Date(record.created_at).toLocaleDateString('en-US') : 'Not available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

