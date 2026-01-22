// src/features/billing/components/forms/CreateInvoiceForm.tsx
import { useForm, useFieldArray } from "react-hook-form";
import type { Invoice, InvoiceItem } from "../../../../types/billing";
import { calculateIVA, calculateGrandTotal } from "../../../../utils/tax.utils";
import { useBillingStore } from "../../../../store/billing.store";
import { useEffect, useState, useMemo } from "react";
import { ReceptorSection } from "./sections/ReceptorSection";
import { ProductSelectorSplit } from "./sections/ProductSelectorSplit";
import { DteItemsTable } from "./sections/DteItemsTable";
import { TotalsSummary } from "./sections/TotalsSummary";
import { ConfirmationModal } from "../../../../shared/components/ConfirmationModal";
import { FiSave, FiRefreshCcw, FiXCircle } from "react-icons/fi";
import { useKeyboardShortcuts } from "../../../../hooks/useKeyboardShortcuts";
import { KEY_COMBOS } from "../../../../utils/keyboardShortcuts";
import { defaultInfoShipping } from "../../constants/default.shipping";

const HeaderBanner = ({ issueDate, issueTime }: { issueDate: string, issueTime: string }) => (
    <div className="bg-brand-primary text-white p-2 flex justify-between items-center text-xs font-medium rounded-none">
        <div className="flex gap-6">
            <span>NIT Emisor: <span className="font-bold">063978123</span></span>
            <span>NRC Emisor: <span className="font-bold">3522465</span></span>
            <span>Usuario: <span className="font-bold">JONATHAN DANIEL HERNANDEZ GODOY</span></span>
        </div>
        <div className="flex gap-4">
            <span>Fecha DTE: <span className="font-mono font-bold">{issueDate}</span></span>
            <span>Hora: <span className="font-mono font-bold">{issueTime}</span></span>
        </div>
    </div>
);

