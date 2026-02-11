// TypeScript types for Training Management System

export type TrainingSessionType = 'welcome' | 'module_1' | 'module_2' | 'module_3' | 'module_4' | 'module_5' | 'advanced' | 'custom';
export type TrainingLocation = 'virtual' | 'on_site' | 'hybrid';
export type TrainingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ChampionRole = 'primary' | 'secondary' | 'backup';

export interface TrainingSession {
  id: string;
  cooperativeId: string;
  sessionType: TrainingSessionType;
  sessionTitle: string;
  sessionDescription?: string;
  scheduledAt?: string;
  completedAt?: string;
  durationMinutes?: number;
  trainerId?: string;
  location: TrainingLocation;
  status: TrainingStatus;
  attendanceCount: number;
  materialsUrl?: string;
  recordingUrl?: string;
  feedbackNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainingChampion {
  id: string;
  cooperativeId: string;
  userProfileId: string;
  role: ChampionRole;
  trainingCompletedAt?: string;
  isActive: boolean;
  responsibilities?: string;
  createdAt?: string;
  updatedAt?: string;
  // Joined data
  userProfile?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
}

export interface TrainingCompletion {
  id: string;
  trainingSessionId: string;
  userProfileId: string;
  completedAt: string;
  score?: number; // 0-100
  feedback?: string;
  createdAt?: string;
}

export interface TrainingModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl?: string;
  materialsUrl?: string;
  objectives: string[];
  exercises: string[];
}

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'module_1',
    moduleNumber: 1,
    title: 'Gestion des Membres et Communication',
    description: 'Apprendre à gérer les profils des membres et la communication interne',
    durationMinutes: 120,
    objectives: [
      'Ajouter et gérer les profils des membres',
      'Organiser les membres par groupes/régions',
      'Envoyer des communications de masse',
      'Planifier et annoncer les réunions',
      'Gérer les présences et participation'
    ],
    exercises: [
      'Import de la liste complète des membres',
      'Création de groupes par secteur géographique',
      'Envoi d\'une annonce de réunion test',
      'Configuration des notifications automatiques',
      'Création d\'un agenda de réunions pour le trimestre'
    ]
  },
  {
    id: 'module_2',
    moduleNumber: 2,
    title: 'Gestion des Documents et Certifications',
    description: 'Organiser et suivre les documents et certifications',
    durationMinutes: 120,
    objectives: [
      'Organiser les documents par type et date',
      'Suivre les échéances de certification',
      'Préparer les audits de certification',
      'Gérer les documents confidentiels',
      'Créer des modèles de documents récurrents'
    ],
    exercises: [
      'Upload de tous les certificats actuels',
      'Configuration des rappels d\'échéance',
      'Création d\'un dossier d\'audit Fair Trade',
      'Organisation des procès-verbaux de réunion',
      'Préparation d\'un rapport mensuel automatisé'
    ]
  },
  {
    id: 'module_3',
    moduleNumber: 3,
    title: 'Suivi de Production et Ventes',
    description: 'Enregistrer et analyser les données de production et ventes',
    durationMinutes: 120,
    objectives: [
      'Enregistrer les données de production',
      'Suivre les ventes et prix obtenus',
      'Analyser les tendances de production',
      'Comparer avec les données de marché',
      'Préparer des rapports pour les acheteurs'
    ],
    exercises: [
      'Saisie des données de la dernière campagne',
      'Configuration du suivi en temps réel',
      'Création de graphiques de performance',
      'Comparaison avec les prix du marché',
      'Génération d\'un rapport mensuel de ventes'
    ]
  },
  {
    id: 'module_4',
    moduleNumber: 4,
    title: 'Sécurité Numérique et Protection des Données',
    description: 'Comprendre et mettre en place la sécurité numérique',
    durationMinutes: 120,
    objectives: [
      'Comprendre les menaces cybernétiques agricoles',
      'Créer et gérer des mots de passe sécurisés',
      'Reconnaître et éviter les tentatives de fraude',
      'Protéger les données financières de la coopérative',
      'Sauvegarder et restaurer les données importantes'
    ],
    exercises: [
      'Évaluation de sécurité de l\'équipement actuel',
      'Configuration de l\'authentification à deux facteurs',
      'Test de reconnaissance des emails de phishing',
      'Création d\'un plan de sauvegarde',
      'Simulation d\'une réponse à incident de sécurité'
    ]
  },
  {
    id: 'module_5',
    moduleNumber: 5,
    title: 'Intelligence de Marché et Optimisation des Ventes',
    description: 'Utiliser les informations de marché pour optimiser les ventes',
    durationMinutes: 120,
    objectives: [
      'Accéder aux informations de prix en temps réel',
      'Identifier les opportunités de marché premium',
      'Comprendre les exigences des différents acheteurs',
      'Planifier les ventes selon les tendances',
      'Négocier de meilleurs prix avec les données'
    ],
    exercises: [
      'Configuration des alertes de prix',
      'Analyse des opportunités export actuelles',
      'Préparation d\'une négociation avec acheteur',
      'Planification d\'une stratégie de vente saisonnière',
      'Création d\'un profil d\'acheteur idéal'
    ]
  }
];

