import { Routes } from '@angular/router';

export const businessRoutes: Routes = [
    {
        path: 'warehouses',
        loadComponent: () => import('./pages/warehouses/warehouses.component')
            .then(c => c.WarehousesComponent)
    }
]