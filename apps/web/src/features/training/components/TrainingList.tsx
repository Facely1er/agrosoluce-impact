import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { TRAINING_MODULES } from '../types';
import { getTrainingSessions } from '../api';
import TrainingModuleComponent from './TrainingModule';
import type { TrainingSession } from '../types';

interface TrainingListProps {
  cooperativeId: string;
}

export default function TrainingList({ cooperativeId }: TrainingListProps) {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [cooperativeId]);

  const loadSessions = async () => {
    setLoading(true);
    const { data } = await getTrainingSessions(cooperativeId);
    if (data) {
      setSessions(data);
    }
    setLoading(false);
  };

  const isModuleCompleted = (moduleId: string) => {
    return sessions.some(
      s => s.sessionType === moduleId && s.status === 'completed'
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Modules de Formation</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Suivez ces modules de formation pour maîtriser toutes les fonctionnalités d'AgroSoluce.
        </p>

        <div className="space-y-4">
          {TRAINING_MODULES.map((module) => {
            const completed = isModuleCompleted(module.id);
            return (
              <TrainingModuleComponent
                key={module.id}
                module={module}
                isCompleted={completed}
                onComplete={() => {
                  // Handle completion
                  loadSessions();
                }}
              />
            );
          })}
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions de Formation</h3>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{session.sessionTitle}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {session.scheduledAt && new Date(session.scheduledAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {session.status === 'completed' && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

