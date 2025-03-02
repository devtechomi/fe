import { AccountType } from "../../core/auth/models/account-type";

export const businessSidenavElements = {
    name: 'sidenav.business.header-name',
    icon: 'business',
    roles: [AccountType.Business],
    pages: [
        { name: 'sidenav.business.warehouses', route: '/business/warehouses', roles: [AccountType.Business] }
    ]
};
