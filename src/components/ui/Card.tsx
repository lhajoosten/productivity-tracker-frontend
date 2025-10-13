import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export function Card({ children, className = '', title, description }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}
