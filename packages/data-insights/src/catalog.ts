/**
 * VRAC catalog: pharmacy profiles and period mappings
 */

import type { PharmacyProfile } from '@agrosoluce/types';

export const PHARMACIES: PharmacyProfile[] = [
  { id: 'tanda', name: 'Grande Pharmacie de Tanda', region: 'gontougo', location: 'Tanda, Gontougo', regionLabel: 'Gontougo (cocoa)' },
  { id: 'prolife', name: 'Pharmacie Prolife', region: 'gontougo', location: 'Tabagne, Gontougo', regionLabel: 'Gontougo (cocoa)' },
  { id: 'olympique', name: 'Pharmacie Olympique', region: 'abidjan', location: 'Abidjan', regionLabel: 'Abidjan (urban)' },
  { id: 'attobrou', name: 'Pharmacie Attobrou', region: 'la_me', location: 'La Mé', regionLabel: 'La Mé (cocoa)' },
];

export const PERIOD_LABELS: Record<string, string> = {
  'aug-dec-2022': 'Aug–Dec 2022',
  'aug-dec-2023': 'Aug–Dec 2023',
  'aug-dec-2024': 'Aug–Dec 2024',
  'aug-dec-2025': 'Aug–Dec 2025',
};
