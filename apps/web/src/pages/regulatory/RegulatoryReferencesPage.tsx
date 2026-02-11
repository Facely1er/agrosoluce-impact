import { useState } from 'react';
import { Info, ExternalLink, FileText, Globe } from 'lucide-react';
import {
  REGULATORY_REFERENCES,
  getAllJurisdictions,
  getAllRegulationNames,
  type RegulatoryReference,
  type Jurisdiction,
} from '@/data/regulatoryReferences';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function RegulatoryReferencesPage() {
  const { t } = useI18n();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | 'all'>('all');
  const [selectedRegulation, setSelectedRegulation] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const jurisdictions = getAllJurisdictions();
  const regulationNames = getAllRegulationNames();

  // Filter references
  let filteredReferences = REGULATORY_REFERENCES;
  if (selectedJurisdiction !== 'all') {
    filteredReferences = filteredReferences.filter(ref => ref.jurisdiction === selectedJurisdiction);
  }
  if (selectedRegulation !== 'all') {
    filteredReferences = filteredReferences.filter(ref => 
      ref.regulation_name === selectedRegulation
    );
  }

  // Group by regulation name
  const groupedByRegulation = filteredReferences.reduce((acc, ref) => {
    if (!acc[ref.regulation_name]) {
      acc[ref.regulation_name] = [];
    }
    acc[ref.regulation_name].push(ref);
    return acc;
  }, {} as Record<string, RegulatoryReference[]>);

  const getJurisdictionLabel = (jurisdiction: Jurisdiction): string => {
    const labels: Record<Jurisdiction, string> = {
      EU: 'European Union',
      FR: 'France',
      DE: 'Germany',
      CI: 'Côte d\'Ivoire',
    };
    return labels[jurisdiction];
  };

  const getEvidenceTypeLabel = (evidence: string): string => {
    const labels: Record<string, string> = {
      certification: 'Certification',
      policy: 'Policy',
      land_evidence: 'Land Evidence',
      other: 'Other',
      documented: 'Documented',
      declared: 'Declared',
      attested: 'Attested',
      contextual: 'Contextual',
    };
    return labels[evidence] || evidence;
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-primary-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Regulatory Reference Mapping
              </h1>
              <p className="text-gray-600 mb-4">
                Informational reference content describing regulatory obligations and due diligence expectations
              </p>
              
              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Informational reference. No compliance determination.</p>
                    <p>
                      This content describes regulatory obligations and typical supporting evidence requirements. 
                      It does not evaluate fulfillment, assess compliance, or make determinations about any organization's status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="jurisdiction-select" className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Jurisdiction
              </label>
              <select
                id="jurisdiction-select"
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value as Jurisdiction | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Jurisdictions</option>
                {jurisdictions.map(jur => (
                  <option key={jur} value={jur}>
                    {getJurisdictionLabel(jur)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="regulation-select" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Regulation
              </label>
              <select
                id="regulation-select"
                value={selectedRegulation}
                onChange={(e) => setSelectedRegulation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Regulations</option>
                {regulationNames.map(reg => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'table'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredReferences.length} reference{filteredReferences.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Content */}
        {viewMode === 'cards' ? (
          <div className="space-y-6">
            {Object.entries(groupedByRegulation).map(([regulationName, references]) => (
              <div key={regulationName} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{regulationName}</h2>
                    <span className="text-sm text-gray-500">
                      {references.length} reference{references.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {references.map((ref) => (
                    <div
                      key={ref.ref_id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {getJurisdictionLabel(ref.jurisdiction)}
                            </span>
                            <span className="text-sm text-gray-500">{ref.article_reference}</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {ref.article_reference}
                          </h3>
                        </div>
                        <a
                          href={ref.source_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Source
                        </a>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Due Diligence Expectation
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {ref.due_diligence_expectation}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Typical Supporting Evidence
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {ref.typical_supporting_evidence.map((evidence, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                            >
                              {getEvidenceTypeLabel(evidence)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jurisdiction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Regulation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Diligence Expectation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supporting Evidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReferences.map((ref) => (
                    <tr key={ref.ref_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ref.ref_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {getJurisdictionLabel(ref.jurisdiction)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {ref.regulation_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {ref.article_reference}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                        {ref.due_diligence_expectation}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {ref.typical_supporting_evidence.map((evidence, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                            >
                              {getEvidenceTypeLabel(evidence)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={ref.source_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">{t.directory.aboutThisReference}</p>
              <p>
                This regulatory reference mapping provides informational content about regulatory obligations 
                and typical supporting evidence requirements. It is intended for reference purposes only and 
                does not constitute legal advice, compliance assessment, or determination of any organization's 
                regulatory status. Users should consult with legal and compliance professionals for specific 
                guidance on regulatory obligations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

