import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiMapPin, FiArrowRight, FiInfo, FiLayers, FiActivity, FiChevronDown } from "react-icons/fi";
import { useProductStore } from "../../../store/product.schema.zod";
import { FormStandardGrid } from "./FormStandardGrid";

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
        reset(initialData || {});
    }, [initialData, reset]);

    const onSubmit = (data: any) => {
        const timestamp = new Date().toLocaleString('es-ES');
        if (initialData) {
            updateProduct(initialData.id, { ...data, updatedAt: timestamp });
        } else {
            addProduct({
                ...data,
                id: crypto.randomUUID(),
                type: activeTab,
                date: timestamp
            });
        }
        reset();
        onSuccess();
    };

    // Estilo base para los selectores y campos
    const inputClasses = "w-full bg-white border-2 border-slate-200 rounded-md px-4 py-4 text-base text-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all shadow-sm appearance-none font-medium";
    const labelClasses = "block text-[15px] font-bold text-gray-800 mb-2 ml-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 py-6 animate-in fade-in duration-500">

            {/* Header: Máxima Claridad */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                        <FiLayers size={32} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                            {initialData ? 'Actualizar Información' : 'Nuevo Registro de Inventario'}
                        </h3>
                        <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                            <span className="bg-slate-100 px-3 py-1 rounded-md text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Sector: {activeTab || 'General'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Sección de Traslados: Ancho Completo */}
            {activeTab === 'traslados' && (
                <section className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 md:p-10 transition-all">
                    <div className="flex items-center gap-3 mb-8">
                        <FiMapPin className="text-blue-600" size={24} />
                        <h4 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Configuración de Ruta</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className={labelClasses}>
                                Bodega de Origen <span className="text-blue-600">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    {...register("sourceWarehouse", { required: true })}
                                    className={inputClasses}
                                >
                                    <option value="">Seleccione el punto de partida</option>
                                    <option value="B-01">Bodega Central - Principal</option>
                                    <option value="B-02">Sucursal Zona Norte</option>
                                </select>
                                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className={labelClasses}>
                                Bodega de Destino <span className="text-blue-600">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    {...register("targetWarehouse", { required: true })}
                                    className={inputClasses}
                                >
                                    <option value="">Seleccione el punto de llegada</option>
                                    <option value="B-03">Punto de Venta Directo</option>
                                    <option value="B-04">Almacén de Distribución</option>
                                </select>
                                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Formulario Dinámico: Los campos heredan el nuevo estilo visual */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Especificaciones de Producto</h4>
                    <div className="h-px w-full bg-slate-100" />
                </div>

                <div className="w-full">
                    {/* Asegúrate que FormStandardGrid use estilos similares para sus labels */}
                    <FormStandardGrid schema={schema} register={register} errors={errors} />
                </div>
            </div>

            {/* Panel de Información Mejorado */}
            <div className="flex gap-6 p-6 bg-white border-2 border-blue-50 rounded-2xl shadow-sm">
                <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-50 rounded-md text-blue-600">
                        <FiActivity size={24} />
                    </div>
                </div>
                <div>
                    <p className="text-base font-bold text-gray-800">Confirmación de Registro</p>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                        Verifique que todos los campos técnicos coincidan con la orden física. Al confirmar, el sistema generará una huella digital para la auditoría de stock.
                    </p>
                </div>
            </div>

            {/* Acciones Finales: Botones Grandes y Robustos */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-10 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onSuccess}
                    className="w-full sm:w-auto px-10 py-4 text-[15px] font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                >
                    Descartar cambios
                </button>

                <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-base shadow-2xl shadow-blue-200 transition-all active:scale-95"
                >
                    {initialData ? 'Guardar Actualización' : 'Completar Registro'}
                    <FiArrowRight size={22} />
                </button>
            </div>
        </form>
    );
};