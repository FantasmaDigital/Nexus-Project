// src/types/inventory.ts

export interface TransferItem {
  sku?: string;
  qty: number;
  details?: {
    SKU?: string;
    sku?: string;
    Nombre?: string;
    Categoria?: string;
    Precio?: number | string;
    precio?: number | string;
  }
}

export interface Transfer {
  id?: string;
  status?: 'enviado' | 'recibido' | 'anulado';
  senderName?: string;
  sourceWarehouse?: string;
  targetWarehouse?: string;
  shipmentTime?: string;
  receiptTime?: string;
  items?: TransferItem[];
  notes?: string;
  date?: string;
  createdAt?: string;
}
