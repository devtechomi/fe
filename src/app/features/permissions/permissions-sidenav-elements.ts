import { AccountType } from "../../core/auth/models/account-type";

export const permissionsSidenavElements = {
    name: 'sidenav.permissions.header-name',
    icon: 'admin_panel_settings',
    roles: [AccountType.Business],
    pages: [
        { name: 'sidenav.permissions.roles', route: '/permissions/roles', roles: [AccountType.Business] },
        { name: 'sidenav.permissions.users', route: '/permissions/users', roles: [AccountType.Business] },
        { name: 'sidenav.permissions.permissions', route: '/permissions/permissions', roles: [AccountType.Business] }
    ]
}; 