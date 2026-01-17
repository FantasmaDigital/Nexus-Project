import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiType, FiHash, FiCalendar, FiSave, FiSettings, FiLayout, FiImage, FiCheckSquare, FiDollarSign, FiPercent } from "react-icons/fi";
import { useInventoryStore } from "../../../store/product.schema.zod";
import { saveSchema } from "../../../utils/zod.crud";
import type { DynamicField } from "../../../types/react.hook.form";

interface SchemaEditorProps {
    onClose: () => void;
}

export const SchemaEditor = ({ onClose }: SchemaEditorProps) => {
    const { schema } = useInventoryStore();
    const [fields, setFields] = useState<DynamicField[]>([]);

    useEffect(() => {
        const mandatoryFields: Partial<DynamicField>[] = [
            { keyName: "SKU", type: "text", required: true },
            { keyName: "Nombre", type: "text", required: true },
            { keyName: "Stock", type: "number", required: true },
            { keyName: "Precio", type: "price", required: true },
            { keyName: "Descuento", type: "discount", required: true },
            { keyName: "Bodega", type: "text", required: true },
        ];

        if (schema && schema.length > 0) {
            // Unir esquema existente con campos obligatorios faltantes
            const mergedFields: DynamicField[] = [...schema.map((s, index) => {
                const isMandatory = mandatoryFields.find(m =>
                    m.keyName?.toLowerCase().trim() === s.keyName?.toLowerCase().trim()
                );

                return {
                    id: (index + 1).toString(),
                    keyName: isMandatory ? isMandatory.keyName! : s.keyName, // Normalizar nombre si es mandatorio
                    type: isMandatory ? isMandatory.type as any : s.type as any, // Asegurar tipo correcto
                    required: !!isMandatory
                };
            })];

            // Agregar campos obligatorios que no estén en el esquema
            mandatoryFields.forEach((m, idx) => {
                const alreadyExists = mergedFields.some(f =>
                    f.keyName.toLowerCase().trim() === m.keyName?.toLowerCase().trim()
                );

                if (!alreadyExists) {
                    mergedFields.push({
                        id: `mandatory-${idx}-${Date.now()}`,
                        keyName: m.keyName!,
                        type: m.type as any,
                        required: true
                    });
                }
            });

            setFields(mergedFields);
        } else {
            setFields(mandatoryFields.map((m, index) => ({
                id: (index + 1).toString(),
                keyName: m.keyName!,
                type: m.type as any,
                required: true
            })));
        }
    }, [schema]);

    const addField = () => {
        setFields([...fields, { id: Date.now().toString(), keyName: "", type: "text" }]);
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const updateField = (id: string, updatedData: Partial<DynamicField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updatedData } : f));
    };

    const handleSaveSchema = () => {
        saveSchema(fields);
        onClose();
    };

    return (
        <div className="bg-white flex flex-col h-full overflow-hidden animate-in fade-in duration-500">
            {/* Obsidian Header - Extreme Contrast */}
            <div className="flex justify-between items-end border-b-2 border-slate-400 pb-6 mb-5 shrink-0">
                <div className="flex flex-col gap-1.5">
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3 tracking-tight leading-none">
                        <FiSettings className="text-blue-500" /> Estructura de Catálogo
                    </h2>
                    <p className="text-xs text-slate-700 font-bold uppercase tracking-wide mt-1.5">
                        Defina los atributos técnicos y validaciones del sistema nuclear.
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                <div className="space-y-4 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field) => (
                        <div key={field.id} className="flex flex-col md:flex-row items-stretch md:items-center gap-2 bg-white p-2 rounded-md border-2 border-slate-400 transition-all hover:border-gray-800 group shadow-md hover:shadow-lg">
                            {/* Type Icon Container - Obsidian */}
                            <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center text-white shadow-sm shrink-0 border border-slate-700">
                                {field.type === 'text' && <FiType size={20} />}
                                {field.type === 'number' && <FiHash size={20} />}
                                {field.type === 'date' && <FiCalendar size={20} />}
                                {field.type === 'large-text' && <FiLayout size={20} />}
                                {field.type === 'image' && <FiImage size={20} />}
                                {field.type === 'boolean' && <FiCheckSquare size={20} />}
                                {field.type === 'price' && <FiDollarSign size={20} />}
                                {field.type === 'discount' && <FiPercent size={20} />}
                            </div>

                            {/* Field Name Input */}
                            <div className="flex-1 space-y-2">
                                <label className="block text-[10px] font-black text-gray-800 uppercase tracking-[0.15em] ml-1">Identificador Único</label>
                                <input
                                    type="text"
                                    placeholder="Nombre del campo..."
                                    value={field.keyName}
                                    onChange={(e) => updateField(field.id, { keyName: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-md px-4 py-3 text-sm font-black text-gray-800 focus:bg-white focus:border-gray-800 outline-none transition-all placeholder:text-slate-400 disabled:opacity-50"
                                    required={field.required}
                                    disabled={field.required}
                                />
                            </div>

                            {/* Type Selector Section */}
                            <div className="shrink-0 flex items-end gap-2">
                                <div className="hidden md:block h-12 w-[2px] bg-slate-200" />
                                <div className="flex flex-col gap-2 flex-1 md:flex-none">
                                    <label className="block text-[10px] font-black text-gray-800 uppercase tracking-[0.15em] ml-1">Tipo de Dato</label>
                                    <select
                                        value={field.type}
                                        onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                        className="bg-white border-2 border-slate-300 rounded-md px-4 py-3 text-xs font-black text-gray-800 outline-none cursor-pointer hover:border-gray-800 transition-all shadow-sm focus:border-gray-800"
                                    >
                                        <option value="text">ALFANUMÉRICO (TEXT)</option>
                                        <option value="number">NUMÉRICO (INT/FLOAT)</option>
                                        <option value="date">TEMPORAL (DATE/TIME)</option>
                                        <option value="large-text">BLOQUE EXTENSO (CONTENT)</option>
                                        <option value="image">URL IMAGEN (IMAGE)</option>
                                        <option value="boolean">DECISIÓN (SÍ/NO)</option>
                                        <option value="price">MONTO ECONÓMICO (PRECIO)</option>
                                        <option value="discount">REDUCCIÓN (%)</option>
                                    </select>
                                </div>

                                {/* Remove Action - Framed */}
                                {!field.required ? (
                                    <button
                                        onClick={() => removeField(field.id)}
                                        className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-red-700 hover:bg-red-50 hover:border-red-200 border-2 border-slate-200 rounded-md transition-all active:scale-95 shadow-sm"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                ) : (
                                    <div className="w-12 h-12 flex items-center justify-center text-slate-300 bg-slate-50 rounded-md border-2 border-slate-100 italic" title="Campo Obligatorio - Protegido por Sistema">
                                        <FiSave size={16} className="opacity-40" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Field Button - Obsidian Frame */}
                <button
                    onClick={addField}
                    className="w-full py-6 mt-4 border-2 border-dashed border-slate-400 rounded-md text-gray-800 font-black text-[11px] uppercase tracking-[0.25em] hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all flex items-center justify-center gap-4 group"
                >
                    <div className="w-6 h-6 rounded-md bg-gray-800 text-white flex items-center justify-center group-hover:bg-white group-hover:text-gray-800 transition-colors">
                        <FiPlus size={14} />
                    </div>
                    ANEXAR NUEVA PROPIEDAD TÉCNICA
                </button>
            </div>

            {/* Extreme Contrast Actions */}
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-800 flex items-center gap-2.5 justify-between mt-5">
                <button
                    onClick={onClose}
                    className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border-2 border-slate-300 transition-all active:scale-95 shadow-sm"
                >
                    CANCELAR
                </button>
                <button
                    onClick={handleSaveSchema}
                    className="flex items-center gap-4 bg-gray-800 hover:bg-black text-white px-6 py-4 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-[0.98] border border-gray-800"
                >
                    <FiSave className="text-blue-500" size={18} />
                    SINCRONIZAR ESQUEMA
                </button>
            </div>
        </div>
    );
};
