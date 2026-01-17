import { useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { useProductStore, useUserStore } from "../../../../store/product.schema.zod";
import { InventoryTable } from "../InventoryTable";
import { SystemNotification } from "../SystemNotification";

type Props = {
    labelClasses: string;
    inputClasses: string;
    register: any;
    setValue: any;
    productSchema: any[];
}

export const TransfersForm = ({ labelClasses, inputClasses, register, setValue, productSchema }: Props) => {
    const [skuInput, setSkuInput] = useState("");
    const [qtyInput, setQtyInput] = useState(1);
    const [scannedItems, setScannedItems] = useState<any[]>([]);
    const [errorPopup, setErrorPopup] = useState<string | null>(null);

    // Obtenemos los productos actuales para validar existencia
    const { products } = useProductStore();
    const { user } = useUserStore();

    // Auto-rellenar remitente si el campo está vacío
    if (user?.name) {
        setValue("senderName", user.name);
    }

    const handleAddProduct = () => {
        const cleanSku = skuInput.trim().toUpperCase();
        if (!cleanSku) return;

        // Búsqueda estricta (Exact Match)
        const productExists = products.find(p => {
            const idMatch = p.id?.toUpperCase() === cleanSku;
            const fieldMatch = Object.values(p).some(val =>
                typeof val === 'string' && val.toUpperCase() === cleanSku
            );
            return idMatch || fieldMatch;
        });

        if (!productExists) {
            setErrorPopup(`Código no válido: "${cleanSku}". No se encontraron coincidencias exactas en el inventario.`);
            return;
        }

        const existingIndex = scannedItems.findIndex(i => (i.sku === cleanSku || i.details?.id === productExists.id));
        let updatedList;

        if (existingIndex > -1) {
            updatedList = [...scannedItems];
            updatedList[existingIndex].qty += qtyInput;
        } else {
            updatedList = [...scannedItems, {
                id: crypto.randomUUID(),
                sku: productExists.SKU || productExists.sku || productExists.id || cleanSku,
                qty: qtyInput,
                details: productExists
            }];
        }

        setScannedItems(updatedList);
        setValue("items", updatedList, { shouldDirty: true });
        setSkuInput("");
        setQtyInput(1);
    };

    const removeItem = (id: string) => {
        const filtered = scannedItems.filter(item => item.id !== id);
        setScannedItems(filtered);
        setValue("items", filtered, { shouldDirty: true });
    };

    return (
        <div className="space-y-8 relative">
            {/* NOTIFICACIÓN PREMIUM DEL SISTEMA */}
            <SystemNotification
                message={errorPopup}
                type="error"
                onClose={() => setErrorPopup(null)}
            />

            {/* 1. SECCIÓN DE DOCUMENTO (METADATOS) */}
            <section className="bg-slate-50/50 p-6 border border-slate-100 space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className={labelClasses}>Bodega de Origen</label>
                        <div className="relative">
                            <select {...register("sourceWarehouse", { required: true })} className={inputClasses}>
                                <option value="">Seleccione origen...</option>
                                <option value="B-01">Almacén Central (AC-01)</option>
                                <option value="B-02">Depósito Regional Norte</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Bodega de Destino</label>
                        <div className="relative">
                            <select {...register("targetWarehouse", { required: true })} className={inputClasses}>
                                <option value="">Seleccione destino...</option>
                                <option value="B-03">Punto de Venta Minorista</option>
                                <option value="B-04">Centro de Distribución Final</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1">
                        <label className={labelClasses}>Notas Adicionales</label>
                        <textarea
                            {...register("notes")}
                            className={`${inputClasses} min-h-[80px] resize-none`}
                            placeholder="Ingrese observaciones importantes sobre este traslado..."
                        />
                    </div>
                </div>
            </section>

            {/* 2. ESCANER REDISEÑADO */}
            <section className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 bg-white border border-slate-200 p-1 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <div className="flex items-center px-3 gap-3 w-full">
                            <FiSearch className="text-slate-400 shrunk-0" />
                            <input
                                type="text"
                                placeholder="Escanee o ingrese código (SKU / ID)..."
                                className="w-full py-2.5 outline-none text-sm font-medium"
                                value={skuInput}
                                onChange={(e) => setSkuInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProduct())}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-40 bg-white border border-slate-200 p-1 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <div className="flex items-center px-4 gap-3 w-full">
                            <span className="text-[10px] font-black text-slate-400 uppercase whitespace-nowrap">Cant.</span>
                            <input
                                type="number"
                                min="1"
                                placeholder="Cant."
                                className="w-full py-2.5 outline-none text-sm font-bold text-center"
                                value={qtyInput}
                                onChange={(e) => setQtyInput(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="bg-slate-900 text-white px-10 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg active:scale-95"
                    >
                        Validar
                    </button>
                </div>
            </section>

            {/* 3. RÉPLICA DE TABLA DE INVENTARIO (LIMPIA) */}
            <InventoryTable
                className="h-[400px]"
                data={scannedItems.map(item => {
                    // Buscar el nombre del campo de stock en el schema
                    const stockField = productSchema.find(s => s.keyName.toUpperCase() === 'STOCK');
                    const stockKey = stockField ? stockField.keyName : 'stock';

                    return {
                        ...item.details,
                        id: item.id, // IMPORTANTE: Preservar el ID del wrapper para que onDelete funcione
                        [stockKey]: item.qty // Mostrar la cantidad a mover en la columna de stock
                    };
                })}
                schema={productSchema.filter(s =>
                    s.keyName.toUpperCase() !== 'DESCUENTO' &&
                    s.type !== 'discount'
                )}
                onDelete={removeItem}
                showDate={false}
                emptyMessage="Esperando escaneo de productos para traslado"
            />
            {scannedItems.length > 0 && (
                <div className="bg-slate-50 px-4 py-2 flex justify-between items-center border border-t-0 border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Items en lista: {scannedItems.length}</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase">Total Unidades: {scannedItems.reduce((acc, curr) => acc + curr.qty, 0)}</span>
                </div>
            )}
        </div>
    );
};