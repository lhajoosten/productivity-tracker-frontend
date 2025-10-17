import type { ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95'

  const variantStyles = {
    primary:
      'bg-light-primary-600 hover:bg-light-primary-700 text-white focus:ring-light-primary-500 ' +
      'dark:bg-dark-primary-600 dark:hover:bg-dark-primary-700 dark:focus:ring-dark-primary-500 ' +
      'solarized:bg-solarized-primary-600 solarized:hover:bg-solarized-primary-700 solarized:focus:ring-solarized-primary-500 ' +
      'alt-light:bg-alt-light-primary-600 alt-light:hover:bg-alt-light-primary-700 alt-light:focus:ring-alt-light-primary-500 ' +
      'alt-dark:bg-alt-dark-primary-600 alt-dark:hover:bg-alt-dark-primary-700 alt-dark:focus:ring-alt-dark-primary-500',
    secondary:
      'bg-light-secondary-100 hover:bg-light-secondary-200 text-light-secondary-900 focus:ring-light-secondary-500 border border-light-secondary-200 ' +
      'dark:bg-dark-secondary-700 dark:hover:bg-dark-secondary-600 dark:text-dark-secondary-100 dark:focus:ring-dark-secondary-500 dark:border-dark-secondary-600 ' +
      'solarized:bg-solarized-secondary-200 solarized:hover:bg-solarized-secondary-300 solarized:text-solarized-secondary-900 solarized:focus:ring-solarized-secondary-500 solarized:border-solarized-secondary-300 ' +
      'alt-light:bg-alt-light-secondary-100 alt-light:hover:bg-alt-light-secondary-200 alt-light:text-alt-light-secondary-900 alt-light:focus:ring-alt-light-secondary-500 alt-light:border-alt-light-secondary-200 ' +
      'alt-dark:bg-alt-dark-secondary-700 alt-dark:hover:bg-alt-dark-secondary-600 alt-dark:text-alt-dark-secondary-100 alt-dark:focus:ring-alt-dark-secondary-500 alt-dark:border-alt-dark-secondary-600',
    danger:
      'bg-error-600 hover:bg-error-700 text-white focus:ring-error-500',
    success:
      'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
    ghost:
      'text-light-secondary-700 hover:bg-light-secondary-100 focus:ring-light-secondary-500 ' +
      'dark:text-dark-secondary-300 dark:hover:bg-dark-secondary-800 dark:focus:ring-dark-secondary-500 ' +
      'solarized:text-solarized-secondary-700 solarized:hover:bg-solarized-secondary-200 solarized:focus:ring-solarized-secondary-500 ' +
      'alt-light:text-alt-light-secondary-700 alt-light:hover:bg-alt-light-secondary-100 alt-light:focus:ring-alt-light-secondary-500 ' +
      'alt-dark:text-alt-dark-secondary-300 alt-dark:hover:bg-alt-dark-secondary-800 alt-dark:focus:ring-alt-dark-secondary-500',
    outline:
      'border-2 border-light-primary-500 text-light-primary-700 hover:bg-light-primary-50 focus:ring-light-primary-500 ' +
      'dark:border-dark-primary-500 dark:text-dark-primary-400 dark:hover:bg-dark-primary-900/20 dark:focus:ring-dark-primary-500 ' +
      'solarized:border-solarized-primary-500 solarized:text-solarized-primary-700 solarized:hover:bg-solarized-primary-50 solarized:focus:ring-solarized-primary-500 ' +
      'alt-light:border-alt-light-primary-500 alt-light:text-alt-light-primary-700 alt-light:hover:bg-alt-light-primary-50 alt-light:focus:ring-alt-light-primary-500 ' +
      'alt-dark:border-alt-dark-primary-500 alt-dark:text-alt-dark-primary-400 alt-dark:hover:bg-alt-dark-primary-900/20 alt-dark:focus:ring-alt-dark-primary-500',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
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
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
