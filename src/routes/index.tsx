import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to Productivity Tracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Track your time, manage your tasks, and boost your productivity with our comprehensive
          tracking system.
        </p>
        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
