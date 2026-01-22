import { useState, useMemo } from "react";
import { FiPlus, FiSearch, FiPrinter, FiArrowLeft, FiFileText, FiFilter, FiX, FiUser, FiBriefcase, FiGlobe, FiSlash, FiCalendar, FiCheck, FiCreditCard, FiDollarSign, FiClock, FiCheckCircle } from "react-icons/fi";
import type { Invoice, InvoiceType, PaymentMethod as TPaymentMethod } from "../../../types/billing";
import { BillingTable } from "./BillingTable";
import { PaymentForm } from "./forms/PaymentForm";
import { CreateInvoiceForm } from "./forms/CreateInvoiceForm";
import { ConfirmationModal } from "../../../shared/components/ConfirmationModal";
import { CustomSelect, type SelectOption } from "../../../components/ui/CustomSelect";
import { useBillingStore } from "../../../store/billing.store";
import { PaymentMethod, PaymentStatus, DocumentType, OthersValues } from "../enums/payment.enum";

const filterOptions: SelectOption[] = [
    { id: OthersValues.ALL.value, label: OthersValues.ALL.label, icon: FiFileText },
    { id: DocumentType.FINAL_CONSUMER.id, label: DocumentType.FINAL_CONSUMER.label, icon: FiUser },
    { id: DocumentType.CREDIT_FISCAL.id, label: DocumentType.CREDIT_FISCAL.label, icon: FiBriefcase },
    { id: DocumentType.EXPORTATION.id, label: DocumentType.EXPORTATION.label, icon: FiGlobe },
    { id: DocumentType.EXCLUDED_SUBJECT.id, label: DocumentType.EXCLUDED_SUBJECT.label, icon: FiSlash },
];

const paymentOptions: SelectOption[] = [
    { id: OthersValues.ALL.value, label: OthersValues.ALL.label, icon: FiDollarSign },
    { id: PaymentMethod.CASH, label: PaymentMethod.CASH, icon: FiDollarSign },
    { id: PaymentMethod.DEBIT_CARD, label: PaymentMethod.DEBIT_CARD, icon: FiCreditCard },
    { id: PaymentMethod.CREDIT_CARD, label: PaymentMethod.CREDIT_CARD, icon: FiCreditCard },
    { id: PaymentMethod.TRANSFER, label: PaymentMethod.TRANSFER, icon: FiGlobe },
    { id: PaymentMethod.BITCOIN, label: PaymentMethod.BITCOIN, icon: FiGlobe },
    { id: PaymentMethod.CHECK, label: PaymentMethod.CHECK, icon: FiFileText },
];

const statusOptions: SelectOption[] = [
    { id: OthersValues.ALL.value, label: OthersValues.ALL.label, icon: FiFileText },
    { id: PaymentStatus.PENDING, label: PaymentStatus.PENDING, icon: FiClock },
    { id: PaymentStatus.PAID, label: PaymentStatus.PAID, icon: FiCheckCircle },
    { id: PaymentStatus.AVOIDED, label: PaymentStatus.AVOIDED, icon: FiSlash },
];

