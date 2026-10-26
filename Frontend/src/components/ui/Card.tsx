import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 ${
        hoverable ? 'transition-all duration-200 hover:shadow-md hover:border-teal-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-teal-50 text-teal-700',
  trend,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-teal-300 active:scale-[0.99]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          {trend && (
            <p className={`mt-1.5 text-xs font-semibold flex items-center gap-1 ${
              trend.positive ? 'text-emerald-700' : 'text-slate-500'
            }`}>
              <span>{trend.positive ? '↑' : '—'}</span>
              <span>{trend.value}</span>
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-xl shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
