import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium mb-1.5
                       text-light-secondary-700 dark:text-dark-secondary-300 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            appearance-none relative block w-full px-3 py-2 rounded-lg
            border ${error
              ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
              : 'border-light-secondary-300 dark:border-dark-secondary-600 solarized:border-solarized-secondary-400 alt-light:border-alt-light-secondary-300 alt-dark:border-alt-dark-secondary-700 ' +
                'focus:ring-light-primary-500 focus:border-light-primary-500 dark:focus:ring-dark-primary-500 dark:focus:border-dark-primary-500 ' +
                'solarized:focus:ring-solarized-primary-500 solarized:focus:border-solarized-primary-500 ' +
                'alt-light:focus:ring-alt-light-primary-500 alt-light:focus:border-alt-light-primary-500 ' +
                'alt-dark:focus:ring-alt-dark-primary-500 alt-dark:focus:border-alt-dark-primary-500'
            }
            placeholder-light-secondary-400 dark:placeholder-dark-secondary-500 solarized:placeholder-solarized-secondary-500 alt-light:placeholder-alt-light-secondary-400 alt-dark:placeholder-alt-dark-secondary-500
            text-light-secondary-900 dark:text-dark-secondary-100 solarized:text-solarized-secondary-900 alt-light:text-alt-light-secondary-900 alt-dark:text-alt-dark-secondary-100
            bg-white dark:bg-dark-secondary-900 solarized:bg-solarized-secondary-50 alt-light:bg-alt-light-secondary-50 alt-dark:bg-alt-dark-secondary-950
            focus:outline-none focus:ring-2
            disabled:bg-light-secondary-100 dark:disabled:bg-dark-secondary-800 solarized:disabled:bg-solarized-secondary-200 alt-light:disabled:bg-alt-light-secondary-100 alt-dark:disabled:bg-alt-dark-secondary-900
            disabled:cursor-not-allowed disabled:opacity-60
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-error-600 dark:text-error-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-light-secondary-500 dark:text-dark-secondary-400 solarized:text-solarized-secondary-600 alt-light:text-alt-light-secondary-500 alt-dark:text-alt-dark-secondary-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
