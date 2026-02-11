import { useState, useEffect } from 'react';
import { FileText, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getAudits } from '../api/evidenceApi';
import type { Audit } from '@/types';

interface AuditListProps {
  cooperativeId: string;
}

export default function AuditList({ cooperativeId }: AuditListProps) {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAudits();
  }, [cooperativeId]);

  const loadAudits = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getAudits(cooperativeId);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setAudits(data || []);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getAuditTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      third_party: 'Tierce Partie',
      internal: 'Interne',
      regulatory: 'Réglementaire',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Chargement des audits...</div>
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

  if (audits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun audit enregistré
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Audits</h3>
      <div className="space-y-3">
        {audits.map((audit) => (
          <div
            key={audit.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <h4 className="font-semibold text-gray-900">{getAuditTypeLabel(audit.audit_type)}</h4>
                  <span
                    className={`ml-auto flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(
                      audit.status
                    )}`}
                  >
                    {getStatusIcon(audit.status)}
                    <span className="capitalize">{audit.status}</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{audit.auditor_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(audit.audit_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>

            {audit.findings && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-700">{audit.findings}</p>
              </div>
            )}

            {audit.document_url && (
              <div className="mt-3">
                <a
                  href={audit.document_url}
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

