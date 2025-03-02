import { Routes } from '@angular/router';

export const accountRoutes: Routes = [
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component')
            .then(c => c.ProfileComponent)
    },
    {
        path: 'sessions',
        loadComponent: () => import('./pages/sessions/sessions.component')
            .then(c => c.SessionsComponent)
    },
    {
        path: 'security',
        loadComponent: () => import('./pages/security/security.component')
            .then(c => c.SecurityComponent)
    },
    {
        path: 'permissions',
        loadComponent: () => import('./pages/permissions/permissions.component')
            .then(c => c.PermissionsComponent)
    }
]