# Estándares de Validación para Nuevos Endpoints

Cada nuevo endpoint añadido a la API de Nexus ERP debe pasar por un proceso de validación automatizado y manual para asegurar su integridad, seguridad y consistencia con el frontend.

## 1. Verificación de Autenticación

**Contexto Actual:** El frontend actualmente utiliza un **sistema de autenticación simulado** (`src/pages/auth/Auth.tsx`) que no realiza una llamada real a un endpoint de API. Utiliza credenciales maestras hardcodeadas.

**Requerimiento para Nuevos Endpoints:**
Aunque no hay un sistema de autenticación real, cada nuevo endpoint **debe incluir un middleware de validación de token placeholder**. Este middleware debe estar preparado para recibir un token de seguridad (por ejemplo, en el header `Authorization: Bearer <token>`).

El script de prueba para el endpoint debe verificar lo siguiente:
- Que el endpoint devuelva un error `401 Unauthorized` si no se provee ningún token.
- Que el endpoint devuelva un error `403 Forbidden` si se provee un token inválido (se puede usar un valor de prueba como `invalid-token`).
- Que el endpoint procese la solicitud correctamente cuando se provee un token válido (se puede usar el valor de prueba `nexus2026`, que está en el código del frontend).

Esto asegura que la seguridad esté integrada desde el diseño, lista para ser reemplazada por una lógica de validación de token real (ej: JWT, OAuth) en el futuro.

## 2. Validación de Esquema de Datos

La consistencia de los datos entre el frontend y el backend es crítica. El frontend de Nexus ERP utiliza **TypeScript** y **Zod** (implícitamente a través de los stores de Zustand y los formularios) para definir sus modelos de datos.

**Requerimiento:**
Cada script de prueba para un nuevo endpoint debe:
1.  Realizar una llamada a la API.
2.  Tomar la respuesta JSON.
3.  Validar que la estructura de la respuesta coincida **exactamente** con las interfaces definidas en el frontend (ver `reference.md` para las ubicaciones de los tipos).

Por ejemplo, si un endpoint devuelve un listado de usuarios, el script debe verificar que cada objeto en el array de respuesta cumple con la interfaz `UserProps`. Si el endpoint devuelve un producto, debe ser validado contra el esquema dinámico (`DynamicField[]`) definido en el `Inventory`.

Esto previene inconsistencias y reduce la probabilidad de bugs en la integración frontend-backend.
