// src/features/billing/components/forms/sections/DteItemsTable.tsx
import { type Control, type UseFormRegister, type UseFormWatch } from "react-hook-form";
import { FiTrash, FiEdit2, FiList } from "react-icons/fi";
import type { Invoice } from "../../../../../types/billing";

interface DteItemsTableProps {
    control: Control<Invoice>;
    register: UseFormRegister<Invoice>;
    watch: UseFormWatch<Invoice>;
    items: any[]; // field array fields
    removeItem: (index: number) => void;
    onEditItem: (index: number) => void; // New prop
    nonTaxableFields: any[];
    removeNonTaxable: (index: number) => void;
    specialTaxFields: any[];
    removeSpecialTax: (index: number) => void;
}

const readOnlyStyles = "w-full bg-slate-50 border border-slate-200 py-1 px-2 text-xs outline-none rounded-none font-mono text-slate-600 cursor-default";

export const DteItemsTable = ({
    register,
    watch,
    items,
    removeItem,
    onEditItem,
    nonTaxableFields,
    removeNonTaxable,
    specialTaxFields,
    removeSpecialTax
}: DteItemsTableProps) => {
    const watchItems = watch("items") || [];

    return (
        <div className="bg-white border-x border-b border-slate-300 shadow-sm mb-4">
            <div className="bg-slate-800 p-2 flex items-center gap-2">
                <FiList className="text-white text-xs" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Cuerpo del DTE (Items Agregados)</h3>
            </div>

            {/* Main Items Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-2 text-left text-[9px] font-bold uppercase text-slate-500 tracking-wider">Descripción</th>
                            <th className="p-2 text-left text-[9px] font-bold uppercase text-slate-500 tracking-wider w-14">Cant.</th>
                            <th className="p-2 text-left text-[9px] font-bold uppercase text-slate-500 tracking-wider w-24">P. Unit.</th>
                            <th className="p-2 text-left text-[9px] font-bold uppercase text-slate-500 tracking-wider w-24">Impuestos</th>
                            <th className="p-2 text-left text-[9px] font-bold uppercase text-slate-500 tracking-wider w-20">Descuento</th>
                            <th className="p-2 text-right text-[9px] font-bold uppercase text-slate-500 tracking-wider w-32">Subtotal</th>
                            <th className="p-2 text-center text-[9px] font-bold uppercase text-slate-500 tracking-wider w-20">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {(items || []).map((field, index) => (
                            <tr key={field.id} className="hover:bg-slate-50/50">
                                <td className="p-1">
                                    <input {...register(`items.${index}.description`)} className={readOnlyStyles} readOnly tabIndex={-1} />
                                </td>
                                <td className="p-1">
                                    <input {...register(`items.${index}.quantity`, { valueAsNumber: true })} type="number" className={`${readOnlyStyles} text-center`} readOnly tabIndex={-1} />
                                </td>
                                <td className="p-1">
                                    <input {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} type="number" step="0.01" className={`${readOnlyStyles} text-right`} readOnly tabIndex={-1} />
                                </td>
                                <td className="p-1">
                                    <div className={`${readOnlyStyles} w-24 text-center truncate uppercase`}>
                                        {watchItems?.[index]?.tax === 'iva' ? 'IVA 13%' : 'Exento'}
                                    </div>
                                </td>
                                <td className="p-1">
                                    <div className={`${readOnlyStyles} w-20 text-center uppercase`}>
                                        {watchItems?.[index]?.quantity * watchItems?.[index]?.unitPrice > 0
                                            ? Math.round((watchItems?.[index]?.discount / (watchItems?.[index]?.quantity * watchItems?.[index]?.unitPrice)) * 100)
                                            : 0}%
                                    </div>
                                </td>
                                <td className="p-1 text-right font-mono font-bold text-slate-700 pr-3">
                                    ${((watchItems?.[index]?.quantity || 0) * (watchItems?.[index]?.unitPrice || 0) - (watchItems?.[index]?.discount || 0)).toFixed(2)}
                                </td>
                                <td className="p-1 text-center whitespace-nowrap">
                                    <button type="button" onClick={() => onEditItem(index)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors mr-1" title="Editar ítem">
                                        <FiEdit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button type="button" onClick={() => removeItem(index)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar ítem">
                                        <FiTrash className="w-3.5 h-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(items || []).length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-400 italic text-xs">
                                    No hay ítems agregados. Utilice el formulario superior.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Non Taxable Items Section */}
            {(nonTaxableFields || []).length > 0 && (
                <div className="border-t border-slate-200">
                    <h4 className="bg-slate-50/80 border-b border-slate-200 p-1.5 px-2 text-[10px] font-bold text-slate-500 uppercase">Montos No Afectos</h4>
                    <table className="w-full">
                        <tbody className="divide-y divide-slate-100">
                            {(nonTaxableFields || []).map((field, index) => (
                                <tr key={field.id} className="hover:bg-slate-50/50">
                                    <td className="p-1.5 w-full text-xs text-slate-600 pl-2">
                                        {field.description}
                                    </td>
                                    <td className="p-1.5 text-xs font-mono font-medium text-slate-800 whitespace-nowrap text-right pr-4">
                                        $ {field.amount.toFixed(2)}
                                    </td>
                                    <td className="p-1 text-center w-10">
                                        <button type="button" onClick={() => removeNonTaxable(index)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                            <FiTrash className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Special Taxes Section */}
            {(specialTaxFields || []).length > 0 && (
                <div className="border-t border-slate-200">
                    <h4 className="bg-slate-50/80 border-b border-slate-200 p-1.5 px-2 text-[10px] font-bold text-slate-500 uppercase">Impuestos Especiales</h4>
                    <table className="w-full">
                        <tbody className="divide-y divide-slate-100">
                            {(specialTaxFields || []).map((field, index) => (
                                <tr key={field.id} className="hover:bg-slate-50/50">
                                    <td className="p-1.5 w-full text-xs text-slate-600 pl-2">
                                        {field.description} <span className="text-[10px] text-slate-400 uppercase tracking-wide ml-1">({field.type})</span>
                                    </td>
                                    <td className="p-1.5 text-xs font-mono font-medium text-slate-800 whitespace-nowrap text-right pr-4">
                                        $ {field.amount.toFixed(2)}
                                    </td>
                                    <td className="p-1 text-center w-10">
                                        <button type="button" onClick={() => removeSpecialTax(index)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                            <FiTrash className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
