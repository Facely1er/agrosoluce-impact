/**
 * VRAC data source: pharmacy sales CSV ingest
 * Register with sourceRegistry; add new file mappings here when new files arrive
 */

import type { DataSource, FileMapping } from '../../pipeline/types';
import { parseEtat2080, parseListeProduits } from './parsers';
import type { VracPeriodData } from './types';

const VRAC_SOURCE_ID = 'vrac';

/** File mappings: which CSV maps to which pharmacy/period */
export const VRAC_FILE_MAPPINGS: FileMapping[] = [
  { file: 'ETAT_2080QTE1.csv', subdir: 'PROLIFE/2080', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_2080QTE2.csv', subdir: 'PROLIFE/2080', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_2080QTE3.csv', subdir: 'PROLIFE/2080', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_2080QTE4.csv', subdir: 'PROLIFE/2080', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2022', year: 2022 },
  { file: 'ETAT_2080QTE5.csv', subdir: 'TANDA/2080', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_2080QTE6.csv', subdir: 'TANDA/2080', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_2080QTE7.csv', subdir: 'TANDA/2080', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_2080QTE8.csv', subdir: 'TANDA/2080', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2022', year: 2022 },
  { file: 'ETAT_2080QTE1.csv', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_2080QTE2.csv', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_2080QTE3.csv', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_2080QTE4.csv', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2022', year: 2022 },
  { file: 'ETAT_2080QTE5.csv', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_2080QTE6.csv', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_2080QTE7.csv', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_2080QTE8.csv', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2022', year: 2022 },
];

export const VRAC_LISTE_MAPPINGS: FileMapping[] = [
  { file: 'ETAT_ListeProduitsVendus1.csv', subdir: 'TANDA', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_ListeProduitsVendus2.csv', subdir: 'TANDA', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_ListeProduitsVendus3.csv', subdir: 'TANDA', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_ListeProduitsVendus4.csv', subdir: 'TANDA', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2022', year: 2022 },
];

/** Infer parser type from file name */
function inferParserType(file: string): 'etat_2080' | 'liste_produits' {
  return file.includes('ListeProduitsVendus') ? 'liste_produits' : 'etat_2080';
}

/** Infer pharmacy from mapping (subdir or file name) */
function inferPharmacyFromMapping(m: FileMapping): string {
  if (m.subdir) {
    if (m.subdir.includes('PROLIFE')) return 'prolife';
    if (m.subdir.includes('TANDA')) return 'tanda';
    if (m.subdir.includes('OLYMPIQUE')) return 'olympique';
    if (m.subdir.includes('ATTOBROU')) return 'attobrou';
  }
  if (m.file.includes('ETAT_2080QTE1') || m.file.includes('ETAT_2080QTE2') || m.file.includes('ETAT_2080QTE3') || m.file.includes('ETAT_2080QTE4'))
    return 'prolife';
  if (m.file.includes('ETAT_2080QTE5') || m.file.includes('ETAT_2080QTE6') || m.file.includes('ETAT_2080QTE7') || m.file.includes('ETAT_2080QTE8'))
    return 'tanda';
  if (m.file.includes('ListeProduitsVendus')) return 'tanda';
  return 'unknown';
}

function parse(content: string, mapping: FileMapping, parser: (c: string) => { code: string; designation: string; quantitySold: number }[]): VracPeriodData | null {
  const products = parser(content);
  if (products.length === 0) return null;
  const totalQuantity = products.reduce((s, p) => s + p.quantitySold, 0);
  const pharmacyId = inferPharmacyFromMapping(mapping);
  const periodStart = `${mapping.year}-08-01`;
  const periodEnd = `${mapping.year}-12-10`;

  return {
    pharmacyId,
    periodLabel: mapping.periodLabel,
    year: mapping.year,
    periodStart,
    periodEnd,
    products,
    totalQuantity,
  };
}

export function parseVracContent(content: string, mapping: FileMapping, parserType?: 'etat_2080' | 'liste_produits'): VracPeriodData | null {
  const pt = parserType ?? inferParserType(mapping.file);
  const parser = pt === 'etat_2080' ? parseEtat2080 : parseListeProduits;
  return parse(content, mapping, parser);
}

/** DataSource implementation for VRAC - used by pipeline */
export const vracDataSource: DataSource<VracPeriodData> = {
  id: VRAC_SOURCE_ID,
  description: 'Pharmacy sales CSV (ETAT_2080QTE, ETAT_ListeProduitsVendus)',
  fileMappings: [...VRAC_FILE_MAPPINGS, ...VRAC_LISTE_MAPPINGS],
  parse(content, mapping) {
    return parseVracContent(content, mapping);
  },
};
