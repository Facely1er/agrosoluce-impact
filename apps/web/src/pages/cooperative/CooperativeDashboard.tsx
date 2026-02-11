import { useState, useEffect } from 'react';
import { Building2, Package, ShoppingCart, MessageSquare, Users, Shield, FileText, Route, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import FarmerList from '@/features/producers/components/FarmerList';
import ComplianceDashboard from '@/features/compliance/components/ComplianceDashboard';
import AuditList from '@/features/evidence/components/AuditList';
import FieldDeclarationForm from '@/features/evidence/components/FieldDeclarationForm';
import { BatchCard } from '@/features/traceability/components';
import { getBatchesByCooperative } from '@/features/traceability/api/traceabilityApi';
import { getCooperativeById } from '@/features/cooperatives/api/cooperativesApi';
import { useCooperativeEnrichment } from '@/hooks/useCooperativeEnrichment';
import type { Cooperative } from '@/types';
import CoopReadinessChecklist from '@/components/CoopReadinessChecklist';
import { getCurrentUser } from '@/lib/supabase/client';
import CooperativeSpaceLanding from './CooperativeSpaceLanding';

// Mock cooperative ID - in real app, get from auth/context
const MOCK_COOPERATIVE_ID = 'cooperative-id-placeholder';

export default function CooperativeDashboard() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'farmers' | 'products' | 'traceability' | 'compliance' | 'evidence'
  >('overview');
  const [showFieldDeclarationForm, setShowFieldDeclarationForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const user = await getCurrentUser();
      // For now, we'll show the landing page if no user is authenticated
      // In production, you might also check if the user has a cooperative role
      setIsAuthenticated(user !== null);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <CooperativeSpaceLanding />;
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Building2 },
    { id: 'farmers', label: 'Producteurs', icon: Users },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'traceability', label: 'Traçabilité', icon: Route },
    { id: 'compliance', label: 'Conformité', icon: Shield },
    { id: 'evidence', label: 'Preuves', icon: FileText },
  ];

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de Bord Coopérative
          </h1>
          <p className="text-gray-600">
            Gérez vos producteurs, produits, traçabilité, conformité et preuves
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'farmers' && <FarmerList cooperativeId={MOCK_COOPERATIVE_ID} />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'traceability' && <TraceabilityTab cooperativeId={MOCK_COOPERATIVE_ID} />}
            {activeTab === 'compliance' && <ComplianceDashboard cooperativeId={MOCK_COOPERATIVE_ID} />}
            {activeTab === 'evidence' && (
              <EvidenceTab
                cooperativeId={MOCK_COOPERATIVE_ID}
                showFieldDeclarationForm={showFieldDeclarationForm}
                onShowForm={() => setShowFieldDeclarationForm(true)}
                onHideForm={() => setShowFieldDeclarationForm(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  const [cooperative, setCooperative] = useState<Cooperative | null>(null);
  const [loading, setLoading] = useState(true);
  const { recomputeEnrichment } = useCooperativeEnrichment();

  useEffect(() => {
    loadCooperative();
  }, []);

  const loadCooperative = async () => {
    // In real app, get cooperative ID from auth/context
    const { data } = await getCooperativeById(MOCK_COOPERATIVE_ID);
    if (data) {
      setCooperative(data);
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    if (!cooperative?.id) return;
    const { data } = await recomputeEnrichment(cooperative.id);
    if (data) {
      setCooperative(data);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Chargement...</div>;
  }

  const readinessStatus = cooperative?.readiness_status || 'not_ready';
  const coverageMetrics = cooperative?.coverage_metrics;
  const contextualRisks = cooperative?.contextual_risks;

  // Readiness badge styling
  const getReadinessBadge = () => {
    switch (readinessStatus) {
      case 'buyer_ready':
        return {
          label: 'Prêt pour les acheteurs',
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle,
        };
      case 'in_progress':
        return {
          label: 'En cours',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: AlertCircle,
        };
      default:
        return {
          label: 'Non prêt',
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: XCircle,
        };
    }
  };

  const readinessBadge = getReadinessBadge();
  const BadgeIcon = readinessBadge.icon;

  return (
    <div className="space-y-6">
      {/* Readiness Status Badge */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Statut de Préparation</h2>
          <button
            onClick={handleRecalculate}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Recalculer
          </button>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${readinessBadge.color}`}>
          <BadgeIcon className="h-5 w-5" />
          <span className="font-medium">{readinessBadge.label}</span>
        </div>
      </div>

      {/* Coverage Metrics */}
      {coverageMetrics && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Couverture des Données</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Farmers Coverage */}
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Producteurs Documentés</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {coverageMetrics.farmers_with_declarations || 0} / {coverageMetrics.farmers_total || 0}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${coverageMetrics.farmers_total > 0 
                      ? ((coverageMetrics.farmers_with_declarations || 0) / coverageMetrics.farmers_total * 100) 
                      : 0}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {coverageMetrics.farmers_total > 0
                  ? Math.round(((coverageMetrics.farmers_with_declarations || 0) / coverageMetrics.farmers_total) * 100)
                  : 0}%
              </div>
            </div>

            {/* Plots Coverage */}
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Parcelles avec Géolocalisation</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {coverageMetrics.plots_with_geo || 0} / {coverageMetrics.plots_total || 0}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${coverageMetrics.plots_total > 0 
                      ? ((coverageMetrics.plots_with_geo || 0) / coverageMetrics.plots_total * 100) 
                      : 0}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {coverageMetrics.plots_total > 0
                  ? Math.round(((coverageMetrics.plots_with_geo || 0) / coverageMetrics.plots_total) * 100)
                  : 0}%
              </div>
            </div>

            {/* Documents Coverage */}
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Documents Requis</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {coverageMetrics.required_docs_present || 0} / {coverageMetrics.required_docs_total || 0}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${coverageMetrics.required_docs_total > 0 
                      ? ((coverageMetrics.required_docs_present || 0) / coverageMetrics.required_docs_total * 100) 
                      : 0}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {coverageMetrics.required_docs_total > 0
                  ? Math.round(((coverageMetrics.required_docs_present || 0) / coverageMetrics.required_docs_total) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Risks */}
      {contextualRisks && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Risques Contextuels</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Zone de déforestation: <strong>{contextualRisks.deforestation_zone || 'unknown'}</strong>
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Zone protégée: <strong>{contextualRisks.protected_area_overlap || 'unknown'}</strong>
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Risque climatique: <strong>{contextualRisks.climate_risk || 'unknown'}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Readiness Checklist */}
      {cooperative && (
        <CoopReadinessChecklist cooperative={cooperative} />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500">
          <Users className="h-8 w-8 text-primary-600 mb-4" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {coverageMetrics?.farmers_total || '-'}
          </div>
          <div className="text-sm text-gray-600">Producteurs</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary-500">
          <Package className="h-8 w-8 text-secondary-600 mb-4" />
          <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600">Produits listés</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <ShoppingCart className="h-8 w-8 text-green-600 mb-4" />
          <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600">Commandes actives</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <Shield className="h-8 w-8 text-blue-600 mb-4" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {coverageMetrics?.plots_total || '-'}
          </div>
          <div className="text-sm text-gray-600">Parcelles</div>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="text-center py-12 text-gray-500">
      <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <p>Gestion des produits - À implémenter</p>
      <p className="text-sm mt-2">Cette section permettra de créer et gérer vos produits</p>
    </div>
  );
}

function TraceabilityTab({ cooperativeId }: { cooperativeId: string }) {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatches();
  }, [cooperativeId]);

  const loadBatches = async () => {
    const { data } = await getBatchesByCooperative(cooperativeId);
    setBatches(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Chargement des lots...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lots et Traçabilité</h3>
      {batches.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Aucun lot enregistré</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>
      )}
    </div>
  );
}

function EvidenceTab({
  cooperativeId,
  showFieldDeclarationForm,
  onShowForm,
  onHideForm,
}: {
  cooperativeId: string;
  showFieldDeclarationForm: boolean;
  onShowForm: () => void;
  onHideForm: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Preuves et Attestations</h3>
        <button
          onClick={onShowForm}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Nouvelle Déclaration
        </button>
      </div>

      {showFieldDeclarationForm && (
        <FieldDeclarationForm
          cooperativeId={cooperativeId}
          onSuccess={onHideForm}
          onCancel={onHideForm}
        />
      )}

      <div className="space-y-6">
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Audits</h4>
          <AuditList cooperativeId={cooperativeId} />
        </div>
      </div>
    </div>
  );
}
