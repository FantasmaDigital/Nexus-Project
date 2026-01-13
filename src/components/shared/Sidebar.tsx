import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { dashRoutes } from "../../shared/constants/sidebar.routes";
import { FiLogOut } from "react-icons/fi";

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const pathComponent = window.location.pathname.split('/')[1];

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    }

    return (
        <aside className={`h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out relative ${isOpen ? 'w-72' : 'w-20'} `}>
            <div className="flex justify-between items-center p-4 h-16 border-b border-gray-700 overflow-hidden">
                <span className={`font-bold text-xl whitespace-nowrap transition-opacity duration-200 ${!isOpen && 'opacity-0 hidden'}`}>
                    Nexus ERP
                </span>
                <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-700 transition-colors">
                    <FaArrowLeft className={`transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
                </button>
            </div>
            <div className="flex flex-col p-4 h-full">
                <ul>
                    {
                        dashRoutes.map((route) => {
                            return (
                                <li className={`mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer flex flex-row items-center gap-2  hover:scale-105 transition-all duration-300 ${pathComponent === route.slug ? 'bg-gray-700 text-yellow-300' : ''}`} key={route.slug}>
                                    <route.icon /><span className={`transition-opacity duration-200 ${!isOpen && 'opacity-0 hidden'}`}>{route.name}</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <button onClick={() => { /* Lógica de cierre de sesión aquí */ }} className="absolute bottom-0 left-0 w-full px-4 py-6 border-t border-gray-700 flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 group cursor-pointer" aria-label="Cerrar sesión" >
                <FiLogOut className="text-2xl min-w-[24px]" />
                <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>Cerrar sesión</span>

                {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-xs rounded 
                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        Salir
                    </div>
                )}
            </button>
        </aside>
    )
}