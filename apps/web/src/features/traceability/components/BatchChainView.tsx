import { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Package } from 'lucide-react';
import { getBatchChain } from '../api/traceabilityApi';
import type { BatchTransaction } from '@/types';

interface BatchChainViewProps {
  batchId: string;
}

export default function BatchChainView({ batchId }: BatchChainViewProps) {
  const [transactions, setTransactions] = useState<BatchTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChain();
  }, [batchId]);

  const loadChain = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getBatchChain(batchId);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setTransactions(data || []);
    setLoading(false);
  };

  const getEntityName = (entityType: string, entityId: string) => {
    // In a real implementation, you'd fetch the actual entity name
    return `${entityType}: ${entityId.slice(0, 8)}...`;
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      harvest: 'Récolte',
      transfer: 'Transfert',
      sale: 'Vente',
      processing: 'Transformation',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Chargement de la chaîne de traçabilité...</div>
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

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune transaction enregistrée pour ce lot
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Chaîne de Traçabilité
      </h3>
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {getTransactionTypeLabel(transaction.transaction_type)}
                </span>
                <span className="text-sm text-gray-500">
                  ({transaction.quantity} {transaction.unit || 'kg'})
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{getEntityName(transaction.from_entity_type, transaction.from_entity_id)}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span>{getEntityName(transaction.to_entity_type, transaction.to_entity_id)}</span>
              </div>
              {transaction.timestamp && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <Calendar className="h-3 w-3" />
                  {new Date(transaction.timestamp).toLocaleString('fr-FR')}
                </div>
              )}
              {transaction.notes && (
                <p className="text-xs text-gray-500 mt-2">{transaction.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

