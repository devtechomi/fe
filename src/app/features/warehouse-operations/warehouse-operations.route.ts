import { Routes } from '@angular/router';

export const warehouseOperationsRoutes: Routes = [
    {
        path: 'boxes',
        loadComponent: () => import('./pages/boxes/boxes.component')
            .then(c => c.BoxesComponent)
    },
    {
        path: 'transfer',
        loadComponent: () => import('./pages/transfer/transfer.component')
            .then(c => c.TransferComponent)
    }
]