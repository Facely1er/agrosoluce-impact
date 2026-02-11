import { useEffect, useState } from 'react';
import { Package, Award, MapPin, Building2, CheckCircle, Clock, Phone, Mail } from 'lucide-react';
import type { Cooperative, Product } from '@/types';
import { getProducts } from '@/features/products/api/productsApi';

interface CooperativeStatsProps {
  cooperative: Cooperative;
}

export default function CooperativeStats({ cooperative }: CooperativeStatsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setProductsLoading(true);
      setProductsError(null);
      
      const { data, error } = await getProducts(cooperative.id);
      
      if (error) {
        setProductsError(error.message);
        setProductsLoading(false);
        return;
      }
      
      setProducts(data || []);
      setProductsLoading(false);
    }

    loadProducts();
  }, [cooperative.id]);

  // Support both database and legacy fields
  const isVerified = cooperative.is_verified ?? cooperative.status === 'verified';
  const sector = cooperative.sector || cooperative.secteur || '';
  const department = cooperative.department || cooperative.departement || '';

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.is_active !== false).length,
    organicProducts: products.filter(p => p.organic).length,
    totalCertifications: (cooperative.certifications?.length || 0) + 
                        products.reduce((acc, p) => acc + (p.certifications?.length || 0), 0),
    hasContactInfo: !!(cooperative.phone || cooperative.email || cooperative.primaryPhoneE164),
    hasLocation: !!(cooperative.latitude && cooperative.longitude),
    hasAddress: !!cooperative.address,
  };

  // Product categories breakdown
  const productCategories = products.reduce((acc, product) => {
    const category = product.category_id || 'Non catégorisé';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Produits</p>
              <p className="text-2xl font-bold text-primary-600">
                {productsLoading ? '...' : stats.totalProducts}
              </p>
              {!productsLoading && stats.activeProducts > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {stats.activeProducts} actif{stats.activeProducts > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <Package className="h-8 w-8 text-primary-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Certifications</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.totalCertifications}
              </p>
              {stats.organicProducts > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {stats.organicProducts} bio
                </p>
              )}
            </div>
            <Award className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Statut</p>
              <p className="text-lg font-bold text-blue-600">
                {isVerified ? 'Vérifiée' : 'En attente'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {cooperative.created_at 
                  ? new Date(cooperative.created_at).toLocaleDateString('fr-FR')
                  : 'Date inconnue'}
              </p>
            </div>
            {isVerified ? (
              <CheckCircle className="h-8 w-8 text-green-400" />
            ) : (
              <Clock className="h-8 w-8 text-yellow-400" />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Informations</p>
              <p className="text-lg font-bold text-secondary-600">
                {[
                  stats.hasContactInfo && 'Contact',
                  stats.hasLocation && 'GPS',
                  stats.hasAddress && 'Adresse'
                ].filter(Boolean).length}/3
              </p>
              <p className="text-xs text-gray-500 mt-1">Complétude</p>
            </div>
            <Building2 className="h-8 w-8 text-secondary-400" />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-secondary-600" />
          Informations Géographiques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Région</p>
            <p className="font-medium text-gray-900">{cooperative.region || 'N/A'}</p>
          </div>
          {department && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Département</p>
              <p className="font-medium text-gray-900">{department}</p>
            </div>
          )}
          {cooperative.commune && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Commune</p>
              <p className="font-medium text-gray-900">{cooperative.commune}</p>
            </div>
          )}
          {sector && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Secteur</p>
              <p className="font-medium text-gray-900">{sector}</p>
            </div>
          )}
          {cooperative.latitude && cooperative.longitude && (
            <>
              <div>
                <p className="text-sm text-gray-500 mb-1">Latitude</p>
                <p className="font-medium text-gray-900">{cooperative.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Longitude</p>
                <p className="font-medium text-gray-900">{cooperative.longitude.toFixed(6)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Contact Information */}
      {(cooperative.phone || cooperative.email || cooperative.primaryPhoneE164) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-secondary-600" />
            Informations de Contact
          </h3>
          <div className="space-y-3">
            {cooperative.primaryPhoneE164 && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <a 
                  href={`tel:${cooperative.primaryPhoneE164}`}
                  className="text-secondary-600 hover:text-secondary-700 font-medium"
                >
                  {cooperative.primaryPhoneE164}
                </a>
              </div>
            )}
            {cooperative.phone && cooperative.phone !== cooperative.primaryPhoneE164 && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{cooperative.phone}</span>
              </div>
            )}
            {cooperative.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <a 
                  href={`mailto:${cooperative.email}`}
                  className="text-secondary-600 hover:text-secondary-700 font-medium"
                >
                  {cooperative.email}
                </a>
              </div>
            )}
            {cooperative.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-900">{cooperative.address}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Breakdown */}
      {!productsLoading && products.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-secondary-600" />
            Répartition des Produits
          </h3>
          {Object.keys(productCategories).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(productCategories).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-700">{category}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-secondary-500 h-2 rounded-full"
                        style={{ width: `${(count / products.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune catégorie disponible</p>
          )}
        </div>
      )}

      {/* Certifications */}
      {(cooperative.certifications && cooperative.certifications.length > 0) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary-600" />
            Certifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {cooperative.certifications.map((cert, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {productsError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Impossible de charger les produits: {productsError}
          </p>
        </div>
      )}
    </div>
  );
}

