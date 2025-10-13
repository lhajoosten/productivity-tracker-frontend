Here's a comprehensive markdown file that explains the frontend requirements based on the backend implementation:

```markdown
# Productivity Tracker Frontend - Project Brief

## Overview
Build a modern React + TypeScript frontend for the **Productivity Tracker** FastAPI backend. The backend provides JWT authentication, RBAC (Role-Based Access Control), and a comprehensive API for user and permission management.

---

## Backend Capabilities (What We Have)

### 🔐 Authentication & Authorization
- **JWT-based authentication** with access & refresh tokens
- **RBAC system** with roles, permissions, and user assignments
- **Protected endpoints** requiring specific permissions
- **Super user creation** via CLI script

### 📦 Existing Backend Entities
```python
# User Entity
- id: UUID
- username: str (unique)
- email: str (unique)
- hashed_password: str
- is_active: bool
- is_superuser: bool
- created_at: datetime
- updated_at: datetime
- roles: List[Role]

# Role Entity
- id: UUID
- name: str (unique)
- description: str | None
- created_at: datetime
- updated_at: datetime
- users: List[User]
- permissions: List[Permission]

# Permission Entity
- id: UUID
- name: str (unique)
- description: str | None
- resource: str
- action: str (CREATE, READ, UPDATE, DELETE)
- created_at: datetime
- updated_at: datetime
- roles: List[Role]
```

### 🛣️ Existing API Endpoints

#### Authentication (`/api/auth`)
```http
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login (returns access + refresh tokens)
POST   /api/auth/refresh           # Refresh access token
POST   /api/auth/logout            # Logout (invalidate tokens)
GET    /api/auth/me                # Get current user info
```

#### Roles (`/api/roles`)
```http
GET    /api/roles                  # List all roles (requires: role:read)
POST   /api/roles                  # Create role (requires: role:create)
GET    /api/roles/{role_id}        # Get role by ID (requires: role:read)
PUT    /api/roles/{role_id}        # Update role (requires: role:update)
DELETE /api/roles/{role_id}        # Delete role (requires: role:delete)
POST   /api/roles/{role_id}/permissions  # Assign permissions (requires: role:update)
DELETE /api/roles/{role_id}/permissions/{permission_id}  # Remove permission (requires: role:update)
```

#### Permissions (`/api/permissions`)
```http
GET    /api/permissions            # List all permissions (requires: permission:read)
POST   /api/permissions            # Create permission (requires: permission:create)
GET    /api/permissions/{perm_id}  # Get permission (requires: permission:read)
PUT    /api/permissions/{perm_id}  # Update permission (requires: permission:update)
DELETE /api/permissions/{perm_id}  # Delete permission (requires: permission:delete)
```

#### Health (`/health`)
```http
GET    /health                     # Health check (public)
```

### 🔒 Authorization Pattern
- **Protected routes** require `Authorization: Bearer <access_token>` header
- **Permission checks** via dependency injection: `Depends(require_permission("resource:action"))`
- **Token refresh** when access token expires (15 min lifetime)

---

## Frontend Requirements

### 🎯 Tech Stack (As Discussed)
- **React 18+** with TypeScript
- **TanStack Router** for file-based routing
- **TanStack Query** for server state management
- **Zustand** for client state (auth, user)
- **React Hook Form** + **Zod** for form validation
- **Tailwind CSS** for styling
- **Vite** as build tool
- **Vitest** for unit tests
- **Playwright** for E2E tests

### 📁 Required Routes (File-Based with TanStack Router)

```text
src/routes/
├── __root.tsx              # Root layout with nav, auth provider
├── index.tsx               # Public landing page
├── login.tsx               # Login page
├── register.tsx            # Registration page
├── _authenticated/         # Protected route group
│   ├── dashboard/
│   │   └── index.tsx       # Dashboard home
│   ├── profile.tsx         # User profile
│   └── admin/              # Admin-only routes
│       ├── users.tsx       # User management (requires: user:read)
│       ├── roles.tsx       # Role management (requires: role:read)
│       └── permissions.tsx # Permission management (requires: permission:read)
```

### 🔑 Authentication Flow

```typescript
// 1. Login Flow
User enters credentials
  → POST /api/auth/login
  → Store tokens in Zustand + localStorage
  → Redirect to /dashboard

// 2. Token Refresh Flow
Access token expires (after 15 min)
  → API returns 401
  → POST /api/auth/refresh with refresh token
  → Update access token
  → Retry original request

// 3. Protected Route Flow
User navigates to /dashboard
  → Check if access token exists
  → If not → redirect to /login
  → If yes → render route

// 4. Permission Check Flow
User tries to access /admin/roles
  → Check if user has role:read permission
  → If not → show 403 Forbidden
  → If yes → fetch and display roles
