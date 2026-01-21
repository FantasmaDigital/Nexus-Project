---
name: dte-facturacion-final
description: Skill integral para DTE Tipo 01, Gestión Express de Clientes y Selector de Inventario Visual 50/50. Especialista en optimización de flujo de facturación y cumplimiento legal de Hacienda en El Salvador.
---

# SKILL: Facturación DTE y Administración de Clientes - Nexus ERP

## 1. Misión y Propósito
Actuar como el motor experto de **DTE Tipo 01** y gestión de receptores para **Nexus ERP**. Garantiza un proceso legalmente impecable y visualmente coherente con el módulo de **Inventario**, optimizando la velocidad de captura mediante interfaces divididas, búsquedas visuales y formularios de un solo paso.

## 2. Gestión Express de Clientes (Añadir Nuevo Cliente)
Registro mediante un **Modal Lateral (Drawer)** con bordes `rounded-none`. La configuración fiscal es la fuente de verdad para el cálculo de impuestos.

### A. Configuración Fiscal Universal (Persona y Empresa)
* **Atributos de Contribuyente (Checkboxes)**: Aplicables a ambos perfiles para automatizar la liquidación:
    * `Exento de Impuestos`: Inhabilita el cargo de IVA 13% en los ítems gravados.
    * `Sujeto a Retención`: Calcula automáticamente la Retención IVA 1% en facturas superiores a $100.
    * `Cliente de Exportación`: Aplica tasa 0% y requiere validación de país destino.
    * `Gobierno / No Sujeto`: Para regímenes especiales de Hacienda.

### B. Segmentación de Datos y Validación de Identidad
* **PERSONA**: 
    * **Identificación**: Selector obligatorio de `Tipo de Documento` (DUI, NIT, PASAPORTE, OTRO) seguido del campo numérico de `No. de Documento`.
    * **Datos Personales**: Nombre Completo y Teléfono (Formato +503 9999-9999).
    * **Contacto y Ubicación**: Correo electrónico y Ubicación predictiva (Departamento/Municipio).
* **EMPRESA**: 
    * **Datos Fiscales**: Nombre Comercial, NRC, NIT y Teléfono de contacto.
    * **Perfil**: Selector de Giro (Actividad Económica) con buscador por palabras clave.

## 3. Selector de Productos Visual "Split 50/50"
Interfaz de adición de ítems dividida simétricamente para maximizar la comodidad del operador:

* **Lado Izquierdo (50% - Formulario de Entrada Rápida)**:
    * **Campos**: Código/SKU, Descripción, Cantidad, Precio Unitario y Descuento.
    * **Botón Maestro**: "AÑADIR A FACTURA" (`bg-brand-quaternary`, `rounded-none`).
* **Lado Derecho (50% - Buscador Visual en Tiempo Real)**:
    * **Barra de Búsqueda**: Filtrado instantáneo por Código, Nombre o Atributos.
    * **Grid de Resultados**: Muestra Imagen miniatura, SKU, Nombre del producto y Precio actual.
    * **Interacción**: Al seleccionar un resultado, se pueblan instantáneamente todos los campos del formulario izquierdo para su edición y confirmación.

## 4. Cuerpo Unificado del DTE (Items)
Para evitar la repetición de campos y asegurar el cumplimiento legal, se utiliza una sola tabla de control con acciones modales específicas:

* **Tabla de Gestión**: Columnas para Cantidad, Descripción, P. Unitario, Impuestos (IVA 13% / Exento), Descuento y Subtotal.
* **Acciones de Adición Especial (Modales dedicados)**:
    1.  **Añadir Ítem**: Abre el selector visual 50/50.
    2.  **Añadir Monto No Afecto**: Diálogo para registrar operaciones que no generan IVA (ej: propinas, tasas municipales).
    3.  **Añadir Impuesto Especial**: Selector para "Otros impuestos casos especiales", permitiendo definir descripción, monto y tipo de afección.

## 5. Especificaciones Técnicas y Visuales (IA Instructions)
1.  **Hard-Edge Design**: Prohibido el uso de esquinas suavizadas. Todo componente debe llevar `rounded-none`.
2.  **Densidad Operativa**: Padding estándar `p-1` en celdas y `p-2` en contenedores.
3.  **Sincronización de Datos**: Usa `product.schema.zod.ts` como base para el buscador en tiempo real.
4.  **Resumen de Liquidación**: El pie de página debe mostrar desglosados la Retención IVA 1%, el Sub-Total, el Monto No Afecto y el Total a Pagar.