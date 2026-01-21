# Referencia de Implementación para API Endpoints en Nexus ERP

## 1. Estándares de Facturación (El Salvador - DTE)

Todos los endpoints que generen o procesen información de facturación deben adherirse a los requerimientos del **Documento Tributario Electrónico (DTE)** de El Salvador.

### Campos Requeridos en Objetos JSON

Cualquier estructura de datos (DTO) relacionada con clientes, empresas o transacciones de venta debe incluir, como mínimo, los siguientes campos para cumplir con la normativa de Hacienda:

- `nit` (string): Número de Identificación Tributaria del cliente o empresa. Formato: `XXXX-XXXXXX-XXX-X`.
- `nrc` (string): Número de Registro de Contribuyente.
- `giro` (string): Actividad económica principal del contribuyente.
- `iva` (number): El Impuesto al Valor Agregado debe ser calculado y aplicado como un **13%** (0.13) sobre los bienes o servicios, a menos que se especifique una exención.

### Ejemplo de Estructura para una Compañía:

El frontend utiliza una estructura similar a esta en su store de Zustand (`useCompanyStore`), la cual debe ser el modelo para las respuestas de la API.

```typescript
interface Company {
  name: string;
  nit: string;
  nrc: string;
  giro: string;
  address?: string;
  phone?: string;
  email?: string;
}
```

## 2. Modelos de Datos del Frontend

La API debe ser consistente con los modelos de datos definidos en el frontend. Antes de crear un endpoint, revise las interfaces y tipos en:

- `src/store/product.schema.zod.ts`: Contiene los stores de Zustand con las interfaces para `UserProps`, `CompanyProps`, `Product`, etc.
- `src/types/react.hook.form.ts`: Define la estructura `DynamicField`, que es crucial para los esquemas de productos dinámicos. Un producto en la base de datos debe poder almacenar un objeto JSON que se alinee con un array de estos campos.

### Ejemplo de Usuario (`UserProps`):
```typescript
interface UserProps {
    uuid: string;
    name: string;
    email: string;
    role: string;
    warehouseName: string;
}
```

Cualquier endpoint relacionado con usuarios (`/api/users`, `/api/admin/users`) debe devolver objetos que sigan esta estructura.
