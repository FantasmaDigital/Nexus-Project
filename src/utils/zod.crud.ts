import { useInventoryStore } from "../store/product.schema.zod";
import type { DynamicField } from "../types/react.hook.form";

export const saveSchema = (fields: DynamicField[]) => {
    const finalSchema: any[] = fields
        .filter(f => f.keyName.trim() !== "")
        .map(({ keyName, type }) => ({ keyName, type }));

    // USAR getState() para acceder al store sin hooks
    useInventoryStore.getState().setSchema(finalSchema);

    alert("Guardado desde utilidad externa");
};
