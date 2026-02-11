import { useState, useEffect } from 'react';
import { FileSignature, Calendar, User, FileText } from 'lucide-react';
import { getAttestations } from '../api/evidenceApi';
import type { Attestation } from '@/types';

interface AttestationViewProps {
  entityType: 'cooperative' | 'farmer' | 'batch' | 'product';
  entityId: string;
}

export default function AttestationView({ entityType, entityId }: AttestationViewProps) {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAttestations();
  }, [entityType, entityId]);

  const loadAttestations = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getAttestations(entityType, entityId);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setAttestations(data || []);
    setLoading(false);
  };

  const getAttestationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sustainability: 'Durabilité',
      labor: 'Travail',
      environmental: 'Environnemental',
      social: 'Social',
      quality: 'Qualité',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Chargement des attestations...</div>
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

  if (attestations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucune attestation enregistrée
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attestations</h3>
      <div className="space-y-3">
        {attestations.map((attestation) => (
          <div
            key={attestation.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileSignature className="h-5 w-5 text-primary-600" />
                  <h4 className="font-semibold text-gray-900">
                    {getAttestationTypeLabel(attestation.attestation_type)}
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{attestation.signed_by}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(attestation.signed_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{attestation.content}</p>
              </div>
            </div>

            {attestation.document_url && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <a
                  href={attestation.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Voir le document
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

