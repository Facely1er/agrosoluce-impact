/**
 * VRAC CSV parsers - shared logic for pharmacy sales data
 * Add new parsers here when new file formats are introduced
 */

export interface VracParsedRow {
  code: string;
  designation: string;
  quantitySold: number;
}

/** Parse French number format: "2,561" or "2 561" -> 2561 */
export function parseFrenchNumber(val: string | undefined): number {
  if (val == null || val === '') return 0;
  const cleaned = String(val).replace(/\s/g, '').replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num);
}

/** Simple CSV line parse - handles quoted fields with commas */
export function parseCsvLine(line: string): string[] {
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
export function parseEtat2080(content: string): VracParsedRow[] {
  const lines = content.split(/\r?\n/);
  const rows: VracParsedRow[] = [];
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
export function parseListeProduits(content: string): VracParsedRow[] {
  const lines = content.split(/\r?\n/);
  const rows: VracParsedRow[] = [];
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

export type VracParserType = 'etat_2080' | 'liste_produits';

export const PARSERS: Record<VracParserType, (content: string) => VracParsedRow[]> = {
  etat_2080: parseEtat2080,
  liste_produits: parseListeProduits,
};
