// src/features/billing/components/forms/sections/ProductSelectorSplit.tsx
import { type Control, type UseFormRegister, type UseFormWatch } from "react-hook-form";
import { FiSearch, FiPlus, FiBox, FiEdit2, FiEye, FiX, FiCheckCircle, FiAlertCircle, FiTag } from "react-icons/fi";
import { useState, useEffect } from "react";
import type { Invoice, InvoiceItem, SpecialTax } from "../../../../../types/billing";
import { useProductStore, type Product } from "../../../../../store/product.schema.zod";
import { getProductField } from "../../../../../utils/product.utils";
import { CustomSelect, type SelectOption } from "../../../../../components/ui/CustomSelect";

const inputStyles = "w-full bg-white border border-slate-300 py-1 px-2 text-xs outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 transition-all rounded-none font-mono placeholder:text-slate-400";
const labelStyles = "block text-[9px] font-bold text-slate-500 uppercase mb-0.5 tracking-wider";
const buttonStyles = "w-full bg-slate-800 text-white px-4 py-2 text-xs font-bold uppercase rounded-none hover:bg-slate-700 transition-colors flex items-center justify-center gap-2";

interface ProductSelectorSplitProps {
    control: Control<Invoice>;
    register?: UseFormRegister<Invoice>;
    watch?: UseFormWatch<Invoice>;
    appendItem: (item: InvoiceItem) => void;
    updateItem: (index: number, item: InvoiceItem) => void;
    appendNonTaxable: (item: { description: string; amount: number }) => void;
    appendSpecialTax: (item: SpecialTax) => void;
    editingItem: InvoiceItem | null;
    editingIndex: number | null;
    onCancelEdit: () => void;
}

const StockAvailabilityModal = ({ product, onClose }: { product: Product, onClose: () => void }) => {
    // Static branch stock data (replaces random values)
    const mainStock = getProductField(product, 'Stock') ?? 0;
    const branchStock = [
        { name: 'Casa Central - San Salvador', stock: mainStock, status: mainStock > 10 ? 'Disponible' : mainStock > 0 ? 'Crítico' : 'Sin Existencia' },
        { name: 'Sucursal Escalón', stock: 0, status: 'Sin Existencia' },
        { name: 'Sucursal Santa Ana', stock: 0, status: 'Sin Existencia' },
    ];

    const totalStock = branchStock.reduce((acc, b) => acc + b.stock, 0);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-200 rounded-none transform transition-all animate-in zoom-in-95 duration-200">
                {/* Header Premium - Cleaner Typography */}
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="bg-brand-quaternary p-2 shadow-lg shadow-brand-quaternary/20">
                            <FiBox className="text-white text-base" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] leading-none mb-1">Inventario por Sucursales</h3>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">Consulta Detallada de Disponibilidad</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-white/5 hover:bg-white/10 p-2 text-slate-400 hover:text-white transition-all">
                        <FiX size={20} />
                    </button>
                </div>

                <div className="p-0">
                    {/* Top Info Banner */}
                    <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-brand-quaternary uppercase tracking-widest block">Producto</span>
                            <h4 className="text-xl font-bold text-slate-800 leading-none uppercase">
                                {getProductField(product, 'Nombre')}
                            </h4>
                            <div className="flex gap-4 pt-1">
                                <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-200 px-2 py-0.5">SKU: {getProductField(product, 'SKU')}</span>
                                <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-200 px-2 py-0.5">PRECIO: ${getProductField(product, 'Precio')?.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-right bg-white p-3 border border-slate-200 shadow-sm min-w-[140px]">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Stock Global</span>
                            <div className="flex items-baseline justify-end gap-1">
                                <span className="text-3xl font-mono font-bold text-slate-900 leading-none">{totalStock}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">UNDS</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Layout */}
                    <div className="p-8">
                        <table className="w-full text-left border-collapse border border-slate-200">
                            <thead className="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <tr>
                                    <th className="px-4 py-3 border-b border-slate-200">Sucursal / Bodega</th>
                                    <th className="px-4 py-3 border-b border-slate-200 text-center">Existencia</th>
                                    <th className="px-4 py-3 border-b border-slate-200 text-center">Estado</th>
                                    <th className="px-4 py-3 border-b border-slate-200 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                                {branchStock.map((branch, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-4 py-4 font-bold text-slate-700 uppercase tracking-tight">{branch.name}</td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <span className={`text-sm font-mono font-bold ${branch.stock > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                                                    {branch.stock}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">UNID</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase ${branch.status === 'Disponible' ? 'bg-green-100 text-green-700' :
                                                branch.status === 'Crítico' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-400'
                                                }`}>
                                                {branch.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button className="text-[10px] font-bold text-brand-quaternary uppercase tracking-tighter hover:text-brand-primary border-b border-transparent hover:border-brand-primary transition-all">
                                                SOLICITAR TRASLADO
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 font-medium italic">Sincronizado con sistema de inventario centralizado</p>
                    <button
                        onClick={onClose}
                        className="bg-slate-900 text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-brand-primary transition-all shadow-md active:scale-95"
                    >
                        Cerrar Ventana
                    </button>
                </div>
            </div>
        </div>
    );
};

