import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi, roleApi } from '@/lib/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { UserListResponse, UserUpdate, AssignRolesToUser, User } from '@/types/api'
import { useToast } from '@/stores/toastStore'
import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Card } from '@/components/ui/Card'

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
  const { addToast } = useToast()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.list(),
  })

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleApi.list(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
  })

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserUpdate }) =>
      userApi.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      addToast('User updated successfully', 'success')
      setIsEditModalOpen(false)
      setSelectedUser(null)
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to update user', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userApi.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      addToast('User deleted successfully', 'success')
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to delete user', 'error')
    },
  })

  const activateMutation = useMutation({
    mutationFn: (userId: string) => userApi.activate(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      addToast('User activated successfully', 'success')
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to activate user', 'error')
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (userId: string) => userApi.deactivate(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      addToast('User deactivated successfully', 'success')
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to deactivate user', 'error')
    },
  })

  const assignRolesMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AssignRolesToUser }) =>
      userApi.assignRoles(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      addToast('Roles assigned successfully', 'success')
      setIsRoleModalOpen(false)
      setSelectedUser(null)
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to assign roles', 'error')
    },
  })

  const handleEditUser = async (user: UserListResponse) => {
    const fullUser = await userApi.get(user.id)
    setSelectedUser(fullUser)
    reset({
      username: fullUser.username,
      email: fullUser.email,
      is_active: fullUser.is_active,
    })
    setIsEditModalOpen(true)
  }

  const handleManageRoles = async (user: UserListResponse) => {
    const fullUser = await userApi.get(user.id)
    setSelectedUser(fullUser)
    setSelectedRoles(fullUser.roles.map((r) => r.id))
    setIsRoleModalOpen(true)
  }

  const handleToggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    )
  }

  const onSubmitUpdate = (data: UserUpdateFormData) => {
    if (selectedUser) {
      updateMutation.mutate({ userId: selectedUser.id, data })
    }
  }

  const handleAssignRoles = () => {
    if (selectedUser) {
      assignRolesMutation.mutate({
        userId: selectedUser.id,
        data: { role_ids: selectedRoles },
      })
    }
  }

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, their roles, and permissions
          </p>
        </div>
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Roles</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.is_active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="error">Inactive</Badge>
                  )}
                  {user.is_superuser && (
                    <Badge variant="primary" className="ml-2">
                      Admin
                    </Badge>
                  )}
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.map((role) => (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleManageRoles(user)}
                    >
                      Roles
                    </Button>
                    {user.is_active ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => deactivateMutation.mutate(user.id)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => activateMutation.mutate(user.id)}
                      >
                        Activate
                      </Button>
                    )}
                    {!user.is_superuser && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this user?')) {
                            deleteMutation.mutate(user.id)
                          }
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        title="Edit User"
      >
        <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
          <Input
            {...register('username')}
            label="Username"
            error={errors.username?.message}
          />
          <Input
            {...register('email')}
            label="Email"
            type="email"
            error={errors.email?.message}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="rounded border-border"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Active
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Manage Roles Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false)
          setSelectedUser(null)
        }}
        title="Manage User Roles"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select roles for {selectedUser?.username}
          </p>
          <div className="space-y-2">
            {roles?.map((role) => (
              <label
                key={role.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleToggleRole(role.id)}
                  className="rounded border-border"
                />
                <div className="flex-1">
                  <div className="font-medium">{role.name}</div>
                  {role.description && (
                    <div className="text-sm text-muted-foreground">
                      {role.description}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsRoleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignRoles} disabled={assignRolesMutation.isPending}>
              {assignRolesMutation.isPending ? 'Saving...' : 'Save Roles'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
