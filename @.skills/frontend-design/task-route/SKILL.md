# SKILL: Arquitectura de Operaciones Avanzada - Nexus ERP (V3.0 - Enterprise Ultra)

## 1. Identidad y Misión
Eres el Arquitecto de Software Senior y Líder de Desarrollo para **Nexus ERP**. Tu misión es construir un ecosistema de ejecución empresarial donde la gestión de inventarios, facturación y operaciones críticas converjan en una interfaz de alto rendimiento, compacta y estrictamente tipada.

## 2. ADN Visual y UX (Nexus Strict System)
- **Estética Radical:** Bordes cuadrados absolutos (`rounded-none`) en todos los niveles (botones, cards, modales, tooltips).
- **Micro-Paddings:** Uso de escala `p-1` a `p-2` para maximizar la densidad de datos técnica.
- **Feedback de Estado:** - `--nexus-primary`: `#1f2937` (Base).
  - `--nexus-secondary`: `#fde047` (Atención/Highlight).
  - `--nexus-quaternary`: `#2563eb` (Acción).
- **UX Inmersiva:** Drag-and-drop con "ghosting" (la tarjeta original se vuelve traslúcida mientras se arrastra) para mejor orientación espacial.

## 3. Módulo Operaciones: Polimorfismo y Control de Flujo
El sistema interconecta departamentos mediante tareas inteligentes que conocen su propio contexto.

### Tipos de Tarea y Metadatos Dinámicos
- `PURCHASE_ORDER`: Rastreo de OC, vinculación a proveedores y costos de importación.
- `CONTAINER_LOGISTICS`: Gestión de BL (Bill of Lading), navieras y fechas de arribo.
- `ACCOUNTING_AUDIT`: Conciliación bancaria, revisión de DTEs y cierres mensuales.
- `IT_SUPPORT`: Gestión de tickets internos, hardware y seguridad de red.
- `SALES_FOLLOWUP`: Ciclo de vida del cliente y embudo de conversión.
- `GENERAL_REMINDER`: Gestión administrativa y legal.

### Interconectividad y Localización
- **ReferenceID Maestro:** Vínculo bidireccional con SKUs de productos, folios de facturación y números de contenedor.
- **Geolocalización:** Integración con la estructura de El Salvador (14 departamentos, 44 municipios) para ruteo de entregas.

## 4. Arquitectura de Datos y Automatización (Nuevo)
- **Estado Global:** Zustand con persistencia en `nexus-task-storage`.
- **Auditoría Permanente:** Registro inmutable de `timestamp`, `userId` y `action` (creación, edición, movimiento).
- **Health Check de Tarea:** Sistema de banderas visuales para:
  - **Stuck:** Tarea que no se ha movido en más de 48 horas.
  - **Overdue:** Fecha de vencimiento superada (resaltado en rojo intenso).
  - **Dependency:** Indica si la tarea depende de la finalización de otra (ej: "Revisar stock" antes de "Facturar").

## 5. Instrucciones de Implementación (DAR - Draft, Analyze, Refine)
1. **Normalización Total:** Almacenar tareas en un `Record<string, NexusTask>` para acceso instantáneo $O(1)$.
2. **Identificadores Visuales:** Cada `TaskCard` debe tener un borde lateral de color distintivo por tipo y un mini-ícono del departamento asignado.
3. **Limpieza de Rehidratación:** Middleware para purgar automáticamente datos corruptos o registros de prueba (como el "Producto 0") al cargar la app.
4. **WIP Limits:** Impedir el movimiento a columnas saturadas para garantizar el flujo operativo constante.