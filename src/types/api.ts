// API Types matching backend Pydantic models

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string
  username: string
  email: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string | null
  roles: Role[]
}

export interface UserListResponse {
  id: string
  username: string
  email: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  roles: Role[]
}

export interface UserCreate {
  email: string
  username: string
  password: string
}

export interface UserUpdate {
  email?: string
  username?: string
  is_active?: boolean
}

export interface UserPasswordUpdate {
  current_password: string
  new_password: string
}

// ============================================================================
// Role Types
// ============================================================================

export interface Role {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string | null
  permissions: Permission[]
}

export interface RoleListResponse {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface RoleCreate {
  name: string
  description?: string | null
  permission_ids?: string[]
}

export interface RoleUpdate {
  name?: string
  description?: string | null
  permission_ids?: string[]
}

// ============================================================================
// Permission Types
// ============================================================================

export interface Permission {
  id: string
  name: string
  description: string | null
  resource: string
  action: string
  created_at: string
  updated_at: string | null
}

export interface PermissionCreate {
  name: string
  resource: string
  action: string
  description?: string | null
}

export interface PermissionUpdate {
  name?: string
  resource?: string
  action?: string
  description?: string | null
}

// ============================================================================
// Assignment Types
// ============================================================================

export interface AssignRolesToUser {
  role_ids: string[]
}

export interface AssignPermissionsToRole {
  permission_ids: string[]
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  message: string
  user: UserListResponse
  access_token: string
  refresh_token: string
  token_type: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  detail:
    | string
    | Array<{
        type: string
        loc: string[]
        msg: string
        input: unknown
        url?: string
      }>
}

// ============================================================================
// Health Check
// ============================================================================

export interface HealthResponse {
  status: string
  timestamp: string
}
