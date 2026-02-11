import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { createFieldDeclaration } from '../api/evidenceApi';
import type { FieldDeclaration } from '@/types';

interface FieldDeclarationFormProps {
  cooperativeId: string;
  farmerId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FieldDeclarationForm({
  cooperativeId,
  farmerId,
  onSuccess,
  onCancel,
}: FieldDeclarationFormProps) {
  const [formData, setFormData] = useState({
    crop_type: '',
    area: '',
    declaration_date: new Date().toISOString().split('T')[0],
    field_location_latitude: '',
    field_location_longitude: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const declaration: Omit<FieldDeclaration, 'id' | 'created_at' | 'updated_at'> = {
      cooperative_id: cooperativeId,
      farmer_id: farmerId,
      crop_type: formData.crop_type,
      area: parseFloat(formData.area),
      declaration_date: formData.declaration_date,
      field_location_latitude: formData.field_location_latitude
        ? parseFloat(formData.field_location_latitude)
        : undefined,
      field_location_longitude: formData.field_location_longitude
        ? parseFloat(formData.field_location_longitude)
        : undefined,
      status: 'pending',
    };

    const { error: err } = await createFieldDeclaration(declaration);

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
        <h3 className="text-xl font-semibold text-gray-900">Nouvelle Déclaration de Champ</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
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
            Type de culture <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.crop_type}
            onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
            placeholder="Ex: Cacao, Café, Ananas..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Superficie (hectares) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="0"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de déclaration <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.declaration_date}
              onChange={(e) => setFormData({ ...formData, declaration_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Coordonnées GPS (optionnel)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.field_location_latitude}
                onChange={(e) => setFormData({ ...formData, field_location_latitude: e.target.value })}
                placeholder="5.3600"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.field_location_longitude}
                onChange={(e) => setFormData({ ...formData, field_location_longitude: e.target.value })}
                placeholder="-4.0083"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
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

