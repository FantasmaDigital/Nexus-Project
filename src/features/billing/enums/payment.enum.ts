import { FiFileText, FiGlobe } from "react-icons/fi";

// PAYMENT METHODS TO USE
export const PaymentMethod = {
    CASH: 'Efectivo',
    DEBIT_CARD: 'Tarjeta Débito',
    CREDIT_CARD: 'Tarjeta Crédito',
    TRANSFER: 'Transferencia',
    BITCOIN: 'Bitcoin',
    CHECK: 'Cheque'
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    AVOIDED: 'Anulado'
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

// DOCUMENT TYPES TO USE
export const DocumentType = {
    FINAL_CONSUMER: { id: '01', label: 'FACTURA CONSUMIDOR FINAL' },
    CREDIT_FISCAL: { id: '03', label: 'COMPROBANTE CRÉDITO FISCAL' },
    EXPORTATION: { id: '11', label: 'FACTURA DE EXPORTACIÓN' },
    EXCLUDED_SUBJECT: { id: '14', label: 'FACTURA SUJETO EXCLUIDO' }
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

export const OthersValues = {
    ALL: { value: 'ALL', label: 'TODOS' },
    EMPTY: { value: '', label: null }
};

export const TypeDocumentToPrint = {
    CF: { id: '01', label: 'Consumidor Final' },
    CCF: { id: '03', label: 'Comprobante Credito Fiscal' },
    EXP: { id: '11', label: 'Factura de Exportación' },
    FSE: { id: '14', label: 'Factura Sujeto Excluido' },
} as const;

// Extraemos las claves ('01', '03', etc.) y los nombres ('CF', 'CCF', etc.) dinámicamente
export const invoiceTypeLabels: Record<string, string> = Object.entries(TypeDocumentToPrint).reduce(
    (acc, [label, value]) => {
        acc[value.id] = label;
        return acc;
    },
    {} as Record<string, string>
);

export type TypeDocumentToPrint =
    (typeof TypeDocumentToPrint)[keyof typeof TypeDocumentToPrint];

// UNIQUE DOCUMENT TYPES TO USE
export const UniqueDocumentType = {
    DUI: { name: 'DUI', defaultValue: '00000000-0', icon: FiFileText, desc: 'Identidad Personal' },
    NIT: { name: 'NIT', defaultValue: '0000-000000-000-0', icon: FiFileText, desc: 'Identificación Tributaria' },
    PASSPORT: { name: 'PASAPORTE', defaultValue: '000000000', icon: FiGlobe, desc: 'Viajero Extranjero' },
    OTHER: { name: 'OTRO', defaultValue: '0000', icon: FiFileText, desc: 'Especificar en Notas' }
} as const;

export type UniqueDocumentType = typeof UniqueDocumentType[keyof typeof UniqueDocumentType];