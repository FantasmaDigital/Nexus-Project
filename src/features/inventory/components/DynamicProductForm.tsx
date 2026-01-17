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

    const onSubmit = async (data: any) => {
        // Confirmación antes de procesar
        if (!window.confirm("¿Seguro que desea guardar este registro? Esta acción afectará el inventario.")) {
            return;
        }

        const timestamp = new Date().toISOString();
        const processedData = { ...data };

        // Procesar campos de imagen a Base64
        for (const field of schema) {
            if (field.type === 'image' && processedData[field.keyName] instanceof FileList) {
                const files = processedData[field.keyName] as FileList;
                if (files.length > 0) {
                    try {
                        const { fileToBase64 } = await import("../../../utils/file.utils");
                        processedData[field.keyName] = await fileToBase64(files[0]);
                    } catch (error) {
                        console.error("Error al convertir imagen:", error);
                    }
                } else if (!initialData) {
                    // Si es nuevo y no hay archivo, limpiar
                    processedData[field.keyName] = null;
                } else {
                    // Si es edición y no hay archivo nuevo, mantener el anterior
                    processedData[field.keyName] = initialData[field.keyName];
                }
            }
        }

        if (initialData) {
            updateProduct(initialData.id, { ...processedData, updatedAt: timestamp });
        } else {
            const finalData = {
                ...processedData,
                id: crypto.randomUUID(),
                type: activeTab,
                createdAt: timestamp
            };

            // Inyectar metadatos si es un traslado
            if (activeTab === 'traslados') {
                const now = new Date();
                finalData.shipmentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                finalData.receiptTime = 'Pendiente';
                finalData.status = 'enviado'; // Estado inicial: enviado
            }

            addProduct(finalData);
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
                            <p className="text-sm font-bold text-amber-900 mb-1">
                                Información Importante
                            </p>
                            <p className="text-xs text-amber-800 mb-2">
                                • <strong>Validación:</strong> Asegúrese de que los números de serie o códigos de barras coincidan exactamente con la etiqueta física del producto.
                            </p>
                            <p className="text-xs text-amber-800">
                                • <strong>Flujo de Inventario:</strong> Los productos registrados aquí se sumarán al inventario, pero <strong>no se reflejarán en el apartado de compras</strong>. Para registros estándar de mercancía, utilice el módulo de Compras. Use este apartado solo para artículos especiales o liquidaciones.
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