export const CreateInvoiceForm = ({ onSuccess, initialData }: { onSuccess: () => void, initialData?: Invoice | null }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Confirmation Modal States
    const [modals, setModals] = useState({
        save: false,
        clear: false,
        cancel: false,
        // delete: false // Removed
    });

    useKeyboardShortcuts([
        {
            combo: KEY_COMBOS.SAVE_DOCUMENT,
            handler: () => setModals(prev => ({ ...prev, save: true }))
        }
    ]);

    useKeyboardShortcuts([
        {
            combo: KEY_COMBOS.CANCEL_DOCUMENT,
            handler: () => setModals(prev => ({ ...prev, cancel: true }))
        }
    ]);

    useKeyboardShortcuts([
        {
            combo: KEY_COMBOS.CLEAR_DOCUMENT,
            handler: () => setModals(prev => ({ ...prev, clear: true }))
        }
    ]);

    const defaultValues = useMemo(() => defaultInfoShipping(currentTime), []);

    const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<Invoice>({
        defaultValues: defaultValues as any
    });

    // Load initial data if editing
    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const { fields: items, append: appendItem, remove: removeItem, update: updateItem } = useFieldArray({
        control,
        name: "items"
    });

    const { fields: nonTaxableFields, append: appendNonTaxable, remove: removeNonTaxable } = useFieldArray({
        control,
        name: "nonTaxableAmounts"
    });

    const { fields: specialTaxFields, append: appendSpecialTax, remove: removeSpecialTax } = useFieldArray({
        control,
        name: "specialTaxes"
    });

    const watchItems = watch("items") || [];
    const ivaRetention = watch("ivaRetention") || 0;

    // Calculate subtotal and IVA only for taxable items
    const taxableSubtotal = watchItems
        .filter(item => item.tax === 'iva')
        .reduce((acc, item) => acc + ((item.quantity || 0) * (item.unitPrice || 0) - (item.discount || 0)), 0);

    const exemptSubtotal = watchItems
        .filter(item => item.tax === 'none')
        .reduce((acc, item) => acc + ((item.quantity || 0) * (item.unitPrice || 0) - (item.discount || 0)), 0);

    const subtotal = taxableSubtotal + exemptSubtotal;
    const montoNoAfecto = nonTaxableFields.reduce((acc, item) => acc + (item.amount || 0), 0);

    // IVA is only 13% of the taxable portion
    const iva = calculateIVA(taxableSubtotal);
    const total = calculateGrandTotal(subtotal, iva, ivaRetention);

    useEffect(() => {
        setValue("subtotal", subtotal);
        setValue("iva", iva);
        setValue("total", total);
    }, [subtotal, iva, total, setValue]);

    // Clock effect
    useEffect(() => {
        if (initialData) return; // Don't auto-update time if editing existing invoice
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            setValue("issueDate", now.toLocaleDateString('es-SV'));
            setValue("issueTime", now.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, [setValue, initialData]);

    const handleEditItem = (index: number) => {
        setEditingItem(items[index] as InvoiceItem);
        setEditingIndex(index);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditingIndex(null);
    };

    const addInvoice = useBillingStore((state) => state.addInvoice);
    const updateInvoice = useBillingStore((state) => state.updateInvoice);

    const onSubmit = (data: Invoice) => {
        if (initialData) {
            // Update existing
            const updatedInvoice = { ...data, id: initialData.id }; // Ensure ID is consistent
            updateInvoice(updatedInvoice);
        } else {
            // Create new
            const invoiceToSave = {
                ...data,
                id: data.id || crypto.randomUUID(),
            };
            addInvoice(invoiceToSave);
        }
        onSuccess();
    };

    const handleClearForm = () => {
        reset();
        setCurrentTime(new Date());
    };

    const handleCancel = () => {
        onSuccess(); // Assuming onSuccess closes the form/modal
    };

    // Removed handleDelete

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col h-full bg-slate-100 rounded-none">
            <HeaderBanner
                issueDate={currentTime.toLocaleDateString('es-SV')}
                issueTime={currentTime.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            />
            {/* Top Sticky Action Header - Nexus Master Design */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-3 py-1.5">
                <div className="flex items-center gap-1">
                    {/* Delete button REMOVED */}
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setModals(prev => ({ ...prev, cancel: true })); }}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 py-1.5 rounded-none transition-all active:scale-[0.98] border border-transparent hover:border-slate-200"
                        title="Cancelar edición"
                    >
                        <FiXCircle className="text-xs" /> <span className="hidden sm:inline">Cancelar</span>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setModals(prev => ({ ...prev, clear: true })); }}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 hover:text-amber-600 hover:bg-amber-50 px-2 py-1.5 rounded-none transition-all active:scale-[0.98] border border-transparent hover:border-amber-100"
                        title="Limpiar formulario"
                    >
                        <FiRefreshCcw className="text-xs" /> <span className="hidden sm:inline">Limpiar</span>
                    </button>
                </div>

                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setModals(prev => ({ ...prev, save: true })); }}
                        className="flex items-center gap-2 bg-brand-quaternary text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-sm active:scale-[0.98] border border-brand-quaternary/30"
                    >
                        <FiSave className="text-xs" /> Guardar Documento
                    </button>
                </div>
            </div>
            <div className="flex-1 pt-1 flex flex-col gap-1 overflow-y-auto">
                <ReceptorSection register={register} errors={errors} setValue={setValue} watch={watch} />
                <ProductSelectorSplit
                    control={control as any}
                    register={register}
                    watch={watch}
                    appendItem={appendItem}
                    updateItem={updateItem}
                    appendNonTaxable={appendNonTaxable}
                    appendSpecialTax={appendSpecialTax}
                    editingItem={editingItem}
                    editingIndex={editingIndex}
                    onCancelEdit={handleCancelEdit}
                />
                <DteItemsTable
                    control={control as any}
                    register={register}
                    watch={watch}
                    items={items}
                    removeItem={removeItem}
                    onEditItem={handleEditItem}
                    nonTaxableFields={nonTaxableFields}
                    removeNonTaxable={removeNonTaxable}
                    specialTaxFields={specialTaxFields}
                    removeSpecialTax={removeSpecialTax}
                />
                <TotalsSummary
                    register={register}
                    errors={errors}
                    subtotal={subtotal}
                    iva={iva}
                    total={total}
                    montoNoAfecto={montoNoAfecto}
                    setValue={setValue}
                    watch={watch}
                />
            </div>



            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={modals.save}
                onClose={() => setModals(prev => ({ ...prev, save: false }))}
                onConfirm={handleSubmit(onSubmit as any)}
                title="Confirmar Guardado"
                message="¿Estás seguro de que deseas generar este documento electrónico (DTE)?"
                confirmText={initialData ? "SÍ, ACTUALIZAR DTE" : "SÍ, GENERAR DTE"}
                type="info"
            />

            <ConfirmationModal
                isOpen={modals.clear}
                onClose={() => setModals(prev => ({ ...prev, clear: false }))}
                onConfirm={handleClearForm}
                title="Limpiar Formulario"
                message="¿Deseas borrar todos los datos ingresados actualmente?"
                confirmText="SÍ, LIMPIAR"
                type="warning"
            />

            <ConfirmationModal
                isOpen={modals.cancel}
                onClose={() => setModals(prev => ({ ...prev, cancel: false }))}
                onConfirm={handleCancel}
                title="Cancelar Edición"
                message="Se perderán los cambios no guardados. ¿Deseas salir?"
                confirmText="SÍ, SALIR"
                type="warning"
            />
            {/* Delete Modal Removed */}
        </form>
    );
};
