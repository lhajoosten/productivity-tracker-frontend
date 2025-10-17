import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  variant?: 'default' | 'bordered' | 'elevated'
  style?: React.CSSProperties
}

export function Card({ children, className = '', title, description, variant = 'default', style }: CardProps) {
  const variantStyles = {
    default:
      'bg-white dark:bg-dark-secondary-800 solarized:bg-solarized-secondary-50 alt-light:bg-alt-light-secondary-50 alt-dark:bg-alt-dark-secondary-900 ' +
      'border border-light-secondary-200 dark:border-dark-secondary-700 solarized:border-solarized-secondary-300 alt-light:border-alt-light-secondary-200 alt-dark:border-alt-dark-secondary-800 ' +
      'shadow-sm',
    bordered:
      'bg-white dark:bg-dark-secondary-800 solarized:bg-solarized-secondary-50 alt-light:bg-alt-light-secondary-50 alt-dark:bg-alt-dark-secondary-900 ' +
      'border-2 border-light-secondary-300 dark:border-dark-secondary-600 solarized:border-solarized-secondary-400 alt-light:border-alt-light-secondary-300 alt-dark:border-alt-dark-secondary-700',
    elevated:
      'bg-white dark:bg-dark-secondary-800 solarized:bg-solarized-secondary-50 alt-light:bg-alt-light-secondary-50 alt-dark:bg-alt-dark-secondary-900 ' +
      'shadow-elevation-2 hover:shadow-elevation-3 transition-shadow duration-200',
  }

  return (
    <div className={`rounded-lg overflow-hidden ${variantStyles[variant]} ${className}`} style={style}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-light-secondary-200 dark:border-dark-secondary-700 solarized:border-solarized-secondary-300 alt-light:border-alt-light-secondary-200 alt-dark:border-alt-dark-secondary-800
                        bg-light-secondary-50 dark:bg-dark-secondary-900/50 solarized:bg-solarized-secondary-100 alt-light:bg-alt-light-secondary-100 alt-dark:bg-alt-dark-secondary-950">
          {title && (
            <h3 className="text-lg font-semibold text-light-secondary-900 dark:text-dark-secondary-50 solarized:text-solarized-secondary-900 alt-light:text-alt-light-secondary-900 alt-dark:text-alt-dark-secondary-50">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-light-secondary-600 dark:text-dark-secondary-400 solarized:text-solarized-secondary-700 alt-light:text-alt-light-secondary-600 alt-dark:text-alt-dark-secondary-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}
