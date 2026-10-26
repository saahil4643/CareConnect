import React from 'react';
import { RequestStatus, AssistanceCategory, VerificationStatus } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'status' | 'category' | 'verification' | 'neutral';
  status?: RequestStatus;
  category?: AssistanceCategory;
  verification?: VerificationStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  status,
  category,
  verification,
  className = '',
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  }[size];

  // Request status formatting
  if (status) {
    const config: Record<RequestStatus, { label: string; bg: string; text: string; dot: string; border: string }> = {
      pending: {
        label: 'Pending Volunteer',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        dot: 'bg-amber-500',
        border: 'border-amber-200',
      },
      assigned: {
        label: 'Assigned',
        bg: 'bg-sky-50',
        text: 'text-sky-800',
        dot: 'bg-sky-500',
        border: 'border-sky-200',
      },
      accepted: {
        label: 'Accepted',
        bg: 'bg-indigo-50',
        text: 'text-indigo-800',
        dot: 'bg-indigo-500',
        border: 'border-indigo-200',
      },
      in_progress: {
        label: 'In Progress',
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        dot: 'bg-purple-500 animate-pulse',
        border: 'border-purple-200',
      },
      completed: {
        label: 'Completed',
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        dot: 'bg-emerald-500',
        border: 'border-emerald-200',
      },
      cancelled: {
        label: 'Cancelled',
        bg: 'bg-rose-50',
        text: 'text-rose-800',
        dot: 'bg-rose-500',
        border: 'border-rose-200',
      },
    };

    const current = config[status];

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${current.bg} ${current.text} ${current.border} ${sizeStyles} ${className}`}
      >
        <span className={`h-2 w-2 rounded-full ${current.dot}`} />
        {children || current.label}
      </span>
    );
  }

  // Verification status formatting
  if (verification) {
    const config: Record<VerificationStatus, { label: string; bg: string; text: string; border: string }> = {
      verified: {
        label: 'Verified Volunteer',
        bg: 'bg-teal-50',
        text: 'text-teal-800',
        border: 'border-teal-200',
      },
      pending: {
        label: 'Verification Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
      },
      unverified: {
        label: 'Unverified',
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
      },
    };

    const current = config[verification];

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${current.bg} ${current.text} ${current.border} ${sizeStyles} ${className}`}
      >
        <span className="text-teal-600">✓</span>
        {children || current.label}
      </span>
    );
  }

  // Assistance Category formatting
  if (category) {
    const categoryLabels: Record<AssistanceCategory, string> = {
      grocery: 'Grocery Delivery',
      medicine: 'Medicine Collection',
      appointment: 'Medical Appointment',
      transport: 'Transportation',
      household: 'Household Help',
      other: 'Personal Assistance',
    };

    return (
      <span
        className={`inline-flex items-center rounded-lg bg-teal-50/80 text-teal-800 border border-teal-200/70 font-medium ${sizeStyles} ${className}`}
      >
        {children || categoryLabels[category]}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
