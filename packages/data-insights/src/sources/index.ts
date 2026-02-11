/**
 * Data sources - registry and exports
 * Add new sources here when new file types are introduced
 */

export { registerSource, getSource, listSources, getFileMappingsForSource } from '../pipeline/sourceRegistry';
export { vracDataSource, parseVracContent, VRAC_FILE_MAPPINGS, VRAC_LISTE_MAPPINGS } from './vrac/vracSource';
export type { VracPeriodData } from './vrac/types';
export { parseEtat2080, parseListeProduits, parseFrenchNumber, parseCsvLine } from './vrac/parsers';
