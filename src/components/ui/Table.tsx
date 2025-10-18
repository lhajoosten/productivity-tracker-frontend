import React from 'react'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className={`min-w-full divide-y divide-border ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className = '' }: TableProps) {
  return (
    <thead className={`bg-muted ${className}`}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '' }: TableProps) {
  return (
    <tbody className={`bg-card divide-y divide-border ${className}`}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = '' }: TableProps) {
  return (
    <tr className={`hover:bg-accent transition-colors ${className}`}>
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  isHeader?: boolean
}

export function TableCell({ children, className = '', isHeader = false }: TableCellProps) {
  const Tag = isHeader ? 'th' : 'td'
  const baseClasses = isHeader
    ? 'px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'
    : 'px-6 py-4 whitespace-nowrap text-sm text-card-foreground'

  return <Tag className={`${baseClasses} ${className}`}>{children}</Tag>
}
