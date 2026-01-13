import { useState, useMemo } from "react";
import {
    FiDatabase, FiFilter, FiPackage, FiPlus, FiSearch, FiUploadCloud,
    FiTruck, FiMinusCircle, FiArrowDownCircle, FiChevronLeft, FiChevronRight, FiArrowRight,
    FiEdit2, FiTrash2
} from "react-icons/fi";
import { useProductStore } from "../../../store/product.schema.zod";
import { Modal } from "../../../shared/components/Modal";
import { DynamicProductForm } from "./DynamicProductForm";

export const InventoryCommandCenter = ({ productSchema }: { productSchema: any[] }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ingresos');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    const { products, removeProduct } = useProductStore();

    const tabs = [
        { id: 'ingresos', label: 'Ingresos', icon: <FiArrowDownCircle /> },
        { id: 'traslados', label: 'Traslados', icon: <FiTruck /> },
        { id: 'retiros', label: 'Retiros', icon: <FiMinusCircle /> },
    ];

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            // Search in static fields
            if (p.id?.toLowerCase().includes(searchLower)) return true;
            if (p.date?.toLowerCase().includes(searchLower)) return true;

            // Search in dynamic fields
            return productSchema.some(schema => {
                const value = p[schema.keyName];
                return String(value).toLowerCase().includes(searchLower);
            });
        });
    }, [products, searchTerm, productSchema]);

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsCreateOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.")) {
            removeProduct(id);
        }
    };

    const handleCloseModal = () => {
        setIsCreateOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="w-full h-screen bg-slate-50 text-slate-700 flex overflow-hidden font-sans">

            {/* Sidebar Colapsable */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 relative shrink-0`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
                    {sidebarOpen && (
                        <h2 className="text-slate-800 font-bold text-sm tracking-tight flex items-center gap-2">
                            <div className="bg-blue-600 p-1 rounded text-white"><FiDatabase size={12} /></div>
                            NEXUS <span className="text-slate-400 font-normal">INVENTORY</span>
                        </h2>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 mx-auto transition-colors"
                    >
                        {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
                    </button>
                </div>

                {sidebarOpen && (
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Esquema de Datos</div>
                        {productSchema.map((field) => (
                            <div key={field.id} className="flex items-center gap-3 p-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span className="flex-1 font-medium truncate">{field.keyName}</span>
                                <span className="text-[10px] text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">{field.type}</span>
                            </div>
                        ))}
                    </div>
                )}
            </aside>

            <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
                {/* Header Superior */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                    <nav className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg border border-slate-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === tab.id
                                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={() => { setEditingProduct(null); setIsCreateOpen(true); }}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-xs font-medium transition-all shadow-sm active:scale-95"
                    >
                        <FiPlus /> Registrar Movimiento
                    </button>
                </header>

                {/* Contenido Principal */}
                <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">

                    {/* Barra de Herramientas */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative w-full max-w-md group">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por ID, fecha o atributos..."
                                className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                                <FiFilter /> Filtros Avanzados
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                                <FiUploadCloud /> Exportar
                            </button>
                        </div>
                    </div>

                    {/* Tabla de Datos */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 min-w-[100px]">ID Ref</th>
                                        {activeTab === 'traslados' && (
                                            <th className="px-6 py-3 text-blue-600">Origen / Destino</th>
                                        )}
                                        <th className="px-6 py-3">Fecha Registro</th>
                                        {productSchema.map(s => (
                                            <th key={s.id} className="px-6 py-3">{s.keyName}</th>
                                        ))}
                                        <th className="px-6 py-3 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-3 font-mono text-xs text-slate-500">
                                                    #{p.id.split('-')[0]}
                                                </td>
                                                {activeTab === 'traslados' && (
                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-100">
                                                                {p.sourceWarehouse || '---'}
                                                            </span>
                                                            <FiArrowRight className="text-slate-300 text-xs" />
                                                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100">
                                                                {p.targetWarehouse || '---'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-3 text-slate-600">
                                                    {p.date}
                                                </td>
                                                {productSchema.map(s => (
                                                    <td key={s.id} className="px-6 py-3 text-slate-800 font-medium">
                                                        {p[s.keyName] || <span className="text-slate-300 italic">--</span>}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(p)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(p.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={productSchema.length + (activeTab === 'traslados' ? 4 : 3)} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                        <FiPackage size={24} className="opacity-50" />
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-900">No hay registros encontrados</p>
                                                    <p className="text-xs mt-1">Intenta ajustar tu búsqueda o crea un nuevo registro.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer de Tabla */}
                        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                            <span>Mostrando {filteredProducts.length} registros</span>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Anterior</button>
                                <button className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Siguiente</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer del Sistema */}
                <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Sistema Operativo v2.4
                        </span>
                        <span>Nexus ERP Enterprise</span>
                    </div>
                    <span>© 2026 Reservados todos los derechos</span>
                </footer>
            </main>

            <Modal isOpen={isCreateOpen} onClose={handleCloseModal} title={editingProduct ? "Editar Registro" : (activeTab === 'traslados' ? "Ejecutar Traslado de Mercancía" : `Nuevo Registro de ${activeTab}`)}>
                <DynamicProductForm
                    schema={productSchema}
                    activeTab={activeTab}
                    onSuccess={handleCloseModal}
                    initialData={editingProduct}
                />
            </Modal>
        </div>
    );
};