// Export Utilities
// Functions for exporting data as downloadable files

/**
 * Download data as JSON file
 */
export function downloadAsJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format filename with timestamp
 */
export function formatExportFilename(baseName: string, coopId: string, extension: string = 'json'): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${baseName}_${coopId}_${timestamp}.${extension}`;
}

