import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 shadow-sm';

  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white focus-visible:ring-teal-500 shadow-teal-700/10',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus-visible:ring-slate-400 border border-slate-200',
    outline: 'border-2 border-teal-600 text-teal-700 hover:bg-teal-50 focus-visible:ring-teal-500 bg-transparent',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500 shadow-rose-700/10',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:ring-slate-400 shadow-none',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500 shadow-emerald-700/10',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[34px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[42px]',
    lg: 'text-base px-5 py-3 gap-2.5 min-h-[48px]',
    xl: 'text-lg px-6 py-4 gap-3 min-h-[56px] font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
