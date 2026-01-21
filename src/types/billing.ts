// src/types/billing.ts

export type ClientDocumentType = 'DUI' | 'NIT' | 'PASAPORTE' | 'OTRO';
export type PaymentMethod = 'Efectivo' | 'Tarjeta Débito' | 'Tarjeta Crédito' | 'Transferencia' | 'Bitcoin' | 'Cheque' | 'Dinero electrónico' | 'Monedero electrónico' | 'Otras Criptomonedas';
export type OperationCondition = 'Contado' | 'Crédito' | 'Plazos';
export type InvoiceStatus = 'PENDIENTE' | 'PAGADA' | 'ANULADA';
export type InvoiceType = '01' | '03' | '11' | '14'; // 01: Factura, 03: CCF, 11: Exportación, 14: Sujeto Excluido

export interface InvoiceItem {
  id: string;
  sku?: string; // Optativo para identificar productos
  imageUrl?: string; // Imagen del producto
  quantity: number;
  description: string;
  unitPrice: number;
  discount: number;
  subtotal: number;
  tax: 'iva' | 'none';
  specialTaxes?: SpecialTax[];
}

/**
 * Representa una persona responsable (emisor o receptor).
 */
export interface ResponsibleParty {
  name: string;
  documentNumber: string;
}

export type SpecialTaxType = 'Gravado' | 'Exento';

export interface SpecialTax {
  id: string;
  description: string;
  amount: number;
  type: SpecialTaxType; // Gravado/Exento
}

/**
 * Representa una factura completa (DTE Tipo 01 - Factura de Consumidor Final).
 */
export interface Invoice {
  // --- Bloque de Identificación (Emisor) ---
  id: string;
  invoiceType: InvoiceType;
  sellerName?: string;
  issueDate: string;
  issueTime: string;

  // --- Bloque del Receptor (Cliente) ---
  client: {
    name: string;
    documentType: ClientDocumentType;
    documentNumber: string;
    email: string;
    phone: string;
    address: string;
    department: string;
    municipality: string;
    economicActivity?: string;
    isExempt?: boolean;
    isRetentionSubject?: boolean;
    isExportClient?: boolean;
    isGovernmentNoSubject?: boolean;
    nrc?: string;
    tradeName?: string;
  };

  // --- Bloque de Items (Cuerpo) ---
  items: InvoiceItem[];
  nonTaxableAmounts?: { description: string; amount: number }[];
  specialTaxes?: SpecialTax[];

  // --- Resumen y Totales ---
  operationCondition: OperationCondition;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  observations: string;
  subtotal: number;
  iva: number;
  total: number;
  ivaRetention: number;
}
