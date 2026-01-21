import { useState } from "react";
import { FiArrowLeft, FiDollarSign, FiCreditCard, FiCheck, FiUser, FiFileText, FiPackage, FiHash } from "react-icons/fi";
import type { Invoice } from "../../../../types/billing";
import { formatCurrency } from "../../../../utils/calculations.utils";

interface PaymentFormProps {
    invoice: Invoice;
    onSuccess: (method: string, amountReceived?: number, change?: number, reference?: string) => void;
    onCancel: () => void;
}

export const PaymentForm = ({ invoice, onSuccess, onCancel }: PaymentFormProps) => {
    const [amountReceived, setAmountReceived] = useState<string>('');
    const [referenceNumber, setReferenceNumber] = useState<string>('');
    const [change, setChange] = useState<number>(0);

    const handleAmountChange = (val: string) => {
        setAmountReceived(val);
        const received = parseFloat(val);
        if (!isNaN(received)) {
            setChange(received - invoice.total);
        } else {
            setChange(0);
        }
    };

    const handleConfirm = () => {
        onSuccess(invoice.paymentMethod, parseFloat(amountReceived) || invoice.total, change, referenceNumber);
    };

    const isEffectivo = invoice.paymentMethod === 'Efectivo';
    const canConfirm = isEffectivo
        ? (change >= 0 && amountReceived !== '')
        : (referenceNumber.trim() !== '');

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-hidden">
            {/* Header - Command Center Style */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-brand-quaternary font-bold text-xs uppercase tracking-widest transition-all group active:scale-95"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Cancelar Pago
                </button>
                <h2 className="text-brand-quaternary font-bold text-sm tracking-tight flex items-center gap-2">
                    <div className="bg-brand-quaternary text-white p-1"><FiDollarSign size={14} /></div>
                    PROCESAR PAGO - FACTURA {invoice.id.split('-')[0].toUpperCase()}
                </h2>
            </header>

            {/* Bento Grid Layout - 2 Columns */}
            <div className="flex-1 p-1 flex gap-1 overflow-y-auto">
                {/* LEFT COLUMN: Products + Client */}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                    {/* Products Table - Takes most vertical space */}
                    <div className="flex-1 bg-white border border-slate-200 flex flex-col min-h-0">
                        <div className="bg-slate-50 border-b-2 border-slate-200 p-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <FiPackage size={14} /> Productos ({invoice.items.length})
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full bg-white">
                                <thead className="bg-slate-50 border-b-2 border-slate-200 sticky top-0">
                                    <tr>
                                        <th className="p-2 text-left text-xs font-bold text-slate-500 uppercase">SKU</th>
                                        <th className="p-2 text-left text-xs font-bold text-slate-500 uppercase">Descripción</th>
                                        <th className="p-2 text-center text-xs font-bold text-slate-500 uppercase">Cant.</th>
                                        <th className="p-2 text-right text-xs font-bold text-slate-500 uppercase">P. Unit.</th>
                                        <th className="p-2 text-right text-xs font-bold text-slate-500 uppercase">Desc.</th>
                                        <th className="p-2 text-right text-xs font-bold text-slate-500 uppercase">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                            <td className="p-2 text-xs font-bold text-brand-quaternary">{item.sku || '---'}</td>
                                            <td className="p-2 text-xs text-slate-700">{item.description}</td>
                                            <td className="p-2 text-center text-xs font-bold text-slate-700">{item.quantity}</td>
                                            <td className="p-2 text-right text-xs font-bold text-slate-700">{formatCurrency(item.unitPrice)}</td>
                                            <td className="p-2 text-right text-xs font-bold text-red-600">{item.discount}%</td>
                                            <td className="p-2 text-right text-xs font-bold text-slate-900">{formatCurrency(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Client Data - Compact */}
                    <div className="bg-white border border-slate-200 flex flex-col shrink-0">
                        <div className="bg-slate-50 border-b-2 border-slate-200 p-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <FiUser size={14} /> Cliente
                            </h3>
                        </div>
                        <div className="p-2 grid grid-cols-3 gap-x-4 gap-y-1">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</span>
                                <span className="text-xs font-bold text-slate-700">{invoice.client.documentType} {invoice.client.documentNumber}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre</span>
                                <span className="text-xs font-bold text-brand-quaternary uppercase">{invoice.client.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                                <span className="text-xs font-bold text-slate-700">{invoice.client.email || '---'}</span>
                            </div>
                            {invoice.client.nrc && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NRC</span>
                                    <span className="text-xs font-bold text-slate-700">{invoice.client.nrc}</span>
                                </div>
                            )}
                            <div className="flex flex-col col-span-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección</span>
                                <span className="text-xs font-bold text-slate-700">{invoice.client.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Invoice Info + Payment */}
                <div className="w-80 flex flex-col gap-1 shrink-0">
                    {/* Invoice Info */}
                    <div className="bg-white border border-slate-200 flex flex-col shrink-0">
                        <div className="bg-slate-50 border-b-2 border-slate-200 p-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <FiFileText size={14} /> Información de Factura
                            </h3>
                        </div>
                        <div className="p-2 grid grid-cols-2 gap-1">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</span>
                                <span className="text-xs font-bold text-brand-quaternary">
                                    {invoice.invoiceType === '01' && 'CONSUMIDOR FINAL'}
                                    {invoice.invoiceType === '03' && 'CCF'}
                                    {invoice.invoiceType === '11' && 'EXPORTACIÓN'}
                                    {invoice.invoiceType === '14' && 'SUJETO EXCLUIDO'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</span>
                                <span className="text-xs font-bold text-slate-700">{invoice.issueDate}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora</span>
                                <span className="text-xs font-bold text-slate-700">{invoice.issueTime}</span>
                            </div>
                            {invoice.sellerName && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendedor</span>
                                    <span className="text-xs font-bold text-slate-700 uppercase">{invoice.sellerName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white border border-slate-200 flex flex-col shrink-0">
                        <div className="bg-slate-50 border-b-2 border-slate-200 p-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <FiDollarSign size={14} /> Método de Pago
                            </h3>
                        </div>
                        <div className="p-2">
                            <div className="p-3 bg-brand-quaternary/10 border-2 border-brand-quaternary flex items-center justify-center gap-2">
                                {invoice.paymentMethod === 'Efectivo' && <FiDollarSign size={18} className="text-brand-quaternary" />}
                                {(invoice.paymentMethod === 'Tarjeta Débito' || invoice.paymentMethod === 'Tarjeta Crédito') && <FiCreditCard size={18} className="text-brand-quaternary" />}
                                <span className="text-sm font-black text-brand-quaternary uppercase tracking-wider">{invoice.paymentMethod}</span>
                            </div>
                        </div>
                    </div>

                    {/* Totals Summary */}
                    <div className="bg-white border border-slate-200 flex flex-col shrink-0">
                        <div className="bg-slate-50 border-b-2 border-slate-200 p-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase">Resumen de Pago</h3>
                        </div>
                        <div className="p-2 flex flex-col gap-1">
                            <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                                <span className="text-xs font-bold text-slate-700">{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IVA (13%)</span>
                                <span className="text-xs font-bold text-slate-700">{formatCurrency(invoice.iva)}</span>
                            </div>
                            {invoice.ivaRetention > 0 && (
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retención</span>
                                    <span className="text-xs font-bold text-red-600">-{formatCurrency(invoice.ivaRetention)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-end pt-2 border-t-2 border-slate-200 mt-1">
                                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Total</span>
                                <span className="text-2xl font-black text-brand-primary">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Cash Payment Input */}
                    {isEffectivo ? (
                        <div className="bg-white border border-slate-200 flex flex-col shrink-0">
                            <div className="bg-green-50 border-b-2 border-green-200 p-2">
                                <h3 className="text-xs font-bold text-green-700 uppercase flex items-center gap-2">
                                    <FiDollarSign size={14} /> Pago en Efectivo
                                </h3>
                            </div>
                            <div className="p-2 flex flex-col gap-2">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                        Monto Recibido
                                    </label>
                                    <div className="relative group/input">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg group-focus-within/input:text-brand-quaternary transition-colors">$</span>
                                        <input
                                            type="number"
                                            value={amountReceived}
                                            onChange={(e) => handleAmountChange(e.target.value)}
                                            className="w-full h-12 pl-8 pr-4 border-2 border-slate-200 font-black text-xl text-slate-800 focus:border-brand-quaternary outline-none transition-all placeholder:text-slate-200 placeholder:font-bold"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className={`p-3 border-2 flex items-center justify-between transition-colors ${change < 0
                                    ? 'bg-red-50 border-red-200 text-red-700'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    }`}>
                                    <span className="text-xs font-black uppercase tracking-wide">Cambio</span>
                                    <span className="text-xl font-black">
                                        {formatCurrency(Math.max(0, change))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 flex flex-col shrink-0">
                            <div className="bg-brand-quaternary/5 border-b-2 border-brand-quaternary/20 p-2">
                                <h3 className="text-xs font-bold text-brand-quaternary uppercase flex items-center gap-2">
                                    <FiHash size={14} /> Referencia de Pago
                                </h3>
                            </div>
                            <div className="p-2 flex flex-col gap-2">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                        N° Voucher / Autorización
                                    </label>
                                    <div className="relative group/input">
                                        <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-brand-quaternary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={referenceNumber}
                                            onChange={(e) => setReferenceNumber(e.target.value)}
                                            className="w-full h-12 pl-10 pr-4 border-2 border-slate-200 font-black text-lg text-slate-800 focus:border-brand-quaternary outline-none transition-all uppercase placeholder:normal-case placeholder:text-slate-200 placeholder:font-bold"
                                            placeholder="Ingrese número de referencia"
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">* Este campo es obligatorio para confirmar</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                        className="h-12 bg-brand-primary text-white font-black uppercase tracking-widest shadow-sm hover:bg-brand-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
                    >
                        <FiCheck size={18} /> Confirmar Pago
                    </button>
                </div>
            </div>
        </div>
    );
};
