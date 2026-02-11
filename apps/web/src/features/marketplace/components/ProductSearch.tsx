import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { getProducts, getProductCategories } from '@/features/products/api/productsApi';
import { getCertifications } from '@/features/compliance/api/complianceApi';
import type { Product, ProductCategory } from '@/types';

interface ProductSearchProps {
  onProductSelect?: (product: Product) => void;
  filters?: {
    certification?: string[];
    complianceStatus?: 'compliant' | 'non_compliant' | 'all';
    region?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export default function ProductSearch({ onProductSelect, filters }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    certification: '',
    region: '',
    minPrice: '',
    maxPrice: '',
  });

  useState(() => {
    loadCategories();
    loadProducts();
  });

  const loadCategories = async () => {
    const { data } = await getProductCategories();
    if (data) {
      setCategories(data);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await getProducts();
    if (data) {
      let filtered = data;

      // Apply search query
      if (searchQuery) {
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply filters
      if (localFilters.category) {
        filtered = filtered.filter((p) => p.category_id === localFilters.category);
      }

      if (localFilters.region) {
        // Would need to join with cooperatives to filter by region
        // For now, skip this filter
      }

      if (localFilters.minPrice) {
        filtered = filtered.filter((p) => (p.price || 0) >= parseFloat(localFilters.minPrice));
      }

      if (localFilters.maxPrice) {
        filtered = filtered.filter((p) => (p.price || 0) <= parseFloat(localFilters.maxPrice));
      }

      setProducts(filtered);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    loadProducts();
  };

  const clearFilters = () => {
    setLocalFilters({
      category: '',
      certification: '',
      region: '',
      minPrice: '',
      maxPrice: '',
    });
    setSearchQuery('');
    loadProducts();
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Rechercher
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Filter className="h-5 w-5" />
          Filtres
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filtres de recherche</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={localFilters.category}
                onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix minimum</label>
              <input
                type="number"
                value={localFilters.minPrice}
                onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix maximum</label>
              <input
                type="number"
                value={localFilters.maxPrice}
                onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
                placeholder="∞"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Recherche en cours...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Aucun produit trouvé</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onProductSelect && onProductSelect(product)}
            >
              <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
              {product.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-600">
                  {product.price} {product.currency || 'XOF'}
                </span>
                {product.quantity_available && (
                  <span className="text-sm text-gray-500">
                    {product.quantity_available} {product.unit || 'kg'} disponible
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

