import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { FiType, FiHash, FiCalendar, FiAlignLeft, FiAlertCircle } from "react-icons/fi";
import type { DynamicField } from "../../../types/react.hook.form";

interface FormStandardGridProps {
    schema: DynamicField[];
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
}

export const FormStandardGrid = ({ schema, register, errors }: FormStandardGridProps) => {

    const getIcon = (type: string, hasError: boolean) => {
        const iconClass = hasError ? "text-red-600" : "text-slate-500 group-focus-within:text-gray-800";
        const size = 18;

        switch (type) {
            case 'number': return <FiHash size={size} className={iconClass} />;
            case 'date': return <FiCalendar size={size} className={iconClass} />;
            case 'large-text': return <FiAlignLeft size={size} className={iconClass} />;
            default: return <FiType size={size} className={iconClass} />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {schema.map((field) => {
                const isLargeText = field.type === 'large-text';
                const hasError = !!errors[field.keyName];

                return (
                    <div
                        key={field.id}
                        className={`flex flex-col gap-2 group ${isLargeText ? 'md:col-span-2' : ''}`}
                    >
                        {/* Label Bar - Modern & Clean */}
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[15px] font-black uppercase tracking-[0.2em] text-gray-800 flex items-center gap-2.5">
                                <div className={`w-1.5 h-3.5 rounded-md ${hasError ? 'bg-red-600' : 'bg-gray-300 group-focus-within:bg-gray-800'}`} />
                                {field.keyName}
                            </label>

                            {hasError ? (
                                <span className="flex items-center gap-1 text-[9px] font-bold text-red-600 uppercase tracking-tight">
                                    <FiAlertCircle size={12} />
                                    Requerido
                                </span>
                            ) : (
                                field.required && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Obligatorio</span>
                            )}
                        </div>

                        {/* Input Container - Premium Rounded */}
                        <div className="relative flex items-center">
                            <div className="absolute left-4 z-10 flex items-center justify-center">
                                {getIcon(field.type, hasError)}
                            </div>

                            {isLargeText ? (
                                <textarea
                                    {...register(field.keyName, { required: field.required })}
                                    className={`
                                        w-full pl-12 pr-5 py-4 min-h-[140px] 
                                        text-sm font-black text-gray-800 
                                        placeholder:text-slate-400 placeholder:font-bold
                                        transition-all duration-200 outline-none resize-none
                                        border-2 rounded-md shadow-sm
                                        ${hasError
                                            ? 'bg-red-50/50 border-red-600 focus:border-red-700 focus:ring-4 focus:ring-red-100'
                                            : 'bg-white border-slate-400 hover:border-slate-600 focus:border-gray-800 focus:ring-4 focus:ring-slate-100'
                                        }
                                    `}
                                    placeholder={`Ingrese ${field.keyName.toLowerCase()}...`}
                                />
                            ) : (
                                <input
                                    type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                    {...register(field.keyName, { required: field.required })}
                                    className={`
                                        w-full h-14 pl-12 pr-5 
                                        text-sm font-black text-gray-800
                                        placeholder:text-slate-400 placeholder:font-bold
                                        transition-all duration-200 outline-none
                                        border-2 rounded-md shadow-sm
                                        ${hasError
                                            ? 'bg-red-50/50 border-red-600 focus:border-red-700 focus:ring-4 focus:ring-red-100'
                                            : 'bg-white border-slate-400 hover:border-slate-600 focus:border-gray-800 focus:ring-4 focus:ring-slate-100'
                                        }
                                    `}
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
