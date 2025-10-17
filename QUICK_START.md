# 🚀 Quick Start Guide

## What's Been Built

Your frontend application is now complete with:

✅ **Authentication System**
- Login page with form validation
- Registration page
- JWT token management with automatic refresh
- Persistent authentication via Zustand + localStorage

✅ **Protected Routes**
- Dashboard for authenticated users
- Profile page showing user details, roles, and permissions
- Auth guard that redirects unauthenticated users to login

✅ **Admin Panel** (Superuser only)
- Role management (create, view, delete, assign permissions)
- Permission management (create, view, delete)
- Interactive permission assignment to roles

✅ **UI Components**
- Button, Card, LoadingSpinner, EmptyState
- PermissionGuard for conditional rendering
- Responsive design with Tailwind CSS
- Dark mode support

✅ **State Management**
- Zustand for auth state
- TanStack Query for server state
- Automatic cache invalidation

✅ **Type Safety**
- Full TypeScript coverage
- API types matching backend Pydantic models
- Type-safe routing with TanStack Router

## How to Run

### 1. Start the Backend (if not already running)
```bash
cd ~/projects/productivity-tracker-backend
poetry run uvicorn productivity_tracker.main:app --reload
```

Backend will run at: http://localhost:8000

### 2. Start the Frontend
```bash
cd ~/projects/productivity-tracker-frontend
npm run dev
```

Frontend will run at: http://localhost:5173

### 3. Create a Superuser (if not already done)
```bash
cd ~/projects/productivity-tracker-backend
poetry run python scripts/create_superuser.py
```

Follow the prompts to create a superuser account.

## Testing the Application

### Test Regular User Flow
1. Open http://localhost:5173
2. Click "Register" or go to http://localhost:5173/register
3. Create a new account (username, email, password)
4. You'll be redirected to login
5. Login with your credentials
6. You'll see the dashboard with your profile info
7. Visit the Profile page to see your roles and permissions

### Test Admin Flow (Superuser)
1. Login with your superuser credentials
2. You'll see additional "Roles" and "Permissions" links in the nav
3. Go to http://localhost:5173/admin/roles
   - Create new roles
   - Assign permissions to roles
   - View all roles and their permissions
4. Go to http://localhost:5173/admin/permissions
   - Create new permissions (specify resource and action)
   - View all permissions grouped by resource
   - Delete permissions

### Test Authentication Features
- **Token Refresh**: Leave the app open for 15+ minutes, make a request - it should auto-refresh
- **Logout**: Click logout - you should be redirected to the landing page
- **Protected Routes**: Try accessing /dashboard while logged out - you should be redirected to /login
- **Permission Guards**: Login as a regular user - you shouldn't see admin menu items

## Project Structure

```
src/
├── routes/                     # File-based routing
│   ├── __root.tsx             # Root layout with navigation
│   ├── index.tsx              # Landing page
│   ├── login.tsx              # Login page
│   ├── register.tsx           # Registration page
│   ├── _authenticated.tsx     # Auth guard wrapper
│   └── _authenticated/
│       ├── dashboard.tsx      # User dashboard
│       ├── profile.tsx        # User profile
│       └── admin/
│           ├── roles.tsx      # Role management
│           └── permissions.tsx # Permission management
├── components/                 # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── LoadingSpinner.tsx
│   ├── PermissionGuard.tsx
│   └── EmptyState.tsx
├── lib/
│   ├── api.ts                 # API client with interceptors
│   └── permissions.ts         # Permission utilities
├── stores/
│   └── authStore.ts           # Zustand auth store
├── types/
│   └── api.ts                 # TypeScript types
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
└── index.css                  # Tailwind CSS
```

## Common Tasks

### Creating a New Permission
1. Login as superuser
2. Go to Admin → Permissions
3. Click "Create Permission"
4. Fill in:
   - Name: e.g., "user:create"
   - Resource: e.g., "user"
   - Action: SELECT from CREATE, READ, UPDATE, DELETE
   - Description: Optional
5. Click Create

### Creating a Role with Permissions
1. Login as superuser
2. Go to Admin → Roles
3. Click "Create Role"
4. Fill in name and description
5. Click Create
6. Click "Manage Permissions" on the newly created role
7. Check the permissions you want to assign
8. Click Save

### Checking User Permissions
1. Login as any user
2. Go to Profile page
3. You'll see:
   - Your roles
   - All permissions from those roles
   - Your account status

## Environment Variables (Optional)

Create a `.env` file in the root if you need to customize:

```env
VITE_API_URL=http://localhost:8000
```

Then update `vite.config.ts` to use it:

```typescript
server: {
  proxy: {
    '/api': {
      target: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

## Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try 3001, 3002, etc.

### Backend Not Running
Make sure the backend is running at http://localhost:8000
Check with: `curl http://localhost:8000/health`

### CORS Errors
The Vite proxy should handle this. If you see CORS errors, make sure:
1. Backend CORS is configured for http://localhost:5173
2. You're accessing the frontend via the proxy at localhost:5173

### Token Refresh Issues
If you get stuck in a login loop:
1. Clear localStorage: Open DevTools → Application → Local Storage → Clear
2. Logout and login again

## Next Steps

Now that the foundation is complete, you can:

1. **Add More Features**
   - User management page (assign roles to users)
   - Activity tracking
   - Time entries
   - Task management

2. **Improve UI/UX**
   - Add toast notifications library
   - Improve form error messages
   - Add loading skeletons
   - Enhance dark mode

3. **Add Testing**
   - Unit tests with Vitest
   - Integration tests with React Testing Library
   - E2E tests with Playwright

4. **Deploy**
   - Build for production: `npm run build`
   - Deploy to Vercel, Netlify, or your preferred host

## Development Tips

- **Hot Reload**: Changes to routes automatically regenerate the route tree
- **Type Safety**: The API client is fully typed - IntelliSense will help you
- **Component Reuse**: Import components from `@/components`
- **Permission Checks**: Use `hasPermission(user, 'resource:action')` utility

## Support

For issues or questions:
1. Check the backend API docs: http://localhost:8000/docs
2. Review the FRONTEND_REQUIREMENTS.md
3. Check browser console for errors
4. Review network tab for failed API calls

Happy coding! 🎉

