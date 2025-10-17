import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, userApi } from '@/lib/api'
import { format } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { UserUpdate, UserPasswordUpdate } from '@/types/api'
import { useToast } from '@/stores/toastStore'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

const updateProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
})

const passwordUpdateSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>

function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const queryClient = useQueryClient()
  const toast = useToast()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.me,
    initialData: user || undefined,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: UserUpdate) => userApi.updateMe(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setUser(data)
      setIsEditModalOpen(false)
      resetProfileForm()
      toast.success('Profile updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update profile')
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: (data: UserPasswordUpdate) => userApi.updatePassword(data),
    onSuccess: () => {
      setIsPasswordModalOpen(false)
      resetPasswordForm()
      toast.success('Password changed successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to change password')
    },
  })

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfileForm,
    setValue: setProfileValue,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordUpdateFormData>({
    resolver: zodResolver(passwordUpdateSchema),
  })

  const handleEditProfile = () => {
    if (currentUser) {
      setProfileValue('username', currentUser.username)
      setProfileValue('email', currentUser.email)
      setIsEditModalOpen(true)
    }
  }

  const onSubmitProfile = (data: UpdateProfileFormData) => {
    updateProfileMutation.mutate(data)
  }

  const onSubmitPassword = (data: PasswordUpdateFormData) => {
    updatePasswordMutation.mutate({
      current_password: data.current_password,
      new_password: data.new_password,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white solarized:text-solarized-base03">
          My Profile
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleEditProfile}>
            Edit Profile
          </Button>
          <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
            Change Password
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white solarized:text-solarized-base03 mb-4">
              Basic Information
            </h2>
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 h-20 w-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl font-bold">
                  {currentUser?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white solarized:text-solarized-base03">
                  {currentUser?.username}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 solarized:text-solarized-base01">
                  {currentUser?.email}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 solarized:text-solarized-base01">
                  Status
                </dt>
                <dd className="mt-1">
                  <Badge variant={currentUser?.is_active ? 'success' : 'danger'}>
                    {currentUser?.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 solarized:text-solarized-base01">
                  Account Type
                </dt>
                <dd className="mt-1">
                  <Badge variant={currentUser?.is_superuser ? 'warning' : 'default'}>
                    {currentUser?.is_superuser ? 'Superuser' : 'Regular User'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 solarized:text-solarized-base01">
                  Member Since
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white solarized:text-solarized-base03">
                  {currentUser?.created_at && format(new Date(currentUser.created_at), 'PPP')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 solarized:text-solarized-base01">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white solarized:text-solarized-base03">
                  {currentUser?.updated_at
                    ? format(new Date(currentUser.updated_at), 'PPP')
                    : 'Never'}
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        {/* Roles Card */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white solarized:text-solarized-base03 mb-4">
              Roles & Permissions
            </h2>
            {currentUser?.roles && currentUser.roles.length > 0 ? (
              <div className="space-y-4">
                {currentUser.roles.map((role) => (
                  <div key={role.id} className="bg-gray-50 dark:bg-gray-700 solarized:bg-solarized-base2 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white solarized:text-solarized-base03">
                          {role.name}
                        </h3>
                        {role.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 solarized:text-solarized-base01">
                            {role.description}
                          </p>
                        )}
                        <div className="mt-3">
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Permissions
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission) => (
                              <Badge key={permission.id} variant="info">
                                {permission.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 solarized:text-solarized-base01 italic">
                No roles assigned
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          resetProfileForm()
        }}
        title="Edit Profile"
      >
        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
          <Input
            label="Username"
            {...registerProfile('username')}
            error={profileErrors.username?.message}
          />
          <Input
            label="Email"
            type="email"
            {...registerProfile('email')}
            error={profileErrors.email?.message}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false)
                resetProfileForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={updateProfileMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false)
          resetPasswordForm()
        }}
        title="Change Password"
      >
        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            {...registerPassword('current_password')}
            error={passwordErrors.current_password?.message}
          />
          <Input
            label="New Password"
            type="password"
            {...registerPassword('new_password')}
            error={passwordErrors.new_password?.message}
          />
          <Input
            label="Confirm New Password"
            type="password"
            {...registerPassword('confirm_password')}
            error={passwordErrors.confirm_password?.message}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsPasswordModalOpen(false)
                resetPasswordForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={updatePasswordMutation.isPending}>
              Change Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
