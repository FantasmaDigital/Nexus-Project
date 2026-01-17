import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDatabase, FiSettings, FiCheckCircle, FiArrowRight, FiEdit3 } from "react-icons/fi";
import { useInventoryStore } from "../../store/product.schema.zod";
import { InventoryCommandCenter } from "../../features/inventory/components/InventoryCommandCenter";
import { SchemaEditor } from "../../features/inventory/components/SchemaEditor";

interface InitialConfigProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen?: boolean;
}

const InitialConfig = ({ setIsOpen }: InitialConfigProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-[#1e293b] text-white text-[10px] font-bold rounded uppercase">Modo Estructura</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#1e293b] tracking-tight">Configuración de Catálogo</h1>
                    <p className="text-gray-500 mt-1">Define los campos y atributos que tendrán tus productos en <b>Nexus ERP</b>.</p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-xs text-gray-400 font-mono">ID_ORG: 2001-ES</p>
                </div>
            </header >

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-md border border-gray-200 p-10 shadow-sm relative overflow-hidden">
                        <FiDatabase className="absolute -right-10 -bottom-10 text-gray-50 text-[240px] -rotate-12 pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-gray-900 mb-4 leading-[1.1]">
                                Crea una interfaz <br />
                                <span className="text-brand-quaternary text-2xl font-bold">a la medida de tu negocio</span>
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md">
                                No todos los inventarios son iguales. Añade campos personalizados como tallas, colores, números de serie o voltajes según tus necesidades.
                            </p>
                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 text-gray-700 font-semibold">
                                    <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center">
                                        <FiCheckCircle className="text-green-600 text-sm" />
                                    </div>
                                    Tipos de datos dinámicos
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 font-semibold">
                                    <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center">
                                        <FiCheckCircle className="text-green-600 text-sm" />
                                    </div>
                                    Validaciones personalizadas
                                </div>
                            </div>
                            <button className="group flex items-center gap-4 bg-[#1e293b] hover:bg-black text-white px-10 py-5 rounded-md font-bold text-lg transition-all shadow-xl shadow-gray-200 active:scale-95" onClick={() => setIsOpen(true)}>
                                Iniciar constructor de esquema
                                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-[#1e293b] rounded-md p-8 text-white shadow-xl relative overflow-hidden">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <FiSettings className="text-blue-400" /> Vista Previa del Modelo
                        </h3>
                        <div className="space-y-3 opacity-80">
                            {[
                                { name: "SKU", type: "Alfanumérico", color: "purple" },
                                { name: "Nombre Producto", type: "Texto", color: "blue" },
                                { name: "Stock / Existencia", type: "Numérico", color: "green" },
                                { name: "Precio Sugerido", type: "Moneda", color: "emerald" },
                                { name: "Bodega / Almacén", type: "Texto", color: "blue" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-white/10 rounded-md border border-white/10">
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <span className={`text-[10px] bg-${item.color}-500/20 px-2 py-1 rounded text-${item.color}-300 font-mono text-uppercase`}>{item.type}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-xs text-gray-400 leading-relaxed">
                            Esta estructura se convertirá en el formulario de entrada para tu equipo de almacén.
                        </p>
                    </div>
                    <div className="bg-white rounded-md border border-gray-100 p-8 shadow-sm flex items-center gap-5 group cursor-help">
                        <div className="w-14 h-14 bg-blue-50 text-brand-quaternary rounded-md flex items-center justify-center group-hover:bg-brand-quaternary group-hover:text-white transition-colors shadow-inner">
                            <FiEdit3 size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm italic">¿Por qué es importante?</h4>
                            <p className="text-xs text-gray-500 mt-1">Un buen esquema reduce errores en un 40% durante la toma de inventario.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export const Inventory = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { isConfigured, schema } = useInventoryStore();

    return (
        <div className={`w-full h-full bg-slate-50 ${isConfigured ? 'overflow-hidden' : 'overflow-y-auto p-2 md:p-6'}`}>
            <div className={`max-w-full mx-auto h-full flex flex-col ${isConfigured ? '' : ''}`}>

                {
                    isConfigured ? (
                        <InventoryCommandCenter productSchema={schema} />
                    ) : (
                        <AnimatePresence mode="wait">
                            {!isOpen ? (
                                <InitialConfig key="config" setIsOpen={setIsOpen} isOpen={isOpen} />
                            ) : (
                                <motion.div
                                    key="constructor"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white p-8 rounded-md shadow-sm border border-gray-200"
                                >
                                    <SchemaEditor onClose={() => setIsOpen(false)} />
                                </motion.div>
                            )}
                            <footer className="mt-auto py-6 flex justify-between items-center text-xs font-medium text-slate-400 uppercase tracking-widest border-t border-slate-200">
                                <p>© 2026 Nexus ERP - Engine: VITE + REACT</p>
                                <div className="flex gap-6">
                                    <a href="#" className="hover:text-brand-quaternary transition-colors">Documentación API</a>
                                    <a href="#" className="hover:text-brand-quaternary transition-colors">Soporte Técnico</a>
                                </div>
                            </footer>
                        </AnimatePresence>

                    )
                }
            </div>
        </div>
    );
};
