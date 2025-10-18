import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.username}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Account</h2>
          <div className="space-y-3">
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
              <p className="text-sm text-muted-foreground mb-2">Roles</p>
              <div className="flex flex-wrap gap-1">
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
            <Link to="/profile">
              <Button variant="secondary" className="w-full mt-4">
                Edit Profile
              </Button>
            </Link>
          </div>
        </Card>

        {/* Admin Tools */}
        {user?.is_superuser && (
          <>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">User Management</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Manage users, their roles, and permissions
              </p>
              <Link to="/admin/users">
                <Button variant="primary" className="w-full">
                  Manage Users
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Role Management</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Create and manage roles with permissions
              </p>
              <Link to="/admin/roles">
                <Button variant="primary" className="w-full">
                  Manage Roles
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Permission Management</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Define and manage system permissions
              </p>
              <Link to="/admin/permissions">
                <Button variant="primary" className="w-full">
                  Manage Permissions
                </Button>
              </Link>
            </Card>
          </>
        )}

        {/* Quick Stats */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Account Created</span>
              <span className="font-medium">
                {user?.created_at && new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
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
    </div>
  )
}
