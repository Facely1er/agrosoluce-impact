import { MapPin, User, Phone, Mail } from 'lucide-react';
import type { Farmer } from '@/types';

interface FarmerCardProps {
  farmer: Farmer;
  onClick?: () => void;
}

export default function FarmerCard({ farmer, onClick }: FarmerCardProps) {
  const hasLocation = farmer.latitude && farmer.longitude;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-primary-500 hover:shadow-lg transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            {farmer.name}
          </h3>
          {farmer.registration_number && (
            <p className="text-sm text-gray-500 mt-1">
              ID: {farmer.registration_number}
            </p>
          )}
        </div>
        {farmer.is_active === false && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            Inactif
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {hasLocation && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>
              {farmer.latitude?.toFixed(4)}, {farmer.longitude?.toFixed(4)}
            </span>
          </div>
        )}
        {farmer.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{farmer.phone}</span>
          </div>
        )}
        {farmer.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="truncate">{farmer.email}</span>
          </div>
        )}
        {farmer.address && (
          <div className="text-gray-500 text-xs mt-2">
            {farmer.address}
          </div>
        )}
      </div>
    </div>
  );
}

