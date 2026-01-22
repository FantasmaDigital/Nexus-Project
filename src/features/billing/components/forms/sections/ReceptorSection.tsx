import { useState, useMemo, useEffect } from "react";
import type { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { useClientStore, type Client } from "../../../../../store/product.schema.zod";
import { FiSearch, FiUser, FiFileText, FiMapPin, FiShoppingCart, FiBriefcase, FiGlobe, FiEdit3, FiFlag } from "react-icons/fi";
import { AddClientModal } from "../../AddClientModal";
import type { Invoice } from "../../../../../types/billing";
import { CustomSelect, type SelectOption } from "../../../../../components/ui/CustomSelect";
import { UniqueDocumentType } from "../../../enums/payment.enum";
import { ESDepartmentsData } from "../../../constants/es.departments";

interface ReceptorSectionProps {
    register: UseFormRegister<Invoice>;
    errors: FieldErrors<Invoice>;
    setValue: (name: any, value: any) => void;
    watch: UseFormWatch<Invoice>;
}

const FormField = ({ label, children, className = "" }: { label: string, children: React.ReactNode, className?: string }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        {children}
    </div>
);

const inputStyles = "w-full h-[38px] bg-white border border-slate-300 px-3 text-sm outline-none focus:border-brand-quaternary transition-all rounded-none";

export const ReceptorSection = ({ register, errors, setValue, watch }: ReceptorSectionProps) => {
    const [isClientModalOpen, setClientModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const invoiceType = watch("invoiceType");
    const sellerName = watch("sellerName");
    const clientDocType = watch("client.documentType");
    const clientDept = watch("client.department");
    const clientMun = watch("client.municipality");

    // Select only clients to avoid re-rendering on other store changes
    const clients = useClientStore(state => state.clients);

    const currentDocInfo = useMemo(() => {
        return Object.values(UniqueDocumentType).find(doc => doc.name === clientDocType) || UniqueDocumentType.DUI;
    }, [clientDocType]);

    // Sync default value when doc type changes
    useEffect(() => {
        const currentDocNumber = watch("client.documentNumber");
        const isDefaultValue = Object.values(UniqueDocumentType).some(doc => doc.defaultValue === currentDocNumber);
        const isEmpty = !currentDocNumber || currentDocNumber.trim() === "";

        if (isDefaultValue || isEmpty) {
            setValue("client.documentNumber", currentDocInfo.defaultValue);
        }
    }, [clientDocType, setValue, watch, currentDocInfo]);

    // Force default municipality if it's 'San Salvador' but empty
    useEffect(() => {
        if (clientDept === "San Salvador" && (!clientMun || clientMun === "")) {
            setValue("client.municipality", "San Salvador Centro" as any);
        }
    }, [clientDept, clientMun, setValue]);

    const filteredClients = useMemo(() => {
        const cleanSearch = searchTerm.toLowerCase().trim();
        if (cleanSearch.length < 2) return [];

        const searchDocOnly = cleanSearch.replace(/[^a-z0-9]/g, '');

        return clients.filter(c => {
            const clientName = (c.name || '').toLowerCase();
            const clientDoc = (c.documentNumber || '').toLowerCase();
            const clientDocClean = clientDoc.replace(/[^a-z0-9]/g, '');

            return clientName.includes(cleanSearch) ||
                clientDoc.includes(cleanSearch) ||
                (searchDocOnly.length > 0 && clientDocClean.includes(searchDocOnly));
        }).slice(0, 5);
    }, [searchTerm, clients]);

    const handleSelectClient = (client: Client) => {
        setValue("client.name", client.name);
        setValue("client.documentNumber", client.documentNumber);
        setValue("client.documentType", client.documentType);
        setValue("client.email", client.email);
        setValue("client.phone", client.phone || "");
        setValue("client.address", client.address || "");
        setValue("client.department", client.department);
        setValue("client.municipality", client.municipality);
        setValue("client.isExempt", !!client.isExempt);
        setValue("client.isRetentionSubject", !!client.isRetentionSubject);
        setValue("client.isExportClient", !!client.isExportClient);
        setValue("client.isGovernmentNoSubject", !!client.isGovernmentNoSubject);
        if (client.nrc) setValue("client.nrc", client.nrc);
        if (client.tradeName) setValue("client.tradeName", client.tradeName);
        if (client.economicActivity) setValue("client.economicActivity", client.economicActivity);

        setSearchTerm("");
    };

    const invoiceTypeOptions: SelectOption[] = [
        { id: '01', label: 'Factura (C. Final)', icon: FiShoppingCart, desc: 'Consumidor Final / Ticket' },
        { id: '03', label: 'Crédito Fiscal', icon: FiBriefcase, desc: 'Contribuyente / IVA Crédito' },
        { id: '11', label: 'Factura de Exportación', icon: FiGlobe, desc: 'Servicios o Bienes Exterior' },
        { id: '14', label: 'Sujeto Excluido', icon: FiEdit3, desc: 'Servicios Profesionales' },
    ];

    const sellerOptions: SelectOption[] = [
        { id: 'JONATHAN HERNANDEZ', label: 'Jonathan Hernández', icon: FiUser, desc: 'Vendedor Senior' },
        { id: 'VENDEDOR 2', label: 'Vendedor 2', icon: FiUser, desc: 'Ejecutivo de Ventas' },
        { id: 'MOSTRADOR', label: 'Mostrador', icon: FiUser, desc: 'Atención al Cliente' },
    ];

    const docTypeOptions: SelectOption[] = Object.values(UniqueDocumentType).map(doc => ({
        id: doc.name,
        label: doc.name,
        icon: doc.icon,
        desc: doc.desc
    }));

    const deptOptions: SelectOption[] = [
        { id: '', label: 'Seleccionar...', icon: FiMapPin, desc: 'Elegir Departamento' },
        ...Object.keys(ESDepartmentsData).map(dep => ({
            id: dep,
            label: dep.toUpperCase(),
            icon: FiMapPin,
            desc: 'Departamento de El Salvador'
        }))
    ];

    const munOptions: SelectOption[] = useMemo(() => {
        const muns = clientDept ? ESDepartmentsData[clientDept as keyof typeof ESDepartmentsData] || [] : [];
        return [
            { id: '', label: 'Seleccionar...', icon: FiMapPin, desc: 'Elegir Municipio' },
            ...muns.map(mun => ({
                id: mun,
                label: mun.toUpperCase(),
                icon: FiFlag,
                desc: 'Municipio / Ciudad'
            }))
        ];
    }, [clientDept]);

    return (
        <>
            <div className="bg-white border border-slate-300 mb-4 shadow-sm">
                <div className="bg-slate-800 p-2 flex items-center gap-2">
                    <FiUser className="text-white text-xs" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Información del Receptor del Documento</h3>
                </div>
                <div className="flex flex-row justify-between items-center bg-slate-50 border-b border-slate-200 p-2">
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                                <input
                                    type="text"
                                    placeholder="BUSCAR CLIENTE POR NOMBRE O DOCUMENTO..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-3 h-[38px] bg-white border border-slate-300 text-[10px] w-full outline-none focus:border-brand-quaternary transition-all font-bold placeholder:font-normal rounded-none shadow-sm"
                                />
                            </div>

                            {filteredClients.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-2xl z-50 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {filteredClients.map((client: Client) => (
                                        <button
                                            key={client.id}
                                            type="button"
                                            onClick={() => handleSelectClient(client)}
                                            className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex items-center gap-4 transition-colors"
                                        >
                                            <div className="bg-slate-100 p-2 border border-slate-200">
                                                <FiUser className="text-slate-500 text-xs" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-800 uppercase leading-none mb-1">{client.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] bg-slate-200 px-1 font-bold text-slate-600">{client.documentType}</span>
                                                    <span className="text-[9px] text-slate-500 font-mono">{client.documentNumber}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {searchTerm.trim().length >= 2 && filteredClients.length === 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-2xl z-50 mt-1 p-4 text-center animate-in fade-in duration-200">
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Sin resultados coincidentes</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setClientModalOpen(true)}
                            className="bg-brand-quaternary text-white px-4 h-[38px] text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-brand-quaternary/90 transition-all shadow-md active:scale-95"
                        >
                            Añadir Cliente
                        </button>
                    </div>
                </div>

                <div className="p-4 flex flex-col gap-6">
                    {/* First Row: Selects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomSelect
                            label="Tipo de Documento"
                            value={invoiceType}
                            options={invoiceTypeOptions}
                            onSelect={(id) => setValue("invoiceType", id as any)}
                            icon={FiFileText}
                            selectClassName="h-[38px]"
                        />

                        <CustomSelect
                            label="Vendedor"
                            value={sellerName || ""}
                            options={sellerOptions}
                            onSelect={(id) => setValue("sellerName", id as any)}
                            icon={FiUser}
                            selectClassName="h-[38px]"
                        />
                    </div>

                    {/* Second Row: Main Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <FormField label="Nombre o Razón Social" className="lg:col-span-3">
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                                <input {...register("client.name", { required: "Campo obligatorio" })} className={`${inputStyles} pl-8`} placeholder="NOMBRE COMPLETO / EMPRESA..." />
                            </div>
                            {errors.client?.name && <span className="text-red-500 text-[10px] font-bold">{errors.client.name.message}</span>}
                        </FormField>

                        <FormField label="Correo Electrónico" className="lg:col-span-2">
                            <input {...register("client.email")} className={inputStyles} type="email" placeholder="CORREO@EJEMPLO.COM" />
                        </FormField>
                    </div>

                    {/* Third Row: Document & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CustomSelect
                            label="Tipo Doc Receptor"
                            value={clientDocType}
                            options={docTypeOptions}
                            onSelect={(id) => setValue("client.documentType", id as any)}
                            icon={FiFileText}
                            selectClassName="h-[38px]"
                        />

                        <FormField label="N° Documento">
                            <input {...register("client.documentNumber")} className={inputStyles} placeholder={currentDocInfo.defaultValue} />
                        </FormField>

                        <FormField label="Teléfono">
                            <input {...register("client.phone")} className={inputStyles} placeholder="+503 2222-0000" />
                        </FormField>
                    </div>

                    {/* Fourth Row: Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-1">
                            <CustomSelect
                                label="Departamento"
                                value={clientDept || ''}
                                options={deptOptions}
                                onSelect={(id) => {
                                    setValue("client.department", id);
                                    if (id !== clientDept) {
                                        setValue("client.municipality", "");
                                    }
                                }}
                                icon={FiMapPin}
                                selectClassName="h-[38px]"
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <CustomSelect
                                label="Municipio"
                                value={clientMun || (clientDept === "San Salvador" ? "San Salvador Centro" : "")}
                                options={munOptions}
                                onSelect={(id) => setValue("client.municipality", id as any)}
                                icon={FiMapPin}
                                selectClassName="h-[38px]"
                            />
                        </div>

                        <FormField label="Dirección de Facturación" className="lg:col-span-3">
                            <input {...register("client.address")} className={inputStyles} placeholder="DIRECCIÓN COMPLETA..." />
                        </FormField>
                    </div>
                </div>

            </div>
            {isClientModalOpen && <AddClientModal
                onClose={() => setClientModalOpen(false)}
                onSuccess={handleSelectClient}
            />}
        </>
    );
};