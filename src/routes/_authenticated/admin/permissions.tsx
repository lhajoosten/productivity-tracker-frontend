import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { permissionApi } from '@/lib/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Permission, PermissionCreate, PermissionUpdate } from '@/types/api'
import { useToast } from '@/stores/toastStore'
import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Card } from '@/components/ui/Card'

export const Route = createFileRoute('/_authenticated/admin/permissions')({
  component: PermissionsPage,
})

const permissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  resource: z.string().min(1, 'Resource is required'),
  action: z.string().min(1, 'Action is required'),
  description: z.string().optional(),
})

type PermissionFormData = z.infer<typeof permissionSchema>

function PermissionsPage() {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionApi.list(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
  })

  const createMutation = useMutation({
    mutationFn: (data: PermissionCreate) => permissionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      addToast('Permission created successfully', 'success')
      setIsCreateModalOpen(false)
      reset()
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to create permission', 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ permissionId, data }: { permissionId: string; data: PermissionUpdate }) =>
      permissionApi.update(permissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      addToast('Permission updated successfully', 'success')
      setIsEditModalOpen(false)
      setSelectedPermission(null)
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to update permission', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (permissionId: string) => permissionApi.delete(permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      addToast('Permission deleted successfully', 'success')
    },
    onError: (error: any) => {
      addToast(error.response?.data?.detail || 'Failed to delete permission', 'error')
    },
  })

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission)
    reset({
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description || '',
    })
    setIsEditModalOpen(true)
  }

  const onSubmitCreate = (data: PermissionFormData) => {
    createMutation.mutate({
      name: data.name,
      resource: data.resource,
      action: data.action,
      description: data.description || null,
    })
  }

  const onSubmitUpdate = (data: PermissionFormData) => {
    if (selectedPermission) {
      updateMutation.mutate({
        permissionId: selectedPermission.id,
        data: {
          name: data.name,
          resource: data.resource,
          action: data.action,
          description: data.description || null,
        },
      })
    }
  }

  if (permissionsLoading) {
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
          <h1 className="text-3xl font-bold text-foreground">Permission Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage system permissions and access controls
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Permission</Button>
      </div>

      {groupedPermissions &&
        Object.entries(groupedPermissions).map(([resource, perms]) => (
          <Card key={resource}>
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold capitalize">{resource}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {perms.length} permission{perms.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {perms.map((permission) => (
                  <tr key={permission.id}>
                    <td className="font-medium">{permission.name}</td>
                    <td>
                      <Badge variant="secondary">{permission.action}</Badge>
                    </td>
                    <td>{permission.description || '-'}</td>
                    <td>{new Date(permission.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditPermission(permission)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            if (
                              confirm('Are you sure you want to delete this permission?')
                            ) {
                              deleteMutation.mutate(permission.id)
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
        ))}

      {/* Create Permission Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          reset()
        }}
        title="Create Permission"
      >
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <Input {...register('name')} label="Name" error={errors.name?.message} />
          <Input
            {...register('resource')}
            label="Resource"
            placeholder="e.g., user, task, project"
            error={errors.resource?.message}
          />
          <Input
            {...register('action')}
            label="Action"
            placeholder="e.g., create, read, update, delete"
            error={errors.action?.message}
          />
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
              {createMutation.isPending ? 'Creating...' : 'Create Permission'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Permission Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPermission(null)
        }}
        title="Edit Permission"
      >
        <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
          <Input {...register('name')} label="Name" error={errors.name?.message} />
          <Input
            {...register('resource')}
            label="Resource"
            placeholder="e.g., user, task, project"
            error={errors.resource?.message}
          />
          <Input
            {...register('action')}
            label="Action"
            placeholder="e.g., create, read, update, delete"
            error={errors.action?.message}
          />
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
    </div>
  )
}
