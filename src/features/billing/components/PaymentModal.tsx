import { useState, useEffect } from 'react';
import { FiX, FiDollarSign, FiCreditCard, FiCheck } from 'react-icons/fi';
import { Modal } from '../../../shared/components/Modal'; // Adjust import based on your Modal location, using generic for now if needed, or building custom.
// Assuming we use a simple custom modal structure or the existing one.
// Let's build a dedicated component that handles the internal logic.

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (method: string, amountReceived?: number, change?: number) => void;
    totalAmount: number;
    invoiceId: string;
}

export const PaymentModal = ({ isOpen, onClose, onConfirm, totalAmount, invoiceId }: PaymentModalProps) => {
    const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'BITCOIN'>('EFECTIVO');
    const [amountReceived, setAmountReceived] = useState<string>('');
    const [change, setChange] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            setAmountReceived('');
            setChange(0);
            setPaymentMethod('EFECTIVO');
        }
    }, [isOpen]);

    const handleAmountChange = (val: string) => {
        setAmountReceived(val);
        const received = parseFloat(val);
        if (!isNaN(received)) {
            setChange(received - totalAmount);
        } else {
            setChange(0);
        }
    };

    const handleConfirm = () => {
        onConfirm(paymentMethod, parseFloat(amountReceived) || totalAmount, change);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-black text-slate-700 uppercase tracking-wide flex items-center gap-2">
                        <div className="bg-brand-primary text-white p-1 rounded-sm"><FiDollarSign /></div>
                        Procesar Pago
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <FiX size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    {/* Total Display */}
                    <div className="text-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total a Pagar</span>
                        <div className="text-4xl font-black text-brand-primary mt-1">
                            ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    {/* Methods */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setPaymentMethod('EFECTIVO')}
                            className={`p-3 text-xs font-bold uppercase tracking-wider border rounded transition-all flex flex-col items-center gap-2 ${paymentMethod === 'EFECTIVO' ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            <FiDollarSign size={20} /> Efectivo
                        </button>
                        <button
                            onClick={() => setPaymentMethod('TARJETA')}
                            className={`p-3 text-xs font-bold uppercase tracking-wider border rounded transition-all flex flex-col items-center gap-2 ${paymentMethod === 'TARJETA' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            <FiCreditCard size={20} /> Tarjeta
                        </button>
                        {/* Add others if needed */}
                    </div>

                    {/* Cash Logic */}
                    {paymentMethod === 'EFECTIVO' && (
                        <div className="bg-slate-50 p-4 rounded items-center border border-slate-200">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                                Monto Recibido
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input
                                    type="number"
                                    value={amountReceived}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    className="w-full h-10 pl-8 pr-3 border border-slate-300 rounded font-bold text-lg text-slate-800 focus:ring-2 focus:ring-brand-quaternary/20 focus:border-brand-quaternary outline-none transition-all placeholder:text-slate-300"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>

                            <div className={`mt-4 flex justify-between items-end p-3 rounded border ${change < 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                <span className="text-xs font-bold text-slate-500 uppercase">Su Cambio:</span>
                                <span className={`text-xl font-black ${change < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    ${Math.max(0, change).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-xs font-bold uppercase text-slate-500 hover:text-slate-700 transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={paymentMethod === 'EFECTIVO' && change < 0}
                        className="px-6 py-2 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded hover:bg-brand-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <FiCheck size={16} /> Confirmar Pago
                    </button>
                </div>
            </div>
        </div>
    );
};
