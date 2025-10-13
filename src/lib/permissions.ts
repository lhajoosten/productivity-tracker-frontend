import type { User } from '@/types/api'

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false

  // Superusers have all permissions
  if (user.is_superuser) return true

  // Check if any of the user's roles have the permission
  return user.roles.some((role) => role.permissions.some((perm) => perm.name === permission))
}

/**
 * Get all permission names for a user
 */
export function getUserPermissions(user: User | null): string[] {
  if (!user) return []

  // Superusers have all permissions (return a special marker)
  if (user.is_superuser) return ['*']

  const permissions = new Set<string>()
  user.roles.forEach((role) => {
    role.permissions.forEach((perm) => {
      permissions.add(perm.name)
    })
  })

  return Array.from(permissions)
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  if (!user) return false
  if (user.is_superuser) return true

  return permissions.some((permission) => hasPermission(user, permission))
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  if (!user) return false
  if (user.is_superuser) return true

  return permissions.every((permission) => hasPermission(user, permission))
}
