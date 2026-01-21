import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { dashRoutes } from "../../shared/constants/sidebar.routes";
import { FiLogOut, FiMapPin } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/product.schema.zod";

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Obtenemos los datos del usuario de la Store
    const { user } = useUserStore();

    // Mejor forma de detectar la ruta activa en React Router
    const pathComponent = location.pathname.split('/')[2];

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        navigate("/auth"); // Redirige al login
    };

    return (
        <aside className={`h-screen bg-brand-primary text-white transition-all duration-300 ease-in-out relative flex flex-col ${isOpen ? 'min-w-64 w-64' : 'min-w-20 w-20'} `}>

            {/* Header: Logo */}
            <div className="flex justify-between items-center p-4 h-16 border-b border-white/10 overflow-hidden shrink-0">
                <div className={`flex items-center gap-2 transition-opacity duration-200 ${!isOpen && 'opacity-0 hidden'}`}>
                    <span className="font-black text-lg tracking-tighter whitespace-nowrap">
                        NEXUS <span className="text-blue-500">ERP</span>
                    </span>
                </div>
                <button onClick={toggleSidebar} className="p-2 rounded hover:bg-white/10 transition-colors ml-auto">
                    <FaArrowLeft className={`transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
                </button>
            </div>

            {/* Navegación Principal */}
            <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                <ul className="space-y-2">
                    {dashRoutes.map((route) => {
                        const Icon = route.icon as any;
                        return (
                            <li
                                key={route.slug}
                                onClick={() => navigate(`/app/${route.slug}`)}
                                className={`group p-3 rounded cursor-pointer flex items-center gap-3 transition-all duration-200 ${pathComponent === route.slug
                                    ? `bg-blue-600 text-white shadow-lg shadow-blue-600/20`
                                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className="shrink-0" />
                                <span className={`text-sm font-bold tracking-wide transition-all duration-300 ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
                                    {route.name}
                                </span>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* SECCIÓN DE USUARIO (Antes del Logout) */}
            <div className={`p-4 border-t border-white/10 transition-all duration-300 ${!isOpen ? 'items-center' : ''}`}>
                <div className={`flex items-center gap-2 rounded-xl transition-colors`}>
                    {/* Información Detallada */}
                    <div className={`flex flex-col min-w-0 transition-all duration-300 ${!isOpen ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                        <p className="text-md font-black text-white truncate leading-tight uppercase tracking-tighter">
                            {user?.name || "Invitado"}
                        </p>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-0.5">
                            {user?.role || "Operador"}
                        </p>

                        {/* Indicador de Bodega */}
                        <div className="flex items-center gap-1 mt-1 text-slate-400">
                            <FiMapPin size={10} className="text-emerald-500" />
                            <span className="text-xs font-medium truncate uppercase tracking-tighter">
                                {user?.warehouseName || "No asignada"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón de Logout */}
            <button
                onClick={handleLogout}
                className="w-full px-6 py-6 border-t border-white/10 flex items-center gap-4 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group relative"
            >
                <FiLogOut size={22} className="shrink-0" />
                <span className={`text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    Finalizar Sesión
                </span>

                {!isOpen && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-[10px] font-black rounded uppercase shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all">
                        Cerrar Sesión
                    </div>
                )}
            </button>
        </aside>
    )
}