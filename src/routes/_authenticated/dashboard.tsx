import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuthStore()

  // Refresh user data
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.me,
    initialData: user || undefined,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2
                          border-light-primary-600 dark:border-dark-primary-500
                          solarized:border-solarized-primary-600
                          alt-light:border-alt-light-primary-600
                          alt-dark:border-alt-dark-primary-500 mx-auto"></div>
          <p className="mt-4 text-light-secondary-600 dark:text-dark-secondary-400
                        solarized:text-solarized-secondary-700 alt-light:text-alt-light-secondary-600 alt-dark:text-alt-dark-secondary-400">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-light-secondary-900 dark:text-dark-secondary-50
                       solarized:text-solarized-secondary-900 alt-light:text-alt-light-secondary-900 alt-dark:text-alt-dark-secondary-50">
          Dashboard
        </h1>
        <p className="mt-2 text-light-secondary-600 dark:text-dark-secondary-400
                      solarized:text-solarized-secondary-700 alt-light:text-alt-light-secondary-600 alt-dark:text-alt-dark-secondary-400">
          Welcome back, <span className="font-semibold">{currentUser?.username}</span>!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card title="Your Profile" variant="elevated" className="animate-slide-in-up">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-light-secondary-600 dark:text-dark-secondary-400
                               solarized:text-solarized-secondary-700 alt-light:text-alt-light-secondary-600 alt-dark:text-alt-dark-secondary-400">
                Username:
              </span>
              <span className="font-medium text-light-secondary-900 dark:text-dark-secondary-100
                               solarized:text-solarized-secondary-900 alt-light:text-alt-light-secondary-900 alt-dark:text-alt-dark-secondary-100">
                {currentUser?.username}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-light-secondary-600 dark:text-dark-secondary-400
                               solarized:text-solarized-secondary-700 alt-light:text-alt-light-secondary-600 alt-dark:text-alt-dark-secondary-400">
                Email:
              </span>
              <span className="font-medium text-light-secondary-900 dark:text-dark-secondary-100
                               solarized:text-solarized-secondary-900 alt-light:text-alt-light-secondary-900 alt-dark:text-alt-dark-secondary-100">
                {currentUser?.email}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-light-secondary-600 dark:text-dark-secondary-400
                               solarized:text-solarized-secondary-700 alt-light:text-alt-light-secondary-600 alt-dark:text-alt-dark-secondary-400">
                Status:
              </span>
              <Badge variant={currentUser?.is_active ? 'success' : 'error'}>
                {currentUser?.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {currentUser?.is_superuser && (
              <div className="pt-2">
                <Badge variant="primary">Superuser</Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Roles Card */}
        <Card title="Your Roles" variant="elevated" className="animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          {currentUser?.roles && currentUser.roles.length > 0 ? (
            <div className="space-y-2">
              {currentUser.roles.map((role) => (
                <div
                  key={role.id}
                  className="bg-light-primary-50 dark:bg-dark-primary-900/20 solarized:bg-solarized-primary-100 alt-light:bg-alt-light-primary-50 alt-dark:bg-alt-dark-primary-900/20
                             text-light-primary-700 dark:text-dark-primary-400 solarized:text-solarized-primary-700 alt-light:text-alt-light-primary-700 alt-dark:text-alt-dark-primary-400
                             px-3 py-2 rounded-lg text-sm font-medium border
                             border-light-primary-200 dark:border-dark-primary-800 solarized:border-solarized-primary-200 alt-light:border-alt-light-primary-200 alt-dark:border-alt-dark-primary-800"
                >
                  {role.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-light-secondary-500 dark:text-dark-secondary-400
                          solarized:text-solarized-secondary-600 alt-light:text-alt-light-secondary-500 alt-dark:text-alt-dark-secondary-400 text-sm">
              No roles assigned
            </p>
          )}
        </Card>

        {/* Permissions Card */}
        <Card title="Your Permissions" variant="elevated" className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          {currentUser?.roles && currentUser.roles.length > 0 ? (
            <div className="space-y-1 text-sm max-h-48 overflow-y-auto scrollbar-thin">
              {currentUser.roles.flatMap((role) =>
                role.permissions.map((perm) => (
                  <div key={perm.id} className="text-light-secondary-700 dark:text-dark-secondary-300
                                                 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300
                                                 flex items-center py-1">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-2 flex-shrink-0"></span>
                    <span className="truncate">{perm.name}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-light-secondary-500 dark:text-dark-secondary-400
                          solarized:text-solarized-secondary-600 alt-light:text-alt-light-secondary-500 alt-dark:text-alt-dark-secondary-400 text-sm">
              No permissions assigned
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
