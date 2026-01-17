import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiSave, FiX, FiInfo, FiBox, FiArrowRight } from "react-icons/fi";
import { useProductStore } from "../../../store/product.schema.zod";
import { FormStandardGrid } from "./FormStandardGrid";
import { TransfersForm } from "./forms/TransfersForm";

interface DynamicProductFormProps {
    schema: any[];
    activeTab?: string;
    onSuccess: () => void;
    initialData?: any;
}

export const DynamicProductForm = ({ schema, activeTab, onSuccess, initialData }: DynamicProductFormProps) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isDirty } } = useForm({
        defaultValues: initialData || {}
    });

    const { addProduct, updateProduct } = useProductStore();

    useEffect(() => {
        reset(initialData || {});
    }, [initialData, reset]);

    const onSubmit = (data: any) => {
        const timestamp = new Date().toISOString();
        if (initialData) {
            updateProduct(initialData.id, { ...data, updatedAt: timestamp });
        } else {
            addProduct({
                ...data,
                id: crypto.randomUUID(),
                type: activeTab,
                createdAt: timestamp
            });
        }
        reset();
        onSuccess();
    };

    const inputClasses = "w-full bg-gray-50 border border-slate-300 rounded-sm px-4 py-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-brand-quaternary focus:border-brand-quaternary outline-none transition-placeholder transition-colors duration-200 shadow-sm appearance-none disabled:bg-gray-200 disabled:cursor-not-allowed";
    const labelClasses = "block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide";

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            /* h-full para ocupar todo el alto y flex-col para separar secciones */
            className="bg-white border border-slate-200 shadow-xl overflow-hidden w-full h-full flex flex-col mx-auto"
        >
            {/* Header Profesional - flex-none para que no se encoja */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex-none">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-primary text-white rounded">
                            <FiBox size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                {initialData ? 'Edición de Registro' : 'Nuevo Registro de Inventario'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Complete los campos técnicos para la gestión del stock.
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Módulo: {activeTab?.toUpperCase() || 'GENERAL'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Contenido con Scroll - flex-1 para tomar el espacio sobrante */}
            <div className="p-4 space-y-10 overflow-y-auto flex-1 custom-scrollbar">
                {/* 1. Sección de Logística (Condicional) */}
                {activeTab === 'traslados' && (
                    <TransfersForm labelClasses={labelClasses} inputClasses={inputClasses} register={register} setValue={setValue} productSchema={schema} />
                )}

                {/* 2. Sección de Especificaciones del Producto (Solo si no es traslados) */}
                {activeTab !== 'traslados' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <FiInfo className="text-brand-quaternary" />
                            <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider">Detalles Técnicos del Producto</h3>
                        </div>
                        <FormStandardGrid schema={schema} register={register} errors={errors} watch={watch} />
                    </div>
                )}

                {/* Nota Informativa */}
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FiInfo className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs text-amber-800">
                                Asegúrese de que los números de serie o códigos de barras coincidan con la etiqueta física del producto.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer de Acciones - flex-none para quedar fijo abajo */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between flex-none">
                <button
                    type="button"
                    onClick={onSuccess}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded transition-colors"
                >
                    <FiX size={18} />
                    Cancelar operación
                </button>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={!isDirty && initialData}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSave size={18} />
                        {initialData ? 'ACTUALIZAR REGISTRO' : 'CONFIRMAR Y GUARDAR'}
                        {!initialData && <FiArrowRight size={16} />}
                    </button>
                </div>
            </div>
        </form>
    );
};