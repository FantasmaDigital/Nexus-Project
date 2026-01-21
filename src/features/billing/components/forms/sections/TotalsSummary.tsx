import { FiDollarSign, FiCreditCard, FiSend, FiFileText, FiSmartphone, FiCpu, FiZap, FiClock, FiCalendar } from "react-icons/fi";
import { SiBitcoin } from "react-icons/si";
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { Invoice } from "../../../../../types/billing";
import { CustomSelect, type SelectOption } from "../../../../../components/ui/CustomSelect";

interface TotalsSummaryProps {
    register: UseFormRegister<Invoice>;
    errors: FieldErrors<Invoice>;
    subtotal: number;
    iva: number;
    total: number;
    montoNoAfecto: number;
    setValue: UseFormSetValue<Invoice>;
    watch: UseFormWatch<Invoice>;
}

const FormField = ({ label, children, className = "" }: { label: string, children: React.ReactNode, className?: string }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        {children}
    </div>
);

const inputStyles = "w-full bg-white border border-slate-300 py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-brand-quaternary/50 focus:border-brand-quaternary transition-all rounded-none";

export const TotalsSummary = ({ register, errors, subtotal, iva, total, montoNoAfecto, setValue, watch }: TotalsSummaryProps) => {
    const paymentMethod = watch("paymentMethod");
    const operationCondition = watch("operationCondition");

    const methods: SelectOption[] = [
        { id: 'Efectivo', label: 'Efectivo', icon: FiDollarSign, desc: 'Pago en Ventanilla' },
        { id: 'Transferencia', label: 'Transferencia', icon: FiSend, desc: 'Banca en Línea' },
        { id: 'Tarjeta Crédito', label: 'Tarjeta de Crédito', icon: FiCreditCard, desc: 'Visa / MC / AMEX' },
        { id: 'Tarjeta Débito', label: 'Tarjeta de Débito', icon: FiCreditCard, desc: 'Consumo Directo' },
        { id: 'Cheque', label: 'Cheque', icon: FiFileText, desc: 'Cobro Bancario' },
        { id: 'Dinero electrónico', label: 'E-Money', icon: FiSmartphone, desc: 'Billetera Digital' },
        { id: 'Bitcoin', label: 'Bitcoin', icon: SiBitcoin, desc: 'Lightning Network' },
        { id: 'Otras Criptomonedas', label: 'Altcoins', icon: FiCpu, desc: 'Criptoactivos' },
    ];

    const conditions: SelectOption[] = [
        { id: 'Contado', label: 'Contado', icon: FiZap, desc: 'Liquidación Total' },
        { id: 'Crédito', label: 'Crédito', icon: FiClock, desc: 'Pago Diferido' },
        { id: 'Plazos', label: 'Plazos', icon: FiCalendar, desc: 'Cuotas' },
    ];

    return (
        <div className="bg-white border border-slate-200">
            <div className="bg-slate-800 p-2 flex items-center gap-2">
                <FiFileText className="text-white text-xs" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Resumen de Liquidación y Pago</h3>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CustomSelect
                            label="Condición de Operación"
                            value={operationCondition}
                            options={conditions}
                            onSelect={(id) => setValue("operationCondition", id as any)}
                            icon={FiZap}
                            direction="up"
                        />

                        <CustomSelect
                            label="Forma de Pago"
                            value={paymentMethod}
                            options={methods}
                            onSelect={(id) => setValue("paymentMethod", id as any)}
                            icon={FiDollarSign}
                            direction="up"
                        />
                    </div>

                    <FormField label="Observaciones al documento">
                        <textarea
                            {...register("observations")}
                            className={`${inputStyles} h-20 text-xs`}
                            placeholder="Cualquier nota adicional sobre la factura..."
                        ></textarea>
                    </FormField>
                </div>

                <div className="lg:col-span-2 space-y-3 bg-slate-50 p-4 border border-slate-200 self-start">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 uppercase tracking-tighter">Sub-Total:</span>
                        <span className="font-mono font-bold text-slate-700">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 uppercase tracking-tighter">IVA (13%):</span>
                        <span className="font-mono font-bold text-slate-700">${iva.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 uppercase tracking-tighter">Monto No Afecto:</span>
                        <span className="font-mono font-bold text-slate-700">${montoNoAfecto.toFixed(2)}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block text-right">Retención IVA (1%)</label>
                        <input
                            {...register("ivaRetention", { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className={`${inputStyles} text-right font-mono font-bold py-1 bg-transparent border-slate-200 focus:bg-white`}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="pt-3 border-t-2 border-slate-400 flex justify-between items-bottom">
                        <span className="font-black text-brand-primary text-sm uppercase self-end mb-1">Total a Liquidar:</span>
                        <div className="text-right">
                            <span className="text-[8px] font-bold text-slate-400 block uppercase mb-1">USD (Moneda Nacional)</span>
                            <span className="font-mono font-black text-brand-primary text-2xl leading-none">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden inputs to maintain form connection */}
            <input type="hidden" {...register("operationCondition")} />
            <input type="hidden" {...register("paymentMethod")} />
        </div>
    );
};
