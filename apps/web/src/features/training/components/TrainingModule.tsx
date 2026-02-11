import { useState } from 'react';
import { Play, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { TRAINING_MODULES } from '../types';
import type { TrainingModule } from '../types';

interface TrainingModuleProps {
  module: TrainingModule;
  isCompleted?: boolean;
  onComplete?: () => void;
}

export default function TrainingModuleComponent({ module, isCompleted, onComplete }: TrainingModuleProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-100' : 'bg-primary-100'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <BookOpen className="h-6 w-6 text-primary-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Module {module.moduleNumber}: {module.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Durée: {module.durationMinutes} minutes
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{module.description}</p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          {expanded ? 'Masquer les détails' : 'Voir les détails'}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Objectifs d'apprentissage:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {module.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Exercices pratiques:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {module.exercises.map((exercise, index) => (
                  <li key={index}>{exercise}</li>
                ))}
              </ul>
            </div>

            {module.videoUrl && (
              <div className="mt-4">
                <a
                  href={module.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Play className="h-5 w-5" />
                  Regarder la vidéo
                </a>
              </div>
            )}

            {!isCompleted && onComplete && (
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={onComplete}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Marquer comme complété
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

