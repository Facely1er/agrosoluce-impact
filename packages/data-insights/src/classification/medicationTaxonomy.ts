/**
 * Enhanced Medication Taxonomy
 * 
 * Classifies pharmaceutical products into 7 therapeutic categories for HWI calculation:
 * 1. Antimalarials - Workforce health (EUDR, Living Income)
 * 2. Pediatric ORS/Zinc - Child welfare, WASH (CSDDD Art. 8, Child Labor)
 * 3. Prenatal Vitamins - Maternal health (Fairtrade 3.5, SDG 3)
 * 4. Contraceptives - Women's empowerment (UN Women, SDG 5)
 * 5. Micronutrients - Nutrition (SDG 2, Food Security)
 * 6. ARVs - Chronic illness HIV (ILO C111, SDG 3)
 * 7. Antibiotics - Acute illness (WHO AMR)
 */

export type MedicationCategory =
  | 'antimalarial'
  | 'pediatric_ors_zinc'
  | 'prenatal_vitamins'
  | 'contraceptives'
  | 'micronutrients'
  | 'arv'
  | 'antibiotics'
  | 'other';

export type IndicatorType =
  | 'workforce_health'
  | 'child_welfare'
  | 'womens_health'
  | 'womens_empowerment'
  | 'nutrition'
  | 'chronic_illness'
  | 'acute_illness'
  | 'other';

export type Priority = 'high' | 'medium' | 'low';

export interface MedicationClassification {
  category: MedicationCategory;
  indicatorType: IndicatorType;
  priority: Priority;
}

/**
 * Antimalarial patterns - Workforce health indicator
 */
const ANTIMALARIAL_PATTERNS = [
  /\bARTEFAN\b/i,
  /\bPLUFENTRINE\b/i,
  /\bARTEMETHER\b/i,
  /\bLUMEFANTRINE\b/i,
  /\bCOARTEM\b/i,
  /\bMALARONE\b/i,
  /\bQUININE\b/i,
  /\bMEFLOQUINE\b/i,
  /\bARTESUNATE\b/i,
  /\bARTEMISININ\b/i,
];

/**
 * Pediatric ORS/Zinc patterns - Child welfare, WASH crisis indicator
 */
const PEDIATRIC_ORS_ZINC_PATTERNS = [
  /\bSRO\b/i,
  /\bORS\b/i,
  /\bADIARIL\b/i,
  /\bPEDIALYTE\b/i,
  /\bORALYTE\b/i,
  /\bREHYDRATE\b/i,
  /\bZINC.*SULFATE/i,
  /\bZINC.*DIARRH/i,
  /\bZINC.*ORS/i,
  /\bDIARRH.*ZINC/i,
];

/**
 * Prenatal vitamin patterns - Maternal health indicator
 */
const PRENATAL_VITAMIN_PATTERNS = [
  /\bACIDE.*FOLIQUE/i,
  /\bFOLIC.*ACID/i,
  /\bFER.*FOLATE/i,
  /\bFOLATE.*FER/i,
  /\bPRENATAL/i,
  /\bGROSSESSE/i,
  /\bFER.*GROSSESSE/i,
  /\bVITAMIN.*PRENATAL/i,
  /\bFER.*B9/i,
  /\bVITAMINE.*FEMME.*ENCEINTE/i,
];

/**
 * Contraceptive patterns - Women's empowerment indicator
 */
const CONTRACEPTIVE_PATTERNS = [
  /\bPREGNON\b/i,
  /\bNORLEVO\b/i,
  /\bPOSTPILL\b/i,
  /\bPILULE.*LENDEMAIN/i,
  /\bCONTRACEPT/i,
  /\bNORGESTREL/i,
  /\bLEVONORGESTREL/i,
  /\bETHINYL.*ESTRADIOL/i,
  /\bPLAN.*B\b/i,
  /\bEMERGENCY.*CONTRACEPT/i,
];

/**
 * Micronutrient patterns - Nutrition, food security indicator
 */
const MICRONUTRIENT_PATTERNS = [
  /\bVITAMIN.*A\b/i,
  /\bVITAMINE.*A\b/i,
  /\bFER.*ELEM/i,
  /\bIRON.*SUPPLEMENT/i,
  /\bZINC\b(?!.*DIARRH)/i, // Zinc NOT for diarrhea (general supplementation)
  /\bCALCIUM\b/i,
  /\bMAGNESIUM\b/i,
  /\bMULTIVITAMIN/i,
  /\bMICRONUTRIMENT/i,
  /\bSUPPLEMENT.*NUTRITION/i,
];

/**
 * ARV patterns - HIV/chronic illness indicator
 */
const ARV_PATTERNS = [
  /\bTENOFOVIR/i,
  /\bEFAVIRENZ/i,
  /\bLAMIVUDINE/i,
  /\bNEVIRAPINE/i,
  /\bZIDOVUDINE/i,
  /\bABACVIR/i,
  /\bRITONAVIR/i,
  /\bLOPINAVIR/i,
  /\bDOLUTEGRAVIR/i,
  /\bEMTRICITABINE/i,
  /\bARV\b/i,
  /\bANTIRETROVIRAL/i,
  /\bTRI.*THERAP/i,
];

/**
 * Antibiotic patterns - Acute illness indicator
 */
