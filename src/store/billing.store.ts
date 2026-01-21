import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Invoice } from '../types/billing';

interface BillingState {
    invoices: Invoice[];
    addInvoice: (invoice: Invoice) => void;
    deleteInvoice: (id: string) => void;
    updateInvoice: (invoice: Invoice) => void;
    updateStatus: (id: string, status: Invoice['status']) => void;
}

export const useBillingStore = create<BillingState>()(
    persist(
        (set) => ({
            invoices: [],
            addInvoice: (invoice) => set((state) => ({
                invoices: [invoice, ...state.invoices]
            })),
            deleteInvoice: (id) => set((state) => ({
                invoices: state.invoices.filter((inv) => inv.id !== id)
            })),
            updateInvoice: (invoice) => set((state) => ({
                invoices: state.invoices.map((inv) => inv.id === invoice.id ? invoice : inv)
            })),
            updateStatus: (id, status) => set((state) => ({
                invoices: state.invoices.map((inv) => inv.id === id ? { ...inv, status } : inv)
            })),
        }),
        {
            name: 'billing-storage',
        }
    )
);
