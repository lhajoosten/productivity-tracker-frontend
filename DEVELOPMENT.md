# Development Notes

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access application
http://localhost:3000
```

## Default Test Credentials

After running the backend setup script to create a superuser, you can use:

```
Username: admin
Password: [your password from backend setup]
```

## Development Workflow

1. **Backend must be running first**
   ```bash
   cd ~/projects/productivity-tracker-backend
   poetry run uvicorn productivity_tracker.main:app --reload
   ```

2. **Start frontend**
   ```bash
   cd ~/projects/productivity-tracker-frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## File-Based Routing

TanStack Router uses file-based routing. Routes are automatically generated from files in `src/routes/`:

- `__root.tsx` - Root layout
- `index.tsx` - `/`
- `login.tsx` - `/login`
- `_authenticated/dashboard.tsx` - `/dashboard` (protected)

The route tree is auto-generated in `src/routeTree.gen.ts` - don't edit this file manually.

## State Management

### Auth State (Zustand + localStorage persistence)
```typescript
const { user, isAuthenticated, login, logout } = useAuthStore()
```

### Server State (TanStack Query)
```typescript
const { data: roles } = useQuery({
  queryKey: ['roles'],
  queryFn: roleApi.list,
})
```

### Toast Notifications
```typescript
const toast = useToast()
toast.success('Success!')
toast.error('Error occurred')
```

## API Integration

All API calls go through `src/lib/api.ts` which:
- Adds Authorization header automatically
- Refreshes tokens on 401 errors
- Provides type-safe API methods

## Permission System

### Check permissions in code:
```typescript
import { hasPermission } from '@/lib/permissions'

if (hasPermission(user, 'role:create')) {
  // User can create roles
}
```

### Guard components:
```typescript
<PermissionGuard permission="role:create">
  <CreateRoleButton />
</PermissionGuard>
```

### Guard entire routes:
```typescript
<RequirePermission permission="role:read">
  <RoleManagementPage />
</RequirePermission>
```

## Building for Production

```bash
# Build
npm run build

# Preview production build
npm run preview

# Output will be in dist/ directory
```

## Common Issues

### Route not found
- Check that file exists in `src/routes/`
- Restart dev server to regenerate route tree
- Check `src/routeTree.gen.ts` for registered routes

### 401 errors
- Check that backend is running
- Verify tokens are being stored (check localStorage)
- Try logging out and back in

### TypeScript errors
- Run `npm install` to ensure all types are installed
- Check `tsconfig.json` for path aliases (@/* → src/*)

## Testing Users

Once backend is running, you can:

1. **Register new users** via `/register`
2. **Login as superuser** to manage roles/permissions
3. **Assign roles** to regular users via admin dashboard

## Next Steps

- [ ] Add user management page (list/edit users)
- [ ] Implement role assignment to users
- [ ] Add activity tracking features
- [ ] Build analytics dashboard
- [ ] Add real-time notifications

