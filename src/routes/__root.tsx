import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuthStore } from '@/stores/authStore'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ToastContainer } from '@/components/ui/ToastContainer'

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
      <div className="min-h-screen flex flex-col bg-light-secondary-50 dark:bg-dark-secondary-950 solarized:bg-solarized-secondary-50 alt-light:bg-alt-light-secondary-50 alt-dark:bg-alt-dark-secondary-950">
        <nav className="bg-white dark:bg-dark-secondary-900 solarized:bg-solarized-secondary-100 alt-light:bg-alt-light-secondary-100 alt-dark:bg-alt-dark-secondary-900
                        border-b border-light-secondary-200 dark:border-dark-secondary-800 solarized:border-solarized-secondary-300 alt-light:border-alt-light-secondary-200 alt-dark:border-alt-dark-secondary-800
                        shadow-sm backdrop-blur-sm bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex items-center px-2 text-xl font-bold bg-gradient-to-r
                             from-light-primary-600 to-light-primary-500 dark:from-dark-primary-500 dark:to-dark-primary-400
                             solarized:from-solarized-primary-600 solarized:to-solarized-primary-500
                             alt-light:from-alt-light-primary-600 alt-light:to-alt-light-primary-500
                             alt-dark:from-alt-dark-primary-500 alt-dark:to-alt-dark-primary-400
                             bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  ⚡ Productivity Tracker
                </Link>
                {isAuthenticated && (
                  <div className="ml-6 flex space-x-4 items-center">
                    <Link
                      to="/dashboard"
                      className="text-light-secondary-700 dark:text-dark-secondary-300 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300
                                 hover:text-light-primary-600 dark:hover:text-dark-primary-400 solarized:hover:text-solarized-primary-600 alt-light:hover:text-alt-light-primary-600 alt-dark:hover:text-alt-dark-primary-400
                                 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      activeProps={{
                        className: 'text-light-primary-600 dark:text-dark-primary-400 solarized:text-solarized-primary-600 alt-light:text-alt-light-primary-600 alt-dark:text-alt-dark-primary-400 ' +
                                   'bg-light-primary-50 dark:bg-dark-primary-900/20 solarized:bg-solarized-primary-100 alt-light:bg-alt-light-primary-50 alt-dark:bg-alt-dark-primary-900/20'
                      }}
                    >
                      Dashboard
                    </Link>
                    {user?.is_superuser && (
                      <>
                        <Link
                          to="/admin/users"
                          className="text-light-secondary-700 dark:text-dark-secondary-300 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300
                                     hover:text-light-primary-600 dark:hover:text-dark-primary-400 solarized:hover:text-solarized-primary-600 alt-light:hover:text-alt-light-primary-600 alt-dark:hover:text-alt-dark-primary-400
                                     px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          activeProps={{
                            className: 'text-light-primary-600 dark:text-dark-primary-400 solarized:text-solarized-primary-600 alt-light:text-alt-light-primary-600 alt-dark:text-alt-dark-primary-400 ' +
                                       'bg-light-primary-50 dark:bg-dark-primary-900/20 solarized:bg-solarized-primary-100 alt-light:bg-alt-light-primary-50 alt-dark:bg-alt-dark-primary-900/20'
                          }}
                        >
                          Users
                        </Link>
                        <Link
                          to="/admin/roles"
                          className="text-light-secondary-700 dark:text-dark-secondary-300 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300
                                     hover:text-light-primary-600 dark:hover:text-dark-primary-400 solarized:hover:text-solarized-primary-600 alt-light:hover:text-alt-light-primary-600 alt-dark:hover:text-alt-dark-primary-400
                                     px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          activeProps={{
                            className: 'text-light-primary-600 dark:text-dark-primary-400 solarized:text-solarized-primary-600 alt-light:text-alt-light-primary-600 alt-dark:text-alt-dark-primary-400 ' +
                                       'bg-light-primary-50 dark:bg-dark-primary-900/20 solarized:bg-solarized-primary-100 alt-light:bg-alt-light-primary-50 alt-dark:bg-alt-dark-primary-900/20'
                          }}
                        >
                          Roles
                        </Link>
                        <Link
                          to="/admin/permissions"
                          className="text-light-secondary-700 dark:text-dark-secondary-300 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300
                                     hover:text-light-primary-600 dark:hover:text-dark-primary-400 solarized:hover:text-solarized-primary-600 alt-light:hover:text-alt-light-primary-600 alt-dark:hover:text-alt-dark-primary-400
                                     px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          activeProps={{
                            className: 'text-light-primary-600 dark:text-dark-primary-400 solarized:text-solarized-primary-600 alt-light:text-alt-light-primary-600 alt-dark:text-alt-dark-primary-400 ' +
                                       'bg-light-primary-50 dark:bg-dark-primary-900/20 solarized:bg-solarized-primary-100 alt-light:bg-alt-light-primary-50 alt-dark:bg-alt-dark-primary-900/20'
                          }}
                        >
                          Permissions
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-light-secondary-700 dark:text-dark-secondary-300 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300
                                 hover:text-light-primary-600 dark:hover:text-dark-primary-400 solarized:hover:text-solarized-primary-600 alt-light:hover:text-alt-light-primary-600 alt-dark:hover:text-alt-dark-primary-400
                                 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      👤 {user?.username}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-error-600 hover:bg-error-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-light-secondary-700 dark:text-dark-secondary-300 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300
                                 hover:text-light-primary-600 dark:hover:text-dark-primary-400 solarized:hover:text-solarized-primary-600 alt-light:hover:text-alt-light-primary-600 alt-dark:hover:text-alt-dark-primary-400
                                 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-light-primary-600 hover:bg-light-primary-700 dark:bg-dark-primary-600 dark:hover:bg-dark-primary-700
                                 solarized:bg-solarized-primary-600 solarized:hover:bg-solarized-primary-700
                                 alt-light:bg-alt-light-primary-600 alt-light:hover:bg-alt-light-primary-700
                                 alt-dark:bg-alt-dark-primary-600 alt-dark:hover:bg-alt-dark-primary-700
                                 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1">
          <Outlet />
        </main>
        <ToastContainer />
      </div>
      <TanStackRouterDevtools />
    </>
  )
}
