import { useState, useMemo } from "react";
import {
    FiDatabase, FiFilter, FiPlus, FiSearch, FiUploadCloud,
    FiTruck, FiMinusCircle, FiArrowLeft, FiArrowRight,
    FiEdit2
} from "react-icons/fi";
import { useProductStore } from "../../../store/product.schema.zod";
import { DynamicProductForm } from "./DynamicProductForm";
import { SchemaEditor } from "./SchemaEditor";
import { InventoryTable } from "./InventoryTable";
import { AiOutlineProduct } from "react-icons/ai";
import { TransferDetail } from "./TransferDetail";
import { FiUser, FiClock, FiLayers } from "react-icons/fi";
import { getProductField } from "../../../utils/product.utils";

type ViewMode = 'list' | 'create' | 'edit' | 'schema';

export const InventoryCommandCenter = ({ productSchema }: { productSchema: any[] }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [activeTab, setActiveTab] = useState('productos');
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [viewingTransfer, setViewingTransfer] = useState<any | null>(null);

    const { products, removeProduct, updateProduct } = useProductStore();

    const tabs = [
        { id: 'productos', label: 'Productos', icon: <AiOutlineProduct /> },
        { id: 'traslados', label: 'Traslados', icon: <FiTruck /> },
        { id: 'retiros', label: 'Retiros', icon: <FiMinusCircle /> },
    ];

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            // Filtrar por tipo según la pestaña activa
            if (activeTab === 'productos' && p.type === 'traslados') return false;
            if (activeTab === 'traslados' && p.type !== 'traslados') return false;

            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();

            // Búsqueda en campos básicos
            if (p.id?.toLowerCase().includes(searchLower)) return true;
            if (p.senderName?.toLowerCase().includes(searchLower)) return true;
            if (p.sourceWarehouse?.toLowerCase().includes(searchLower)) return true;
            if (p.targetWarehouse?.toLowerCase().includes(searchLower)) return true;

            // Búsqueda en esquema si no es traslados
            if (activeTab !== 'productos' && activeTab !== 'traslados') return false; // Safety

            if (activeTab === 'productos') {
                return productSchema.some(schema => {
                    const value = getProductField(p, schema.keyName);
                    return String(value ?? '').toLowerCase().includes(searchLower);
                });
            }

            return false;
        });
    }, [products, searchTerm, productSchema, activeTab]);

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setViewMode('edit');
    };

    const handleDelete = (id: string) => {
        if (activeTab === 'traslados') {
            if (confirm("¿Seguro que desea ANULAR este traslado? Esta acción no se puede deshacer.")) {
                updateProduct(id, { status: 'anulado' });
            }
            return;
        }

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
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-50">
                    <div className="flex items-center gap-4">
                        {viewMode !== 'list' ? (
                            <button
                                onClick={handleClose}
                                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-brand-quaternary font-bold text-xs uppercase tracking-widest transition-all group active:scale-95"
                            >
                                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                Volver al Listado
                            </button>
                        ) : (
                            <>
                                <h2 className="text-brand-primary font-bold text-sm tracking-tight flex items-center gap-2 mr-4">
                                    <div className="bg-brand-quaternary p-1 rounded text-white"><FiDatabase size={12} /></div>
                                    INVENTARIO
                                </h2>
                                <nav className="flex items-center gap-1 bg-slate-100/50 p-1 border border-slate-100">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold transition-all ${activeTab === tab.id
                                                ? 'bg-white text-brand-quaternary shadow-sm border border-slate-200/50'
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
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                                    title="Configurar columnas y esquema"
                                >
                                    <FiEdit2 size={12} /> Esquema
                                </button>
                                <button
                                    onClick={() => { setEditingProduct(null); setViewMode('create'); }}
                                    className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary text-white px-4 py-2 text-xs font-medium transition-all shadow-sm active:scale-95"
                                >
                                    <FiPlus /> Registrar Movimiento
                                </button>
                            </>
                        )}
                    </div>
                </header>

                <div className="flex-1 p-1 flex flex-col gap-1 min-w-0 overflow-hidden relative">
                    {viewMode === 'list' ? (
                        <>
                            <div className="flex flex-wrap items-center justify-between gap-1 shrink-0">
                                <div className="relative w-full flex-1 group">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar por ID, fecha o atributos..."
                                        className="w-full bg-white border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="flex gap-1 h-full">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
                                        <FiFilter /> Filtros
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200  text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
                                        <FiUploadCloud /> Exportar
                                    </button>
                                </div>
                            </div>

                            <InventoryTable
                                className="flex-1"
                                data={filteredProducts}
                                schema={activeTab === 'productos' ? productSchema : []}
                                onEdit={activeTab === 'productos' ? handleEdit : undefined}
                                onDelete={handleDelete}
                                onView={activeTab === 'traslados' ? (item) => setViewingTransfer(item) : undefined}
                                renderExtraHeaders={() => (
                                    activeTab === 'traslados' ? (
                                        <>
                                            <th className="px-4 py-3 text-slate-500 whitespace-nowrap border-b border-slate-200 bg-slate-50 min-w-[150px]">Enviado por</th>
                                            <th className="px-4 py-3 text-slate-500 whitespace-nowrap border-b border-slate-200 bg-slate-50 min-w-[200px]">Ruta Logística</th>
                                            <th className="px-4 py-3 text-slate-500 whitespace-nowrap border-b border-slate-200 bg-slate-50 min-w-[100px]">Horarios</th>
                                            <th className="px-4 py-3 text-brand-quaternary text-center whitespace-nowrap border-b border-slate-200 bg-slate-50">Items</th>
                                            <th className="px-4 py-3 text-slate-500 text-center whitespace-nowrap border-b border-slate-200 bg-slate-50">Estado</th>
                                        </>
                                    ) : null
                                )}
                                renderExtraColumns={(p) => (
                                    activeTab === 'traslados' ? (
                                        <>
                                            <td className="px-4 py-3 whitespace-nowrap italic">
                                                <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                    <FiUser className="text-slate-400" />
                                                    {p.senderName || '---'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-black border border-orange-100 uppercase italic">
                                                        {p.sourceWarehouse || '---'}
                                                    </span>
                                                    <FiArrowRight className="text-slate-300 text-xs" />
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black border border-blue-100 uppercase italic">
                                                        {p.targetWarehouse || '---'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                                        <FiClock size={10} className="text-emerald-500" />
                                                        {p.shipmentTime || '--:--'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                                        <FiClock size={10} />
                                                        {p.receiptTime || '--:--'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-black italic">
                                                    <FiLayers size={10} />
                                                    {p.items?.length || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase italic border ${p.status === 'enviado' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    p.status === 'recibido' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        p.status === 'anulado' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            'bg-slate-50 text-slate-700 border-slate-100'
                                                    }`}>
                                                    {p.status || 'Enviado'}
                                                </span>
                                            </td>
                                        </>
                                    ) : null
                                )}
                            />

                            <div className="px-3 py-2 border border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0 shadow-sm">
                                <span>Mostrando {filteredProducts.length} registros</span>
                                <div className="flex gap-2">
                                    <button className="px-2 py-1 bg-white border border-slate-200 rounded disabled:opacity-50" disabled>Anterior</button>
                                    <button className="px-2 py-1 bg-white border border-slate-200 rounded disabled:opacity-50" disabled>Siguiente</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {viewMode === 'schema' ? (
                                <div className="flex-1 p-5 overflow-hidden h-full">
                                    <SchemaEditor onClose={handleClose} />
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                {/* MODAL DE DETALLE DE TRASLADO */}
                <TransferDetail
                    transfer={viewingTransfer}
                    onClose={() => setViewingTransfer(null)}
                />
            </main>
        </div>
    );
};
