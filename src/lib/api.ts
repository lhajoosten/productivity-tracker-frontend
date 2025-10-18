import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  UserCreate,
  User,
  UserListResponse,
  UserUpdate,
  UserPasswordUpdate,
  Role,
  RoleCreate,
  RoleUpdate,
  Permission,
  PermissionCreate,
  PermissionUpdate,
  AssignPermissionsToRole,
  AssignRolesToUser,
  HealthResponse,
  Token,
  RefreshTokenRequest,
} from '@/types/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
})

// Request interceptor - cookies are sent automatically, no need to manually attach tokens
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // If error is 401 and we haven't retried yet, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) throw new Error('No refresh token')

        // Send refresh_token in body
        await api.post('/auth/refresh', { refresh_token: refreshToken } as RefreshTokenRequest)

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  register: (data: UserCreate) =>
    api.post<User>('/auth/register', data).then((res) => res.data),

  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data).then((res) => res.data),

  refresh: (data: RefreshTokenRequest) =>
    api.post<Token>('/auth/refresh', data).then((res) => res.data),

  logout: () => api.post('/auth/logout').then((res) => res.data),

  me: () => api.get<User>('/auth/me').then((res) => res.data),

  updateMe: (data: UserUpdate) =>
    api.put<User>('/auth/me', data).then((res) => res.data),

  updatePassword: (data: UserPasswordUpdate) =>
    api.put<User>('/auth/me/password', data).then((res) => res.data),
}

// ============================================================================
// User API
// ============================================================================

export const userApi = {
  list: (skip = 0, limit = 100) =>
    api.get<UserListResponse[]>('/auth/users', { params: { skip, limit } }).then((res) => res.data),

  get: (userId: string) =>
    api.get<User>(`/auth/users/${userId}`).then((res) => res.data),

  update: (userId: string, data: UserUpdate) =>
    api.put<User>(`/auth/users/${userId}`, data).then((res) => res.data),

  delete: (userId: string) =>
    api.delete(`/auth/users/${userId}`).then((res) => res.data),

  activate: (userId: string) =>
    api.post<User>(`/auth/users/${userId}/activate`).then((res) => res.data),

  deactivate: (userId: string) =>
    api.post<User>(`/auth/users/${userId}/deactivate`).then((res) => res.data),

  assignRoles: (userId: string, data: AssignRolesToUser) =>
    api.post<User>(`/auth/users/${userId}/roles`, data).then((res) => res.data),
}

// ============================================================================
// Role API
// ============================================================================

export const roleApi = {
  list: (skip = 0, limit = 100) =>
    api.get<Role[]>('/roles', { params: { skip, limit } }).then((res) => res.data),

  create: (data: RoleCreate) =>
    api.post<Role>('/roles', data).then((res) => res.data),

  get: (roleId: string) =>
    api.get<Role>(`/roles/${roleId}`).then((res) => res.data),

  getByName: (roleName: string) =>
    api.get<Role>(`/roles/name/${roleName}`).then((res) => res.data),

  update: (roleId: string, data: RoleUpdate) =>
    api.put<Role>(`/roles/${roleId}`, data).then((res) => res.data),

  delete: (roleId: string) =>
    api.delete(`/roles/${roleId}`).then((res) => res.data),

  assignPermissions: (roleId: string, data: AssignPermissionsToRole) =>
    api.post<Role>(`/roles/${roleId}/permissions`, data).then((res) => res.data),

  addPermission: (roleId: string, permissionId: string) =>
    api.post<Role>(`/roles/${roleId}/permissions/${permissionId}`).then((res) => res.data),

  removePermission: (roleId: string, permissionId: string) =>
    api.delete<Role>(`/roles/${roleId}/permissions/${permissionId}`).then((res) => res.data),
}

// ============================================================================
// Permission API
// ============================================================================

export const permissionApi = {
  list: (skip = 0, limit = 100) =>
    api.get<Permission[]>('/permissions', { params: { skip, limit } }).then((res) => res.data),

  create: (data: PermissionCreate) =>
    api.post<Permission>('/permissions', data).then((res) => res.data),

  get: (permissionId: string) =>
    api.get<Permission>(`/permissions/${permissionId}`).then((res) => res.data),

  getByName: (permissionName: string) =>
    api.get<Permission>(`/permissions/name/${permissionName}`).then((res) => res.data),

  getByResource: (resource: string) =>
    api.get<Permission[]>(`/permissions/resource/${resource}`).then((res) => res.data),

  update: (permissionId: string, data: PermissionUpdate) =>
    api.put<Permission>(`/permissions/${permissionId}`, data).then((res) => res.data),

  delete: (permissionId: string) =>
    api.delete(`/permissions/${permissionId}`).then((res) => res.data),
}

// ============================================================================
// Health API
// ============================================================================

export const healthApi = {
  check: () => api.get<HealthResponse>('/health').then((res) => res.data),
}

export default api
