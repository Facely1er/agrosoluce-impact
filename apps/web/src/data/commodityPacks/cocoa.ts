// Commodity Pack: Cocoa
// Static informational content about cocoa supply chains, document patterns, and buyer expectations
// Descriptive only - NO adequacy or sufficiency implications

export interface CommodityPack {
  commodity: string;
  typical_supply_chain: string;
  common_document_patterns: string[];
  buyer_expectations_summary: string;
  known_challenges: string[];
  reference_links: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
}

export const COCOA_COMMODITY_PACK: CommodityPack = {
  commodity: 'cocoa',
  typical_supply_chain: `Cocoa supply chains typically involve multiple actors from farm to consumer:

1. **Farmers**: Smallholder farmers (often 1-5 hectares) who grow cocoa trees and harvest pods. Many farmers are part of cooperatives or sell to local traders.

2. **Cooperatives**: Farmer organizations that aggregate cocoa from members, may provide services (training, inputs, credit), and sell to exporters or processors.

3. **Local Traders/Collectors**: Intermediaries who purchase cocoa from farmers or cooperatives, often operating at village or regional levels.

4. **Exporters**: Companies that purchase cocoa from cooperatives or traders, handle export documentation, and sell to international buyers.

5. **Processors**: Companies that process cocoa beans into cocoa products (butter, powder, liquor) for use in chocolate manufacturing.

6. **Chocolate Manufacturers**: Companies that produce finished chocolate products for retail markets.

7. **Retailers**: Final point of sale to consumers.

The supply chain can vary significantly by region, with some cooperatives having direct relationships with exporters or processors, while others work through multiple intermediaries. Traceability and documentation requirements increase as cocoa moves through the chain toward export markets.`,
  
  common_document_patterns: [
    'Certification documents (e.g., Fair Trade, Rainforest Alliance, UTZ, Organic) - often required for premium markets',
    'Cooperative membership certificates - showing farmer affiliation with organized groups',
    'Purchase receipts or sales records - documenting transactions between farmers and buyers',
    'Quality certificates - grading and quality assessment documents from cooperatives or exporters',
    'Traceability records - documentation linking cocoa batches to specific farms or cooperatives',
    'Export permits and customs documentation - required for international trade',
    'Land evidence documents - showing where cocoa is produced (varies by country)',
    'Child labor monitoring reports - documentation of monitoring and remediation efforts',
    'Environmental compliance certificates - for deforestation-free or sustainable production',
    'Financial records - payment receipts, credit agreements, or cooperative financial statements',
    'Training certificates - evidence of farmer training programs (e.g., GAP, sustainability)',
    'Internal control system documentation - for certification schemes requiring ICS',
  ],
  
  buyer_expectations_summary: `Buyers in cocoa markets typically expect documentation that demonstrates:

**Traceability**: Ability to trace cocoa back to specific farms or cooperatives, often required for certification schemes and regulatory compliance (e.g., EUDR).

**Quality Assurance**: Documentation showing cocoa meets quality standards, including grading certificates and quality control records.

**Sustainability Compliance**: Evidence of compliance with sustainability standards, including:
- Deforestation-free production (especially for EUDR compliance)
- Child labor monitoring and remediation
- Environmental protection measures
- Social responsibility practices

**Certification**: Many buyers require or prefer certified cocoa (Fair Trade, Rainforest Alliance, UTZ, Organic, etc.), with associated certification documentation.

**Legal Compliance**: Documentation showing compliance with local laws and regulations, including land rights, export permits, and tax documentation.

**Financial Transparency**: Records of payments to farmers, pricing structures, and financial relationships in the supply chain.

Buyer expectations vary significantly by market segment, with premium markets (e.g., specialty chocolate, certified products) typically requiring more extensive documentation than commodity markets.`,
  
  known_challenges: [
    'Documentation gaps: Many smallholder farmers lack formal documentation, particularly for land rights and transactions. Expecting formal documents as the only acceptable evidence can exclude legitimate farmers.',
    'Certification costs: Certification schemes require significant investment in documentation, monitoring, and compliance. Not all cooperatives or farmers can afford certification, limiting market access.',
    'Traceability complexity: Maintaining traceability through complex supply chains with multiple intermediaries is challenging and requires robust record-keeping systems.',
    'Language barriers: Documentation may be in local languages or dialects, requiring translation support for international buyers.',
    'Document quality and preservation: Documents may be handwritten, photocopied, or in various states of preservation. Age, storage conditions, and handling affect document quality.',
    'Inconsistent standards: Different buyers and certification schemes have varying documentation requirements, creating confusion and administrative burden for cooperatives.',
    'Technology limitations: Many cooperatives operate in areas with limited internet access or technology infrastructure, making digital documentation systems difficult to implement.',
    'Cost of compliance: Meeting documentation requirements can be expensive, particularly for small cooperatives with limited resources.',
    'Time delays: Obtaining official documents can take months or years, with inconsistent processing times across regions and administrative systems.',
    'Gender disparities: Women farmers often face additional barriers in obtaining documentation, particularly for land rights, limiting their market access.',
    'Seasonal variations: Documentation needs may vary by harvest season, with peak periods creating administrative bottlenecks.',
    'Intermediary documentation: In supply chains with multiple intermediaries, documentation may be incomplete or inconsistent at different stages.',
  ],
  
  reference_links: [
    {
      title: 'International Cocoa Organization (ICCO)',
      url: 'https://www.icco.org/',
      description: 'International organization providing information about cocoa markets, statistics, and industry standards',
    },
    {
      title: 'World Cocoa Foundation',
      url: 'https://www.worldcocoa.org/',
      description: 'Industry organization focused on sustainable cocoa production and supply chain practices',
    },
    {
      title: 'Fairtrade International - Cocoa',
      url: 'https://www.fairtrade.net/product/cocoa',
      description: 'Information about Fairtrade certification standards and requirements for cocoa',
    },
    {
      title: 'Rainforest Alliance - Cocoa',
      url: 'https://www.rainforest-alliance.org/business/sectors/agriculture/cocoa',
      description: 'Certification standards and sustainable agriculture practices for cocoa production',
    },
    {
      title: 'EU Deforestation Regulation - Cocoa',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1115',
      description: 'EU regulation on deforestation-free products, including cocoa traceability requirements',
    },
    {
      title: 'Cocoa Barometer',
      url: 'https://www.cocoabarometer.org/',
      description: 'Biennial report on sustainability in the cocoa sector, including supply chain analysis',
    },
  ],
};

/**
 * Get commodity pack by commodity name
 * Returns null if commodity pack not found
 */
export function getCommodityPackByName(commodityName: string): CommodityPack | null {
  const nameLower = commodityName.toLowerCase();
  if (nameLower.includes('cocoa') || nameLower.includes('cacao')) {
    return COCOA_COMMODITY_PACK;
  }
  return null;
}


