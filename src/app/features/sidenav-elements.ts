import { accountSidenavElements } from "./account/account-sidenav-elements";
import { businessSidenavElements } from "./business/business-sidenav-elements";
import { warehouseOperationsSidenavElements } from "./warehouse-operations/warehouse-operations-sidenav-elements";
import { reportsSidenavElements } from "./reports/reports-sidenav-elements";
import { dashboardSidenavElements } from "./dashboard/dashboard-sidenav-elements";

export const sidenavElements: {
    name: string,
    icon: string,
    roles: string[] | null,
    pages: {
        name: string,
        route: string,
        roles: string[] | null
    }[]
}[] = [
    dashboardSidenavElements,
    accountSidenavElements,
    businessSidenavElements,
    warehouseOperationsSidenavElements,
    reportsSidenavElements,
];
