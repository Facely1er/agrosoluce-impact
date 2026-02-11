import { AssessmentSection } from '@/types/assessment.types';

export const assessmentSections: AssessmentSection[] = [
  {
    id: 'farm-profile',
    title: 'Farm & Cooperative Profile',
    icon: '🏛️',
    description: 'Basic information about your cooperative and operations',
    questions: [
      {
        id: 'cooperative-size',
        question: 'How many members are in your cooperative?',
        required: true,
        options: [
          { value: 'small', label: '50-150 members', score: 1 },
          { value: 'medium', label: '150-400 members', score: 2 },
          { value: 'large', label: '400+ members', score: 3 }
        ]
      },
      {
        id: 'primary-crop',
        question: 'What is your primary crop?',
        required: true,
        options: [
          { value: 'cocoa', label: 'Cocoa', score: 3 },
          { value: 'cashew', label: 'Cashew', score: 3 },
          { value: 'coffee', label: 'Coffee', score: 2 },
          { value: 'mixed', label: 'Mixed crops', score: 1 }
        ]
      },
      {
        id: 'certifications',
        question: 'Do you have any certifications?',
        required: true,
        options: [
          { value: 'fair-trade', label: 'Fair Trade certified', score: 3 },
          { value: 'organic', label: 'Organic certified', score: 3 },
          { value: 'in-progress', label: 'Certification in progress', score: 2 },
          { value: 'none', label: 'No certifications', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'security-data',
    title: 'Security & Data Protection',
    icon: '🛡️',
    description: 'How you protect cooperative and member information',
    questions: [
      {
        id: 'record-storage',
        question: 'How do you store cooperative records?',
        required: true,
        options: [
          { value: 'digital-secure', label: 'Secure digital system with backups', score: 3 },
          { value: 'computer-basic', label: 'Basic computer storage', score: 2 },
          { value: 'paper-organized', label: 'Organized paper records', score: 1 },
          { value: 'paper-basic', label: 'Basic paper records', score: 0 }
        ]
      },
      {
        id: 'financial-protection',
        question: 'How do you protect financial information?',
        required: true,
        options: [
          { value: 'bank-secure', label: 'Bank accounts with proper controls', score: 3 },
          { value: 'mobile-money', label: 'Mobile money with PIN protection', score: 2 },
          { value: 'cash-safe', label: 'Cash in secure location', score: 1 },
          { value: 'cash-basic', label: 'Basic cash management', score: 0 }
        ]
      },
      {
        id: 'communication-security',
        question: 'How do you communicate sensitive information?',
        required: true,
        options: [
          { value: 'secure-apps', label: 'Secure messaging apps', score: 3 },
          { value: 'whatsapp', label: 'WhatsApp or SMS', score: 2 },
          { value: 'phone-only', label: 'Phone calls only', score: 1 },
          { value: 'in-person', label: 'In-person meetings only', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'child-protection',
    title: 'Child Protection & Social Responsibility',
    icon: '👶',
    description: 'Policies and practices for protecting children in your community',
    questions: [
      {
        id: 'child-labor-policy',
        question: 'Do you have child labor prevention policies?',
        required: true,
        options: [
          { value: 'enforced', label: 'Written policy, actively enforced', score: 3 },
          { value: 'written', label: 'Written policy exists', score: 2 },
          { value: 'verbal', label: 'Verbal understanding among members', score: 1 },
          { value: 'none', label: 'No formal policy', score: 0 }
        ]
      },
      {
        id: 'child-monitoring',
        question: 'How do you monitor child welfare in your community?',
        required: true,
        options: [
          { value: 'systematic', label: 'Systematic monitoring with records', score: 3 },
          { value: 'regular-discussions', label: 'Regular discussions in meetings', score: 2 },
          { value: 'informal-awareness', label: 'Informal community awareness', score: 1 },
          { value: 'none', label: 'No specific monitoring', score: 0 }
        ]
      },
      {
        id: 'education-support',
        question: 'How do you support children\'s education?',
        required: true,
        options: [
          { value: 'education-fund', label: 'Education fund & scholarships', score: 3 },
          { value: 'school-supplies', label: 'Help with school supplies', score: 2 },
          { value: 'encourage-only', label: 'Encourage education', score: 1 },
          { value: 'none', label: 'No specific support', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'economic-performance',
    title: 'Economic Performance & Market Access',
    icon: '📊',
    description: 'Your cooperative\'s economic strength and market connections',
    questions: [
      {
        id: 'price-information',
        question: 'How do you get market price information?',
        required: true,
        options: [
          { value: 'real-time', label: 'Real-time market data access', score: 3 },
          { value: 'weekly-updates', label: 'Weekly market updates', score: 2 },
          { value: 'buyer-info', label: 'Information from buyers', score: 1 },
          { value: 'limited', label: 'Limited price information', score: 0 }
        ]
      },
      {
        id: 'buyer-relationships',
        question: 'How many regular buyers do you have?',
        required: true,
        options: [
          { value: 'multiple-premium', label: '5+ buyers including premium markets', score: 3 },
          { value: 'multiple-regular', label: '3-5 regular buyers', score: 2 },
          { value: 'few-buyers', label: '1-2 regular buyers', score: 1 },
          { value: 'single-irregular', label: 'Single buyer or irregular sales', score: 0 }
        ]
      }
    ]
  }
];

