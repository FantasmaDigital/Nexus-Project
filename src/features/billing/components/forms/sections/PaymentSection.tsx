import { FiDollarSign, FiCreditCard, FiSend, FiFileText, FiSmartphone, FiCpu, FiZap, FiClock, FiCalendar } from "react-icons/fi";
import { SiBitcoin } from "react-icons/si";
import type { UseFormRegister, UseFormWatch } from "react-hook-form";
import type { Invoice } from "../../../../../types/billing";
import { CustomSelect, type SelectOption } from "../../../../../components/ui/CustomSelect";

interface PaymentSectionProps {
    register: UseFormRegister<Invoice>;
    setValue: (name: any, value: any) => void;
    watch: UseFormWatch<Invoice>;
}

export const PaymentSection = ({ register, setValue, watch }: PaymentSectionProps) => {
    const paymentMethod = watch("paymentMethod");
    const operationCondition = watch("operationCondition");

    const methods: SelectOption[] = [
        { id: 'Efectivo', label: 'Efectivo', icon: FiDollarSign, desc: 'Pago en Ventanilla' },
        { id: 'Transferencia', label: 'Transferencia', icon: FiSend, desc: 'Banca en Línea / SPEI' },
        { id: 'Tarjeta Crédito', label: 'Tajeta de Crédito', icon: FiCreditCard, desc: 'Visa / MasterCard / AMEX' },
        { id: 'Tarjeta Débito', label: 'Tarjeta de Débito', icon: FiCreditCard, desc: 'Consumo Directo' },
        { id: 'Cheque', label: 'Cheque Certificado', icon: FiFileText, desc: 'Cobro Bancario' },
        { id: 'Dinero electrónico', label: 'Billetera Digital', icon: FiSmartphone, desc: 'Chivo / Nequi / Otros' },
        { id: 'Bitcoin', label: 'Bitcoin (Lightning)', icon: SiBitcoin, desc: 'Activo Digital' },
        { id: 'Otras Criptomonedas', label: 'Criptoactivos', icon: FiCpu, desc: 'Stablecoins / Altcoins' },
    ];

    const conditions: SelectOption[] = [
        { id: 'Contado', label: 'Contado Inmediato', icon: FiZap, desc: 'Liquidación Total' },
        { id: 'Crédito', label: 'Crédito Comercial', icon: FiClock, desc: 'Pago Diferido' },
        { id: 'Plazos', label: 'Venta a Plazos', icon: FiCalendar, desc: 'Cuotas Programadas' },
    ];

    return (
        <div className="bg-slate-50 border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
                label="Condición de Operación"
                value={operationCondition}
                options={conditions}
                onSelect={(id) => setValue("operationCondition", id as any)}
                icon={FiZap}
                direction="up"
            />

            <CustomSelect
                label="Forma de Pago Principal"
                value={paymentMethod}
                options={methods}
                onSelect={(id) => setValue("paymentMethod", id as any)}
                icon={FiDollarSign}
                direction="up"
            />

            {/* Hidden inputs for form registration */}
            <input type="hidden" {...register("operationCondition")} />
            <input type="hidden" {...register("paymentMethod")} />
        </div>
    );
};
