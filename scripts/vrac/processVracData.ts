/**
 * VRAC Data Processing Script
 * Parses pharmacy CSV exports and outputs normalized JSON for the analysis dashboard
 *
 * Run: npx tsx scripts/vrac/processVracData.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const VRAC_ROOT = path.resolve(process.cwd(), 'VRAC');
const OUTPUT_PATH = path.resolve(process.cwd(), 'apps/web/public/data/vrac/processed.json');

interface ParsedRow {
  code: string;
  designation: string;
  quantitySold: number;
}

interface PeriodData {
  pharmacyId: string;
  periodLabel: string;
  year: number;
  periodStart: string;
  periodEnd: string;
  products: ParsedRow[];
  totalQuantity: number;
}

/** Parse French number format: "2,561" or "2 561" -> 2561 (comma = thousands sep) */
function parseFrenchNumber(val: string | undefined): number {
  if (val == null || val === '') return 0;
  const cleaned = String(val).replace(/\s/g, '').replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num);
}

/** Detect pharmacy from CSV header lines */
function detectPharmacy(lines: string[]): string | null {
  const text = lines.slice(0, 5).join(' ').toLowerCase();
  if (text.includes('grande pharmacie de tanda') || text.includes('tanda')) return 'tanda';
  if (text.includes('pharmacie prolife') || text.includes('tabagne')) return 'prolife';
  if (text.includes('olympique')) return 'olympique';
  if (text.includes('attobrou')) return 'attobrou';
  return null;
}

/** Extract period from "Période du 01/08/2025 au 10/12/2025" */
function extractPeriod(lines: string[]): { start: string; end: string; year: number } | null {
  for (const line of lines) {
    const m = line.match(/Période\s+du\s+(\d{2}\/\d{2}\/\d{4})\s+au\s+(\d{2}\/\d{2}\/\d{4})/i);
    if (m) {
      const [, start, end] = m;
      const year = parseInt(end.split('/')[2], 10);
      return {
        start: start.split('/').reverse().join('-'),
        end: end.split('/').reverse().join('-'),
        year,
      };
    }
  }
  return null;
}

/** Simple CSV line parse - handles quoted fields with commas */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  if (current) result.push(current.trim());
  return result;
}

/** Parse ETAT_2080QTE format (Top 20 products) */
function parseEtat2080(content: string): ParsedRow[] {
  const lines = content.split(/\r?\n/);
  const rows: ParsedRow[] = [];
  const headerIdx = lines.findIndex((l) => l.includes('Rang') && l.includes('Code') && l.includes('signation'));
  if (headerIdx < 0) return rows;

  const headerParts = parseCsvLine(lines[headerIdx] ?? '');
  const codeIdx = headerParts.findIndex((h) => h.trim() === 'Code');
  const designationIdx = headerParts.findIndex((h) => h.trim().includes('signation') || h.trim() === 'Désignation');
  const qteIdx = headerParts.findIndex((h) => h.includes('Qt') && h.includes('vendue'));

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.startsWith('LISTE DES')) break;
    const parts = parseCsvLine(line);
    if (parts.length < 3) continue;
    const code = parts[codeIdx]?.trim() ?? parts[1] ?? '';
    const designation = parts[designationIdx]?.trim() ?? parts[2] ?? '';
    const qteStr = parts[qteIdx] ?? parts[parts.length - 1] ?? '0';
    const qte = parseFrenchNumber(qteStr);
    const rank = parseInt(parts[0] ?? '', 10);
    if (rank >= 1 && rank <= 20 && code && qte > 0) {
      rows.push({ code, designation, quantitySold: qte });
    }
  }
  return rows;
}

/** Parse ETAT_ListeProduitsVendus format (full product list) */
function parseListeProduits(content: string): ParsedRow[] {
  const lines = content.split(/\r?\n/);
  const rows: ParsedRow[] = [];
  // Find data rows - format: Code,Désignation,Qté vendue,Stock,Prix
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Code,Désignation,Qté vendue') && line.includes('Stock')) {
      for (let j = i + 1; j < lines.length; j++) {
        const row = lines[j];
        if (!row.trim() || row.includes('Code Géo :') || row.includes('Nombre d')) break;
        const parts = row.split(',');
        if (parts.length >= 3) {
          const code = parts[0]?.trim() ?? '';
          const designation = parts[1]?.trim() ?? '';
          const qte = parseFrenchNumber(parts[2]);
          if (code && qte > 0) {
            rows.push({ code, designation, quantitySold: qte });
          }
        }
      }
      break;
    }
  }
  return rows;
}

