import { Package, MapPin, Shield, Route } from 'lucide-react';
import type { Product } from '@/types';
import { CertificationBadge } from '@/features/compliance/components';
import { getCertifications } from '@/features/compliance/api/complianceApi';
import { getBatchesByProduct } from '@/features/traceability/api/traceabilityApi';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  cooperativeName?: string;
  onClick?: () => void;
  showTraceability?: boolean;
  showCompliance?: boolean;
}

export default function ProductCard({
  product,
  cooperativeName,
  onClick,
  showTraceability = true,
  showCompliance = true,
}: ProductCardProps) {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [batchCount, setBatchCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showCompliance && product.cooperative_id) {
      loadCertifications();
    }
    if (showTraceability) {
      loadBatchCount();
    }
  }, [product, showCompliance, showTraceability]);

  const loadCertifications = async () => {
    if (!product.cooperative_id) return;
    setLoading(true);
    const { data } = await getCertifications(product.cooperative_id);
    setCertifications((data || []).filter((c) => c.status === 'active').slice(0, 3));
    setLoading(false);
  };

  const loadBatchCount = async () => {
    const { data } = await getBatchesByProduct(product.id);
    setBatchCount((data || []).length);
  };

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
            {product.name}
          </h3>
          {cooperativeName && (
            <p className="text-sm text-gray-500 mt-1">{cooperativeName}</p>
          )}
        </div>
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
      )}

      <div className="space-y-2 text-sm text-gray-600 mb-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">Prix:</span>
          <span className="text-lg font-bold text-primary-600">
            {product.price} {product.currency || 'XOF'} / {product.unit || 'kg'}
          </span>
        </div>
        {product.quantity_available !== undefined && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Disponible:</span>
            <span>{product.quantity_available} {product.unit || 'kg'}</span>
          </div>
        )}
      </div>

      {/* Compliance Badges */}
      {showCompliance && certifications.length > 0 && (
        <div className="mb-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Certifications:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <CertificationBadge key={cert.id} certification={cert} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Traceability Info */}
      {showTraceability && batchCount !== null && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Route className="h-4 w-4" />
            <span>{batchCount} lot{batchCount !== 1 ? 's' : ''} traçable{batchCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {product.organic && (
        <div className="mt-2">
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Bio
          </span>
        </div>
      )}
    </div>
  );
}

