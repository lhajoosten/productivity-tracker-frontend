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
          <label htmlFor={props.id} className="block text-sm font-medium mb-1.5 text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            appearance-none relative block w-full px-3 py-2 rounded-lg
            border ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-input focus:ring-ring focus:border-ring'}
            placeholder:text-muted-foreground
            text-foreground
            bg-background
            focus:outline-none focus:ring-2
            disabled:bg-muted
            disabled:cursor-not-allowed disabled:opacity-60
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
