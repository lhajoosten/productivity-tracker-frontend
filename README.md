# Productivity Tracker Frontend

A modern React + TypeScript frontend for the Productivity Tracker application, featuring JWT authentication, role-based access control (RBAC), and a comprehensive admin dashboard.

## 🚀 Features

- ✅ **Authentication & Authorization**
  - JWT-based login/register with access & refresh tokens
  - Automatic token refresh on expiration
  - Protected routes with authentication guards
  - Role-based access control (RBAC)

- ✅ **Admin Dashboard**
  - User management with role assignments
  - Role management with permission assignment
  - Permission management (CRUD operations)
  - Real-time data updates with TanStack Query

- ✅ **Modern Tech Stack**
  - React 19 + TypeScript
  - TanStack Router (file-based routing)
  - TanStack Query (server state management)
  - Zustand (client state management)
  - React Hook Form + Zod (form validation)
  - Tailwind CSS (styling)
  - Vite (build tool)

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── PermissionGuard.tsx   # Permission-based component rendering
│   └── ui/
│       ├── Button.tsx             # Reusable button component
│       ├── Input.tsx              # Form input with validation
│       ├── Modal.tsx              # Modal dialog
│       ├── Card.tsx               # Card container
│       ├── LoadingSpinner.tsx    # Loading states
│       └── ToastContainer.tsx    # Toast notifications
├── lib/
│   ├── api.ts                     # Axios client with auth interceptors
│   └── permissions.ts            # Permission utility functions
├── routes/                        # File-based routing (TanStack Router)
│   ├── __root.tsx                # Root layout with navigation
│   ├── index.tsx                 # Home page
│   ├── login.tsx                 # Login page
│   ├── register.tsx              # Registration page
│   ├── _authenticated.tsx        # Protected route wrapper
│   └── _authenticated/
│       ├── dashboard.tsx         # Main dashboard
│       ├── profile.tsx           # User profile
│       └── admin/
│           ├── roles.tsx         # Role management
│           └── permissions.tsx   # Permission management
├── stores/
│   ├── authStore.ts              # Authentication state (Zustand)
│   └── toastStore.ts             # Toast notification state
├── types/
│   └── api.ts                    # TypeScript type definitions
├── App.tsx                        # App component with providers
├── main.tsx                       # App entry point
└── index.css                      # Global styles (Tailwind)
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Backend API running on `http://localhost:8000`

### Install Dependencies

```bash
npm install
```

### Environment Configuration

The app is configured to proxy API requests to `http://localhost:8000` in development mode (see `vite.config.ts`).

If your backend runs on a different port, update the proxy configuration:

```typescript
// vite.config.ts
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_BACKEND_PORT',
      changeOrigin: true,
    },
  },
}
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication Flow

### Login Process

1. User enters username and password on `/login`
2. Frontend sends `POST /api/auth/login` request
3. Backend returns access token, refresh token, and user data
4. Tokens are stored in Zustand store (persisted to localStorage)
5. User is redirected to `/dashboard`

### Token Refresh

- Access tokens expire after 15 minutes
- When a request returns 401:
  1. Frontend automatically calls `POST /api/auth/refresh`
  2. New access token is stored
  3. Original request is retried

### Protected Routes

Routes under `_authenticated/` require authentication:

```typescript
// Automatic redirect to /login if not authenticated
/_authenticated/
  ├── dashboard
  ├── profile
  └── admin/*
```

### Permission Guards

Admin routes require specific permissions:

```typescript
// Example: Viewing roles requires 'role:read' permission
/admin/roles      → requires: role:read
/admin/permissions → requires: permission:read
```

## 📝 Available Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/dashboard` | Authenticated | User dashboard |
| `/profile` | Authenticated | User profile |
| `/admin/roles` | Admin (role:read) | Role management |
| `/admin/permissions` | Admin (permission:read) | Permission management |

## 🎨 Component Usage

### Button

```tsx
import { Button } from '@/components/ui/Button'

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="danger" isLoading={loading}>
  Delete
</Button>
```

### Input

```tsx
import { Input } from '@/components/ui/Input'

<Input
  label="Username"
  error={errors.username?.message}
  {...register('username')}
/>
```

### Toast Notifications

```tsx
import { useToast } from '@/stores/toastStore'

const toast = useToast()

toast.success('Operation completed!')
toast.error('Something went wrong')
toast.info('Here is some information')
toast.warning('Please be careful')
```

### Permission Guard

```tsx
import { PermissionGuard } from '@/components/auth/PermissionGuard'

<PermissionGuard permission="role:create">
  <Button>Create Role</Button>
</PermissionGuard>
```

## 🔧 API Client Usage

```typescript
import { authApi, roleApi, permissionApi } from '@/lib/api'

// Login
const response = await authApi.login({ username, password })

// Fetch roles
const roles = await roleApi.list()

// Create permission
const newPermission = await permissionApi.create({
  name: 'user:create',
  resource: 'user',
  action: 'CREATE',
})
```

## 🧪 Testing

### Run Unit Tests

```bash
npm run test
```

### Run E2E Tests

```bash
npm run test:e2e
```

## 🌙 Dark Mode

The app supports dark mode based on system preferences. Dark mode classes are applied using Tailwind's `dark:` variant.

## 📦 State Management

### Server State (TanStack Query)

- User data
- Roles list
- Permissions list
- Automatic caching & revalidation

### Client State (Zustand)

- Authentication tokens
- Current user object
- Toast notifications

## 🚦 Common Tasks

### Adding a New Protected Route

1. Create file in `src/routes/_authenticated/your-route.tsx`
2. Export a route using `createFileRoute`:

```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/your-route')({
  component: YourComponent,
})

function YourComponent() {
  return <div>Your content</div>
}
```

### Adding Permission Checks

```typescript
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'

const { user } = useAuthStore()

if (hasPermission(user, 'resource:action')) {
  // User has permission
}
```

## 🐛 Troubleshooting

### "Cannot connect to backend"

- Ensure backend is running on `http://localhost:8000`
- Check proxy configuration in `vite.config.ts`

### "401 Unauthorized" errors

- Check if access token is expired
- Verify refresh token is valid
- Try logging out and logging back in

### Routes not updating

- Run `npm run dev` to regenerate route tree
- Check `src/routeTree.gen.ts` for route configuration

## 📚 Learn More

- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📄 License

MIT

