import { useState, useEffect } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { getFarmersByCooperative } from '../api/farmersApi';
import type { Farmer } from '@/types';
import FarmerCard from './FarmerCard';
import FarmerForm from './FarmerForm';

interface FarmerListProps {
  cooperativeId: string;
  showAddButton?: boolean;
}

export default function FarmerList({ cooperativeId, showAddButton = true }: FarmerListProps) {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadFarmers();
  }, [cooperativeId]);

  const loadFarmers = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getFarmersByCooperative(cooperativeId);
    
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setFarmers(data || []);
    setLoading(false);
  };

  const handleFarmerAdded = () => {
    setShowForm(false);
    loadFarmers();
  };

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.registration_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Chargement des producteurs...</div>
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Producteurs ({farmers.length})
        </h2>
        {showAddButton && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Ajouter un producteur
          </button>
        )}
      </div>

      {showForm && (
        <FarmerForm
          cooperativeId={cooperativeId}
          onSuccess={handleFarmerAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un producteur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {filteredFarmers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchQuery ? 'Aucun producteur trouvé' : 'Aucun producteur enregistré'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFarmers.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      )}
    </div>
  );
}

