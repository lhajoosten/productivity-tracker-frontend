import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  AssignPermissionsRequest,
  HealthResponse,
} from '@/types/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
let accessToken: string | null = null
let refreshToken: string | null = null

export const setTokens = (access: string | null, refresh: string | null) => {
  accessToken = access
  refreshToken = refresh
}

export const getAccessToken = () => accessToken
export const getRefreshToken = () => refreshToken

// Request interceptor - attach access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 and refresh token
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post<LoginResponse>('/api/v1/auth/refresh', {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token } = response.data
        setTokens(access_token, refresh_token)

        processQueue()
        isRefreshing = false

        return api(originalRequest)
      } catch (err) {
        processQueue(err as Error)
        isRefreshing = false
        // Clear tokens and redirect to login
        setTokens(null, null)
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

// API methods

// Auth endpoints
export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<User>('/auth/register', data).then((res) => res.data),

  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data).then((res) => res.data),

  refresh: (refreshToken: string) =>
    api
      .post<LoginResponse>('/auth/refresh', { refresh_token: refreshToken })
      .then((res) => res.data),

  logout: () => api.post('/auth/logout').then((res) => res.data),

  me: () => api.get<User>('/auth/me').then((res) => res.data),
}

// Role endpoints
export const roleApi = {
  list: () => api.get<Role[]>('/roles').then((res) => res.data),

  create: (data: CreateRoleRequest) => api.post<Role>('/roles', data).then((res) => res.data),

  get: (roleId: string) => api.get<Role>(`/roles/${roleId}`).then((res) => res.data),

  update: (roleId: string, data: UpdateRoleRequest) =>
    api.put<Role>(`/roles/${roleId}`, data).then((res) => res.data),

  delete: (roleId: string) => api.delete(`/roles/${roleId}`).then((res) => res.data),

  assignPermissions: (roleId: string, data: AssignPermissionsRequest) =>
    api.post<Role>(`/roles/${roleId}/permissions`, data).then((res) => res.data),

  removePermission: (roleId: string, permissionId: string) =>
    api.delete<Role>(`/roles/${roleId}/permissions/${permissionId}`).then((res) => res.data),
}

// Permission endpoints
export const permissionApi = {
  list: () => api.get<Permission[]>('/permissions').then((res) => res.data),

  create: (data: CreatePermissionRequest) =>
    api.post<Permission>('/permissions', data).then((res) => res.data),

  get: (permissionId: string) =>
    api.get<Permission>(`/permissions/${permissionId}`).then((res) => res.data),

  update: (permissionId: string, data: UpdatePermissionRequest) =>
    api.put<Permission>(`/permissions/${permissionId}`, data).then((res) => res.data),

  delete: (permissionId: string) =>
    api.delete(`/permissions/${permissionId}`).then((res) => res.data),
}

// Health endpoint
export const healthApi = {
  check: () => api.get<HealthResponse>('/health').then((res) => res.data),
}

export default api
