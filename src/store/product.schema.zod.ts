import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DynamicField } from '../types/react.hook.form';

interface InventoryState {
    schema: DynamicField[];
    isConfigured: boolean;
    // Acciones
    setSchema: (newSchema: DynamicField[]) => void;
    resetSchema: () => void;
}

interface ProductStore {
    products: any[];
    addProduct: (product: any) => void;
    removeProduct: (id: string) => void;
    updateProduct: (id: string, updatedData: any) => void;
}

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set) => ({
            schema: [],
            isConfigured: false,
            setSchema: (newSchema) => set({
                schema: newSchema,
                isConfigured: true
            }),
            resetSchema: () => set({
                schema: [],
                isConfigured: false
            }),
        }),
        {
            name: 'nexus-inventory-schema',
        }
    )
);

export const useProductStore = create<ProductStore>()(
    persist(
        (set) => ({
            products: [],
            
            addProduct: (product) => set((state) => ({
                products: [product, ...state.products]
            })),

            removeProduct: (id: string) => set((state) => ({
                products: state.products.filter(p => p.id !== id)
            })),

            updateProduct: (id: string, updatedData: any) => set((state) => ({
                products: state.products.map(p => p.id === id 
                    ? { ...p, ...updatedData } 
                    : p
                )
            }))
        }),
        { 
            name: 'nexus-inventory-data-products' 
        }
    )
);
