import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import type { UserCreate } from '@/types/api'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const registerMutation = useMutation({
    mutationFn: (data: UserCreate) => authApi.register(data),
    onSuccess: async (user) => {
      // After registration, automatically log in
      login(user)
      navigate({ to: '/dashboard' })
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || 'Registration failed. Please try again.')
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    setError(null)
    const { confirmPassword, ...userData } = data
    registerMutation.mutate(userData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
          <p className="mt-2 text-muted-foreground">
            Sign up to get started with Productivity Tracker
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              {...register('username')}
              id="username"
              type="text"
              label="Username"
              autoComplete="username"
              placeholder="Choose a username"
              error={errors.username?.message}
            />

            <Input
              {...register('email')}
              id="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder="Enter your email"
              error={errors.email?.message}
            />

            <Input
              {...register('password')}
              id="password"
              type="password"
              label="Password"
              autoComplete="new-password"
              placeholder="Create a password"
              error={errors.password?.message}
            />

            <Input
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
