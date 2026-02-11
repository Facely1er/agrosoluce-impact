import { useState } from 'react';
import { X } from 'lucide-react';
import { createFarmer } from '../api/farmersApi';
import type { Farmer } from '@/types';

interface FarmerFormProps {
  cooperativeId: string;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Partial<Farmer>;
}

export default function FarmerForm({ cooperativeId, onSuccess, onCancel, initialData }: FarmerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    registration_number: initialData?.registration_number || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    latitude: initialData?.latitude?.toString() || '',
    longitude: initialData?.longitude?.toString() || '',
    location_description: initialData?.location_description || '',
    date_of_birth: initialData?.date_of_birth || '',
    gender: initialData?.gender || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const farmerData: Omit<Farmer, 'id' | 'created_at' | 'updated_at'> = {
      cooperative_id: cooperativeId,
      name: formData.name,
      registration_number: formData.registration_number || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      location_description: formData.location_description || undefined,
      date_of_birth: formData.date_of_birth || undefined,
      gender: formData.gender || undefined,
      is_active: true,
    };

    const { error: err } = await createFarmer(farmerData);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    onSuccess();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Modifier le producteur' : 'Nouveau producteur'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro d'enregistrement
            </label>
            <input
              type="text"
              value={formData.registration_number}
              onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude (GPS)
            </label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="5.3600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude (GPS)
            </label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="-4.0083"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description de l'emplacement
          </label>
          <textarea
            value={formData.location_description}
            onChange={(e) => setFormData({ ...formData, location_description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Description détaillée de l'emplacement du champ"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}

