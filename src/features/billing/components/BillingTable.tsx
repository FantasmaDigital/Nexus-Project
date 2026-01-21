import type { Invoice, InvoiceStatus, InvoiceType } from "../../../types/billing";
import { FiPrinter, FiEdit, FiXCircle, FiDollarSign } from "react-icons/fi";

interface BillingTableProps {
  invoices: Invoice[];
  onEdit?: (invoice: Invoice) => void;
  onVoid?: (id: string) => void;
  onPay?: (invoice: Invoice) => void;
}

const statusStyles: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200", // Fallback
  PAGADA: "bg-green-100 text-green-700 border-green-200",
  IMPRESA: "bg-green-100 text-green-700 border-green-200", // Fallback/Keep for safety
  paid: "bg-green-100 text-green-700 border-green-200", // Fallback
  ANULADA: "bg-red-100 text-red-700 border-red-200",
  voided: "bg-red-100 text-red-700 border-red-200", // Fallback
};

const invoiceTypeLabels: Record<InvoiceType, string> = {
  '01': 'CF',
  '03': 'CCF',
  '11': 'EXP',
  '14': 'FSE',
};

const StatusBadge = ({ status }: { status: InvoiceStatus }) => (
  <span className={`px-2 py-0.5 rounded-none text-[10px] font-black uppercase italic border ${statusStyles[status]}`}>
    {status}
  </span>
);

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('es-SV');
  }
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return dateString;
  }
  return dateString;
};


export const BillingTable = ({ invoices, onEdit, onVoid, onPay }: BillingTableProps) => {


  if (invoices.length === 0) {
    return (
      <div className="text-center py-16 bg-white border-y border-slate-200">
        <h3 className="text-lg font-bold text-slate-500">No se encontraron facturas.</h3>
        <p className="text-slate-400 mt-2">Intenta ajustar tu búsqueda o crea una nueva factura.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left bg-white border-x border-slate-200">
      <thead className="bg-slate-50 border-b-2 border-slate-200">
        <tr>
          <th className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Factura #</th>
          <th className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
          <th className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
          <th className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Vendedor</th>
          <th className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
          <th className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Pago</th>
          <th className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
          <th className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Estado</th>
          <th className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {invoices.map((invoice) => (
          <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="p-2 font-bold text-brand-quaternary text-xs whitespace-nowrap">
              {invoice.id.split('-')[0].toUpperCase()}
            </td>
            <td className="p-2 text-slate-600 text-xs font-bold" title={invoiceTypeLabels[invoice.invoiceType]}>
              {invoiceTypeLabels[invoice.invoiceType] || invoice.invoiceType}
            </td>
            <td className="p-2 text-slate-700 font-bold text-xs uppercase truncate max-w-[150px]" title={invoice.client.name}>
              {invoice.client.name}
            </td>
            <td className="p-2 text-slate-500 text-xs uppercase hidden md:table-cell truncate max-w-[120px]" title={invoice.sellerName}>
              {invoice.sellerName?.split(' ')[0] || '-'}
            </td>
            <td className="p-2 text-slate-500 text-xs font-mono whitespace-nowrap">{formatDate(invoice.issueDate)}</td>
            <td className="p-2 text-slate-500 text-xs uppercase hidden md:table-cell">
              {invoice.paymentMethod || '-'}
            </td>
            <td className="p-2 text-slate-800 font-mono font-bold text-sm text-right whitespace-nowrap">
              ${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </td>
            <td className="p-2 text-center">
              <StatusBadge status={invoice.status} />
            </td>
            <td className="p-2 text-center">
              <div className="flex items-center justify-center gap-1">
                {(invoice.status === 'PENDIENTE' || (invoice.status as string) === 'pending') ? (
                  <>
                    <button
                      onClick={() => onPay && onPay(invoice)}
                      className="text-green-600 hover:text-green-700 p-1.5 transition-all hover:bg-green-50 rounded-full"
                      title="Pagar y Emitir"
                    >
                      <FiDollarSign size={16} />
                    </button>
                    <button
                      onClick={() => onEdit && onEdit(invoice)}
                      className="text-blue-500 hover:text-blue-700 p-1.5 transition-all hover:bg-blue-50 rounded-full"
                      title="Modificar"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => onVoid && onVoid(invoice.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 transition-all hover:bg-red-50 rounded-full"
                      title="Anular"
                    >
                      <FiXCircle size={16} />
                    </button>
                  </>
                ) : (
                  // IMPRESA or ANULADA
                  <button
                    className="text-slate-400 hover:text-brand-primary p-1.5 transition-all hover:bg-slate-100 rounded-full"
                    title="Imprimir Copia"
                  >
                    <FiPrinter size={16} />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
