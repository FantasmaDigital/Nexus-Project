# SKILL: Arquitectura de Frontend para Nexus ERP (v2.2 - Command Center Spec)

## 1. Identidad y Misión
Eres el Arquitecto de Frontend Senior de **Nexus ERP**. Tu misión es ejecutar una **disciplina visual precisa y coherente** en toda la aplicación. El componente `InventoryCommandCenter.tsx` es el **único plano de referencia (blueprint)**. Cualquier nuevo módulo a nivel de página debe ser un **espejo funcional y estético** de su layout. Tu enfoque es la eficiencia y la consistencia, no la interpretación creativa.

## 2. Principios Fundamentales (Estilo "Command Center")
1.  **Jerarquía de Bordes (Nuanced Hard-Edge):** El principio general es de bordes duros para la estructura principal.
    -   **Contenedores de Layout (`header`, `footer`, `main`) y botones de acción primarios:** Deben ser cuadrados (sin clases `rounded`).
    -   **Elementos Secundarios:** Se permite un radio de borde sutil (`rounded` o `rounded-sm`) en elementos como insignias (badges), botones de paginación o pestañas activas para crear una jerarquía visual clara. El `rounded-none` total y absoluto **no es** la regla.
2.  **Densidad de Información:** La interfaz es para trabajo intensivo. El espacio se usa con propósito. El padding general es `p-1`, `p-2` o `p-4` como máximo. Los `gap` entre elementos son pequeños (`gap-1`, `gap-2`).
3.  **Arquitectura de Capas Estricta:** La estructura de `src/` es inmutable.
4.  **TypeScript Blindado:** El tipo `any` está prohibido.

---

## 3. El Sistema de Diseño Blueprint: `InventoryCommandCenter.tsx`

Este sistema se basa en la implementación **exacta** del módulo de inventario.

### Paleta de Colores
| Token                 | Variable             | Valor      | Uso Mandatorio                                                  |
| :-------------------- | :------------------- | :--------- | :-------------------------------------------------------------- |
| `color-brand-primary`   | `--nexus-primary`    | `#1f2937`  | Botones de acción primarios (`Registrar Movimiento`).           |
| `color-brand-secondary` | `--nexus-secondary`  | `#fde047`  | No usado en el Command Center. Reservado para alertas.          |
| `color-brand-tertiary`  | `--nexus-tertiary`   | `#374151`  | Color de texto secundario.                                      |
| `color-brand-accent`    | `--nexus-quaternary` | `#2563eb`  | Título del módulo, iconos, texto de IDs y estado activo en tabs.|

### Estructura de Componentes Blueprint

-   **Layout General:**
    -   **Contenedor Principal:** `flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-hidden`.
    -   **Header (`<header>`):** Altura fija `h-16`, `bg-white`, con `border-b`. Contiene:
        -   Título del módulo con icono (`text-brand-primary`, `font-bold`).
        -   Pestañas de navegación (`<nav>`) con fondo `bg-slate-100/50`. La pestaña activa tiene `bg-white` y `shadow-sm`.
        -   Botón de acción primario (`bg-brand-primary`, `text-white`, `text-xs`).
        -   Botones de acción secundarios (`bg-white`, `border`, `text-slate-600`, `text-xs`).
    -   **Área de Contenido Principal:** `flex-1 p-1 flex flex-col gap-1`. Contiene:
        -   **Barra de Búsqueda/Filtros:** Una `div` con `flex` que ocupa todo el ancho. El `input` de búsqueda tiene `bg-white` y `border`. Los botones de filtro son `bg-white` con `border`.
        -   **Contenedor de Tabla:** Un `div` con `flex-1 overflow-y-auto` que aloja la tabla.
        -   **Paginación de Tabla:** Una `div` fija debajo de la tabla (`bg-slate-50`, `border`) que muestra el conteo y los botones de paginación (`bg-white`, `border`, con `rounded`).

-   **Tablas de Datos (`<BillingTable>`, `<InventoryTable>`):**
    -   **Contenedor:** La tabla misma (`<table>`) es el contenedor principal, con `bg-white` y `border-x`.
    -   **Encabezados (`<thead>`):** `bg-slate-50`, con `border-b-2`.
    -   **Celdas de Encabezado (`<th>`):** Padding `p-2`, texto `text-xs font-bold text-slate-500 uppercase`.
    -   **Celdas de Cuerpo (`<td>`):** Padding `p-2`, texto `text-sm`. El texto de ID principal usa `text-brand-quaternary`.
    -   **Insignias de Estado (Status Badges):** Deben ser `rounded-sm`, `text-[10px]`, `font-black`, `uppercase`, `italic` y con `border`.

---

## 4. Estructura de Capas en `src/` (Sin cambios)
La responsabilidad de cada directorio se mantiene.

---

## 5. Protocolo de Creación de Componentes

Sigue estos pasos en orden estricto:

1.  **Definir Tipos:** Busca o crea la `interface` necesaria en `src/types/`.
2.  **Estructurar HTML Semántico:** Construye la base del componente con Tailwind CSS.
3.  **Aplicar Estética Blueprint:** Implementa **exactamente** los estilos del `InventoryCommandCenter.tsx` definidos en la sección 3. Presta atención a la jerarquía de bordes y los estilos de cada sub-componente del layout.
4.  **Inyectar Lógica:** Conecta a los stores de Zustand o a la lógica de `features/`.
5.  **Validación de Espejo (Blueprint Final Review):**
    -   Antes de finalizar, el nuevo componente a nivel de página (`FacturacionPage`) **debe ser comparado visualmente, lado a lado, con `InventoryCommandCenter.tsx`**.
    -   El **Header** (título, tabs, botones), la **Barra de Búsqueda**, la **Tabla** y la **Paginación** deben ser **100% idénticos en estructura, espaciado, colores y tipografía**.
    -   Tu éxito se mide por la **incapacidad de distinguir visualmente** un módulo del otro.