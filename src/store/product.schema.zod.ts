import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DynamicField } from '../types/react.hook.form';
import { z } from 'zod'; // Import zod

// Zod Schema for Product
export const productSchema = z.object({
    id: z.string().uuid(),
    sku: z.string().min(1, "SKU es obligatorio."),
    name: z.string().min(1, "Nombre del producto es obligatorio."),
    description: z.string().optional(),
    price: z.number().min(0, "El precio no puede ser negativo."),
    imageUrl: z.string().url().optional(), // Added imageUrl field
});

// Product can have dynamic fields based on the schema
export interface Product extends Record<string, any> {
    id: string;
    sku: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
}

interface InventoryState {
    schema: DynamicField[];
    isConfigured: boolean;
    // Acciones
    setSchema: (newSchema: DynamicField[]) => void;
    resetSchema: () => void;
}

// Tabla usuario con relacion a la tabla almacenes, asignando almacen por usuario
type UserProps = {
    uuid: string;
    name: string;
    email: string;
    role: string;
    warehouseName: string;
}

interface UserStore {
    user: UserProps | null;
    isConfigured: boolean;
    setUser: (newUser: UserProps) => void;
    resetUser: () => void;
}

interface ProductStore {
    products: Product[]; // Use the Zod inferred type
    addProduct: (product: Product) => void;
    removeProduct: (id: string) => void;
    updateProduct: (id: string, updatedData: Partial<Product>) => void; // Partial for updates
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
        (set) => ({
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

            updateProduct: (id: string, updatedData: Partial<Product>) => set((state) => ({
                products: state.products.map(p => p.id === id
                    ? { ...p, ...updatedData }
                    : p
                )
            }))
        }),
        {
            name: import.meta.env.VITE_STORAGE_PRODUCTS || 'nexus-inventory-data-products-v2'
        }
    )
);
interface CompanyProps {
    name: string;
    nit: string;
    giro: string;
    address?: string;
    phone?: string;
    email?: string;
    nrc?: string;
}

interface CompanyStore {
    company: CompanyProps | null;
    setCompany: (company: CompanyProps) => void;
}

export const useCompanyStore = create<CompanyStore>()(
    persist(
        (set) => ({
            company: {
                name: "Nexus Solutions S.A.",
                nit: "0614-123456-101-5",
                nrc: "193042-1",
                email: "nexus.solutions@nexus.com",
                giro: "Servicios Tecnológicos",
                address: "San Salvador, El Salvador",
                phone: "+503 2100-0000"
            },
            setCompany: (company) => set({ company }),
        }),
        {
            name: 'nexus-company-info'
        }
    )
);

// Client Store Integration
import type { AddClientSchema } from '../features/billing/components/add-client.schema';

export interface Client extends AddClientSchema {
    id: string;
}

interface ClientStore {
    clients: Client[];
    addClient: (clientData: AddClientSchema) => Client;
    updateClient: (client: Client) => Client | undefined;
    findClientByDocument: (documentNumber: string, documentType?: string) => Client | undefined;
}

export const useClientStore = create<ClientStore>()(
    persist(
        (set, get) => ({
            clients: [],
            addClient: (clientData) => {
                const { clients } = get();
                const existingClient = clients.find(c => c.documentNumber === clientData.documentNumber);

                if (existingClient) {
                    const updatedClient: Client = { ...existingClient, ...clientData };
                    set({
                        clients: clients.map(c =>
                            c.id === existingClient.id ? updatedClient : c
                        ),
                    });
                    return updatedClient;
                } else {
                    const newClient: Client = {
                        ...clientData,
                        id: crypto.randomUUID(),
                    };
                    set({ clients: [...clients, newClient] });
                    return newClient;
                }
            },
            updateClient: (client) => {
                let updatedClient: Client | undefined;
                set((state) => ({
                    clients: state.clients.map((c) => {
                        if (c.id === client.id) {
                            updatedClient = { ...c, ...client };
                            return updatedClient;
                        }
                        return c;
                    }),
                }));
                return updatedClient;
            },
            findClientByDocument: (documentNumber, documentType) => {
                const { clients } = get();
                return clients.find(c =>
                    c.documentNumber === documentNumber &&
                    (!documentType || c.documentType === documentType)
                );
            },
        }),
        {
            name: 'nexus-billing-clients-v1', // Updated version to force refresh
        }
    )
);
