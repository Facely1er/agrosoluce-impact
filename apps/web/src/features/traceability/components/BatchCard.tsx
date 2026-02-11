import { Calendar, MapPin, Package, User } from 'lucide-react';
import type { Batch } from '@/types';

interface BatchCardProps {
  batch: Batch;
  onClick?: () => void;
  showProduct?: boolean;
}

export default function BatchCard({ batch, onClick, showProduct = false }: BatchCardProps) {
  const hasLocation = batch.origin_gps_latitude && batch.origin_gps_longitude;

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
            <Package className="h-5 w-5 text-primary-600" />
            {batch.batch_number || `Lot #${batch.id.slice(0, 8)}`}
          </h3>
          {batch.harvest_date && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Récolté le {new Date(batch.harvest_date).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-400" />
          <span>
            {batch.quantity} {batch.unit || 'kg'}
          </span>
        </div>
        {hasLocation && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>
              {batch.origin_gps_latitude?.toFixed(4)}, {batch.origin_gps_longitude?.toFixed(4)}
            </span>
          </div>
        )}
        {batch.farmer_id && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span>Producteur: {batch.farmer_id.slice(0, 8)}...</span>
          </div>
        )}
      </div>

      {batch.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">{batch.notes}</p>
        </div>
      )}
    </div>
  );
}

