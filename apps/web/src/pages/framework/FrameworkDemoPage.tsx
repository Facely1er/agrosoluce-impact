/**
 * Framework Demo Page
 * Demonstrates the new framework compliance features and health indicators
 */

import { Activity, Download, FileText } from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Button, Card, CardContent, Badge } from '@/components/ui';
import { FrameworkComplianceBadge, ExportReportButton } from '@/components/framework';
import { HealthIndicatorsDashboard } from '@/components/health';

export default function FrameworkDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-health-50 via-wellness-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Health & Impact', path: '/health-impact' },
          { label: 'Framework Demo' }
        ]} />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Badge variant="primary" size="lg" className="bg-health-100 text-health-700 border-health-300">
              <Activity className="h-4 w-4 mr-2" />
              Agricultural Health Framework
            </Badge>
            <FrameworkComplianceBadge
              version="1.0"
              status="partial"
              size="lg"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Framework Compliance Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Agricultural health framework: compliance status, health indicators, and framework-compliant report export.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <ExportReportButton
              cooperativeName="Demo Cooperative"
              variant="primary"
              size="lg"
            />
            <Button variant="secondary" size="lg" className="inline-flex items-center gap-2">
              <FileText className="h-5 w-5" />
              View Documentation
            </Button>
          </div>
        </div>

        {/* Compliance Status Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Framework Compliance Status Examples
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-wellness-300 bg-wellness-50">
              <CardContent className="p-6">
                <FrameworkComplianceBadge
                  version="1.0"
                  status="compliant"
                  size="md"
                />
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                  Fully Compliant
                </h3>
                <p className="text-sm text-gray-600">
                  All required health indicators are tracked and data quality meets framework standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-health-300 bg-health-50">
              <CardContent className="p-6">
                <FrameworkComplianceBadge
                  version="1.0"
                  status="partial"
                  size="md"
                />
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                  Partial Compliance
                </h3>
                <p className="text-sm text-gray-600">
                  Some health indicators pending. Continue data collection to achieve full compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-warning/30 bg-warning/10">
              <CardContent className="p-6">
                <FrameworkComplianceBadge
                  version="1.0"
                  status="review-needed"
                  size="md"
                />
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                  Review Needed
                </h3>
                <p className="text-sm text-gray-600">
                  Framework compliance requires immediate attention. Contact administrator for support.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Health Indicators Dashboard */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Enhanced Health Indicators Dashboard
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <HealthIndicatorsDashboard />
            </CardContent>
          </Card>
        </section>

        {/* Features Highlight */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-health-100 p-4 rounded-lg inline-block mb-4">
                  <Activity className="h-8 w-8 text-health-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">5 Health Categories</h3>
                <p className="text-sm text-gray-600">
                  Malaria, Nutrition, Safety, Healthcare, Prevention
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-wellness-100 p-4 rounded-lg inline-block mb-4">
                  <FileText className="h-8 w-8 text-wellness-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3 Report Types</h3>
                <p className="text-sm text-gray-600">
                  Summary, Detailed, Framework-Compliant
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-vitality-100 p-4 rounded-lg inline-block mb-4">
                  <Download className="h-8 w-8 text-vitality-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3 Export Formats</h3>
                <p className="text-sm text-gray-600">
                  PDF, Excel, CSV
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-primary-100 p-4 rounded-lg inline-block mb-4">
                  <Activity className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">WCAG 2.1 AA</h3>
                <p className="text-sm text-gray-600">
                  85% Accessibility Compliant
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Documentation Links */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-health-600 to-wellness-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Framework documentation
              </h2>
              <p className="text-xl mb-8 text-white/90">
                User guide, indicator definitions, and export formats.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-health-600 hover:bg-gray-100">
                  Framework User Guide
                </Button>
                <Button variant="secondary" size="lg" className="bg-white text-health-600 hover:bg-gray-100">
                  Alignment Analysis
                </Button>
                <Button variant="secondary" size="lg" className="bg-white text-health-600 hover:bg-gray-100">
                  Accessibility Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
