import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { verifyEUDR } from '../api/complianceApi';
import type { EUDRVerification } from '@/types';

interface EUDRVerificationProps {
  batchId: string;
  gpsCoordinates?: { latitude: number; longitude: number };
  onVerificationComplete?: (verification: EUDRVerification) => void;
}

export default function EUDRVerification({
  batchId,
  gpsCoordinates,
  onVerificationComplete,
}: EUDRVerificationProps) {
  const [verification, setVerification] = useState<EUDRVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (batchId) {
      performVerification();
    }
  }, [batchId, gpsCoordinates]);

  const performVerification = async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await verifyEUDR(batchId, gpsCoordinates);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    if (data) {
      setVerification(data);
      if (onVerificationComplete) {
        onVerificationComplete(data);
      }
    }

    setLoading(false);
  };

  const getStatusIcon = () => {
    if (!verification) return null;

    switch (verification.status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    if (!verification) return 'bg-gray-100 text-gray-700';

    switch (verification.status) {
      case 'verified':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        <span>Vérification EUDR en cours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
        Erreur: {error}
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="text-gray-500 text-sm">
        Aucune vérification EUDR disponible
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="h-6 w-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Vérification EUDR</h3>
        <div className={`ml-auto flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize">{verification.status}</span>
        </div>
      </div>

      <div className="space-y-3">
        {verification.gps_coordinates && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              GPS: {verification.gps_coordinates.latitude.toFixed(4)},{' '}
              {verification.gps_coordinates.longitude.toFixed(4)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Vérification Déforestation</div>
            <div className="flex items-center gap-2">
              {verification.deforestation_check === 'passed' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : verification.deforestation_check === 'failed' ? (
                <XCircle className="h-4 w-4 text-red-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium capitalize">
                {verification.deforestation_check}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Vérification Travail des Enfants</div>
            <div className="flex items-center gap-2">
              {verification.child_labor_check === 'passed' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : verification.child_labor_check === 'failed' ? (
                <XCircle className="h-4 w-4 text-red-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium capitalize">
                {verification.child_labor_check}
              </span>
            </div>
          </div>
        </div>

        {verification.verified_at && (
          <div className="text-xs text-gray-500">
            Vérifié le: {new Date(verification.verified_at).toLocaleString('fr-FR')}
          </div>
        )}

        {verification.notes && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Notes</div>
            <p className="text-sm text-gray-700">{verification.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

