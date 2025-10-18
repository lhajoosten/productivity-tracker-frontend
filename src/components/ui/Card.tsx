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
    default: 'bg-card border border-border shadow-sm',
    bordered: 'bg-card border-2 border-border',
    elevated: 'bg-card shadow-lg hover:shadow-xl transition-shadow duration-200',
  }

  return (
    <div className={`rounded-lg overflow-hidden ${variantStyles[variant]} ${className}`} style={style}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-border bg-muted">
          {title && <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>}
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
