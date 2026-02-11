import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import type { Certification } from '@/types';

interface CertificationBadgeProps {
  certification: Certification;
  size?: 'sm' | 'md' | 'lg';
}

export default function CertificationBadge({ certification, size = 'md' }: CertificationBadgeProps) {
  const getStatusIcon = () => {
    switch (certification.status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'revoked':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (certification.status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'expired':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'revoked':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-base px-4 py-2';
      default:
        return 'text-sm px-3 py-1.5';
    }
  };

  const getCertificationLabel = (type: string) => {
    const labels: Record<string, string> = {
      organic: 'Bio',
      fair_trade: 'Commerce Équitable',
      rainforest_alliance: 'Rainforest Alliance',
      utz: 'UTZ',
      eudr: 'EUDR',
    };
    return labels[type] || type;
  };

  const isExpired = certification.expiry_date && new Date(certification.expiry_date) < new Date();

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${getStatusColor()} ${getSizeClasses()}`}
      title={`${getCertificationLabel(certification.certification_type)} - ${certification.issuer} - ${certification.status}`}
    >
      {getStatusIcon()}
      <span className="font-medium">{getCertificationLabel(certification.certification_type)}</span>
      {isExpired && certification.status === 'active' && (
        <span className="text-xs opacity-75">(Expiré)</span>
      )}
    </div>
  );
}

