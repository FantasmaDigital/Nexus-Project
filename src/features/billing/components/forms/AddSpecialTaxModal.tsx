import { useState } from "react";
import type { SpecialTaxType } from "../../../../types/billing";

interface AddSpecialTaxModalProps {
    onAdd: (data: { description: string, amount: number, type: SpecialTaxType }) => void;
    onClose: () => void;
}

const inputStyles = "w-full bg-white border border-slate-300 py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-brand-quaternary/50 focus:border-brand-quaternary transition-all rounded-none";

export const AddSpecialTaxModal = ({ onAdd, onClose }: AddSpecialTaxModalProps) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState<SpecialTaxType>('Gravado');

    const handleAdd = () => {
        if (description && amount > 0) {
            onAdd({ description, amount, type });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-none shadow-xl w-96">
                <h3 className="text-base font-bold text-slate-700 uppercase mb-4">Añadir Impuesto Especial</h3>
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Descripción del impuesto (e.g., Impuesto X)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputStyles}
                    />
                    <input
                        type="number"
                        placeholder="Monto"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        className={inputStyles}
                    />
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as SpecialTaxType)}
                        className={inputStyles}
                    >
                        <option value="Gravado">Gravado</option>
                        <option value="Exento">Exento</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-none transition-colors">Cancelar</button>
                    <button onClick={handleAdd} className="bg-brand-quaternary text-white px-6 py-2 text-sm font-semibold uppercase rounded-none hover:bg-brand-quaternary/90 transition-colors">Añadir</button>
                </div>
            </div>
        </div>
    );
};
