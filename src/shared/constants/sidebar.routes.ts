import { MdDashboard, MdInventory } from "react-icons/md";
import type { DashRoute } from "../../types/dashboard";

export const dashRoutes: DashRoute[] = [
    {
        name: 'Dashboard',
        slug: 'dashboard',
        icon: MdDashboard
    },
    {
        name: 'Inventory',
        slug: 'inventory',
        icon: MdInventory
    },
]