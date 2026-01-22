import type { Invoice } from "../../../types/billing";

export interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (method: string, amountReceived?: number, change?: number) => void;
    totalAmount: number;
    invoiceId: string;
}

export interface BillingTableProps {
  invoices: Invoice[];
  onEdit?: (invoice: Invoice) => void;
  onVoid?: (id: string) => void;
  onPay?: (invoice: Invoice) => void;
}
