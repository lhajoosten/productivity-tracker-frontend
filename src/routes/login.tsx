import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import type { LoginRequest } from '@/types/api'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response) => {
      // Store refresh token
      localStorage.setItem('refresh_token', response.refresh_token)

      // Fetch full user data
      const user = await authApi.me()
      login(user)
      navigate({ to: '/dashboard' })
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || 'Login failed. Please try again.')
    },
  })


  const onSubmit = (data: LoginFormData) => {
    setError(null)
    loginMutation.mutate(data)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br
                    from-light-secondary-50 via-light-primary-50 to-light-secondary-100
                    dark:from-dark-secondary-950 dark:via-dark-primary-950 dark:to-dark-secondary-900
                    solarized:from-solarized-secondary-50 solarized:via-solarized-primary-50 solarized:to-solarized-secondary-100
                    alt-light:from-alt-light-secondary-50 alt-light:via-alt-light-primary-50 alt-light:to-alt-light-secondary-100
                    alt-dark:from-alt-dark-secondary-950 alt-dark:via-alt-dark-primary-950 alt-dark:to-alt-dark-secondary-900"
    >
      <div className="max-w-md w-full animate-scale-in">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-bold text-light-secondary-900 dark:text-dark-secondary-50
                         solarized:text-solarized-secondary-900 alt-light:text-alt-light-secondary-900 alt-dark:text-alt-dark-secondary-50"
          >
            Welcome Back
          </h2>
          <p
            className="mt-2 text-light-secondary-600 dark:text-dark-secondary-400
                        solarized:text-solarized-secondary-700 alt-light:text-alt-light-secondary-600 alt-dark:text-alt-dark-secondary-400"
          >
            Sign in to your account to continue
          </p>
        </div>

        <Card variant="elevated">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-error-50 dark:bg-error-900/20 border border-error-400 text-error-700 dark:text-error-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              {...register('username')}
              id="username"
              type="text"
              label="Username"
              autoComplete="username"
              placeholder="Enter your username"
              error={errors.username?.message}
            />

            <Input
              {...register('password')}
              id="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              placeholder="Enter your password"
              error={errors.password?.message}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
