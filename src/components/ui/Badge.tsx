import React from 'react';
import type { BookingStatus } from '../../types';
import { STATUS_CONFIG } from '../../types';

// ─── Status Badge ─────────────────────────────────────────────────────────────
interface BadgeProps {
  status: BookingStatus;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Generic Badge ────────────────────────────────────────────────────────────
interface GenericBadgeProps {
  children: React.ReactNode;
  color?: 'gray' | 'green' | 'blue' | 'yellow' | 'red';
}

const badgeColors = {
  gray:   'bg-gray-100 text-gray-700 border-gray-200',
  green:  'bg-green-50 text-green-700 border-green-200',
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  red:    'bg-red-50 text-red-700 border-red-200',
};

export const Badge: React.FC<GenericBadgeProps> = ({ children, color = 'gray' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${badgeColors[color]}`}>
    {children}
  </span>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height }) => (
  <div
    className={`skeleton rounded-lg ${className}`}
    style={{ width, height: height || '1rem' }}
  />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
  </div>
);

export const SkeletonRow: React.FC = () => (
  <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3.5 w-1/3" />
      <Skeleton className="h-3 w-1/4" />
    </div>
    <Skeleton className="h-6 w-20 rounded-full" />
  </div>
);
