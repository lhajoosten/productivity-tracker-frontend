import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi, roleApi } from '@/lib/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { UserListResponse, UserUpdate } from '@/types/api'
import { useToast } from '@/stores/toastStore'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const Route = createFileRoute('/_authenticated/admin/users')({
  component: UsersPage,
})

const userUpdateSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  is_active: z.boolean(),
})

type UserUpdateFormData = z.infer<typeof userUpdateSchema>

function UsersPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.list,
  })

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: roleApi.list,
  })

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserUpdate }) =>
      userApi.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsEditModalOpen(false)
      setSelectedUser(null)
      toast.success('User updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update user')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete user')
    },
  })

  const assignRolesMutation = useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      userApi.assignRoles(userId, { role_ids: roleIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsRoleModalOpen(false)
      setSelectedUser(null)
      setSelectedRoles([])
      toast.success('Roles assigned successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to assign roles')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    setValue,
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
  })

  const handleEditUser = (user: UserListResponse) => {
    setSelectedUser(user)
    setValue('username', user.username)
    setValue('email', user.email)
    setValue('is_active', user.is_active)
    setIsEditModalOpen(true)
  }

  const handleAssignRoles = (user: UserListResponse) => {
    setSelectedUser(user)
    setSelectedRoles(user.roles.map((r) => r.id))
    setIsRoleModalOpen(true)
  }

  const onSubmitUpdate = (data: UserUpdateFormData) => {
    if (!selectedUser) return
    updateMutation.mutate({ userId: selectedUser.id, data })
  }

  const handleDelete = (userId: string, username: string) => {
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteMutation.mutate(userId)
    }
  }

  const handleSaveRoles = () => {
    if (!selectedUser) return
    assignRolesMutation.mutate({ userId: selectedUser.id, roleIds: selectedRoles })
  }

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    )
  }

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white solarized:text-solarized-base03">
          User Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 solarized:text-solarized-base01">
          Manage users, their roles, and access permissions
        </p>
      </div>

      <div className="card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Username</TableCell>
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Roles</TableCell>
              <TableCell isHeader>Type</TableCell>
              <TableCell isHeader>Created</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 dark:text-white solarized:text-solarized-base03">
                        {user.username}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600 dark:text-gray-400 solarized:text-solarized-base01">
                    {user.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? 'success' : 'danger'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <Badge key={role.id} variant="primary">
                          {role.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm italic">
                        No roles
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {user.is_superuser && <Badge variant="warning">Superuser</Badge>}
                </TableCell>
                <TableCell>
                  <span className="text-gray-600 dark:text-gray-400 solarized:text-solarized-base01 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignRoles(user)}
                    >
                      Roles
                    </Button>
                    {!user.is_superuser && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id, user.username)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
          resetForm()
        }}
        title={`Edit User: ${selectedUser?.username}`}
      >
        <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
          <Input
            label="Username"
            {...register('username')}
            error={errors.username?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('is_active')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              Active
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Roles Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false)
          setSelectedUser(null)
          setSelectedRoles([])
        }}
        title={`Assign Roles: ${selectedUser?.username}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 solarized:text-solarized-base01">
            Select roles to assign to this user:
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {roles?.map((role) => (
              <label
                key={role.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 solarized:hover:bg-solarized-base2 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="ml-3 flex-1">
                  <div className="font-medium text-gray-900 dark:text-white solarized:text-solarized-base03">
                    {role.name}
                  </div>
                  {role.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 solarized:text-solarized-base01">
                      {role.description}
                    </div>
                  )}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {role.permissions.map((perm) => (
                      <Badge key={perm.id} variant="info">
                        {perm.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsRoleModalOpen(false)
                setSelectedRoles([])
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRoles} isLoading={assignRolesMutation.isPending}>
              Save Roles
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