const ANTIBIOTIC_PATTERNS = [
  /\bAMOXICILL/i,
  /\bAMOXICIL\b/i,
  /\bACLAV\b/i,
  /\bAMFOCIN\b/i,
  /\bMETRONIDAZ/i,
  /\bCIPROFLOX/i,
  /\bPENICILL/i,
  /\bAZITHROMYCIN/i,
  /\bCLARITHROMYCIN/i,
  /\bCEFTRIAXON/i,
  /\bGENTAMICIN/i,
  /\bDOXYCYCLIN/i,
  /\bCOTRIMOXAZOLE/i,
  /\bERYTHROMYCIN/i,
];

/**
 * Known antimalarial product codes (from existing system)
 */
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

/**
 * Classify medication based on product code and designation
 * Priority order: Pediatric ORS/Zinc > Prenatal > Contraceptives > ARVs > Antimalarials > Antibiotics > Micronutrients
 */
export function classifyMedication(code: string, designation: string): MedicationClassification {
  const upperCode = code?.toUpperCase() ?? '';
  const upperDesignation = designation?.toUpperCase() ?? '';

  // Priority 1: Pediatric ORS/Zinc (child welfare - highest ESG priority)
  if (PEDIATRIC_ORS_ZINC_PATTERNS.some(pattern => pattern.test(upperDesignation))) {
    return {
      category: 'pediatric_ors_zinc',
      indicatorType: 'child_welfare',
      priority: 'high',
    };
  }

  // Priority 2: Prenatal vitamins (maternal health)
  if (PRENATAL_VITAMIN_PATTERNS.some(pattern => pattern.test(upperDesignation))) {
    return {
      category: 'prenatal_vitamins',
      indicatorType: 'womens_health',
      priority: 'high',
    };
  }

  // Priority 3: Contraceptives (women's empowerment)
  if (CONTRACEPTIVE_PATTERNS.some(pattern => pattern.test(upperDesignation))) {
    return {
      category: 'contraceptives',
      indicatorType: 'womens_empowerment',
      priority: 'high',
    };
  }

  // Priority 4: ARVs (chronic illness)
  if (ARV_PATTERNS.some(pattern => pattern.test(upperDesignation))) {
    return {
      category: 'arv',
      indicatorType: 'chronic_illness',
      priority: 'medium',
    };
  }

  // Priority 5: Antimalarials (workforce health)
  if (
    ANTIMALARIAL_CODES.has(code) ||
    ANTIMALARIAL_CODES.has(upperCode) ||
    ANTIMALARIAL_PATTERNS.some(pattern => pattern.test(upperDesignation))
  ) {
    return {
      category: 'antimalarial',
      indicatorType: 'workforce_health',
      priority: 'high',
    };
  }

  // Priority 6: Antibiotics (acute illness)
  if (ANTIBIOTIC_PATTERNS.some(pattern => pattern.test(upperDesignation))) {
    return {
      category: 'antibiotics',
      indicatorType: 'acute_illness',
      priority: 'medium',
    };
  }

  // Priority 7: Micronutrients (nutrition)
  if (MICRONUTRIENT_PATTERNS.some(pattern => pattern.test(upperDesignation))) {
    return {
      category: 'micronutrients',
      indicatorType: 'nutrition',
      priority: 'medium',
    };
  }

  // Default: other
  return {
    category: 'other',
    indicatorType: 'other',
    priority: 'low',
  };
}

/**
 * Get human-readable category label
 */
export function getCategoryLabel(category: MedicationCategory): string {
  const labels: Record<MedicationCategory, string> = {
    antimalarial: 'Antimalarials',
    pediatric_ors_zinc: 'Pediatric ORS/Zinc',
    prenatal_vitamins: 'Prenatal Vitamins',
    contraceptives: 'Contraceptives',
    micronutrients: 'Micronutrients',
    arv: 'ARVs (HIV)',
    antibiotics: 'Antibiotics',
    other: 'Other',
  };
  return labels[category];
}

/**
 * Get ESG framework mapping for category
 */
export function getESGMapping(category: MedicationCategory): string {
  const mappings: Record<MedicationCategory, string> = {
    antimalarial: 'EUDR, ISSB S2, Living Income',
    pediatric_ors_zinc: 'CSDDD Art. 8, SDG 6, Child Labor Prevention',
    prenatal_vitamins: 'Fairtrade 3.5, Rainforest Alliance Ch. 4, SDG 3',
    contraceptives: 'UN Women, Gender Equity Standards, SDG 5',
    micronutrients: 'SDG 2, Living Income Gap Analysis',
    arv: 'ILO C111, SDG 3, Healthcare Access',
    antibiotics: 'WHO AMR, Healthcare Quality Standards',
    other: 'General Health',
  };
  return mappings[category];
}

/**
 * Get indicator type label
 */
export function getIndicatorTypeLabel(indicatorType: IndicatorType): string {
  const labels: Record<IndicatorType, string> = {
    workforce_health: 'Workforce Health',
    child_welfare: 'Child Welfare',
    womens_health: "Women's Health",
    womens_empowerment: "Women's Empowerment",
    nutrition: 'Nutrition & Food Security',
    chronic_illness: 'Chronic Illness Management',
    acute_illness: 'Acute Illness',
    other: 'Other',
  };
  return labels[indicatorType];
}
