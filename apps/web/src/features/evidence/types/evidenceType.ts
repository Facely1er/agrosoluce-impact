// Evidence Typology
// Defines standard classification for evidence without judging quality or compliance

export type EvidenceType = 'documented' | 'declared' | 'attested' | 'contextual';

export const EVIDENCE_TYPES: EvidenceType[] = ['documented', 'declared', 'attested', 'contextual'];

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  documented: 'Documented',
  declared: 'Declared',
  attested: 'Attested',
  contextual: 'Contextual',
};

export const EVIDENCE_TYPE_DEFAULT: EvidenceType = 'documented';

export const EVIDENCE_TYPE_TOOLTIP = 'Evidence classification. Not a quality or compliance assessment.';