/** File-to-pharmacy/period mapping from known structure */
const FILE_MAPPINGS: Array<{
  file: string;
  subdir?: string;
  pharmacyId: string;
  periodLabel: string;
  year: number;
}> = [
  { file: 'ETAT_2080QTE1.csv', subdir: 'PROLIFE/2080', pharmacyId: 'prolife', periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_2080QTE2.csv', subdir: 'PROLIFE/2080', pharmacyId: 'prolife', periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_2080QTE3.csv', subdir: 'PROLIFE/2080', pharmacyId: 'prolife', periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_2080QTE4.csv', subdir: 'PROLIFE/2080', pharmacyId: 'prolife', periodLabel: 'Aug–Dec 2022', year: 2022 },
  { file: 'ETAT_2080QTE5.csv', subdir: 'TANDA/2080', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_2080QTE6.csv', subdir: 'TANDA/2080', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_2080QTE7.csv', subdir: 'TANDA/2080', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_2080QTE8.csv', subdir: 'TANDA/2080', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2022', year: 2022 },
  // Root-level files (when subdir not present)
  { file: 'ETAT_2080QTE1.csv', pharmacyId: 'prolife', periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_2080QTE2.csv', pharmacyId: 'prolife', periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_2080QTE3.csv', pharmacyId: 'prolife', periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_2080QTE4.csv', pharmacyId: 'prolife', periodLabel: 'Aug–Dec 2022', year: 2022 },
  { file: 'ETAT_2080QTE5.csv', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_2080QTE6.csv', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_2080QTE7.csv', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_2080QTE8.csv', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2022', year: 2022 },
];

/** ListeProduits mapping: ETAT_ListeProduitsVendus1.csv = Tanda Aug-Dec 2025, etc. */
const LISTE_MAPPINGS: Array<{ file: string; subdir?: string; pharmacyId: string; periodLabel: string; year: number }> = [
  { file: 'ETAT_ListeProduitsVendus1.csv', subdir: 'TANDA', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2025', year: 2025 },
  { file: 'ETAT_ListeProduitsVendus2.csv', subdir: 'TANDA', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2024', year: 2024 },
  { file: 'ETAT_ListeProduitsVendus3.csv', subdir: 'TANDA', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2023', year: 2023 },
  { file: 'ETAT_ListeProduitsVendus4.csv', subdir: 'TANDA', pharmacyId: 'tanda', periodLabel: 'Aug–Dec 2022', year: 2022 },
];

function processFile(
  filePath: string,
  mapping: { pharmacyId: string; periodLabel: string; year: number },
  parser: (c: string) => ParsedRow[]
): PeriodData | null {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  const products = parser(content);
  if (products.length === 0) return null;
  const totalQuantity = products.reduce((s, p) => s + p.quantitySold, 0);
  const periodStart = `20${String(mapping.year).slice(-2)}-08-01`;
  const periodEnd = `20${String(mapping.year).slice(-2)}-12-10`;
  return {
    pharmacyId: mapping.pharmacyId,
    periodLabel: mapping.periodLabel,
    year: mapping.year,
    periodStart,
    periodEnd,
    products,
    totalQuantity,
  };
}

function main() {
  const allData: PeriodData[] = [];
  const seen = new Set<string>();

  // Process ETAT_2080QTE (Top 20) - prefer subdir when it exists
  const periodKey = (p: string, y: number) => `${p}-${y}`;
  for (const m of FILE_MAPPINGS) {
    if (seen.has(periodKey(m.pharmacyId, m.year))) continue;
    const subdirPath = m.subdir ? path.join(VRAC_ROOT, m.subdir) : VRAC_ROOT;
    let filePath = path.join(subdirPath, m.file);
    if (!fs.existsSync(filePath) && m.subdir) {
      filePath = path.join(VRAC_ROOT, m.file);
    }
    const data = processFile(filePath, m, parseEtat2080);
    if (data) {
      allData.push(data);
      seen.add(periodKey(m.pharmacyId, m.year));
    }
  }

  // Process ListeProduits for Tanda (full catalog - richer data)
  // Skip if we already have 2080 data for this pharmacy/year (Liste is supplementary)
  for (const m of LISTE_MAPPINGS) {
    const subdirPath = m.subdir ? path.join(VRAC_ROOT, m.subdir) : VRAC_ROOT;
    const filePath = path.join(subdirPath, m.file);
    const data = processFile(filePath, m, parseListeProduits);
    if (data) {
      const existing = allData.find((d) => d.pharmacyId === m.pharmacyId && d.year === m.year);
      if (!existing || existing.products.length < data.products.length) {
        if (existing) allData.splice(allData.indexOf(existing), 1);
        allData.push(data);
      }
    }
  }

  // Sort by pharmacy, year
  allData.sort((a, b) => {
    if (a.pharmacyId !== b.pharmacyId) return a.pharmacyId.localeCompare(b.pharmacyId);
    return b.year - a.year;
  });

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ periods: allData }, null, 2), 'utf-8');
  console.log(`VRAC data processed: ${allData.length} periods -> ${OUTPUT_PATH}`);
}

main();
