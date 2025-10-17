import React from 'react'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 solarized:divide-solarized-base1 ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className = '' }: TableProps) {
  return (
    <thead className={`bg-gray-50 dark:bg-gray-800 solarized:bg-solarized-base2 ${className}`}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '' }: TableProps) {
  return (
    <tbody className={`bg-white dark:bg-gray-900 solarized:bg-solarized-base3 divide-y divide-gray-200 dark:divide-gray-700 solarized:divide-solarized-base1 ${className}`}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = '' }: TableProps) {
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800 solarized:hover:bg-solarized-base2 transition-colors ${className}`}>
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
    ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 solarized:text-solarized-base01 uppercase tracking-wider'
    : 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 solarized:text-solarized-base03'

  return <Tag className={`${baseClasses} ${className}`}>{children}</Tag>
}

