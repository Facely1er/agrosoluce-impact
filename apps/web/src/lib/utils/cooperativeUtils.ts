// Utility functions for cooperative data processing
// Migrated from the original HTML/JS implementation

export function normalizeText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function toSlug(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function splitContact(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .toString()
    .split(/[\/|,;\n]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

export function normalizeCIPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  const digits = cleaned.replace(/^0+/, '');
  const last10 = digits.slice(-10);
  const last8 = digits.slice(-8);
  if (last10 && last10.length === 10) return '+225' + last10;
  if (last8 && last8.length === 8) return '+225' + last8;
  if (digits.startsWith('225')) return '+' + digits;
  return '+225' + digits;
}

export function extractNatureTags(natureActivite: string | null | undefined): string[] {
  const text = normalizeText(natureActivite || '');
  const tags = new Set<string>();
  const map = [
    ['production', 'production'],
    ['collecte', 'collecte'],
    ['achat', 'achat'],
    ['vente', 'vente'],
    ['commercialisation', 'commercialisation'],
    ['transformation', 'transformation'],
    ['stockage', 'stockage'],
    ['transport', 'transport'],
    ['conditionnement', 'conditionnement']
  ];
  map.forEach(([needle, tag]) => {
    if (text.includes(needle)) tags.add(tag);
  });
  return Array.from(tags);
}

export function canonicalizeSecteur(value: string | null | undefined): string {
  const v = (value || '').toString().trim();
  if (!v) return '';
  return v.toUpperCase();
}

/**
 * Format cooperative name for display according to workflow requirements.
 * Names should not be displayed directly - they should be formatted and normalized.
 * 
 * @param name - Raw cooperative name from database
 * @returns Formatted name ready for display
 */
export function formatCooperativeName(name: string | null | undefined): string {
  if (!name) return '';
  
  // Trim whitespace
  let formatted = name.trim();
  
  // Remove extra whitespace and normalize
  formatted = formatted.replace(/\s+/g, ' ');
  formatted = formatted.replace(/\s*-\s*/g, '-'); // Normalize hyphens
  
  // Handle common cooperative name patterns
  const commonPrefixes = ['COOP', 'COOPERATIVE', 'UNION', 'FEDERATION', 'ASSOCIATION', 'SOCIETE', 'SOCIÉTÉ'];
  const commonSuffixes = ['SARL', 'SA', 'SCA', 'SCE', 'GIE', 'SNC', 'SAS'];
  
  // Split into words and format each
  const words = formatted.split(/\s+/);
  formatted = words
    .map((word, index) => {
      if (!word) return word;
      
      const upperWord = word.toUpperCase();
      const lowerWord = word.toLowerCase();
      const isLastWord = index === words.length - 1;
      const isFirstWord = index === 0;
      
      // Handle common prefixes (usually first word)
      if (isFirstWord && commonPrefixes.includes(upperWord)) {
        // Capitalize first letter, rest lowercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      
      // Handle common suffixes (usually last word)
      if (isLastWord && commonSuffixes.includes(upperWord)) {
        // Keep as all caps for legal entities
        return upperWord;
      }
      
      // Handle hyphenated words (e.g., "COOP-ABC" or "coop-abc")
      if (word.includes('-')) {
        return word
          .split('-')
          .map(part => {
            if (!part) return part;
            const partUpper = part.toUpperCase();
            const partLower = part.toLowerCase();
            if (part === partUpper || part === partLower) {
              return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }
            return part;
          })
          .join('-');
      }
      
      // If word is all caps or all lowercase, apply title case
      if (word === upperWord || word === lowerWord) {
        // Special handling for acronyms (2-4 letters, all caps, no numbers)
        if (word.length <= 4 && word === upperWord && /^[A-Z]+$/.test(word)) {
          return upperWord; // Keep acronyms as all caps
        }
        // Apply title case
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      
      // Otherwise preserve existing capitalization (mixed case)
      return word;
    })
    .join(' ');
  
  // Ensure first letter is always capitalized
  if (formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  
  return formatted;
}

// Region coordinates for Côte d'Ivoire
export const regionCoordinates: Record<string, [number, number]> = {
  "AGNEBY-TIASSA": [5.93, -4.22],
  "BAGOUÉ": [9.50, -6.50],
  "BAFING": [8.50, -7.75],
  "BÉOUMI": [7.00, -5.95],
  "BOUNDIALI": [9.52, -6.47],
  "CAVALLY": [6.60, -7.50],
  "DENGUÉLÉ": [9.80, -7.35],
  "GBÔKLÉ": [5.50, -4.40],
  "GBÉKÉ": [7.68, -5.03],
  "GO": [6.13, -5.95],
  "GOH": [6.13, -5.95],
  "GUEMON": [7.40, -7.55],
  "GUÉRÉ": [6.75, -7.50],
  "HAMBOL": [8.10, -5.20],
  "HAUT-SASSANDRA": [7.00, -6.47],
  "IFOU": [7.78, -8.12],
  "INDÉNIÉ-DJUABLIN": [6.48, -3.50],
  "KABADOUGOU": [9.50, -7.50],
  "KAN": [9.50, -7.00],
  "KAVALLI": [6.60, -7.50],
  "KOUTO": [9.50, -7.50],
  "LOH-DJIBOUA": [6.50, -7.15],
  "LOGN": [6.89, -8.13],
  "MARAHOUÉ": [7.50, -6.00],
  "N'AWA": [6.50, -3.50],
  "PORO": [9.50, -5.50],
  "SAN-PÉDRO": [4.75, -6.64],
  "SINFRA": [6.62, -5.91],
  "SUD-COMOÉ": [5.50, -3.20],
  "TONKPI": [7.40, -8.10],
  "TOUMODI": [6.58, -5.01],
  "VILLE D'ABIDJAN": [5.32, -4.03],
  "WESTERN": [5.32, -4.03],
  "WORODOUGOU": [8.00, -6.50],
  "YAMOUSSOUKRO": [6.83, -5.28],
  "ZANZAN": [8.30, -3.40]
};

export function getRegionCoordinates(regionName: string): [number, number] {
  if (regionCoordinates[regionName]) {
    return regionCoordinates[regionName];
  }
  const normalizedName = regionName.toUpperCase().trim();
  for (const [key, coords] of Object.entries(regionCoordinates)) {
    if (key.toUpperCase() === normalizedName) {
      return coords;
    }
  }
  return [7.54, -5.55]; // Default to center of Côte d'Ivoire
}

export function enrichCooperatives(cooperatives: any[]): any[] {
  return cooperatives.map(c => {
    const [lat, lng] = getRegionCoordinates(c.region || '');
    const contactParts = splitContact(c.contact);
    const phoneCandidates = [c.phone, ...contactParts];
    const phonesE164 = (phoneCandidates
      .map(p => normalizeCIPhone(p))
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i)) as string[];
    
    // Format cooperative name according to workflow requirements
    const formattedName = formatCooperativeName(c.name);
    
    return {
      ...c,
      name: formattedName, // Use formatted name (not displayed directly)
      lat,
      lng,
      regionSlug: toSlug(c.region),
      departementSlug: toSlug(c.departement),
      secteurCanonical: canonicalizeSecteur(c.secteur),
      natureActiviteTags: extractNatureTags(c.natureActivite),
      phonesE164,
      primaryPhoneE164: phonesE164[0] || null,
      searchKeywords: [
        normalizeText(c.name), // Keep original for search
        normalizeText(c.departement),
        normalizeText(c.president)
      ].filter(Boolean)
    };
  });
}

