/**
 * Product taxonomy: maps product codes/names to therapeutic categories
 * Used for computing antimalarial share and health index
 * Add new codes/patterns here when new products are introduced
 */

export type TherapeuticCategory = 'antimalarial' | 'antibiotic' | 'analgesic' | 'other';

/** Known antimalarial product codes (ARTEFAN, PLUFENTRINE, etc.) */
const ANTIMALARIAL_CODES = new Set([
  '8076190', // ARTEFAN 80/480 CP
  '8141390', // PLUFENTRINE 80/480MG
  '1307641', // ARTEFAN 20/120MG SUSP
  '2288927', // ARTEFAN 20/120MG CPR
  '8145287', // ARTEFAN 40/240MG CP
  '1307651', // ARTEFAN 40/240MG SUSP
  '8145293', // ARTEFAN 60/360 CP
  '1307661', // ARTEFAN 60/360MG SUSP
  '1307671', // ARTEFAN 80/480MG SUSP
  '1307681', // ARTEFAN DT 40/240
  '8088164', // ARTEFAN 180/1080MG SUSP
  '2298794', // ARTEFAN 20/120 CP B/24
]);

/** Substrings in product designation indicating antimalarial */
const ANTIMALARIAL_PATTERNS = [
  'artefan',
  'plufentrine',
  'artemether',
  'lumefantrine',
  'coartem',
  'malarone',
  'quinine',
];

export function getProductCategory(
  code: string,
  designation: string
): TherapeuticCategory {
  const upperCode = code?.toUpperCase() ?? '';
  const upperDesignation = designation?.toUpperCase() ?? '';

  if (ANTIMALARIAL_CODES.has(code) || ANTIMALARIAL_CODES.has(upperCode)) {
    return 'antimalarial';
  }
  if (ANTIMALARIAL_PATTERNS.some((p) => upperDesignation.includes(p.toUpperCase()))) {
    return 'antimalarial';
  }

  if (
    upperDesignation.includes('AMOXICILL') ||
    upperDesignation.includes('AMOXICIL') ||
    upperDesignation.includes('ACLAV') ||
    upperDesignation.includes('AMFOCIN') ||
    upperDesignation.includes('METRONIDAZ') ||
    upperDesignation.includes('CIPROFLOX') ||
    upperDesignation.includes('PENICILL')
  ) {
    return 'antibiotic';
  }

  if (
    upperDesignation.includes('PARACETAMOL') ||
    upperDesignation.includes('PARAMED') ||
    upperDesignation.includes('NOVALG') ||
    upperDesignation.includes('DICLO') ||
    upperDesignation.includes('IBUPROF') ||
    upperDesignation.includes('ANTALGEX') ||
    upperDesignation.includes('LITACOLD')
  ) {
    return 'analgesic';
  }

  return 'other';
}
