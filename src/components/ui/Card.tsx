import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
};

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick, padding = 'md' }) => {
  const base = `bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card ${paddings[padding]} ${className}`;

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -1, boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)' }}
        transition={{ duration: 0.15 }}
        className={`${base} cursor-pointer`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, delta, deltaPositive, icon, color = 'text-gray-900 dark:text-zinc-100' }) => (
  <Card className="relative overflow-hidden">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-2xl font-semibold ${color}`}>{value}</p>
        {delta && (
          <p className={`text-xs mt-1 ${deltaPositive !== false ? 'text-green-600' : 'text-red-500'}`}>
            {deltaPositive !== false ? '↑' : '↓'} {delta}
          </p>
        )}
      </div>
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-400/10 flex items-center justify-center text-brand-400">
          {icon}
        </div>
      )}
    </div>
  </Card>
);
