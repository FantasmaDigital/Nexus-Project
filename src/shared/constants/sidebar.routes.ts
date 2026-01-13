import { MdDashboard, MdInventory } from "react-icons/md";
import type { DashRoute } from "../../types/dashboard";
import { TbReportSearch } from "react-icons/tb";

export const dashRoutes: DashRoute[] = [
    {
        name: 'Dashboard',
        slug: 'dashboard',
        icon: MdDashboard
    },
    {
        name: 'Reports',
        slug: 'reports',
        icon: TbReportSearch
    },
    {
        name: 'Inventory',
        slug: 'inventory',
        icon: MdInventory
    },
    {
        name: 'Settings',
        slug: 'settings',
        icon: MdDashboard
    }
]