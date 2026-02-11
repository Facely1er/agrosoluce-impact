import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { submitFeedback } from '../api';
import type { FeedbackType, FeedbackPriority } from '../types';

interface FeedbackFormProps {
  cooperativeId?: string;
  onComplete?: () => void;
}

export default function FeedbackForm({ cooperativeId, onComplete }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    feedbackType: 'suggestion' as FeedbackType,
    subject: '',
    content: '',
    priority: 'medium' as FeedbackPriority
  });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await submitFeedback({
      cooperativeId,
      feedbackType: formData.feedbackType,
      subject: formData.subject,
      content: formData.content,
      priority: formData.priority,
      status: 'open'
    });

    if (!error) {
      setSubmitted(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    }
    setSaving(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">Feedback envoyé avec succès</h3>
        <p className="text-green-700">Merci pour votre retour ! Nous l'examinerons rapidement.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Envoyer un Feedback</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de feedback
          </label>
          <select
            value={formData.feedbackType}
            onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value as FeedbackType })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="suggestion">Suggestion</option>
            <option value="feature_request">Demande de fonctionnalité</option>
            <option value="bug">Rapport de bug</option>
            <option value="complaint">Plainte</option>
            <option value="compliment">Compliment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priorité
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as FeedbackPriority })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sujet
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Résumé de votre feedback"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            rows={6}
            required
            placeholder="Décrivez votre feedback en détail..."
          />
        </div>

        <div className="flex items-center justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={saving || !formData.content}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
            {saving ? 'Envoi...' : 'Envoyer le feedback'}
          </button>
        </div>
      </form>
    </div>
  );
}