export const BillingDashboard = () => {
    const invoices = useBillingStore((state) => state.invoices);
    const updateInvoice = useBillingStore((state) => state.updateInvoice);
    const updateStatus = useBillingStore((state) => state.updateStatus);

    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'list' | 'create' | 'pay'>('list');
    const [showFilters, setShowFilters] = useState(false);

    // Active Filter States (Applied)
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [filterType, setFilterType] = useState<InvoiceType | string>(OthersValues.ALL.value);
    const [filterClient, setFilterClient] = useState("");
    const [filterSeller, setFilterSeller] = useState("");
    const [filterPayment, setFilterPayment] = useState<TPaymentMethod | string>(OthersValues.ALL.value);
    const [filterStatus, setFilterStatus] = useState<string>(OthersValues.ALL.value);

    // Temporary Filter States
    const [tempDateRange, setTempDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [tempFilterType, setTempFilterType] = useState<InvoiceType | string>(OthersValues.ALL.value);
    const [tempClient, setTempClient] = useState("");
    const [tempSeller, setTempSeller] = useState("");
    const [tempPayment, setTempPayment] = useState<TPaymentMethod | string>(OthersValues.ALL.value);
    const [tempFilterStatus, setTempFilterStatus] = useState<string>(OthersValues.ALL.value);

    // Action States
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
    const [voidModal, setVoidModal] = useState<{ isOpen: boolean; invoiceId: string | null }>({ isOpen: false, invoiceId: null });

    // MIGRATION EFFECT: Fix legacy statuses immediately
    useMemo(() => {
        invoices.forEach(inv => {
            let newStatus: any = null;
            const currentStatus = (inv.status || "").toString().toUpperCase();

            if (currentStatus === 'PENDIENTE' || currentStatus === PaymentStatus.PENDING.toUpperCase()) newStatus = PaymentStatus.PENDING;
            else if (currentStatus === 'PAGADA' || currentStatus === 'PAGADO' || currentStatus === PaymentStatus.PAID.toUpperCase()) newStatus = PaymentStatus.PAID;
            else if (currentStatus === 'ANULADA' || currentStatus === 'ANULADO' || currentStatus === PaymentStatus.AVOIDED.toUpperCase()) newStatus = PaymentStatus.AVOIDED;

            if (newStatus && inv.status !== newStatus) {
                updateInvoice({ ...inv, status: newStatus });
            }
        });
    }, [invoices, updateInvoice]);

    // ... Filters Logic ...
    // (Existing filter logic omitted for brevity, keeping it as is)
    // Lógica para filtrar facturas
    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            // 1. Search Term (Global)
            const matchesSearch =
                invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.id.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Invoice Type
            if (filterType !== OthersValues.ALL.value && invoice.invoiceType !== filterType) {
                return false;
            }

            // 3. Client Name (Advanced Filter)
            if (filterClient && !invoice.client.name.toLowerCase().includes(filterClient.toLowerCase())) {
                return false;
            }

            // 4. Seller Name (Advanced Filter)
            if (filterSeller && !invoice.sellerName?.toLowerCase().includes(filterSeller.toLowerCase())) {
                return false;
            }

            // 5. Payment Method
            if (filterPayment !== OthersValues.ALL.value && invoice.paymentMethod !== filterPayment) {
                return false;
            }

            // 6. Invoice Status
            if (filterStatus !== OthersValues.ALL.value && invoice.status !== filterStatus) {
                return false;
            }

            // 7. Date Range
            if (dateRange.start || dateRange.end) {
                let invoiceDate = new Date(invoice.issueDate);
                if (isNaN(invoiceDate.getTime()) && typeof invoice.issueDate === 'string') {
                    const parts = invoice.issueDate.split('/');
                    if (parts.length === 3) {
                        const [day, month, year] = parts;
                        invoiceDate = new Date(`${year}-${month}-${day}`);
                    }
                }

                if (!isNaN(invoiceDate.getTime())) {
                    invoiceDate.setHours(0, 0, 0, 0);
                    if (dateRange.start) {
                        const startDate = new Date(dateRange.start);
                        startDate.setHours(0, 0, 0, 0);
                        if (invoiceDate < startDate) return false;
                    }
                    if (dateRange.end) {
                        const endDate = new Date(dateRange.end);
                        endDate.setHours(0, 0, 0, 0);
                        if (invoiceDate > endDate) return false;
                    }
                }
            }
            return true;
        });
    }, [invoices, searchTerm, filterType, filterClient, filterSeller, filterPayment, filterStatus, dateRange]);


    const handleApplyFilters = () => {
        setFilterType(tempFilterType);
        setDateRange(tempDateRange);
        setFilterClient(tempClient);
        setFilterSeller(tempSeller);
        setFilterPayment(tempPayment);
        setFilterStatus(tempFilterStatus);
    };

    const handleClearFilters = () => {
        setFilterType(OthersValues.ALL.value);
        setDateRange({ start: "", end: "" });
        setFilterClient("");
        setFilterSeller("");
        setFilterPayment(OthersValues.ALL.value);
        setFilterStatus(OthersValues.ALL.value);
        setTempFilterType(OthersValues.ALL.value);
        setTempDateRange({ start: "", end: "" });
        setTempClient("");
        setTempSeller("");
        setTempPayment(OthersValues.ALL.value);
        setTempFilterStatus(OthersValues.ALL.value);
        setSearchTerm("");
    };

    const handleClose = () => {
        setViewMode('list');
        setEditingInvoice(null);
        setPayingInvoice(null);
    };

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setViewMode('create');
    };

    const handlePay = (invoice: Invoice) => {
        setPayingInvoice(invoice);
        setViewMode('pay');
    };

    const handlePaymentSuccess = () => {
        if (payingInvoice) {
            updateStatus(payingInvoice.id, PaymentStatus.PAID);
            alert("Pago registrado correctamente. Factura PAGADA.");
            handleClose();
        }
    };

    const confirmVoid = (id: string) => {
        setVoidModal({ isOpen: true, invoiceId: id });
    };

    const handleVoid = () => {
        if (voidModal.invoiceId) {
            updateStatus(voidModal.invoiceId, PaymentStatus.AVOIDED);
            setVoidModal({ isOpen: false, invoiceId: null });
        }
    };

    return (
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
            {viewMode !== 'pay' && (
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-4">
                        {viewMode === 'create' ? (
                            <button
                                onClick={handleClose}
                                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-brand-quaternary font-bold text-xs uppercase tracking-widest transition-all group active:scale-95"
                            >
                                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                Volver al Listado
                            </button>
                        ) : (
                            <h2 className="text-brand-primary font-bold text-sm tracking-tight flex items-center gap-2">
                                <div className="bg-brand-quaternary p-1 rounded-none text-white"><FiFileText size={12} /></div>
                                {editingInvoice ? 'MODIFICAR FACTURA' : 'FACTURACIÓN'}
                            </h2>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {viewMode === 'list' && (
                            <button
                                onClick={() => setViewMode('create')}
                                className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 text-xs font-medium transition-all shadow-sm active:scale-95"
                            >
                                <FiPlus /> Crear Factura
                            </button>
                        )}
                    </div>
                </header>
            )}

            <div className="flex-1 p-1 flex flex-col gap-1 min-w-0 relative">
                {viewMode === 'list' ? (
                    <>
                        <div className="flex flex-col gap-1 shrink-0 bg-white p-2 border border-slate-200 relative z-20">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="relative flex-1 group min-w-[200px]">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar por cliente, N° de factura..."
                                        className="w-full h-[38px] bg-slate-50 border border-slate-200 pl-10 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase placeholder:normal-case"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center gap-2 px-3 py-2 border text-xs font-bold uppercase transition-all ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <FiFilter /> Filtros
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-xs font-bold uppercase text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                                        <FiPrinter /> Exportar PDF
                                    </button>
                                </div>
                            </div>

                            {/* Expandable Filter Panel */}
                            {showFilters && (
                                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                                    {/* Row 1: Primary Search Criteria */}
                                    <div className="flex items-end gap-4 w-full">
                                        <div className="w-64 shrink-0">
                                            <CustomSelect
                                                label="Tipo de Documento"
                                                value={tempFilterType}
                                                options={filterOptions}
                                                onSelect={(id) => setTempFilterType(id as InvoiceType | string)}
                                                icon={FiFileText}
                                                selectClassName="h-[38px]"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <FiUser className="text-slate-400" /> Cliente
                                            </label>
                                            <input
                                                type="text"
                                                value={tempClient}
                                                onChange={(e) => setTempClient(e.target.value)}
                                                placeholder="Nombre del cliente..."
                                                className="w-full h-[38px] bg-white border border-slate-300 px-3 text-[11px] font-bold text-slate-700 uppercase outline-none focus:border-brand-quaternary focus:ring-2 focus:ring-brand-quaternary/20 transition-all rounded-none placeholder:text-slate-400 placeholder:font-medium"
                                            />
                                        </div>
                                        <div className="w-56 shrink-0 flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <FiBriefcase className="text-slate-400" /> Vendedor
                                            </label>
                                            <input
                                                type="text"
                                                value={tempSeller}
                                                onChange={(e) => setTempSeller(e.target.value)}
                                                placeholder="Vendedor..."
                                                className="w-full h-[38px] bg-white border border-slate-300 px-3 text-[11px] font-bold text-slate-700 uppercase outline-none focus:border-brand-quaternary focus:ring-2 focus:ring-brand-quaternary/20 transition-all rounded-none placeholder:text-slate-400 placeholder:font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Secondary Filters & Actions */}
                                    <div className="flex items-end gap-4 w-full">
                                        <div className="w-64 shrink-0">
                                            <CustomSelect
                                                label="Método de Pago"
                                                value={tempPayment}
                                                options={paymentOptions}
                                                onSelect={(id) => setTempPayment(id as TPaymentMethod | string)}
                                                icon={FiDollarSign}
                                                selectClassName="h-[38px]"
                                            />
                                        </div>

                                        <div className="w-44 shrink-0">
                                            <CustomSelect
                                                label="Estado de Factura"
                                                value={tempFilterStatus}
                                                options={statusOptions}
                                                onSelect={(id) => setTempFilterStatus(id)}
                                                icon={FiClock}
                                                selectClassName="h-[38px]"
                                            />
                                        </div>

                                        <div className="w-40 shrink-0 flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <FiCalendar className="text-slate-400" /> Fecha Inicio
                                            </label>
                                            <input
                                                type="date"
                                                value={tempDateRange.start}
                                                onChange={(e) => setTempDateRange(prev => ({ ...prev, start: e.target.value }))}
                                                className="w-full h-[38px] bg-white border border-slate-300 px-3 text-[11px] font-bold text-slate-700 uppercase outline-none focus:border-brand-quaternary focus:ring-2 focus:ring-brand-quaternary/20 transition-all rounded-none"
                                            />
                                        </div>
                                        <div className="w-40 shrink-0 flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <FiCalendar className="text-slate-400" /> Fecha Fin
                                            </label>
                                            <input
                                                type="date"
                                                value={tempDateRange.end}
                                                onChange={(e) => setTempDateRange(prev => ({ ...prev, end: e.target.value }))}
                                                className="w-full h-[38px] bg-white border border-slate-300 px-3 text-[11px] font-bold text-slate-700 uppercase outline-none focus:border-brand-quaternary focus:ring-2 focus:ring-brand-quaternary/20 transition-all rounded-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 ml-auto">
                                            <button
                                                onClick={handleApplyFilters}
                                                className="h-[38px] px-6 bg-brand-quaternary border border-brand-quaternary text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-quaternary/90 transition-all flex items-center gap-2 mb-[1px]"
                                            >
                                                <FiCheck size={14} /> Aplicar
                                            </button>
                                            <button
                                                onClick={handleClearFilters}
                                                className="h-[38px] px-6 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 hover:border-red-200 transition-all flex items-center gap-2 mb-[1px]"
                                            >
                                                <FiX size={14} /> Limpiar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <BillingTable invoices={filteredInvoices} onEdit={handleEdit} onVoid={confirmVoid} onPay={handlePay} />
                        </div>

                        <div className="px-3 py-2 border border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0 shadow-sm">
                            <span>Mostrando {filteredInvoices.length} facturas</span>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 bg-white border border-slate-200" disabled>Anterior</button>
                                <button className="px-2 py-1 bg-white border border-slate-200" disabled>Siguiente</button>
                            </div>
                        </div>
                    </>
                ) : viewMode === 'create' ? (
                    <CreateInvoiceForm onSuccess={handleClose} initialData={editingInvoice} />
                ) : (
                    payingInvoice && (
                        <PaymentForm
                            invoice={payingInvoice}
                            onSuccess={handlePaymentSuccess}
                            onCancel={handleClose}
                        />
                    )
                )}
            </div>

            <ConfirmationModal
                isOpen={voidModal.isOpen}
                onClose={() => setVoidModal({ isOpen: false, invoiceId: null })}
                onConfirm={handleVoid}
                title="Confirmar Anulación"
                message="¿Estás seguro de que deseas anular esta factura? Esta acción es irreversible."
                confirmText="SÍ, ANULAR"
                type="danger"
            />
        </main>
    );
};
