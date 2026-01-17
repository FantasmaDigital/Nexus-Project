export interface DynamicField {
    id: string;
    keyName: string; // Nombre de la clave (ej: "descripcion_tecnica")
    type: 'text' | 'number' | 'date' | 'large-text' | 'image' | 'currency' | 'boolean' | 'price' | 'discount'; // Tipo de dato
    required?: boolean;
}