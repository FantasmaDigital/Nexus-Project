import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiPackage, FiMapPin, FiArrowRight, FiInfo, FiTag, FiHash, FiCalendar, FiType } from "react-icons/fi";
import { useProductStore } from "../../../store/product.schema.zod";

interface DynamicProductFormProps {
    schema: any[];
    activeTab?: string;
    onSuccess: () => void;
    initialData?: any;
}

export const DynamicProductForm = ({ schema, activeTab, onSuccess, initialData }: DynamicProductFormProps) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: initialData || {}
    });

    const { addProduct, updateProduct } = useProductStore();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({});
        }
    }, [initialData, reset]);

    const onSubmit = (data: any) => {
        if (initialData) {
            updateProduct(initialData.id, {
                ...data,
                updatedAt: new Date().toLocaleString('es-ES')
            });
        } else {
            const newProduct = {
                ...data,
                id: crypto.randomUUID(),
                type: activeTab,
                date: new Date().toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            addProduct(newProduct);
        }
        reset();
        onSuccess();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'number': return <FiHash className="text-slate-400" />;
            case 'date': return <FiCalendar className="text-slate-400" />;
            default: return <FiType className="text-slate-400" />;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-1">
            {/* Header Section */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-2">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
                    <FiPackage size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {initialData ? 'Actualización de Registro' : 'Datos del Movimiento'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium lowercase first-letter:uppercase">
                        Complete los campos para el registro de {activeTab || 'inventario'}
                    </p>
                </div>
            </div>

            {/* Transfer-Specific Fields */}
            {activeTab === 'traslados' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                        <FiMapPin size={40} className="rotate-12" />
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-xs font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            Bodega Origen
                        </label>
                        <select
                            {...register("sourceWarehouse", { required: activeTab === 'traslados' })}
                            className="bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="">Seleccionar Origen...</option>
                            <option value="B-01">Bodega Central (B-01)</option>
                            <option value="B-02">Sucursal Norte (B-02)</option>
                            <option value="B-03">Punto de Venta (B-03)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-xs font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Bodega Destino
                        </label>
                        <select
                            {...register("targetWarehouse", { required: activeTab === 'traslados' })}
                            className="bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="">Seleccionar Destino...</option>
                            <option value="B-01">Bodega Central (B-01)</option>
                            <option value="B-02">Sucursal Norte (B-02)</option>
                            <option value="B-04">Bodega Externa (B-04)</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Dynamic Fields Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                    <FiTag size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Atributos del Esquema</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {schema.map((field) => (
                        <div key={field.id} className="flex flex-col gap-2 group">
                            <label className="text-xs font-bold text-slate-500 transition-colors group-focus-within:text-blue-600 flex justify-between">
                                {field.keyName}
                                {field.required && <span className="text-red-400 opacity-50">* obligatorio</span>}
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 pointer-events-none transition-colors group-focus-within:text-blue-500">
                                    {getIcon(field.type)}
                                </div>
                                <input
                                    type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                    {...register(field.keyName, { required: field.required })}
                                    className={`w-full pl-11 pr-4 py-3 bg-white border ${errors[field.keyName] ? 'border-red-300 bg-red-50/30' : 'border-slate-200'} rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-normal`}
                                    placeholder={`Ej: ${field.keyName === 'SKU' ? 'PROD-1029' : '---'}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Information Alert */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-slate-600">
                <FiInfo className="shrink-0 mt-0.5 text-blue-500" />
                <p className="text-xs leading-relaxed">
                    Asegúrese de que la información sea correcta. Los registros quedan auditados con la fecha y hora actual del sistema.
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                    type="button"
                    onClick={onSuccess}
                    className="flex-1 px-6 py-4 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-95 border border-transparent hover:border-slate-200"
                >
                    Descartar
                </button>
                <button
                    type="submit"
                    className={`flex-[2] flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-slate-200 active:scale-95 text-white ${initialData
                        ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
                        : 'bg-slate-900 hover:bg-black hover:shadow-slate-300'
                        }`}
                >
                    {initialData ? 'Guardar Cambios' : 'Finalizar Registro'}
                    <FiArrowRight />
                </button>
            </div>
        </form>
    );
};