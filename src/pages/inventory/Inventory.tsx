import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDatabase, FiSettings, FiSave, FiCheckCircle, FiArrowRight, FiPlus, FiEdit3, FiTrash2, FiType, FiHash, FiCalendar } from "react-icons/fi";
import { IoMdReturnLeft } from "react-icons/io";
import type { DynamicField } from "../../types/react.hook.form";
import { saveSchema } from "../../utils/zod.crud";
import { useInventoryStore } from "../../store/product.schema.zod";
import { InventoryCommandCenter } from "../../features/inventory/components/InventoryCommandCenter";

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
                                <span className="text-blue-600 text-2xl font-bold">a la medida de tu negocio</span>
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
                            <div className="flex justify-between items-center p-3 bg-white/10 rounded-md border border-white/10">
                                <span className="text-sm font-medium">Nombre Producto</span>
                                <span className="text-[10px] bg-blue-500/20 px-2 py-1 rounded text-blue-300 font-mono text-uppercase">Texto</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/10 rounded-md border border-white/10">
                                <span className="text-sm font-medium">SKU / Referencia</span>
                                <span className="text-[10px] bg-purple-500/20 px-2 py-1 rounded text-purple-300 font-mono text-uppercase">Alfanumérico</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/10 rounded-md border border-white/10 italic text-gray-400">
                                <span className="text-sm">Nuevo campo...</span>
                                <FiPlus className="text-sm" />
                            </div>
                        </div>
                        <p className="mt-8 text-xs text-gray-400 leading-relaxed">
                            Esta estructura se convertirá en el formulario de entrada para tu equipo de almacén.
                        </p>
                    </div>
                    <div className="bg-white rounded-md border border-gray-100 p-8 shadow-sm flex items-center gap-5 group cursor-help">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
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

export const CreateProductSchema = ({ setIsOpen }: { setIsOpen: (val: boolean) => void }) => {
    const [fields, setFields] = useState<DynamicField[]>([
        { id: "1", keyName: "SKU", type: "text", required: true },
        { id: "2", keyName: "Nombre", type: "text" }
    ]);

    const addField = () => {
        setFields([...fields, { id: Date.now().toString(), keyName: "", type: "text" }]);
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const updateField = (id: string, updatedData: Partial<DynamicField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updatedData } : f));
    };

    const handleSaveSchema = () => {
        saveSchema(fields);
        setIsOpen(false);
    };

    return (
        <motion.div
            key="constructor"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-md shadow-sm border border-gray-200"
        >
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-black text-[#1e293b]">Definir Estructura</h2>
                    <p className="text-gray-500 text-sm">Configura los nombres de las columnas de tu inventario.</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 flex items-center gap-2 text-sm font-bold uppercase tracking-tighter">
                    <IoMdReturnLeft size={20} /> Volver
                </button>
            </div>

            <div className="space-y-3">
                {fields.map((field) => (
                    <div key={field.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-md border border-gray-100 group transition-all hover:border-blue-200">
                        {/* Selector de Tipo de Icono */}
                        <div className="bg-white p-2 rounded border border-gray-200 text-gray-400">
                            {field.type === 'text' && <FiType />}
                            {field.type === 'number' && <FiHash />}
                            {field.type === 'date' && <FiCalendar />}
                            {field.type === 'large-text' && <FiType />}
                        </div>

                        {/* Input para el Nombre de la Clave */}
                        <input
                            type="text"
                            placeholder="Nombre del campo (ej: Precio Compra)"
                            value={field.keyName}
                            onChange={(e) => updateField(field.id, { keyName: e.target.value })}
                            className="flex-1 bg-transparent border-none outline-none font-medium text-[#1e293b] placeholder:text-gray-300"
                            required={field.required}
                            disabled={field.id === "1"} // Bloqueamos SKU por ser primario
                        />

                        {/* Selector de Tipo de Dato */}
                        <select
                            value={field.type}
                            onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-xs font-bold text-gray-500 outline-none cursor-pointer"
                        >
                            <option value="text">TEXTO</option>
                            <option value="number">NÚMERO</option>
                            <option value="date">FECHA</option>
                            <option value="large-text">TEXTO LARGO</option>
                        </select>

                        {/* Eliminar */}
                        {field.id !== "1" && (
                            <button onClick={() => removeField(field.id)} className="text-gray-300 hover:text-red-500 transition-colors px-2">
                                <FiTrash2 />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    onClick={addField}
                    className="w-full py-4 mt-4 border-2 border-dashed border-gray-200 rounded-md text-gray-400 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                >
                    <FiPlus /> AÑADIR NUEVA PROPIEDAD
                </button>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row justify-between items-center p-5 bg-white border border-gray-200 rounded-xl shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    {/* Indicador visual de estado */}
                    <div className="hidden md:flex w-12 h-12 bg-blue-50 text-gray-800 rounded-lg items-center justify-center">
                        <FiSave size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Configuración del Modelo</p>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                            Se han estructurado <span className="text-[#1e293b] font-bold">{fields.length} atributos</span> para tus productos.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Descartar
                    </button>
                    <button
                        onClick={handleSaveSchema}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-black text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95"
                    >
                        <FiSave className="text-blue-400" />
                        Publicar Esquema
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const Inventory = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { isConfigured, schema } = useInventoryStore();

    return (
        <div className="w-full h-full bg-slate-50 overflow-y-auto p-2 md:p-4">
            <div className="max-w-full mx-auto h-full flex flex-col">

                {
                    isConfigured ? (
                        <InventoryCommandCenter productSchema={schema} />
                    ) : (
                        <AnimatePresence mode="wait">
                            {!isOpen ? (
                                <InitialConfig key="config" setIsOpen={setIsOpen} isOpen={isOpen} />
                            ) : (
                                <CreateProductSchema key="constructor" setIsOpen={setIsOpen} />
                            )}
                            <footer className="mt-auto py-6 flex justify-between items-center text-xs font-medium text-slate-400 uppercase tracking-widest border-t border-slate-200">
                                <p>© 2026 Nexus ERP - Engine: VITE + REACT</p>
                                <div className="flex gap-6">
                                    <a href="#" className="hover:text-blue-600 transition-colors">Documentación API</a>
                                    <a href="#" className="hover:text-blue-600 transition-colors">Soporte Técnico</a>
                                </div>
                            </footer>
                        </AnimatePresence>

                    )
                }
            </div>
        </div>
    );
};