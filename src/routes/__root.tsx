import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuthStore } from '@/stores/authStore'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center px-2 text-xl font-bold text-primary-600">
                  Productivity Tracker
                </Link>
                {isAuthenticated && (
                  <div className="ml-6 flex space-x-4 items-center">
                    <Link
                      to="/dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                      activeProps={{ className: 'text-primary-600 dark:text-primary-400' }}
                    >
                      Dashboard
                    </Link>
                    {user?.is_superuser && (
                      <>
                        <Link
                          to="/admin/roles"
                          className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                          activeProps={{ className: 'text-primary-600 dark:text-primary-400' }}
                        >
                          Roles
                        </Link>
                        <Link
                          to="/admin/permissions"
                          className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                          activeProps={{ className: 'text-primary-600 dark:text-primary-400' }}
                        >
                          Permissions
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {user?.username}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
