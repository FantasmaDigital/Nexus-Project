// src/features/billing/components/AddClientModal.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FiX, FiUser, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
import { addClientSchema, type AddClientSchema } from './add-client.schema';
import { useClientStore, type Client } from '../../../store/product.schema.zod';
import { useState } from 'react';

interface AddClientModalProps {
    onClose: () => void;
    onSuccess?: (client: Client) => void;
}

const FormField = ({ label, children, className = "", error }: { label: string, children: React.ReactNode, className?: string, error?: string }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        {children}
        {error && <span className="text-[10px] text-red-500 font-medium flex items-center gap-1"><FiAlertCircle className="w-3 h-3" /> {error}</span>}
    </div>
);

const inputStyles = "w-full bg-white border border-slate-300 py-2 px-3 text-sm outline-none focus:border-brand-quaternary transition-all rounded-none placeholder:text-slate-400";
const checkboxStyles = "h-4 w-4 rounded-none text-brand-quaternary focus:ring-brand-quaternary border-slate-300 cursor-pointer";

const TabButton = ({ isActive, onClick, icon: Icon, label }: { isActive: boolean, onClick: () => void, icon: React.ElementType, label: string }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase transition-all border-b-2 ${isActive ? 'bg-slate-50 border-brand-quaternary text-brand-quaternary' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
    >
        <Icon className="h-4 w-4" />
        {label}
    </button>
)

export const AddClientModal = ({ onClose, onSuccess }: AddClientModalProps) => {
    const { addClient } = useClientStore();
    const [clientType, setClientType] = useState<AddClientSchema['clientType']>('person');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<AddClientSchema>({
        resolver: zodResolver(addClientSchema),
        defaultValues: {
            clientType: 'person',
            documentType: 'DUI',
            name: '',
            email: '',
            documentNumber: '',
            phone: '+503 0000-0000',
            department: 'San Salvador',
            municipality: 'San Salvador',
            address: '',
            tradeName: '',
            nrc: '',
            economicActivity: '',
            isExempt: false,
            isRetentionSubject: false,
            isExportClient: false,
            isGovernmentNoSubject: false
        }
    });

    const onSubmit = async (data: AddClientSchema) => {
        setIsSubmitting(true);

        try {
            console.log("Saving client data to store:", data);
            const newClient = addClient(data);
            console.log("Client registered successfully:", newClient);
            if (onSuccess) onSuccess(newClient);
            onClose();
        } catch (error) {
            console.error("Error registering client:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const departments = ["San Salvador", "La Libertad", "Santa Ana", "San Miguel", "Sonsonate", "Usulután", "Ahuachapán", "La Paz", "Cabañas", "Cuscatlán", "Morazán", "San Vicente", "Chalatenango", "La Unión"];
    const municipalities = ["San Salvador", "Santa Tecla", "Antiguo Cuscatlán", "Soyapango", "Mejicanos", "Santa Ana", "San Miguel"];

    const handleTabChange = (type: AddClientSchema['clientType']) => {
        setClientType(type);
        setValue('clientType', type);
        // Set default document type based on tab
        if (type === 'company') setValue('documentType', 'NIT');
        else setValue('documentType', 'DUI');
    }

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-end">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col rounded-none animate-in slide-in-from-right duration-300">
                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 bg-white">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Gestión Express de Clientes</h2>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nexus ERP Billing System</span>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-none transition-colors border border-slate-200">
                        <FiX className="text-slate-600" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <TabButton isActive={clientType === 'person'} onClick={() => handleTabChange('person')} icon={FiUser} label="Persona Natural" />
                    <TabButton isActive={clientType === 'company'} onClick={() => handleTabChange('company')} icon={FiBriefcase} label="Empresa / Contribuyente" />
                </div>

                {/* Body Content - NOT A FORM TAG anymore to prevent URL submission */}
                <div className="flex-grow flex flex-col overflow-hidden bg-white">
                    <div className="flex-grow overflow-y-auto p-6 space-y-6">

                        {/* Section: Identity */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-4 w-1 bg-brand-quaternary"></div>
                                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Identificación y Datos Base</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Tipo Documento" error={errors.documentType?.message}>
                                    <select {...register("documentType")} className={inputStyles}>
                                        <option value="DUI">DUI</option>
                                        <option value="NIT">NIT</option>
                                        <option value="PASAPORTE">PASAPORTE</option>
                                        <option value="OTRO">OTRO</option>
                                    </select>
                                </FormField>
                                <FormField label="No. de Documento" error={errors.documentNumber?.message}>
                                    <input {...register("documentNumber")} className={inputStyles} placeholder="00000000-0" />
                                </FormField>
                            </div>

                            <FormField label={clientType === 'person' ? "Nombre Completo" : "Razón Social"} error={errors.name?.message}>
                                <input {...register("name")} className={inputStyles} placeholder={clientType === 'person' ? "NOMBRE DEL CLIENTE..." : "RAZÓN SOCIAL DE LA EMPRESA..."} />
                            </FormField>

                            {clientType === 'company' && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <FormField label="Nombre Comercial">
                                        <input {...register("tradeName")} className={inputStyles} placeholder="NOMBRE COMERCIAL..." />
                                    </FormField>
                                    <FormField label="NRC (Registro Fiscal)">
                                        <input {...register("nrc")} className={inputStyles} placeholder="000000-0" />
                                    </FormField>
                                    <FormField label="Giro / Actividad" className="col-span-2">
                                        <input {...register("economicActivity")} className={inputStyles} placeholder="BUSCAR ACTIVIDAD ECONÓMICA..." />
                                    </FormField>
                                </div>
                            )}
                        </div>

                        {/* Section: Contact */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-4 w-1 bg-brand-quaternary"></div>
                                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Contacto y Ubicación</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Correo Electrónico" error={errors.email?.message}>
                                    <input {...register("email")} className={inputStyles} type="email" placeholder="cliente@empresa.com" />
                                </FormField>
                                <FormField label="Teléfono (Movil/Fijo)" error={errors.phone?.message}>
                                    <input {...register("phone")} className={inputStyles} placeholder="+503 2222-0000" />
                                </FormField>
                                <FormField label="Departamento" error={errors.department?.message}>
                                    <select {...register("department")} className={inputStyles}>
                                        <option value="">SELECCIONAR...</option>
                                        {departments.map(dep => <option key={dep} value={dep}>{dep.toUpperCase()}</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Municipio" error={errors.municipality?.message}>
                                    <select {...register("municipality")} className={inputStyles}>
                                        <option value="">SELECCIONAR...</option>
                                        {municipalities.map(mun => <option key={mun} value={mun}>{mun.toUpperCase()}</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Dirección Detallada" className="col-span-2">
                                    <textarea {...register("address")} className={`${inputStyles} h-20 resize-none`} placeholder="CALLE, NÚMERO DE CASA, PUNTO DE REFERENCIA..." />
                                </FormField>
                            </div>
                        </div>

                        {/* Section: Fiscal Config */}
                        <div className="bg-slate-50 p-4 border border-slate-200 space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-4 w-1 bg-brand-quaternary"></div>
                                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Configuración Fiscal de Hacienda</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <label className="flex items-center gap-3 p-2 bg-white border border-slate-200 cursor-pointer hover:border-brand-quaternary/50 transition-colors">
                                    <input type="checkbox" {...register("isExempt")} className={checkboxStyles} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">Exento Impuestos</span>
                                </label>
                                <label className="flex items-center gap-3 p-2 bg-white border border-slate-200 cursor-pointer hover:border-brand-quaternary/50 transition-colors">
                                    <input type="checkbox" {...register("isRetentionSubject")} className={checkboxStyles} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">Sujeto Retención</span>
                                </label>
                                <label className="flex items-center gap-3 p-2 bg-white border border-slate-200 cursor-pointer hover:border-brand-quaternary/50 transition-colors">
                                    <input type="checkbox" {...register("isExportClient")} className={checkboxStyles} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">Exportación</span>
                                </label>
                                <label className="flex items-center gap-3 p-2 bg-white border border-slate-200 cursor-pointer hover:border-brand-quaternary/50 transition-colors">
                                    <input type="checkbox" {...register("isGovernmentNoSubject")} className={checkboxStyles} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">Gobierno / Otros</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-5 border-t border-slate-200 bg-white grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-3 text-xs font-bold text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-none transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="bg-brand-quaternary text-white px-4 py-3 text-xs font-black uppercase tracking-widest rounded-none hover:bg-brand-quaternary/90 transition-all shadow-lg active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    REGISTRANDO...
                                </>
                            ) : (
                                "Registrar Cliente"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};