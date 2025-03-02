import { InitialIntegrationComponent } from "./initial-integration/initial-integration.component";
import { SyncWarehousesComponent } from "./sync-warehouses/sync-warehouses.component";

export const IntegrationDialogs: {
    name: string,
    dialog: any 
}[] = [
    { name: 'initial', dialog: InitialIntegrationComponent },
    { name: 'sync', dialog: SyncWarehousesComponent }
];
