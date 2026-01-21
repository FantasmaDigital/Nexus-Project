import { MdDashboard, MdInventory, MdReceipt } from "react-icons/md";
import type { DashRoute } from "../../types/dashboard";

export const dashRoutes: DashRoute[] = [
    {
        name: 'Inicio',
        slug: 'dashboard',
        icon: MdDashboard
    },
    {
        name: 'Facturación',
        slug: 'billing',
        icon: MdReceipt
    },
    {
        name: 'Almacén',
        slug: 'inventory',
        icon: MdInventory
    },
]