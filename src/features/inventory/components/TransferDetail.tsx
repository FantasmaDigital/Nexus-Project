import { FiX, FiMapPin, FiClock, FiUser, FiPackage, FiArrowRight, FiDownload } from "react-icons/fi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TransferPDF } from "./TransferPDF";
import { formatCurrency } from "../../../utils/calculations.utils";

interface TransferDetailProps {
    transfer: any;
    onClose: () => void;
}

export const TransferDetail = ({ transfer, onClose }: TransferDetailProps) => {
    if (!transfer) return null;

    const items = transfer.items || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-slate-900 text-white px-8 py-5 flex justify-between items-center relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <FiPackage size={100} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">
                            <span>Control de Inventario</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span>SKU: {transfer.id?.split('-')[0].toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-black tracking-tighter">DETALLE DE MOVIMIENTO</h2>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${transfer.status === 'enviado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                transfer.status === 'recibido' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    transfer.status === 'anulado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                }`}>
                                {transfer.status || 'Enviado'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1 p-3 bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-400 mb-0.5">
                                <FiUser size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Responsable</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{transfer.senderName || 'No especificado'}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-400 mb-0.5">
                                <FiMapPin size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Ruta Logística</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-700 uppercase">{transfer.sourceWarehouse || '---'}</span>
                                <FiArrowRight className="text-slate-300" size={12} />
                                <span className="text-xs font-black text-slate-700 uppercase">{transfer.targetWarehouse || '---'}</span>
                            </div>
                        </div>
                        <div className="space-y-1 p-3 bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-400 mb-0.5">
                                <FiClock size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Salida</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800">{transfer.shipmentTime || '---'}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-400 mb-0.5">
                                <FiClock size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Llegada</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800">{transfer.receiptTime || 'Dependiendo...'}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FiPackage /> Productos en el Documento
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {items.length} SKUs
                            </span>
                        </div>
                        <div className="border border-slate-200">
                            <table className="w-full text-left">
                                <thead className="bg-[#1e293b] text-white text-[9px] font-black uppercase tracking-widest border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 w-[25%]">SKU</th>
                                        <th className="px-4 py-3 w-[35%]">Descripción</th>
                                        <th className="px-4 py-3 w-[10%] text-center">Cant.</th>
                                        <th className="px-4 py-3 w-[15%] text-right">P. Unitario</th>
                                        <th className="px-4 py-3 w-[15%] text-right font-black">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-[13px]">
                                    {items.map((item: any, idx: number) => {
                                        const price = parseFloat(item.details?.Precio || item.details?.precio || 0);
                                        const subtotal = price * item.qty;

                                        return (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3 font-mono text-[11px] font-bold text-slate-500">
                                                    {item.details?.SKU || item.details?.sku || item.sku}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-slate-900">{item.details?.Nombre || 'Producto sin nombre'}</div>
                                                    <div className="text-[9px] text-slate-400 uppercase font-black">{item.details?.Categoria || 'Sin categoría'}</div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="font-black text-slate-900 bg-slate-100 px-3 py-1 rounded">
                                                        {item.qty}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-600">
                                                    {formatCurrency(price)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-black text-slate-900">
                                                    {formatCurrency(subtotal)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {items.length > 0 && (
                                        <tr className="bg-slate-50 border-t-2 border-slate-200">
                                            <td colSpan={4} className="px-4 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                TOTAL TRASLADADO (USD)
                                            </td>
                                            <td className="px-4 py-4 text-right text-base font-black text-slate-900 whitespace-nowrap">
                                                {formatCurrency(items.reduce((acc: number, item: any) => acc + (parseFloat(item.details?.Precio || item.details?.precio || 0) * item.qty), 0))}
                                            </td>
                                        </tr>
                                    )}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-10 text-center text-slate-400 italic">
                                                No hay items registrados en este traslado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                {transfer.notes && (
                    <div className="px-8 pb-8 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                Observaciones
                            </h3>
                        </div>
                        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-[13px] leading-relaxed rounded-md shadow-inner">
                            "{transfer.notes}"
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-slate-100 p-6 border-t border-slate-200 flex flex-wrap gap-4 justify-between items-center shrink-0">
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">
                        Log: {transfer.date || transfer.createdAt || '---'}
                    </div>
                    <div className="flex items-center gap-3">
                        <PDFDownloadLink
                            document={<TransferPDF transfer={transfer} />}
                            fileName={`TRASLADO-${transfer.id?.split('-')[0]}.pdf`}
                            className="bg-[#10b981] text-white px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#059669] transition-all shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer"
                        >
                            {/* @ts-ignore */}
                            {({ loading }) => (
                                <>
                                    <FiDownload size={16} />
                                    {loading ? 'Preparando...' : 'Descargar Seguimiento'}
                                </>
                            )}
                        </PDFDownloadLink>
                        <button
                            onClick={onClose}
                            className="px-8 py-4 bg-[#0f172a] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-colors shadow-lg active:scale-95"
                        >
                            Cerrar Documento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
