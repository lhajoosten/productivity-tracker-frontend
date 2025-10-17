import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br
                    from-light-secondary-50 via-light-primary-50 to-light-secondary-100
                    dark:from-dark-secondary-950 dark:via-dark-primary-950 dark:to-dark-secondary-900
                    solarized:from-solarized-secondary-50 solarized:via-solarized-primary-50 solarized:to-solarized-secondary-100
                    alt-light:from-alt-light-secondary-50 alt-light:via-alt-light-primary-50 alt-light:to-alt-light-secondary-100
                    alt-dark:from-alt-dark-secondary-950 alt-dark:via-alt-dark-primary-950 alt-dark:to-alt-dark-secondary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r
                         from-light-primary-600 via-light-primary-500 to-light-primary-600
                         dark:from-dark-primary-400 dark:via-dark-primary-300 dark:to-dark-primary-400
                         solarized:from-solarized-primary-600 solarized:via-solarized-primary-500 solarized:to-solarized-primary-600
                         alt-light:from-alt-light-primary-600 alt-light:via-alt-light-primary-500 alt-light:to-alt-light-primary-600
                         alt-dark:from-alt-dark-primary-400 alt-dark:via-alt-dark-primary-300 alt-dark:to-alt-dark-primary-400
                         bg-clip-text text-transparent animate-pulse-slow">
            Welcome to Productivity Tracker
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-light-secondary-700 dark:text-dark-secondary-300
                        solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300 max-w-2xl mx-auto leading-relaxed">
            Track your time, manage your tasks, and boost your productivity with our comprehensive
            tracking system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-in-up">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-light-primary-600 hover:bg-light-primary-700 dark:bg-dark-primary-600 dark:hover:bg-dark-primary-700
                           solarized:bg-solarized-primary-600 solarized:hover:bg-solarized-primary-700
                           alt-light:bg-alt-light-primary-600 alt-light:hover:bg-alt-light-primary-700
                           alt-dark:bg-alt-dark-primary-600 alt-dark:hover:bg-alt-dark-primary-700
                           text-white px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-light-primary-600 hover:bg-light-primary-700 dark:bg-dark-primary-600 dark:hover:bg-dark-primary-700
                             solarized:bg-solarized-primary-600 solarized:hover:bg-solarized-primary-700
                             alt-light:bg-alt-light-primary-600 alt-light:hover:bg-alt-light-primary-700
                             alt-dark:bg-alt-dark-primary-600 alt-dark:hover:bg-alt-dark-primary-700
                             text-white px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Get Started →
                </Link>
                <Link
                  to="/login"
                  className="bg-light-secondary-200 hover:bg-light-secondary-300 dark:bg-dark-secondary-700 dark:hover:bg-dark-secondary-600
                             solarized:bg-solarized-secondary-200 solarized:hover:bg-solarized-secondary-300
                             alt-light:bg-alt-light-secondary-200 alt-light:hover:bg-alt-light-secondary-300
                             alt-dark:bg-alt-dark-secondary-700 alt-dark:hover:bg-alt-dark-secondary-600
                             text-light-secondary-900 dark:text-dark-secondary-100 solarized:text-solarized-secondary-900 alt-light:text-alt-light-secondary-900 alt-dark:text-alt-dark-secondary-100
                             px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95 border-2
                             border-light-secondary-300 dark:border-dark-secondary-600 solarized:border-solarized-secondary-300 alt-light:border-alt-light-secondary-300 alt-dark:border-alt-dark-secondary-600"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
