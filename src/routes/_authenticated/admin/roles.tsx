import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roleApi, permissionApi } from '@/lib/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Role, RoleCreate, RoleUpdate, AssignPermissionsToRole } from '@/types/api'
import { useToast } from '@/stores/toastStore'
import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Card } from '@/components/ui/Card'

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
  const { addToast } = useToast()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleApi.list(),
  })

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionApi.list(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  })

  const createMutation = useMutation({
    mutationFn: (data: RoleCreate) => roleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      addToast('Role created successfully', 'success')
      setIsCreateModalOpen(false)
      reset()
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to create role', 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: RoleUpdate }) =>
      roleApi.update(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      addToast('Role updated successfully', 'success')
      setIsEditModalOpen(false)
      setSelectedRole(null)
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to update role', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (roleId: string) => roleApi.delete(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      addToast('Role deleted successfully', 'success')
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to delete role', 'error')
    },
  })

  const assignPermissionsMutation = useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: AssignPermissionsToRole }) =>
      roleApi.assignPermissions(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      addToast('Permissions assigned successfully', 'success')
      setIsPermissionModalOpen(false)
      setSelectedRole(null)
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to assign permissions', 'error')
    },
  })

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    reset({
      name: role.name,
      description: role.description || '',
    })
    setIsEditModalOpen(true)
  }

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role)
    setSelectedPermissions(role.permissions.map((p) => p.id))
    setIsPermissionModalOpen(true)
  }

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const onSubmitCreate = (data: RoleFormData) => {
    createMutation.mutate({
      name: data.name,
      description: data.description || null,
      permission_ids: [],
    })
  }

  const onSubmitUpdate = (data: RoleFormData) => {
    if (selectedRole) {
      updateMutation.mutate({
        roleId: selectedRole.id,
        data: {
          name: data.name,
          description: data.description || null,
        },
      })
    }
  }

  const handleAssignPermissions = () => {
    if (selectedRole) {
      assignPermissionsMutation.mutate({
        roleId: selectedRole.id,
        data: { permission_ids: selectedPermissions },
      })
    }
  }

  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Group permissions by resource
  const groupedPermissions = permissions?.reduce(
    (acc, perm) => {
      if (!acc[perm.resource]) {
        acc[perm.resource] = []
      }
      acc[perm.resource].push(perm)
      return acc
    },
    {} as Record<string, typeof permissions>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Role Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage roles and their permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Role</Button>
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Permissions</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles?.map((role) => (
              <tr key={role.id}>
                <td className="font-medium">{role.name}</td>
                <td>{role.description || '-'}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions?.slice(0, 3).map((perm) => (
                      <Badge key={perm.id} variant="secondary">
                        {perm.name}
                      </Badge>
                    ))}
                    {role.permissions?.length > 3 && (
                      <Badge variant="secondary">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </td>
                <td>{new Date(role.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditRole(role)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleManagePermissions(role)}
                    >
                      Permissions
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this role?')) {
                          deleteMutation.mutate(role.id)
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Create Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          reset()
        }}
        title="Create Role"
      >
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <Input {...register('name')} label="Name" error={errors.name?.message} />
          <Input
            {...register('description')}
            label="Description"
            error={errors.description?.message}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedRole(null)
        }}
        title="Edit Role"
      >
        <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
          <Input {...register('name')} label="Name" error={errors.name?.message} />
          <Input
            {...register('description')}
            label="Description"
            error={errors.description?.message}
          />
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

      {/* Manage Permissions Modal */}
      <Modal
        isOpen={isPermissionModalOpen}
        onClose={() => {
          setIsPermissionModalOpen(false)
          setSelectedRole(null)
        }}
        title="Manage Role Permissions"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select permissions for {selectedRole?.name}
          </p>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {groupedPermissions &&
              Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource} className="space-y-2">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                    {resource}
                  </h3>
                  {perms.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => handleTogglePermission(perm.id)}
                        className="rounded border-border"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{perm.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {perm.action} on {perm.resource}
                          {perm.description && ` - ${perm.description}`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsPermissionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignPermissions}
              disabled={assignPermissionsMutation.isPending}
            >
              {assignPermissionsMutation.isPending ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
