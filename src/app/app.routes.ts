import { Routes } from '@angular/router';
import { authRoutes } from './core/auth/auth.routes';
import { sidenavRoutes } from './features/sidenav.routes';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./core/auth/pages/login/login.component')
            .then(c => c.LoginComponent)
    },
    ...authRoutes,
    ...sidenavRoutes,
    {
        path: '**',
        loadComponent: () => import('./shared/components/errors/not-found/not-found.component')
            .then(c => c.NotFoundComponent)
    }
];
