import React from 'react'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    default:
      'bg-light-secondary-100 dark:bg-dark-secondary-800 solarized:bg-solarized-secondary-200 alt-light:bg-alt-light-secondary-200 alt-dark:bg-alt-dark-secondary-800 ' +
      'text-light-secondary-800 dark:text-dark-secondary-200 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-800 alt-dark:text-alt-dark-secondary-200',
    primary:
      'bg-light-primary-100 dark:bg-dark-primary-900/30 solarized:bg-solarized-primary-100 alt-light:bg-alt-light-primary-100 alt-dark:bg-alt-dark-primary-900/30 ' +
      'text-light-primary-800 dark:text-dark-primary-200 solarized:text-solarized-primary-800 alt-light:text-alt-light-primary-800 alt-dark:text-alt-dark-primary-200',
    success:
      'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200',
    warning:
      'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-200',
    error:
      'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-200',
    info:
      'bg-info-100 dark:bg-info-900/30 text-info-800 dark:text-info-200',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
