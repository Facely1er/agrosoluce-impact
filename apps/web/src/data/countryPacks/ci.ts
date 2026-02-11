// Country Pack: Côte d'Ivoire (CI)
// Static informational content about land tenure, document acceptance, and limitations
// Pure content only - NO scoring, NO compliance determination

export interface CountryPack {
  country_code: string;
  country_name: string;
  land_tenure_overview: string;
  commonly_accepted_documents: string[];
  known_limitations: string[];
  language_notes: string[];
  public_sources: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
}

export const CI_COUNTRY_PACK: CountryPack = {
  country_code: 'CI',
  country_name: 'Côte d\'Ivoire',
  land_tenure_overview: `Land tenure in Côte d'Ivoire is complex and characterized by multiple overlapping systems. The country recognizes both statutory law (based on French civil law) and customary law, which often coexist and sometimes conflict.

Most agricultural land is held under customary tenure, where land rights are typically managed by traditional authorities (chiefs, village councils). Formal land titles are relatively rare, especially in rural areas. Many farmers access land through:
- Customary arrangements with traditional authorities
- Family inheritance
- Sharecropping or rental agreements
- Community-based land allocation

The formal land registration system exists but is not widely accessible to smallholder farmers due to cost, complexity, and administrative barriers. Many farmers operate on land without formal documentation, relying on community recognition and traditional authority validation.

Land conflicts are common, particularly in cocoa-growing regions, where migration, population growth, and commercial agriculture have increased pressure on land resources.`,
  
  commonly_accepted_documents: [
    'Attestation de possession foncière (Land possession certificate) - issued by local authorities or traditional chiefs',
    'Certificat de propriété (Property certificate) - formal title document, less common',
    'Convention de location (Rental agreement) - for sharecropping or rental arrangements',
    'Attestation du chef de village (Village chief attestation) - traditional authority document',
    'Carte d\'identité nationale (National ID card) - for identity verification',
    'Attestation de résidence (Residence certificate) - issued by local administration',
    'Documents de succession (Inheritance documents) - for family land transfers',
    'Convention de métayage (Sharecropping agreement) - for sharecropping arrangements',
    'Photographs with landmarks - visual evidence of land use',
    'GPS coordinates - if available from mobile devices',
    'Maps showing field locations - hand-drawn or printed maps',
    'Statements from cooperative or local authorities - written attestations about land use',
  ],
  
  known_limitations: [
    'Formal land titles are rare: Most smallholder farmers do not have formal land titles. Expecting formal titles as the only acceptable evidence excludes many legitimate farmers.',
    'Cost and access barriers: The formal land registration process is expensive and administratively complex, making it inaccessible to many smallholder farmers.',
    'Customary vs. statutory law: There is often a gap between customary land rights (which are widely recognized locally) and formal statutory recognition. Documents may reflect customary rights that are not formally registered.',
    'Language barriers: Many official documents are in French, and farmers may have documents in local languages or dialects. Translation may be needed.',
    'Document quality varies: Documents may be handwritten, photocopied, or in various states of preservation. Age and condition of documents vary significantly.',
    'Incomplete documentation: Farmers may have partial documentation (e.g., identity documents but not land documents, or vice versa).',
    'Migration and land access: Many farmers are migrants or descendants of migrants who access land through arrangements that may not be formally documented.',
    'Gender disparities: Women often have less secure land rights and may have difficulty obtaining documentation, even when they are the primary farmers.',
    'Administrative delays: Obtaining official documents can take months or years, with inconsistent processing times across regions.',
    'Corruption and informal payments: The land administration system may require informal payments, creating barriers for farmers who cannot afford them.',
  ],
  
  language_notes: [
    'Official language: French is the official language of Côte d\'Ivoire. Most formal documents will be in French.',
    'Local languages: Many farmers speak local languages (e.g., Baoulé, Dioula, Bété) and may have documents or explanations in these languages. Translation support may be needed.',
    'Document terminology: Land-related documents may use specific legal or administrative terminology in French. Key terms include: "propriété" (ownership), "possession" (possession), "attestation" (certificate/attestation), "convention" (agreement).',
    'Village-level documents: Documents from village chiefs or local authorities may be in French, local languages, or a mix. Content and validity depend on local recognition.',
    'Translation considerations: When documents are in local languages, focus on understanding the content and context rather than requiring perfect translation. The key is demonstrating land access and use, not perfect linguistic accuracy.',
  ],
  
  public_sources: [
    {
      title: 'World Bank - Land Tenure in Côte d\'Ivoire',
      url: 'https://www.worldbank.org/en/country/cotedivoire',
      description: 'General information about land tenure systems and challenges in Côte d\'Ivoire',
    },
    {
      title: 'FAO - Land Tenure and Agricultural Development in Côte d\'Ivoire',
      url: 'https://www.fao.org/land-water/land/land-governance/land-tenure/en/',
      description: 'Information about land tenure and agricultural development policies',
    },
    {
      title: 'Côte d\'Ivoire Land Administration',
      url: 'https://www.gouv.ci/',
      description: 'Official government portal (French) - may contain information about land administration procedures',
    },
    {
      title: 'USAID - Land Tenure and Property Rights in Côte d\'Ivoire',
      url: 'https://www.land-links.org/',
      description: 'Resources on land tenure and property rights issues',
    },
  ],
};

/**
 * Get country pack by country code
 * Returns null if country pack not found
 */
export function getCountryPackByCode(countryCode: string): CountryPack | null {
  const codeUpper = countryCode.toUpperCase();
  if (codeUpper === 'CI' || codeUpper === 'COTE D\'IVOIRE' || codeUpper === 'CÔTE D\'IVOIRE' || codeUpper === 'IVORY COAST') {
    return CI_COUNTRY_PACK;
  }
  return null;
}

/**
 * Get country pack by country name (fuzzy matching)
 */
export function getCountryPackByName(countryName: string): CountryPack | null {
  const nameUpper = countryName.toUpperCase();
  if (nameUpper.includes('COTE') || nameUpper.includes('CÔTE') || nameUpper.includes('IVOIRE') || nameUpper.includes('IVORY COAST')) {
    return CI_COUNTRY_PACK;
  }
  return null;
}

