import { useState } from 'react';
import { Info, ExternalLink, Globe, Search, Filter, X } from 'lucide-react';
import {
  NGO_REGISTRY,
  getAllThematicFocuses,
  getAllCountries,
} from '@/data/ngoRegistry';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function NGORegistryPage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThematicFocus, setSelectedThematicFocus] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const thematicFocuses = getAllThematicFocuses();
  const countries = getAllCountries();

  // Filter NGOs
  let filteredNGOs = NGO_REGISTRY;
  
  // Filter by search term
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredNGOs = filteredNGOs.filter(ngo =>
      ngo.ngo_name.toLowerCase().includes(searchLower) ||
      ngo.thematic_focus.some(f => f.toLowerCase().includes(searchLower)) ||
      ngo.countries_active.some(c => c.toLowerCase().includes(searchLower)) ||
      (ngo.notes && ngo.notes.toLowerCase().includes(searchLower))
    );
  }
  
  // Filter by thematic focus
  if (selectedThematicFocus !== 'all') {
    filteredNGOs = filteredNGOs.filter(ngo =>
      ngo.thematic_focus.some(f => f === selectedThematicFocus)
    );
  }
  
  // Filter by country
  if (selectedCountry !== 'all') {
    filteredNGOs = filteredNGOs.filter(ngo =>
      ngo.countries_active.some(c => 
        c === selectedCountry || c === 'Global'
      )
    );
  }

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedThematicFocus('all');
    setSelectedCountry('all');
  };

  const hasActiveFilters = searchTerm || selectedThematicFocus !== 'all' || selectedCountry !== 'all';

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-primary-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                NGO & Public Reference Registry
              </h1>
              <p className="text-gray-600 mb-4">
                Reference list of public-interest organizations working in agriculture, sustainability, and supply chain transparency
              </p>
              
              {/* Important Notice */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-bold mb-1">Reference list of public-interest organizations. Listing does not imply endorsement or certification.</p>
                    <p>
                      This registry provides a reference list of organizations that publish public reports, 
                      research, or data relevant to agricultural supply chains, sustainability, and transparency. 
                      Inclusion in this list does not indicate endorsement, partnership, certification, or any 
                      relationship between AgroSoluce and these organizations. Users should conduct their own 
                      due diligence when engaging with any organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, focus, or country..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thematic Focus
              </label>
              <select
                value={selectedThematicFocus}
                onChange={(e) => setSelectedThematicFocus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Filter by thematic focus"
              >
                <option value="all">All Focuses</option>
                {thematicFocuses.map(focus => (
                  <option key={focus} value={focus}>
                    {focus}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Filter by country"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredNGOs.length} organization{filteredNGOs.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* NGO List */}
        <div className="space-y-4">
          {filteredNGOs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 mb-2">No organizations found matching your filters.</p>
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Clear filters to see all organizations
              </button>
            </div>
          ) : (
            filteredNGOs.map((ngo, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {ngo.ngo_name}
                    </h3>
                    
                    {/* Thematic Focus */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Thematic Focus</h4>
                      <div className="flex flex-wrap gap-2">
                        {ngo.thematic_focus.map((focus, fIdx) => (
                          <span
                            key={fIdx}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Countries Active */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Countries Active
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ngo.countries_active.map((country, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Notes */}
                    {ngo.notes && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {ngo.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Public Reports Link */}
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href={ngo.public_reports_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm font-medium">View Reports</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">{t.directory.aboutThisRegistry}</p>
              <p>
                This registry is maintained for informational purposes only. Organizations are included based on 
                their publication of public reports, research, or data relevant to agricultural supply chains, 
                sustainability, and transparency. The registry is not exhaustive and may not include all relevant 
                organizations. Inclusion or exclusion from this registry does not reflect any assessment of an 
                organization's work, credibility, or impact. Users should verify information independently and 
                conduct appropriate due diligence when engaging with any organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

