// Readiness Checklist Component
// Converts enrichment data into actionable checklist items

import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { Cooperative } from '@/types';
import { COVERAGE_THRESHOLDS } from '@/config/enrichmentConfig';

interface ChecklistItem {
  id: string;
  label: string;
  status: 'complete' | 'partial' | 'missing';
  description?: string;
}

interface CoopReadinessChecklistProps {
  cooperative: Cooperative;
}

export default function CoopReadinessChecklist({ cooperative }: CoopReadinessChecklistProps) {
  const coverageMetrics = cooperative.coverage_metrics;
  const regulatoryContext = cooperative.regulatory_context;

  if (!coverageMetrics) {
    return null;
  }

  const checklistItems: ChecklistItem[] = [];

  // Farmers declarations checklist item
  const farmersTotal = coverageMetrics.farmers_total || 0;
  const farmersWithDeclarations = coverageMetrics.farmers_with_declarations || 0;
  const farmerRatio = farmersTotal > 0 ? farmersWithDeclarations / farmersTotal : 0;
  
  checklistItems.push({
    id: 'farmer_declarations',
    label: `Ajouter des déclarations pour au moins 70% des producteurs`,
    status: farmerRatio >= COVERAGE_THRESHOLDS.farmerDeclarationsBuyerReady
      ? 'complete'
      : farmerRatio >= COVERAGE_THRESHOLDS.farmerDeclarationsMinimum
      ? 'partial'
      : 'missing',
    description: `${farmersWithDeclarations} / ${farmersTotal} producteurs documentés (${Math.round(farmerRatio * 100)}%)`,
  });

  // Plots geo references checklist item
  const plotsTotal = coverageMetrics.plots_total || 0;
  const plotsWithGeo = coverageMetrics.plots_with_geo || 0;
  const plotRatio = plotsTotal > 0 ? plotsWithGeo / plotsTotal : 0;

  checklistItems.push({
    id: 'plot_geo',
    label: `Ajouter des références géographiques pour au moins 70% des parcelles`,
    status: plotRatio >= COVERAGE_THRESHOLDS.plotsGeoBuyerReady
      ? 'complete'
      : plotRatio > 0
      ? 'partial'
      : 'missing',
    description: `${plotsWithGeo} / ${plotsTotal} parcelles avec géolocalisation (${Math.round(plotRatio * 100)}%)`,
  });

  // Required documents checklist items
  const requiredDocsTotal = coverageMetrics.required_docs_total || 0;
  const requiredDocsPresent = coverageMetrics.required_docs_present || 0;

  if (requiredDocsTotal > 0) {
    checklistItems.push({
      id: 'required_documents',
      label: `Télécharger tous les documents requis (${requiredDocsPresent} / ${requiredDocsTotal})`,
      status: requiredDocsPresent >= requiredDocsTotal
        ? 'complete'
        : requiredDocsPresent > 0
        ? 'partial'
        : 'missing',
      description: requiredDocsPresent < requiredDocsTotal
        ? `Il manque ${requiredDocsTotal - requiredDocsPresent} type(s) de document requis`
        : 'Tous les documents requis sont présents',
    });
  }

  // Child labor policy (if required)
  if (regulatoryContext?.child_labor_due_diligence_required) {
    // This would need to check if a policy document exists
    // For Phase 1, we'll just show it as a general requirement
    checklistItems.push({
      id: 'child_labor_policy',
      label: 'Télécharger une politique de travail des enfants',
      status: 'missing', // Would need to check documents to determine actual status
      description: 'Requis pour la diligence raisonnable en matière de travail des enfants',
    });
  }

  // Land evidence document
  checklistItems.push({
    id: 'land_evidence',
    label: 'Télécharger au moins un document de preuve de terrain/parcelle',
    status: requiredDocsPresent > 0 ? 'partial' : 'missing', // Simplified check
    description: 'Document de preuve de légitimité d\'utilisation des terres',
  });

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 border-green-200';
      case 'partial':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Liste de Vérification de Préparation</h2>
      <p className="text-sm text-gray-600 mb-6">
        Cette liste est générée automatiquement à partir de vos données. Elle indique votre progression vers la préparation pour les acheteurs.
      </p>
      <div className="space-y-3">
        {checklistItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-4 rounded-lg border ${getStatusColor(item.status)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(item.status)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{item.label}</div>
              {item.description && (
                <div className="text-sm text-gray-600 mt-1">{item.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Ces indicateurs fournissent un contexte et des métriques uniquement.
          Ils ne constituent pas des garanties légales ou de conformité.
        </p>
      </div>
    </div>
  );
}

