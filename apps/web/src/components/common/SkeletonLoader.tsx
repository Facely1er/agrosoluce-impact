/**
 * Skeleton Loader Components
 * Reusable skeleton loaders for better loading states
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  circle?: boolean;
}

/**
 * Base skeleton element
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = true,
  circle = false,
}) => {
  const roundedClass = circle ? 'rounded-full' : rounded ? 'rounded' : '';
  
  // Build width and height classes using Tailwind's arbitrary value syntax
  const widthClass = width 
    ? `w-[${typeof width === 'number' ? `${width}px` : width}]` 
    : '';
  const heightClass = height 
    ? `h-[${typeof height === 'number' ? `${height}px` : height}]` 
    : '';
  
  return (
    <div
      className={`bg-gray-200 animate-pulse ${roundedClass} ${widthClass} ${heightClass} ${className}`.trim()}
    />
  );
};

/**
 * Skeleton for metric cards
 */
export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Skeleton height={24} width="60%" className="mb-2" />
      <Skeleton height={32} width="40%" className="mb-1" />
      <Skeleton height={16} width="80%" />
    </div>
  );
};

/**
 * Skeleton for cooperative cards
 */
export const CooperativeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton circle width={64} height={64} />
        <div className="flex-1">
          <Skeleton height={24} width="70%" className="mb-2" />
          <Skeleton height={16} width="50%" className="mb-1" />
          <Skeleton height={16} width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="90%" />
        <Skeleton height={16} width="80%" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton height={32} width={100} rounded />
        <Skeleton height={32} width={100} rounded />
      </div>
    </div>
  );
};

/**
 * Skeleton for table rows
 */
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-6 py-4">
          <Skeleton height={16} width={idx === 0 ? '80%' : '60%'} />
        </td>
      ))}
    </tr>
  );
};

/**
 * Skeleton for table with header
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <Skeleton height={24} width="200px" />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, idx) => (
              <th key={idx} className="px-6 py-3">
                <Skeleton height={16} width="80%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, idx) => (
            <TableRowSkeleton key={idx} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Skeleton for chart/visualization
 */
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Skeleton height={24} width="200px" className="mb-4" />
      <Skeleton height={300} width="100%" />
    </div>
  );
};

/**
 * Skeleton for form fields
 */
export const FormFieldSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      <Skeleton height={16} width="120px" />
      <Skeleton height={40} width="100%" rounded />
    </div>
  );
};

/**
 * Skeleton for form with multiple fields
 */
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {Array.from({ length: fields }).map((_, idx) => (
        <FormFieldSkeleton key={idx} />
      ))}
      <div className="flex gap-4 pt-4">
        <Skeleton height={44} width={120} rounded />
        <Skeleton height={44} width={120} rounded />
      </div>
    </div>
  );
};

/**
 * Skeleton for list items
 */
export const ListItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <Skeleton circle width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton height={20} width="60%" />
        <Skeleton height={16} width="40%" />
      </div>
      <Skeleton height={32} width={80} rounded />
    </div>
  );
};

/**
 * Skeleton for dashboard header
 */
export const DashboardHeaderSkeleton: React.FC = () => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <Skeleton height={32} width="300px" className="mb-2" />
      <Skeleton height={20} width="500px" />
    </div>
  );
};

/**
 * Skeleton for metrics grid
 */
export const MetricsGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <MetricCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Skeleton for assessment flow
 */
export const AssessmentFlowSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Progress tracker */}
      <div className="flex items-center justify-between mb-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex items-center">
            <Skeleton circle width={32} height={32} />
            {idx < 5 && <Skeleton height={2} width={40} className="mx-2" />}
          </div>
        ))}
      </div>
      
      {/* Question card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Skeleton height={24} width="200px" className="mb-4" />
        <Skeleton height={20} width="100%" className="mb-2" />
        <Skeleton height={20} width="90%" className="mb-6" />
        
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded">
              <Skeleton circle width={20} height={20} />
              <Skeleton height={18} width="80%" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Skeleton height={44} width={120} rounded />
        <Skeleton height={44} width={120} rounded />
      </div>
    </div>
  );
};

export default Skeleton;

