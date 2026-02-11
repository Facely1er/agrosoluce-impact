import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, MapPin, Package, CheckCircle } from 'lucide-react';
import { createBuyerRequest } from '@/features/buyers/api';
import { matchCooperativesToRequest } from '@/domain/agro/matching';
import { createRequestMatches } from '@/features/buyers/api';
import { useCooperatives } from '@/hooks/useCooperatives';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Button, Card, CardContent, Alert, LoadingSpinner, Input, Select, Badge } from '@/components/ui';
import type { BuyerRequest } from '@/domain/agro/types';

export default function BuyerRequestForm() {
  const navigate = useNavigate();
  const { cooperatives, loading: coopsLoading } = useCooperatives();
  
  const [formData, setFormData] = useState<Omit<BuyerRequest, 'id' | 'status' | 'createdAt'>>({
    buyerOrg: '',
    buyerContactEmail: '',
    targetCountry: '',
    commodity: '',
    minVolumeTons: undefined,
    maxVolumeTons: undefined,
    requirements: {
      certifications: [],
      eudrRequired: false,
      childLaborZeroTolerance: false
    }
  });

  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableCertifications = [
    'Fairtrade',
    'Rainforest Alliance',
    'Organic',
    'UTZ',
    '4C',
    'RFA'
  ];

  const commodities = ['cocoa', 'coffee', 'cashew', 'palm oil', 'rubber', 'cotton'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form
      if (!formData.buyerOrg || !formData.buyerContactEmail || !formData.targetCountry || !formData.commodity) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Create buyer request
      const { data: request, error: requestError } = await createBuyerRequest({
        ...formData,
        requirements: {
          ...formData.requirements,
          certifications: selectedCertifications
        }
      });

      if (requestError || !request) {
        throw requestError || new Error('Failed to create request');
      }

      // Run matching logic
      if (cooperatives.length > 0) {
        const matches = matchCooperativesToRequest(request, cooperatives);
        
        // Create match records (top 20 matches)
        const topMatches = matches.slice(0, 20).map(m => ({
          cooperativeId: m.cooperative.id,
          matchScore: m.matchScore
        }));

        if (topMatches.length > 0) {
          await createRequestMatches(request.id, topMatches);
        }
      }

      // Navigate to results page
      navigate(`/buyer/requests/${request.id}/matches`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const toggleCertification = (cert: string) => {
    setSelectedCertifications(prev =>
      prev.includes(cert)
        ? prev.filter(c => c !== cert)
        : [...prev, cert]
    );
  };

  if (coopsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading cooperatives..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Buyers', path: '/buyers' },
          { label: 'Buyer Portal', path: '/buyer' },
          { label: 'Create Request' }
        ]} />

        {/* Header */}
        <Card variant="gradient" className="mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                  Create Buyer Request
                </h1>
                <p className="text-white/90 text-lg">
                  Submit your sourcing requirements and we'll match you with suitable cooperatives
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="error" title="Error">
                {error}
              </Alert>
            )}

          {/* Organization Name */}
          <Input
            label="Organization Name"
            type="text"
            id="buyerOrg"
            required
            value={formData.buyerOrg}
            onChange={(e) => setFormData({ ...formData, buyerOrg: e.target.value })}
            placeholder="Your company or organization name"
          />

          {/* Contact Email */}
          <Input
            label={
              <>
                <Mail className="inline h-4 w-4 mr-1" />
                Contact Email
              </>
            }
            type="email"
            id="buyerContactEmail"
            required
            value={formData.buyerContactEmail}
            onChange={(e) => setFormData({ ...formData, buyerContactEmail: e.target.value })}
            placeholder="your.email@company.com"
          />

          {/* Target Country */}
          <Input
            label={
              <>
                <MapPin className="inline h-4 w-4 mr-1" />
                Target Country
              </>
            }
            type="text"
            id="targetCountry"
            required
            value={formData.targetCountry}
            onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
            placeholder="e.g., Côte d'Ivoire"
          />

          {/* Commodity */}
          <Select
            label={
              <>
                <Package className="inline h-4 w-4 mr-1" />
                Commodity
              </>
            }
            id="commodity"
            required
            value={formData.commodity}
            onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
            options={[
              { value: '', label: 'Select a commodity' },
              ...commodities.map(comm => ({
                value: comm,
                label: comm.charAt(0).toUpperCase() + comm.slice(1)
              }))
            ]}
          />

          {/* Volume Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Min Volume (tons)"
              type="number"
              id="minVolume"
              min="0"
              step="0.01"
              value={formData.minVolumeTons || ''}
              onChange={(e) => setFormData({
                ...formData,
                minVolumeTons: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              placeholder="0"
            />
            <Input
              label="Max Volume (tons)"
              type="number"
              id="maxVolume"
              min="0"
              step="0.01"
              value={formData.maxVolumeTons || ''}
              onChange={(e) => setFormData({
                ...formData,
                maxVolumeTons: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              placeholder="0"
            />
          </div>

          {/* Requirements Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>

            {/* Certifications */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Required Certifications
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCertifications.map(cert => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleCertification(cert)}
                    className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-1 ${
                      selectedCertifications.includes(cert)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {selectedCertifications.includes(cert) && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {cert}
                  </button>
                ))}
              </div>
            </div>

            {/* EUDR Requirement */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requirements.eudrRequired || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    requirements: {
                      ...formData.requirements,
                      eudrRequired: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Requires EUDR-aligned supply
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-8 mt-1">
                Only show cooperatives with EUDR-aligned documentation and due diligence context
              </p>
            </div>

            {/* Child Labor Zero Tolerance */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requirements.childLaborZeroTolerance || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    requirements: {
                      ...formData.requirements,
                      childLaborZeroTolerance: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Zero tolerance on child labor
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-8 mt-1">
                Only show cooperatives with low child labor risk
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/cooperatives')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              disabled={loading}
              className="flex-1"
            >
              Create Request & Find Matches
            </Button>
          </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

