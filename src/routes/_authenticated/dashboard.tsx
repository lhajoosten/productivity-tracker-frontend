import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/lib/api'

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {currentUser?.username}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Profile</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Username:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{currentUser?.username}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Email:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{currentUser?.email}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Status:</span>
              <span
                className={`ml-2 ${currentUser?.is_active ? 'text-green-600' : 'text-red-600'}`}
              >
                {currentUser?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {currentUser?.is_superuser && (
              <div>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Superuser
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Roles Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Roles</h3>
          {currentUser?.roles && currentUser.roles.length > 0 ? (
            <div className="space-y-2">
              {currentUser.roles.map((role) => (
                <div
                  key={role.id}
                  className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-2 rounded-md text-sm"
                >
                  {role.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No roles assigned</p>
          )}
        </div>

        {/* Permissions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Permissions
          </h3>
          {currentUser?.roles && currentUser.roles.length > 0 ? (
            <div className="space-y-1 text-sm max-h-48 overflow-y-auto">
              {currentUser.roles.flatMap((role) =>
                role.permissions.map((perm) => (
                  <div key={perm.id} className="text-gray-700 dark:text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {perm.name}
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No permissions</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition text-left">
            <div className="text-primary-600 dark:text-primary-400 text-2xl mb-2">📊</div>
            <h3 className="font-medium text-gray-900 dark:text-white">View Reports</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Check your productivity reports
            </p>
          </button>
          <button className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition text-left">
            <div className="text-primary-600 dark:text-primary-400 text-2xl mb-2">⏱️</div>
            <h3 className="font-medium text-gray-900 dark:text-white">Track Time</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Start tracking your time
            </p>
          </button>
          <button className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition text-left">
            <div className="text-primary-600 dark:text-primary-400 text-2xl mb-2">✓</div>
            <h3 className="font-medium text-gray-900 dark:text-white">Manage Tasks</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and manage your tasks
            </p>
          </button>
          <button className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition text-left">
            <div className="text-primary-600 dark:text-primary-400 text-2xl mb-2">⚙️</div>
            <h3 className="font-medium text-gray-900 dark:text-white">Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure your preferences
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
