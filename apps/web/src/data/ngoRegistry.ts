// NGO & Public Reference Registry
// Static reference list of public-interest organizations
// Listing does not imply endorsement or certification

export interface NGORegistryEntry {
  ngo_name: string;
  thematic_focus: string[];
  countries_active: string[];
  public_reports_link: string;
  notes?: string;
}

/**
 * NGO & Public Reference Registry
 * Reference list of public-interest organizations working in agriculture, sustainability, and supply chain transparency
 * This is a reference list only - listing does not imply endorsement, certification, or partnership
 */
export const NGO_REGISTRY: NGORegistryEntry[] = [
  {
    ngo_name: 'Fairtrade International',
    thematic_focus: ['Fair Trade', 'Smallholder Support', 'Sustainable Agriculture', 'Social Justice'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Ecuador', 'Peru', 'Colombia', 'India', 'Indonesia'],
    public_reports_link: 'https://www.fairtrade.net/impact/reports',
    notes: 'Fairtrade certification and standards organization. Publishes annual impact reports and market data.',
  },
  {
    ngo_name: 'Rainforest Alliance',
    thematic_focus: ['Deforestation Prevention', 'Sustainable Agriculture', 'Climate Change', 'Biodiversity'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Brazil', 'Colombia', 'Ecuador', 'Indonesia', 'Vietnam'],
    public_reports_link: 'https://www.rainforest-alliance.org/about/annual-reports',
    notes: 'Certification and sustainable agriculture programs. Publishes annual reports and impact assessments.',
  },
  {
    ngo_name: 'UTZ (now part of Rainforest Alliance)',
    thematic_focus: ['Sustainable Agriculture', 'Traceability', 'Farmer Training'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Brazil', 'Colombia'],
    public_reports_link: 'https://www.rainforest-alliance.org/about/annual-reports',
    notes: 'Merged with Rainforest Alliance in 2018. Historical reports available through Rainforest Alliance.',
  },
  {
    ngo_name: 'Solidaridad Network',
    thematic_focus: ['Sustainable Supply Chains', 'Smallholder Support', 'Climate Resilience', 'Gender Equity'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Brazil', 'Colombia', 'India', 'Indonesia', 'Vietnam'],
    public_reports_link: 'https://www.solidaridadnetwork.org/publications',
    notes: 'International network focused on sustainable supply chains. Publishes annual reports and case studies.',
  },
  {
    ngo_name: 'World Cocoa Foundation',
    thematic_focus: ['Cocoa Sustainability', 'Farmer Livelihoods', 'Child Labor Prevention', 'Climate Change'],
    countries_active: ['Côte d\'Ivoire', 'Ghana', 'Ecuador', 'Colombia', 'Indonesia', 'Cameroon'],
    public_reports_link: 'https://www.worldcocoa.org/publications',
    notes: 'Industry association focused on cocoa sustainability. Publishes reports on sector challenges and solutions.',
  },
  {
    ngo_name: 'Cocoa Barometer',
    thematic_focus: ['Cocoa Sector Analysis', 'Sustainability Assessment', 'Supply Chain Transparency'],
    countries_active: ['Global'],
    public_reports_link: 'https://www.cocoabarometer.org/',
    notes: 'Biennial report on sustainability in the cocoa sector. Published by VOICE Network and other partners.',
  },
  {
    ngo_name: 'VOICE Network',
    thematic_focus: ['Cocoa Sector Advocacy', 'Human Rights', 'Environmental Protection', 'Supply Chain Transparency'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana'],
    public_reports_link: 'https://voicenetwork.eu/publications/',
    notes: 'European network of NGOs working on cocoa sector issues. Publishes advocacy reports and policy briefs.',
  },
  {
    ngo_name: 'Mighty Earth',
    thematic_focus: ['Deforestation Prevention', 'Environmental Protection', 'Supply Chain Accountability'],
    countries_active: ['Côte d\'Ivoire', 'Ghana', 'Indonesia', 'Brazil', 'Colombia'],
    public_reports_link: 'https://www.mightyearth.org/publications/',
    notes: 'Environmental advocacy organization. Publishes reports on deforestation and supply chain impacts.',
  },
  {
    ngo_name: 'Oxfam',
    thematic_focus: ['Smallholder Support', 'Gender Equity', 'Human Rights', 'Climate Justice'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Brazil', 'Colombia', 'India', 'Indonesia'],
    public_reports_link: 'https://www.oxfam.org/en/research',
    notes: 'International confederation focused on poverty and injustice. Publishes research on agricultural supply chains.',
  },
  {
    ngo_name: 'Human Rights Watch',
    thematic_focus: ['Human Rights', 'Child Labor', 'Labor Rights', 'Land Rights'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Brazil', 'Colombia', 'Indonesia'],
    public_reports_link: 'https://www.hrw.org/reports',
    notes: 'International human rights organization. Publishes reports on labor rights and human rights in supply chains.',
  },
  {
    ngo_name: 'International Labor Rights Forum',
    thematic_focus: ['Labor Rights', 'Child Labor Prevention', 'Worker Rights', 'Supply Chain Accountability'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Brazil', 'Colombia'],
    public_reports_link: 'https://laborrights.org/publications',
    notes: 'Organization focused on labor rights in global supply chains. Publishes reports on working conditions.',
  },
  {
    ngo_name: 'Forest Trends',
    thematic_focus: ['Deforestation Prevention', 'Sustainable Land Use', 'Ecosystem Services', 'Supply Chain Transparency'],
    countries_active: ['Global', 'Brazil', 'Colombia', 'Indonesia', 'Côte d\'Ivoire'],
    public_reports_link: 'https://www.forest-trends.org/publications/',
    notes: 'Organization focused on forest conservation and sustainable land use. Publishes research on deforestation drivers.',
  },
  {
    ngo_name: 'ProForest',
    thematic_focus: ['Sustainable Supply Chains', 'Deforestation Prevention', 'Certification', 'Traceability'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Brazil', 'Colombia', 'Indonesia'],
    public_reports_link: 'https://www.proforest.net/publications',
    notes: 'Organization providing technical support for sustainable supply chains. Publishes guidance and case studies.',
  },
  {
    ngo_name: 'IDH - The Sustainable Trade Initiative',
    thematic_focus: ['Sustainable Trade', 'Supply Chain Transformation', 'Landscape Approaches', 'Public-Private Partnerships'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Brazil', 'Colombia', 'Indonesia', 'Vietnam'],
    public_reports_link: 'https://www.idhsustainabletrade.com/publications/',
    notes: 'Organization facilitating sustainable trade initiatives. Publishes annual reports and impact assessments.',
  },
  {
    ngo_name: 'Global Forest Watch',
    thematic_focus: ['Deforestation Monitoring', 'Forest Transparency', 'Supply Chain Mapping', 'Data Tools'],
    countries_active: ['Global'],
    public_reports_link: 'https://www.globalforestwatch.org/publications',
    notes: 'Forest monitoring platform and research organization. Publishes data and analysis on forest loss.',
  },
  {
    ngo_name: 'World Resources Institute (WRI)',
    thematic_focus: ['Sustainable Agriculture', 'Deforestation Prevention', 'Climate Change', 'Supply Chain Transparency'],
    countries_active: ['Global', 'Brazil', 'Colombia', 'Indonesia', 'Côte d\'Ivoire'],
    public_reports_link: 'https://www.wri.org/publications',
    notes: 'Research organization focused on environmental and development issues. Publishes research on sustainable agriculture.',
  },
  {
    ngo_name: 'Conservation International',
    thematic_focus: ['Biodiversity Conservation', 'Sustainable Agriculture', 'Climate Change', 'Ecosystem Services'],
    countries_active: ['Global', 'Brazil', 'Colombia', 'Indonesia', 'Côte d\'Ivoire', 'Ghana'],
    public_reports_link: 'https://www.conservation.org/publications',
    notes: 'Conservation organization working on biodiversity and sustainable development. Publishes research and impact reports.',
  },
  {
    ngo_name: 'The Nature Conservancy',
    thematic_focus: ['Conservation', 'Sustainable Agriculture', 'Climate Change', 'Land Use Planning'],
    countries_active: ['Global', 'Brazil', 'Colombia', 'Indonesia'],
    public_reports_link: 'https://www.nature.org/en-us/about-us/who-we-are/how-we-work/working-with-companies/resources/',
    notes: 'Conservation organization. Publishes research on sustainable agriculture and conservation.',
  },
  {
    ngo_name: 'Greenpeace',
    thematic_focus: ['Environmental Protection', 'Deforestation Prevention', 'Supply Chain Accountability', 'Climate Change'],
    countries_active: ['Global', 'Brazil', 'Colombia', 'Indonesia', 'Côte d\'Ivoire'],
    public_reports_link: 'https://www.greenpeace.org/international/publications/',
    notes: 'Environmental advocacy organization. Publishes reports on deforestation and environmental impacts.',
  },
  {
    ngo_name: 'Amnesty International',
    thematic_focus: ['Human Rights', 'Labor Rights', 'Land Rights', 'Indigenous Rights'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'Brazil', 'Colombia', 'Indonesia'],
    public_reports_link: 'https://www.amnesty.org/en/documents/',
    notes: 'Human rights organization. Publishes reports on human rights violations in supply chains.',
  },
  {
    ngo_name: 'Traidcraft Exchange',
    thematic_focus: ['Fair Trade', 'Smallholder Support', 'Gender Equity', 'Supply Chain Transparency'],
    countries_active: ['Global', 'Côte d\'Ivoire', 'Ghana', 'India', 'Kenya'],
    public_reports_link: 'https://www.traidcraft.org.uk/resources',
    notes: 'Fair trade organization. Publishes reports on fair trade and smallholder support.',
  },
];

/**
 * Get all NGOs by thematic focus
 */
export function getNGOsByThematicFocus(focus: string): NGORegistryEntry[] {
  return NGO_REGISTRY.filter(ngo => 
    ngo.thematic_focus.some(f => f.toLowerCase().includes(focus.toLowerCase()))
  );
}

/**
 * Get all NGOs by country
 */
export function getNGOsByCountry(country: string): NGORegistryEntry[] {
  const countryLower = country.toLowerCase();
  return NGO_REGISTRY.filter(ngo => 
    ngo.countries_active.some(c => 
      c.toLowerCase().includes(countryLower) || 
      c.toLowerCase() === 'global'
    )
  );
}

/**
 * Get all unique thematic focuses
 */
export function getAllThematicFocuses(): string[] {
  const focuses = new Set<string>();
  NGO_REGISTRY.forEach(ngo => {
    ngo.thematic_focus.forEach(focus => focuses.add(focus));
  });
  return Array.from(focuses).sort();
}

/**
 * Get all unique countries
 */
export function getAllCountries(): string[] {
  const countries = new Set<string>();
  NGO_REGISTRY.forEach(ngo => {
    ngo.countries_active.forEach(country => countries.add(country));
  });
  return Array.from(countries).sort();
}

