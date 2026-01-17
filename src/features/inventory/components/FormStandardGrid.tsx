import { useEffect, useState } from "react";
import type { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { FiType, FiHash, FiCalendar, FiAlignLeft, FiAlertCircle, FiImage, FiDollarSign, FiUploadCloud } from "react-icons/fi";
import type { DynamicField } from "../../../types/react.hook.form";

interface FormStandardGridProps {
    schema: DynamicField[];
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    watch: UseFormWatch<any>;
}

// Sub-componente para manejar la previsualización de forma segura
const ImagePreview = ({ file }: { file: File | null }) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!file || !(file instanceof File)) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Limpieza vital: libera la memoria cuando el componente se desmonta o cambia el archivo
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    if (!preview) return null;

    return (
        <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-100 border border-slate-200 rounded-sm overflow-hidden animate-in fade-in zoom-in-95">
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            <div className="absolute top-2 left-2 bg-brand-primary/80 text-white text-[10px] px-2 py-1 font-bold rounded">VISTA PREVIA</div>
        </div>
    );
};

export const FormStandardGrid = ({ schema, register, errors, watch }: FormStandardGridProps) => {

    const getIcon = (type: string, hasError: boolean) => {
        const iconClass = hasError ? "text-red-600" : "text-slate-500 group-focus-within:text-brand-primary";
        const size = 18;

        switch (type) {
            case 'number': return <FiHash size={size} className={iconClass} />;
            case 'currency': return <FiDollarSign size={size} className={iconClass} />;
            case 'date': return <FiCalendar size={size} className={iconClass} />;
            case 'large-text': return <FiAlignLeft size={size} className={iconClass} />;
            case 'image': return <FiImage size={size} className={iconClass} />;
            default: return <FiType size={size} className={iconClass} />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {schema.map((field) => {
                const isLargeText = field.type === 'large-text';
                const isImage = field.type === 'image';
                const hasError = !!errors[field.keyName];

                // Observar el archivo de forma segura
                const watchedFile = isImage ? watch(field.keyName) : null;
                const fileToPreview = (watchedFile && watchedFile[0] instanceof File) ? watchedFile[0] : null;

                return (
                    <div
                        key={field.id || field.keyName} // Prioriza field.id, si no existe usa keyName
                        className={`flex flex-col gap-1.5 group ${isLargeText || isImage ? 'md:col-span-2' : ''}`}
                    >
                        {/* Label Bar */}
                        <div className="flex items-center justify-between px-0.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
                                <div className={`w-1 h-3 ${hasError ? 'bg-red-600' : 'bg-slate-300 group-focus-within:bg-brand-primary'}`} />
                                {field.keyName}
                            </label>

                            {hasError && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase">
                                    <FiAlertCircle size={12} />
                                    Error de validación
                                </span>
                            )}
                        </div>

                        {/* Input Logic */}
                        <div className="relative">
                            {/* Icono (Se oculta si hay archivo cargado en tipo imagen) */}
                            {(!isImage || !fileToPreview) && (
                                <div className="absolute left-3.5 top-[14px] z-10 pointer-events-none">
                                    {getIcon(field.type, hasError)}
                                </div>
                            )}

                            {isLargeText ? (
                                <textarea
                                    {...register(field.keyName, { required: field.required })}
                                    className={`w-full pl-11 pr-4 py-3 min-h-[120px] text-sm font-medium text-slate-900 border rounded-sm outline-none transition-all ${hasError ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-brand-quaternary focus:ring-1 focus:ring-brand-quaternary'
                                        }`}
                                    placeholder={`Describa ${field.keyName.toLowerCase()}...`}
                                />
                            ) : isImage ? (
                                <div className="space-y-3">
                                    <div className={`relative border-2 border-dashed rounded-sm p-4 transition-all ${hasError ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50'
                                        }`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...register(field.keyName, { required: field.required })}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500 py-4">
                                            <FiUploadCloud size={32} />
                                            <p className="text-xs font-bold uppercase tracking-tighter">
                                                {fileToPreview ? 'Imagen seleccionada' : 'Click para subir o arrastrar imagen'}
                                            </p>
                                            <p className="text-[10px] font-medium text-brand-quaternary">
                                                {fileToPreview ? fileToPreview.name : 'Formatos soportados: JPG, PNG (Máx 5MB)'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Renderizado seguro de la previsualización */}
                                    <ImagePreview file={fileToPreview} />
                                </div>
                            ) : (
                                <input
                                    type={field.type === 'number' || field.type === 'currency' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                    step={field.type === 'currency' ? '0.01' : '1'}
                                    {...register(field.keyName, { required: field.required })}
                                    className={`w-full h-11 pl-11 pr-4 text-sm font-medium text-brand-primary border rounded-sm outline-none transition-all ${hasError ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                                        }`}
                                    placeholder={field.type === 'date' ? '' : `Ingrese ${field.keyName.toLowerCase()}...`}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};