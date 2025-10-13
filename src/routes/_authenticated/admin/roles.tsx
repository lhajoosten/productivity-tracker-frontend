import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roleApi, permissionApi } from '@/lib/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Role, Permission } from '@/types/api'

export const Route = createFileRoute('/_authenticated/admin/roles')({
  component: RolesPage,
})

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type RoleFormData = z.infer<typeof roleSchema>

function RolesPage() {
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: roleApi.list,
  })

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionApi.list,
  })

  const createMutation = useMutation({
    mutationFn: roleApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setIsCreateModalOpen(false)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: roleApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  const assignPermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      roleApi.assignPermissions(roleId, { permission_ids: permissionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setIsPermissionModalOpen(false)
      setSelectedRole(null)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  })

  const onSubmit = (data: RoleFormData) => {
    createMutation.mutate(data)
  }

  const handleDelete = (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      deleteMutation.mutate(roleId)
    }
  }

  const handleAssignPermissions = (role: Role) => {
    setSelectedRole(role)
    setIsPermissionModalOpen(true)
  }

  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Role Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Create Role
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {roles?.map((role) => (
              <tr key={role.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {role.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {role.description || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {role.permissions.length} permissions
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleAssignPermissions(role)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400"
                  >
                    Manage Permissions
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Role Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create Role</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Permissions Modal */}
      {isPermissionModalOpen && selectedRole && (
        <PermissionModal
          role={selectedRole}
          permissions={permissions || []}
          onClose={() => {
            setIsPermissionModalOpen(false)
            setSelectedRole(null)
          }}
          onAssign={(permissionIds) => {
            assignPermissionsMutation.mutate({
              roleId: selectedRole.id,
              permissionIds,
            })
          }}
        />
      )}
    </div>
  )
}

function PermissionModal({
  role,
  permissions,
  onClose,
  onAssign,
}: {
  role: Role
  permissions: Permission[]
  onClose: () => void
  onAssign: (permissionIds: string[]) => void
}) {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(role.permissions.map((p) => p.id))
  )

  const togglePermission = (permissionId: string) => {
    const newSet = new Set(selectedPermissions)
    if (newSet.has(permissionId)) {
      newSet.delete(permissionId)
    } else {
      newSet.add(permissionId)
    }
    setSelectedPermissions(newSet)
  }

  const handleSubmit = () => {
    onAssign(Array.from(selectedPermissions))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Manage Permissions for {role.name}
        </h2>
        <div className="space-y-2 mb-4">
          {permissions.map((permission) => (
            <label
              key={permission.id}
              className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedPermissions.has(permission.id)}
                onChange={() => togglePermission(permission.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {permission.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {permission.resource}:{permission.action}
                  {permission.description && ` - ${permission.description}`}
                </p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