```

### 🗂️ Required API Client (`src/lib/api.ts`)

```typescript
// Features needed:
- Axios instance with baseURL (http://localhost:8000)
- Request interceptor: Attach Authorization header
- Response interceptor: Handle 401 (refresh token logic)
- Type-safe API methods matching backend endpoints
- Error handling with toast notifications
```

### 🏪 Zustand Stores Required

#### `authStore.ts`
```typescript
interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  login: (tokens: Tokens, user: User) => void
  logout: () => void
  refreshAccessToken: () => Promise<void>
}
```

#### `userStore.ts`
```typescript
interface UserState {
  currentUser: User | null
  permissions: string[]
  hasPermission: (permission: string) => boolean
  setUser: (user: User) => void
}
```

### 🧩 Key Components to Build

#### Layout Components
- `AppLayout.tsx` - Main layout with nav, sidebar, footer
- `ProtectedRoute.tsx` - Wrapper for authenticated routes
- `PermissionGuard.tsx` - Check if user has specific permission

#### Auth Components
- `LoginForm.tsx` - Login with username/password
- `RegisterForm.tsx` - User registration
- `LogoutButton.tsx` - Logout functionality

#### Admin Components
- `RoleList.tsx` - Display all roles with permissions
- `RoleForm.tsx` - Create/edit roles
- `PermissionList.tsx` - Display all permissions
- `PermissionForm.tsx` - Create/edit permissions
- `UserList.tsx` - Display users with assigned roles
- `AssignRoleModal.tsx` - Assign roles to users

#### UI Components
- `Button.tsx` - Reusable button component
- `Input.tsx` - Form input with validation
- `Table.tsx` - Data table for lists
- `Modal.tsx` - Modal dialog
- `Toast.tsx` - Notification system
- `LoadingSpinner.tsx` - Loading states

### 📝 TypeScript Types (`src/types/api.ts`)

```typescript
// Match backend Pydantic models
interface User {
  id: string
  username: string
  email: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
  roles: Role[]
}

interface Role {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  permissions: Permission[]
}

interface Permission {
  id: string
  name: string
  description: string | null
  resource: string
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
  created_at: string
  updated_at: string
}

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

interface RegisterRequest {
  username: string
  email: string
  password: string
}
```

### 🎨 UI/UX Requirements

- **Responsive design** (mobile-first)
- **Dark mode** toggle
- **Loading states** for async operations
- **Error handling** with user-friendly messages
- **Form validation** with inline errors
- **Toast notifications** for success/error feedback
- **Confirmation modals** for destructive actions (delete)
- **Permission-based UI** (hide elements user can't access)

### 🧪 Testing Requirements

#### Unit Tests (Vitest)
- API client with mocked responses
- Zustand store actions
- Form validation logic
- Permission check utilities

#### Integration Tests (React Testing Library)
- Login/logout flow
- Form submissions
- Protected route redirects
- Permission guard behavior

#### E2E Tests (Playwright)
- Complete authentication flow
- Admin workflows (create role, assign permissions)
- User role assignment

### 🚀 Development Workflow

1. **Setup Project**
   ```bash
   npm create vite@latest productivity-tracker-frontend -- --template react-ts
   cd productivity-tracker-frontend
   npm install
   ```

2. **Install Dependencies**
   ```bash
   npm install @tanstack/react-router @tanstack/react-query zustand
   npm install react-hook-form zod @hookform/resolvers
   npm install axios date-fns
   npm install -D tailwindcss @tanstack/router-vite-plugin
   ```

3. **Configure Vite Proxy**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     server: {
       proxy: {
         '/api': 'http://localhost:8000'
       }
     }
   })
   ```

4. **Build Features**
    - [ ] Setup TanStack Router with file-based routing
    - [ ] Create API client with token refresh logic
    - [ ] Build auth flow (login/register/logout)
    - [ ] Implement protected routes
    - [ ] Create admin dashboard (roles, permissions, users)
    - [ ] Add form validation with React Hook Form + Zod
    - [ ] Style with Tailwind CSS
    - [ ] Write tests

### 🔐 Security Considerations

- **Store tokens in httpOnly cookies** (alternative to localStorage for XSS protection)
- **Implement CSRF protection** if using cookies
- **Validate all inputs** client-side (Zod) and server-side (Pydantic)
- **Sanitize user-generated content** (prevent XSS)
- **Implement rate limiting** on login attempts (client-side UX)
- **Use HTTPS** in production
- **Set proper CORS headers** in FastAPI backend

### 📊 State Management Strategy

```text
Server State (TanStack Query):
- User list
- Role list
- Permission list
- Current user data

Client State (Zustand):
- Auth tokens
- Current user object
- UI state (sidebar open/closed, theme)
- Form state (handled by React Hook Form)
```

### 🎯 MVP Features (Phase 1)

1. ✅ User authentication (login/register/logout)
2. ✅ Protected routes with auth guards
3. ✅ User profile page
4. ✅ Admin dashboard (view roles, permissions, users)
5. ✅ Role management (CRUD)
6. ✅ Permission assignment to roles

### 🚀 Future Enhancements (Phase 2)

- User impersonation (for admins)
- Audit logs (track who did what)
- Activity tracking (time entries, tasks)
- Analytics dashboard
- Real-time notifications (WebSocket)
- Multi-factor authentication (MFA)

---

## Quick Start Commands

```bash
# Start backend
cd ~/projects/productivity-tracker-backend
poetry run uvicorn productivity_tracker.main:app --reload

# Start frontend (after setup)
cd ~/projects/productivity-tracker-frontend
npm run dev

# Access app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## Next Steps

1. **Initialize Vite project** with React + TypeScript
2. **Setup TanStack Router** with file-based routing
3. **Create API client** with Axios + interceptors
4. **Build authentication flow** (login/register)
5. **Implement protected routes** with auth guards
6. **Create admin dashboard** for RBAC management

Ready to start building! 🚀
```

This markdown file provides a complete blueprint for building your frontend based on your existing backend implementation. It covers all the endpoints, entities, and patterns you've already built in FastAPI.