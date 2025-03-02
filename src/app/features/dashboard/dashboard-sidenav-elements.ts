import { AccountType } from "../../core/auth/models/account-type";

export const dashboardSidenavElements = {
    name: 'sidenav.dashboard.header-name',
    icon: 'dashboard',
    roles: null,
    pages: [
        { name: 'sidenav.dashboard.overview', route: '/dashboard/overview', roles: null },
        { name: 'sidenav.dashboard.integrations', route: '/dashboard/integrations', roles: [AccountType.Business] }
    ]
};
