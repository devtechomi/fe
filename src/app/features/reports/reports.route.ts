import { Routes } from '@angular/router';

export const reportsRoutes: Routes = [
    {
        path: 'inventory',
        loadComponent: () => import('./pages/inventory/inventory.component')
            .then(c => c.InventoryComponent)
    },
    {
        path: 'transfers',
        loadComponent: () => import('./pages/transfers/transfers.component')
            .then(c => c.TransfersComponent)
    }
]