import { useState, useMemo } from "react";
import {
    FiDatabase, FiFilter, FiPackage, FiPlus, FiSearch, FiUploadCloud,
    FiTruck, FiMinusCircle, FiArrowDownCircle, FiArrowLeft, FiArrowRight,
    FiEdit2, FiTrash2
} from "react-icons/fi";
import { useProductStore } from "../../../store/product.schema.zod";
import { DynamicProductForm } from "./DynamicProductForm";
import { SchemaEditor } from "./SchemaEditor";

type ViewMode = 'list' | 'create' | 'edit' | 'schema';

export const InventoryCommandCenter = ({ productSchema }: { productSchema: any[] }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [activeTab, setActiveTab] = useState('ingresos');
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
            if (p.id?.toLowerCase().includes(searchLower)) return true;
            if (p.date?.toLowerCase().includes(searchLower)) return true;

            return productSchema.some(schema => {
                const value = p[schema.keyName];
                return String(value).toLowerCase().includes(searchLower);
            });
        });
    }, [products, searchTerm, productSchema]);

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setViewMode('edit');
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
            removeProduct(id);
        }
    };

    const handleClose = () => {
        setViewMode('list');
        setEditingProduct(null);
    };

    return (
        <div className="w-full h-full bg-slate-50 text-slate-700 flex overflow-hidden font-sans">

            {/* Main Wrapper */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50">
                    <div className="flex items-center gap-4">
                        {viewMode !== 'list' ? (
                            <button
                                onClick={handleClose}
                                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all group active:scale-95"
                            >
                                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                Volver al Listado
                            </button>
                        ) : (
                            <>
                                <h2 className="text-gray-800 font-bold text-sm tracking-tight flex items-center gap-2 mr-4">
                                    <div className="bg-blue-600 p-1 rounded text-white"><FiDatabase size={12} /></div>
                                    INVENTARIO
                                </h2>
                                <nav className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-md border border-slate-100">
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
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {viewMode === 'list' && (
                            <>
                                <button
                                    onClick={() => setViewMode('schema')}
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                                    title="Configurar columnas y esquema"
                                >
                                    <FiEdit2 size={12} /> Esquema
                                </button>
                                <button
                                    onClick={() => { setEditingProduct(null); setViewMode('create'); }}
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-xs font-medium transition-all shadow-sm active:scale-95"
                                >
                                    <FiPlus /> Registrar Movimiento
                                </button>
                            </>
                        )}
                    </div>
                </header>

                <div className="flex-1 p-3 flex flex-col gap-6 min-w-0 overflow-hidden relative">
                    {viewMode === 'list' ? (
                        <>
                            <div className="flex flex-wrap items-center justify-between gap-4 shrink-0 px-1">
                                <div className="relative w-full max-w-md group">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar por ID, fecha o atributos..."
                                        className="w-full bg-white border border-slate-200 rounded-md py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
                                        <FiFilter /> Filtros
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
                                        <FiUploadCloud /> Exportar
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 relative bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
                                <div className="absolute inset-0 overflow-x-auto overflow-y-auto custom-scrollbar">
                                    <table className="min-w-full w-max text-left border-separate border-spacing-0 table-auto">
                                        <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm z-30 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 bg-slate-50">ID Ref</th>
                                                {activeTab === 'traslados' && (
                                                    <th className="px-4 py-3 text-blue-600 whitespace-nowrap border-b border-slate-200 bg-slate-50">Origen / Destino</th>
                                                )}
                                                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 bg-slate-50">Fecha Registro</th>
                                                {productSchema.map(s => (
                                                    <th key={s.id} className="px-4 py-3 whitespace-nowrap border-b border-slate-200 min-w-[160px] bg-slate-50">{s.keyName}</th>
                                                ))}
                                                <th className="px-4 py-3 text-right sticky right-0 bg-slate-50 border-b border-l border-slate-200 z-40">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((p) => (
                                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                                        <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                                                            #{p.id.split('-')[0]}
                                                        </td>
                                                        {activeTab === 'traslados' && (
                                                            <td className="px-4 py-3 whitespace-nowrap">
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
                                                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                                            {p.date}
                                                        </td>
                                                        {productSchema.map(s => (
                                                            <td key={s.id} className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                                                                <div className="max-w-[300px] truncate" title={p[s.keyName]}>
                                                                    {p[s.keyName] || <span className="text-slate-300 italic">--</span>}
                                                                </div>
                                                            </td>
                                                        ))}
                                                        <td className="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-slate-50 border-l border-slate-100 transition-colors z-10 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)]">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><FiEdit2 size={14} /></button>
                                                                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><FiTrash2 size={14} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={productSchema.length + (activeTab === 'traslados' ? 4 : 3)} className="px-6 py-20 text-center">
                                                        <div className="flex flex-col items-center text-slate-400">
                                                            <FiPackage size={24} className="mb-2 opacity-20" />
                                                            <p className="text-sm">No hay registros</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="px-6 py-3 border border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0 rounded-md shadow-sm">
                                <span>Mostrando {filteredProducts.length} registros</span>
                                <div className="flex gap-2">
                                    <button className="px-2 py-1 bg-white border border-slate-200 rounded disabled:opacity-50" disabled>Anterior</button>
                                    <button className="px-2 py-1 bg-white border border-slate-200 rounded disabled:opacity-50" disabled>Siguiente</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {viewMode === 'schema' ? (
                                <div className="flex-1 p-5 overflow-hidden h-full">
                                    <SchemaEditor onClose={handleClose} />
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                                    <DynamicProductForm
                                        schema={productSchema}
                                        activeTab={activeTab}
                                        onSuccess={handleClose}
                                        initialData={editingProduct}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium uppercase shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-md bg-emerald-500" /> Sistema Operativo v2.4</span>
                        <span>Nexus ERP Enterprise</span>
                    </div>
                    <span>© 2026 Reservados todos los derechos</span>
                </footer>
            </main>
        </div>
    );
};
