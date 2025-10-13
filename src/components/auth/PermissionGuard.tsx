import { ReactNode } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { hasPermission } from '@/lib/permissions'

interface PermissionGuardProps {
  permission: string
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const { user } = useAuthStore()

  if (!hasPermission(user, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface RequirePermissionProps {
  permission: string
  children: ReactNode
}

export function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { user } = useAuthStore()

  if (!hasPermission(user, permission)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">403 - Forbidden</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You don't have permission to access this page.
          </p>
          <a href="/dashboard" className="text-primary-600 hover:text-primary-700 underline">
            Go back to dashboard
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