type AddMode = 'product' | 'exempt' | 'special_tax';

export const ProductSelectorSplit = ({
    appendItem,
    updateItem,
    appendNonTaxable,
    appendSpecialTax,
    editingItem,
    editingIndex,
    onCancelEdit,
    watch
}: ProductSelectorSplitProps) => {
    const products = useProductStore(state => state.products) || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [mode, setMode] = useState<AddMode>('product');
    const [selectedStockProduct, setSelectedStockProduct] = useState<Product | null>(null);



    // Form state independent of the main form to allow quick adding
    const [formState, setFormState] = useState<{
        sku: string;
        description: string;
        unitPrice: number;
        quantity: number;
        discountPercent: number;
        tax: 'iva' | 'none'; // Added tax
        specialTaxType: 'Gravado' | 'Exento';
        imageUrl?: string;
    }>({
        sku: '',
        description: '',
        unitPrice: 0,
        quantity: 1,
        discountPercent: 0,
        tax: 'iva',
        specialTaxType: 'Gravado',
        imageUrl: ''
    });

    // Populate form when editingItem changes
    useEffect(() => {
        if (editingItem) {
            setMode('product');
            // Calculate starting percentage based on existing absolute discount
            const totalGross = editingItem.quantity * editingItem.unitPrice;
            const startingPercent = totalGross > 0 ? (editingItem.discount / totalGross) * 100 : 0;

            setFormState({
                sku: editingItem.sku || '---',
                description: editingItem.description,
                unitPrice: editingItem.unitPrice,
                quantity: editingItem.quantity,
                discountPercent: Number(startingPercent.toFixed(2)),
                tax: editingItem.tax,
                specialTaxType: 'Gravado',
                imageUrl: editingItem.imageUrl
            });
        }
    }, [editingItem]);

    const filteredProducts = products.filter(product => {
        const productName = getProductField(product, 'Nombre') || '';
        const productSku = getProductField(product, 'SKU') || '';
        const lowerSearchTerm = searchTerm.toLowerCase();

        return String(productName).toLowerCase().includes(lowerSearchTerm) ||
            String(productSku).toLowerCase().includes(lowerSearchTerm);
    });

    const handleProductSelect = (product: Product) => {
        setMode('product');
        const desc = getProductField(product, 'Nombre') || getProductField(product, 'description') || 'Producto sin nombre';
        const priceValue = getProductField(product, 'Precio') || getProductField(product, 'price') || 0;
        const skuValue = getProductField(product, 'SKU') || getProductField(product, 'sku') || '---';

        // Check for Sujeto Excluido (14) or Exportación (11) to default to Exento
        const currentInvoiceType = watch ? watch("invoiceType") : '01';
        const defaultTax = (currentInvoiceType === '14' || currentInvoiceType === '11') ? 'none' : 'iva';

        setFormState({
            sku: skuValue,
            description: desc,
            unitPrice: priceValue,
            quantity: 1,
            discountPercent: 0, // Reset discount on product selection
            tax: defaultTax,
            specialTaxType: 'Gravado',
            imageUrl: getProductField(product, 'image')
        });
    };

    const handleAddToInvoice = () => {
        if (!formState.description) return;

        if (mode === 'product') {
            if (formState.quantity <= 0 || formState.unitPrice < 0) return;

            // Calculate absolute discount from percentage
            const grossSubtotal = formState.quantity * formState.unitPrice;
            const absoluteDiscount = grossSubtotal * (formState.discountPercent / 100);

            if (editingIndex !== null) {
                updateItem(editingIndex, {
                    id: editingItem?.id || '',
                    sku: formState.sku,
                    quantity: formState.quantity,
                    description: formState.description,
                    unitPrice: formState.unitPrice,
                    discount: absoluteDiscount,
                    tax: formState.tax,
                    imageUrl: formState.imageUrl,
                    subtotal: grossSubtotal - absoluteDiscount,
                });
            } else {
                const newItemId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
                appendItem({
                    id: newItemId,
                    sku: formState.sku,
                    quantity: formState.quantity,
                    description: formState.description,
                    unitPrice: formState.unitPrice,
                    discount: absoluteDiscount,
                    tax: formState.tax,
                    imageUrl: formState.imageUrl,
                    subtotal: grossSubtotal - absoluteDiscount,
                });
            }
        } else if (mode === 'exempt') {
            if (formState.unitPrice <= 0) return;
            // Using unitPrice as "Monto" for consistency in the UI
            appendNonTaxable({
                description: formState.description,
                amount: formState.unitPrice
            });
        } else if (mode === 'special_tax') {
            if (formState.unitPrice <= 0) return;
            appendSpecialTax({
                id: crypto.randomUUID(),
                description: formState.description,
                amount: formState.unitPrice,
                type: formState.specialTaxType
            });
        }

        // Reset form, keeping mode but clearing values
        setFormState(prev => ({
            ...prev,
            sku: '',
            description: '',
            unitPrice: 0,
            quantity: 1,
            discountPercent: 0,
            imageUrl: ''
        }));
    };

    const taxOptions: SelectOption[] = [
        { id: 'iva', label: 'IVA 13%', icon: FiCheckCircle, desc: 'Impuesto al Valor Agregado' },
        { id: 'none', label: 'EXENTO', icon: FiX, desc: 'Producto no sujeto a IVA' },
    ];

    const specialTaxTypeOptions: SelectOption[] = [
        { id: 'Gravado', label: 'GRAVADO', icon: FiCheckCircle, desc: 'Sujeto a cálculo adicional' },
        { id: 'Exento', label: 'EXENTO', icon: FiX, desc: 'No genera base imponible' },
    ];

    return (
        <div className="border border-slate-300 mb-4 shadow-sm">
            <div className="bg-slate-800 p-2 flex items-center gap-2">
                <FiPlus className="text-white text-xs" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Selección de Productos y Servicios</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-300 rounded-none bg-white p-0 text-sm max-h-[20rem] h-full">
                {/* Left Side: Master Input Form */}
                <div className="p-2 flex flex-col gap-2 bg-slate-50/50">
                    <div className="flex gap-1 mb-1 border-b border-slate-200 pb-2">
                        <button
                            type="button"
                            onClick={() => setMode('product')}
                            className={`flex-1 text-[10px] font-bold uppercase rounded-none py-1 border ${mode === 'product' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'}`}
                        >
                            Producto
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('exempt')}
                            className={`flex-1 text-[10px] font-bold uppercase rounded-none py-1 border ${mode === 'exempt' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'}`}
                        >
                            No Afecto
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('special_tax')}
                            className={`flex-1 text-[10px] font-bold uppercase rounded-none py-1 border ${mode === 'special_tax' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'}`}
                        >
                            Imp. Esp.
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                        {/* Dynamic Fields based on Mode */}
                        {mode === 'product' && (
                            <>
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="col-span-1">
                                        <label className={labelStyles}>SKU</label>
                                        <input
                                            type="text"
                                            value={formState.sku}
                                            onChange={(e) => setFormState(p => ({ ...p, sku: e.target.value }))}
                                            className={inputStyles}
                                            placeholder="CODE"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className={labelStyles}>Descripción</label>
                                        <input
                                            type="text"
                                            value={formState.description}
                                            onChange={(e) => setFormState(p => ({ ...p, description: e.target.value }))}
                                            className={inputStyles}
                                            placeholder="Nombre del producto..."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className={labelStyles}>Cant.</label>
                                        <input
                                            type="number"
                                            value={formState.quantity}
                                            onChange={(e) => setFormState(p => ({ ...p, quantity: parseFloat(e.target.value) || 0 }))}
                                            className={inputStyles}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelStyles}>P. Unit.</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formState.unitPrice}
                                            onChange={(e) => setFormState(p => ({ ...p, unitPrice: parseFloat(e.target.value) || 0 }))}
                                            className={inputStyles}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Desc. (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formState.discountPercent}
                                            onChange={(e) => setFormState(p => ({ ...p, discountPercent: parseFloat(e.target.value) || 0 }))}
                                            className={inputStyles}
                                            placeholder="0%"
                                        />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <CustomSelect
                                        label="Impuestos"
                                        value={formState.tax}
                                        options={taxOptions}
                                        onSelect={(id) => setFormState(p => ({ ...p, tax: id as any }))}
                                        icon={FiTag}
                                    />
                                </div>
                            </>
                        )}

                        {mode === 'exempt' && (
                            <>
                                <div>
                                    <label className={labelStyles}>Descripción del Monto No Afecto</label>
                                    <input
                                        type="text"
                                        value={formState.description}
                                        onChange={(e) => setFormState(p => ({ ...p, description: e.target.value }))}
                                        className={inputStyles}
                                        placeholder="Ej: Propina, Donación..."
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className={labelStyles}>Monto ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formState.unitPrice} // Reuse unitPrice as amount
                                        onChange={(e) => setFormState(p => ({ ...p, unitPrice: parseFloat(e.target.value) || 0 }))}
                                        className={inputStyles}
                                        placeholder="0.00"
                                    />
                                </div>
                            </>
                        )}

                        {mode === 'special_tax' && (
                            <>
                                <div>
                                    <label className={labelStyles}>Concepto del Impuesto</label>
                                    <input
                                        type="text"
                                        value={formState.description}
                                        onChange={(e) => setFormState(p => ({ ...p, description: e.target.value }))}
                                        className={inputStyles}
                                        placeholder="Ej: Fovial, Ctrans..."
                                        autoFocus
                                    />
                                </div>
                                <div className="w-full">
                                    <label className={labelStyles}>Monto ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formState.unitPrice} // Reuse unitPrice as amount
                                        onChange={(e) => setFormState(p => ({ ...p, unitPrice: parseFloat(e.target.value) || 0 }))}
                                        className={inputStyles}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="w-full">
                                    <CustomSelect
                                        label="Tipo Impuesto"
                                        value={formState.specialTaxType}
                                        options={specialTaxTypeOptions}
                                        onSelect={(id) => setFormState(p => ({ ...p, specialTaxType: id as any }))}
                                        icon={FiAlertCircle}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex gap-1">
                        <button type="button" onClick={handleAddToInvoice} className={`${buttonStyles} ${editingIndex !== null ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                            {editingIndex !== null ? <FiEdit2 className="text-sm" /> : <FiPlus className="text-sm" />}
                            {editingIndex !== null ? 'MODIFICAR ÍTEM' : (mode === 'product' ? 'AGREGAR ÍTEM' : mode === 'exempt' ? 'AGREGAR NO AFECTO' : 'AGREGAR IMPUESTO')}
                        </button>
                        {editingIndex !== null && (
                            <button
                                type="button"
                                onClick={() => {
                                    onCancelEdit();
                                    setFormState(prev => ({
                                        ...prev,
                                        sku: '',
                                        description: '',
                                        unitPrice: 0,
                                        quantity: 1,
                                        discountPercent: 0
                                    }));
                                }}
                                className="bg-slate-200 text-slate-600 px-3 py-2 text-[10px] font-bold uppercase hover:bg-slate-300 transition-colors"
                            >
                                CANCELAR
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Side: Visual Searcher */}
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="p-2 border-b border-slate-200 bg-white">
                        <div className="relative">
                            <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-8 pr-2 py-1.5 border border-slate-300 text-xs rounded-none outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all font-mono"
                                placeholder="BUSCAR EN INVENTARIO (SKU O NOMBRE)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-slate-100 text-[10px] text-slate-500 uppercase font-bold tracking-wider z-10 shadow-sm">
                                <tr>
                                    <th className="p-1.5 border-b border-slate-200 w-12 text-center"><FiBox className="inline" /></th>
                                    <th className="p-1.5 border-b border-slate-200">SKU</th>
                                    <th className="p-1.5 border-b border-slate-200">Producto</th>
                                    <th className="p-1.5 border-b border-slate-200 text-right">Precio</th>
                                    <th className="p-1.5 border-b border-slate-200 text-center w-10">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-slate-100">
                                {filteredProducts.map(product => (
                                    <tr
                                        key={product.id}
                                        onClick={() => handleProductSelect(product)}
                                        className="hover:bg-blue-50 cursor-pointer transition-colors group"
                                    >
                                        <td className="p-2 text-center">
                                            {getProductField(product, 'image') ? (
                                                <img src={getProductField(product, 'image')} alt="" className="h-10 w-10 object-cover rounded-none border border-slate-200 mx-auto" />
                                            ) : (
                                                <div className="h-10 w-10 bg-slate-100 border border-slate-200 mx-auto rounded-none"></div>
                                            )}
                                        </td>
                                        <td className="p-1.5 font-mono text-slate-600 group-hover:text-blue-700">{getProductField(product, 'SKU')}</td>
                                        <td className="p-1.5 text-slate-800 font-medium group-hover:text-blue-900 truncate max-w-[150px]">{getProductField(product, 'Nombre')}</td>
                                        <td className="p-1.5 text-right font-bold text-slate-700 group-hover:text-blue-800">${(getProductField(product, 'Precio') ?? 0).toFixed(2)}</td>
                                        <td className="p-1.5 text-center">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedStockProduct(product);
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-brand-quaternary hover:bg-slate-100 transition-colors"
                                                title="Ver Stock en Sucursales"
                                            >
                                                <FiEye size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400 italic text-xs">
                                            {searchTerm ? "No se encontró ningún producto con ese código o nombre." : "Ingrese un término de búsqueda para ver resultados."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedStockProduct && (
                <StockAvailabilityModal
                    product={selectedStockProduct}
                    onClose={() => setSelectedStockProduct(null)}
                />
            )}
        </div>
    );
};