import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import type { UserUpdate, UserPasswordUpdate } from '@/types/api'
import { useToast } from '@/stores/toastStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'New password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: UserUpdate) => authApi.updateMe(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser)
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      addToast('Profile updated successfully', 'success')
      setIsEditingProfile(false)
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to update profile', 'error')
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: (data: UserPasswordUpdate) => authApi.updatePassword(data),
    onSuccess: () => {
      addToast('Password changed successfully', 'success')
      setIsChangingPassword(false)
      resetPassword()
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to change password', 'error')
    },
  })

  const onSubmitProfile = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data)
  }

  const onSubmitPassword = (data: PasswordFormData) => {
    const { confirm_password, ...passwordData } = data
    updatePasswordMutation.mutate(passwordData)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          {!isEditingProfile && (
            <Button
              variant="secondary"
              onClick={() => {
                resetProfile({
                  username: user?.username,
                  email: user?.email,
                })
                setIsEditingProfile(true)
              }}
            >
              Edit
            </Button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
            <Input
              {...registerProfile('username')}
              label="Username"
              error={profileErrors.username?.message}
            />
            <Input
              {...registerProfile('email')}
              label="Email"
              type="email"
              error={profileErrors.email?.message}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{user?.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex gap-2 mt-1">
                {user?.is_active && <Badge variant="success">Active</Badge>}
                {user?.is_superuser && <Badge variant="primary">Admin</Badge>}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Roles</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user?.roles?.map((role) => (
                  <Badge key={role.id} variant="secondary">
                    {role.name}
                  </Badge>
                ))}
                {(!user?.roles || user.roles.length === 0) && (
                  <span className="text-sm text-muted-foreground">No roles assigned</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Change Password */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
          {!isChangingPassword && (
            <Button
              variant="secondary"
              onClick={() => {
                resetPassword()
                setIsChangingPassword(true)
              }}
            >
              Change Password
            </Button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
            <Input
              {...registerPassword('current_password')}
              label="Current Password"
              type="password"
              error={passwordErrors.current_password?.message}
            />
            <Input
              {...registerPassword('new_password')}
              label="New Password"
              type="password"
              error={passwordErrors.new_password?.message}
            />
            <Input
              {...registerPassword('confirm_password')}
              label="Confirm New Password"
              type="password"
              error={passwordErrors.confirm_password?.message}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsChangingPassword(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updatePasswordMutation.isPending}>
                {updatePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            For security reasons, we recommend changing your password regularly.
          </p>
        )}
      </Card>

      {/* Account Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Account ID</span>
            <span className="font-mono text-xs">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="font-medium">
              {user?.created_at && new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="font-medium">
              {user?.updated_at
                ? new Date(user.updated_at).toLocaleDateString()
                : 'Never'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
