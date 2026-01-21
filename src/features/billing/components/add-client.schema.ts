import { z } from 'zod';

export const addClientSchema = z.object({
  clientType: z.enum(['person', 'company']).default('person'),
  documentType: z.enum(['DUI', 'NIT', 'PASAPORTE', 'OTRO']).default('DUI'),
  documentNumber: z.string().min(1, "El número de documento es obligatorio."),
  name: z.string().min(1, "El nombre o razón social es obligatorio."),
  email: z.string().email("Correo electrónico inválido."),
  phone: z.string().regex(/^\+503 \d{4}-\d{4}$/, "Formato inválido (+503 9999-9999)"),

  // Company specific
  tradeName: z.string().optional(), // Nombre Comercial
  nrc: z.string().optional(), // Registro de Contribuyente

  // Address
  department: z.string().min(1, "El departamento es obligatorio."),
  municipality: z.string().min(1, "El municipio es obligatorio."),
  address: z.string().optional(),

  // Fiscal
  economicActivity: z.string().optional(),
  isExempt: z.boolean().default(false),
  isRetentionSubject: z.boolean().default(false),
  isExportClient: z.boolean().default(false),
  isGovernmentNoSubject: z.boolean().default(false),
});

export type AddClientSchema = z.infer<typeof addClientSchema>;
