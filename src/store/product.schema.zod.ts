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

// Tabla usuario con relacion a la tabla almacenes, asignando almacen por usuario
type UserProps= {
    uuid: string;
    name: string;
    email: string;
    role: string;
    warehouseName: string;
}

interface UserStore{
    user: UserProps | null;
    isConfigured: boolean;
    setUser: (newUser: UserProps) => void;
    resetUser: () => void;
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

export const useWarehouseStore = create<any>()(
    persist(
        (set)=>({
            warehouses: [],
            isConfigured: false,
            setWarehouses: (newWarehouses: any[]) => set({
                warehouses: newWarehouses,
                isConfigured: true
            }),
            resetWarehouses: () => set({
                warehouses: [],
                isConfigured: false
            }),
        }),
        {
            name: 'nexus-inventory-warehouses'
        }
    )
);

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            isConfigured: false,
            setUser: (newUser: UserProps) => set({
                user: newUser,
                isConfigured: true
            }),
            resetUser: () => set({
                user: null,
                isConfigured: false
            }),
        }),
        {
            name: 'nexus-inventory-user'
        }
    )
)

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
