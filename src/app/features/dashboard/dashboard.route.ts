import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
    {
        path: 'overview',
        loadComponent: () => import('./pages/overview/overview.component')
            .then(c => c.OverviewComponent)
    },
    {
        path: 'integrations',
        loadComponent: () => import('./pages/integrations/integrations.component')
            .then(c => c.IntegrationsComponent)
    }
]