import { Routes } from '@angular/router';
import { authGuard } from '../core/auth/auth.guard';
import { authBusinessGuard } from '../core/auth/auth-business.guard';

export const sidenavRoutes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.route')
            .then(c => c.dashboardRoutes),
        canActivate: [authGuard],
        canActivateChild: [authGuard]
    },
    {
        path: 'account',
        loadChildren: () => import('./account/account.route')
            .then(c => c.accountRoutes),
        canActivate: [authGuard],
        canActivateChild: [authGuard]
    },
    {
        path: 'business',
        loadChildren: () => import('./business/business.route')
            .then(c => c.businessRoutes),
        canActivate: [authBusinessGuard],
        canActivateChild: [authBusinessGuard]
    },
    {
        path: 'warehouse-operations',
        loadChildren: () => import('./warehouse-operations/warehouse-operations.route')
            .then(c => c.warehouseOperationsRoutes),
        canActivate: [authGuard],
        canActivateChild: [authGuard]
    },
    {
        path: 'reports',
        loadChildren: () => import('./reports/reports.route')
            .then(c => c.reportsRoutes),
        canActivate: [authGuard],
        canActivateChild: [authGuard]
    }
]