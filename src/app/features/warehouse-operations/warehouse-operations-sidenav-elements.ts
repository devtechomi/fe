import { AccountType } from "../../core/auth/models/account-type";

export const warehouseOperationsSidenavElements = {
    name: 'sidenav.warehouse-operations.header-name',
    icon: 'warehouse',
    roles: null,
    pages: [
        { name: 'sidenav.warehouse-operations.boxes', route: '/warehouse-operations/boxes', roles: null },
        { name: 'sidenav.warehouse-operations.transfer', route: '/warehouse-operations/transfer', roles: [AccountType.User] }
    ]
};
