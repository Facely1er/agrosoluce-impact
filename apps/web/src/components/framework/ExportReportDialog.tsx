/**
 * Export Report Dialog Component
 * Generates framework-compliant reports for health impact data
 */

import { useState } from 'react';
import { Download, FileText, CheckCircle2, X } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';

export interface ExportReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cooperativeId?: string;
  cooperativeName?: string;
}

export function ExportReportDialog({ isOpen, onClose, cooperativeName }: ExportReportDialogProps) {
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'framework-compliant'>('summary');
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setExporting(true);
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setExporting(false);
    setExported(true);

    // Reset after showing success
    setTimeout(() => {
      setExported(false);
      onClose();
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
      aria-describedby="export-dialog-description"
    >
      <Card className="max-w-2xl w-full">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-health-100 p-3 rounded-lg">
                <Download className="h-6 w-6 text-health-600" aria-hidden="true" />
              </div>
              <div>
                <h2 id="export-dialog-title" className="text-2xl font-bold text-gray-900">
                  Export Health Impact Report
                </h2>
                {cooperativeName && (
                  <p id="export-dialog-description" className="text-sm text-gray-600">
                    For: {cooperativeName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {exported ? (
            /* Success State */
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-wellness-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Report Generated Successfully!</h3>
              <p className="text-gray-600">Your report is ready for download.</p>
            </div>
          ) : (
            <>
              {/* Report Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: 'summary',
                      label: 'Summary',
                      description: 'Key metrics overview',
                    },
                    {
                      id: 'detailed',
                      label: 'Detailed',
                      description: 'Complete analysis',
                    },
                    {
                      id: 'framework-compliant',
                      label: 'Framework Compliant',
                      description: 'Official format',
                    },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setReportType(type.id as typeof reportType)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        reportType === type.id
                          ? 'border-health-600 bg-health-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">{type.label}</div>
                      <div className="text-xs text-gray-600">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'pdf', label: 'PDF', icon: '📄' },
                    { id: 'excel', label: 'Excel', icon: '📊' },
                    { id: 'csv', label: 'CSV', icon: '📝' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setFormat(fmt.id as typeof format)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        format === fmt.id
                          ? 'border-health-600 bg-health-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{fmt.icon}</div>
                      <div className="font-semibold text-gray-900">{fmt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Framework Compliance Note */}
              {reportType === 'framework-compliant' && (
                <div className="mb-6 p-4 bg-wellness-50 border border-wellness-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-wellness-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-wellness-900 mb-1">
                        Agricultural Health Framework v1.0
                      </h4>
                      <p className="text-sm text-wellness-800">
                        This report follows the official agricultural health framework standards and includes
                        all required health indicators, sustainability metrics, and compliance documentation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="secondary"
                  className="flex-1"
                  disabled={exporting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  variant="primary"
                  className="flex-1 bg-health-600 hover:bg-health-700"
                  disabled={exporting}
                >
                  {exporting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Export Report Button Component
 * Trigger button for opening the export dialog
 */
export interface ExportReportButtonProps {
  cooperativeId?: string;
  cooperativeName?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ExportReportButton({ cooperativeId, cooperativeName, variant = 'secondary', size = 'md' }: ExportReportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant={variant}
        size={size}
        className="inline-flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export Report
      </Button>
      <ExportReportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        cooperativeId={cooperativeId}
        cooperativeName={cooperativeName}
      />
    </>
  );
}
