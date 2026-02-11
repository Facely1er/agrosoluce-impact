// Regulatory Reference Mapping
// Static reference content describing regulatory obligations
// No logic, no scoring, no compliance determination

export type Jurisdiction = 'EU' | 'FR' | 'DE' | 'CI';

export type DocType = 'certification' | 'policy' | 'land_evidence' | 'other';
export type EvidenceType = 'documented' | 'declared' | 'attested' | 'contextual';

export interface RegulatoryReference {
  ref_id: string;
  jurisdiction: Jurisdiction;
  regulation_name: string;
  article_reference: string;
  due_diligence_expectation: string; // Plain language description
  typical_supporting_evidence: Array<DocType | EvidenceType>;
  source_link: string;
}

/**
 * Regulatory References Database
 * Static informational content only - describes obligations, does not evaluate fulfillment
 */
export const REGULATORY_REFERENCES: RegulatoryReference[] = [
  // EU Regulations
  {
    ref_id: 'EUDR-001',
    jurisdiction: 'EU',
    regulation_name: 'EU Deforestation Regulation (EUDR)',
    article_reference: 'Article 9 - Due Diligence Obligations',
    due_diligence_expectation: 'Operators must collect information, documents, and data demonstrating that relevant commodities and products placed on the Union market or exported from the Union are deforestation-free and have been produced in accordance with the relevant legislation of the country of production.',
    typical_supporting_evidence: ['certification', 'land_evidence', 'documented', 'attested'],
    source_link: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1115',
  },
  {
    ref_id: 'EUDR-002',
    jurisdiction: 'EU',
    regulation_name: 'EU Deforestation Regulation (EUDR)',
    article_reference: 'Article 10 - Information Requirements',
    due_diligence_expectation: 'Operators must obtain and keep information on the geolocation and time of production of the relevant commodities, including information on the plot of land where the relevant commodities were produced.',
    typical_supporting_evidence: ['land_evidence', 'documented', 'contextual'],
    source_link: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1115',
  },
  {
    ref_id: 'EUDR-003',
    jurisdiction: 'EU',
    regulation_name: 'EU Deforestation Regulation (EUDR)',
    article_reference: 'Article 11 - Risk Assessment',
    due_diligence_expectation: 'Operators must assess the risk that relevant commodities and products are non-compliant with the requirements of this Regulation, taking into account information obtained pursuant to Article 10 and other relevant information.',
    typical_supporting_evidence: ['certification', 'policy', 'documented', 'attested'],
    source_link: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1115',
  },
  {
    ref_id: 'EUDR-004',
    jurisdiction: 'EU',
    regulation_name: 'EU Deforestation Regulation (EUDR)',
    article_reference: 'Article 12 - Risk Mitigation',
    due_diligence_expectation: 'Where a risk is identified, operators must take adequate and proportionate mitigation measures to ensure that the risk is reduced to a negligible level before placing the relevant commodities and products on the Union market or exporting them.',
    typical_supporting_evidence: ['certification', 'policy', 'attested'],
    source_link: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1115',
  },
  {
    ref_id: 'EU-CSRD-001',
    jurisdiction: 'EU',
    regulation_name: 'Corporate Sustainability Reporting Directive (CSRD)',
    article_reference: 'Article 19a - Sustainability Reporting',
    due_diligence_expectation: 'Large companies must report on sustainability matters, including information about their due diligence processes with respect to sustainability matters, and about the principal adverse impacts connected with the company\'s value chain.',
    typical_supporting_evidence: ['policy', 'documented', 'attested'],
    source_link: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022L2464',
  },
  {
    ref_id: 'EU-CSRDD-001',
    jurisdiction: 'EU',
    regulation_name: 'Corporate Sustainability Due Diligence Directive (CSDDD)',
    article_reference: 'Article 7 - Due Diligence Policy',
    due_diligence_expectation: 'Companies must adopt and annually update a due diligence policy which includes a description of the company\'s approach to due diligence, a code of conduct, and a description of the processes put in place to implement due diligence obligations.',
    typical_supporting_evidence: ['policy', 'documented'],
    source_link: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52024PC0050',
  },
  
  // French Regulations
  {
    ref_id: 'FR-LDV-001',
    jurisdiction: 'FR',
    regulation_name: 'Loi de Vigilance (Duty of Vigilance Law)',
    article_reference: 'Article L. 225-102-4 - Vigilance Plan',
    due_diligence_expectation: 'Companies must establish and effectively implement a vigilance plan that includes reasonable measures to identify risks and prevent serious violations of human rights and fundamental freedoms, serious bodily injury or environmental damage or health risks resulting from their activities and those of their subsidiaries, subcontractors, and suppliers.',
    typical_supporting_evidence: ['policy', 'documented', 'attested'],
    source_link: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000034057313',
  },
  {
    ref_id: 'FR-LDV-002',
    jurisdiction: 'FR',
    regulation_name: 'Loi de Vigilance (Duty of Vigilance Law)',
    article_reference: 'Article L. 225-102-5 - Public Reporting',
    due_diligence_expectation: 'Companies must publish their vigilance plan in their annual management report, including information on the measures taken to implement the plan and the results obtained.',
    typical_supporting_evidence: ['policy', 'documented'],
    source_link: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000034057313',
  },
  
  // German Regulations
  {
    ref_id: 'DE-LkSG-001',
    jurisdiction: 'DE',
    regulation_name: 'Lieferkettensorgfaltspflichtengesetz (LkSG)',
    article_reference: 'Section 3 - Human Rights Due Diligence',
    due_diligence_expectation: 'Companies must establish appropriate risk management systems to identify, prevent, and mitigate human rights risks and environmental risks in their supply chains. This includes conducting regular risk analyses and taking appropriate preventive and remedial measures.',
    typical_supporting_evidence: ['policy', 'documented', 'attested'],
    source_link: 'https://www.gesetze-im-internet.de/lksg/',
  },
  {
    ref_id: 'DE-LkSG-002',
    jurisdiction: 'DE',
    regulation_name: 'Lieferkettensorgfaltspflichtengesetz (LkSG)',
    article_reference: 'Section 6 - Policy Statement',
    due_diligence_expectation: 'Companies must adopt a policy statement on their human rights strategy, including the procedure for identifying and assessing human rights risks, measures to prevent and mitigate risks, and procedures for handling complaints.',
    typical_supporting_evidence: ['policy', 'documented'],
    source_link: 'https://www.gesetze-im-internet.de/lksg/',
  },
  {
    ref_id: 'DE-LkSG-003',
    jurisdiction: 'DE',
    regulation_name: 'Lieferkettensorgfaltspflichtengesetz (LkSG)',
    article_reference: 'Section 8 - Risk Analysis',
    due_diligence_expectation: 'Companies must conduct regular risk analyses to identify and assess human rights and environmental risks in their supply chains, taking into account the nature and scope of their business activities.',
    typical_supporting_evidence: ['certification', 'policy', 'documented', 'contextual'],
    source_link: 'https://www.gesetze-im-internet.de/lksg/',
  },
  
  // Côte d'Ivoire Regulations
  {
    ref_id: 'CI-Cocoa-001',
    jurisdiction: 'CI',
    regulation_name: 'Côte d\'Ivoire Cocoa Sector Regulations',
    article_reference: 'Decree on Cocoa Traceability',
    due_diligence_expectation: 'Cocoa producers and exporters must maintain traceability records demonstrating the origin of cocoa beans, including information about the cooperative, farmer, and plot of land where the cocoa was produced.',
    typical_supporting_evidence: ['certification', 'land_evidence', 'documented', 'declared'],
    source_link: 'https://www.gouv.ci/',
  },
  {
    ref_id: 'CI-ChildLabor-001',
    jurisdiction: 'CI',
    regulation_name: 'Côte d\'Ivoire Child Labor Prevention',
    article_reference: 'National Action Plan for Child Labor Elimination',
    due_diligence_expectation: 'Cocoa sector actors must implement measures to prevent and eliminate child labor, including monitoring systems, awareness-raising activities, and support for affected families. Documentation of compliance measures is required for export certification.',
    typical_supporting_evidence: ['certification', 'policy', 'documented', 'declared'],
    source_link: 'https://www.gouv.ci/',
  },
  {
    ref_id: 'CI-Forest-001',
    jurisdiction: 'CI',
    regulation_name: 'Côte d\'Ivoire Forest Code',
    article_reference: 'Forest Protection and Sustainable Management',
    due_diligence_expectation: 'Agricultural activities must comply with forest protection regulations. Evidence of legal land use and absence of deforestation is required for commodities produced in forest-adjacent areas.',
    typical_supporting_evidence: ['land_evidence', 'certification', 'documented', 'contextual'],
    source_link: 'https://www.gouv.ci/',
  },
];

/**
 * Get regulatory references by jurisdiction
 */
export function getRegulatoryReferencesByJurisdiction(jurisdiction: Jurisdiction): RegulatoryReference[] {
  return REGULATORY_REFERENCES.filter(ref => ref.jurisdiction === jurisdiction);
}

/**
 * Get regulatory references by regulation name
 */
export function getRegulatoryReferencesByRegulation(regulationName: string): RegulatoryReference[] {
  return REGULATORY_REFERENCES.filter(ref => 
    ref.regulation_name.toLowerCase().includes(regulationName.toLowerCase())
  );
}

/**
 * Get all unique jurisdictions
 */
export function getAllJurisdictions(): Jurisdiction[] {
  return Array.from(new Set(REGULATORY_REFERENCES.map(ref => ref.jurisdiction)));
}

/**
 * Get all unique regulation names
 */
export function getAllRegulationNames(): string[] {
  return Array.from(new Set(REGULATORY_REFERENCES.map(ref => ref.regulation_name)));
}

