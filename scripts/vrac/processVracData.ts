/**
 * VRAC Data Processing Script
 * Parses pharmacy CSV exports and outputs normalized JSON for the analysis dashboard
 *
 * Uses @agrosoluce/data-insights pipeline. Add new file mappings in:
 *   packages/data-insights/src/sources/vrac/vracSource.ts
 *
 * Run: npm run vrac:process
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  vracDataSource,
  VRAC_FILE_MAPPINGS,
  VRAC_LISTE_MAPPINGS,
  parseVracContent,
  processVracPeriods,
} from '@agrosoluce/data-insights';
import type { VracPeriodData } from '@agrosoluce/data-insights';

const VRAC_ROOT = path.resolve(process.cwd(), 'VRAC');
const OUTPUT_PATH = path.resolve(process.cwd(), 'apps/web/public/data/vrac/processed.json');

function readFile(mapping: { file: string; subdir?: string }): string | null {
  const subdirPath = mapping.subdir ? path.join(VRAC_ROOT, mapping.subdir) : VRAC_ROOT;
  let filePath = path.join(subdirPath, mapping.file);
  if (!fs.existsSync(filePath) && mapping.subdir) {
    filePath = path.join(VRAC_ROOT, mapping.file);
  }
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

function main() {
  const allPeriods: VracPeriodData[] = [];

  // Process ETAT_2080QTE - prefer subdir when it exists
  for (const m of VRAC_FILE_MAPPINGS) {
    const content = readFile(m);
    if (content) {
      const data = vracDataSource.parse(content, m);
      if (data) allPeriods.push(data);
    }
  }

  // Process ListeProduits (full catalog - replaces 2080 when more products)
  for (const m of VRAC_LISTE_MAPPINGS) {
    const content = readFile(m);
    if (content) {
      const data = parseVracContent(content, m);
      if (data) {
        const existing = allPeriods.find((p) => p.pharmacyId === data.pharmacyId && p.year === data.year);
        if (!existing || existing.products.length < data.products.length) {
          if (existing) allPeriods.splice(allPeriods.indexOf(existing), 1);
          allPeriods.push(data);
        }
      }
    }
  }

  const processed = processVracPeriods(allPeriods);

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const output = {
    periods: processed,
    processedAt: new Date().toISOString(),
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`VRAC data processed: ${processed.length} periods -> ${OUTPUT_PATH}`);
}

main();
