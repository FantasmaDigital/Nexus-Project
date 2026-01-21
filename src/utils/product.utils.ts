/**
 * Robustly retrieves a field value from a product object, 
 * supporting case-insensitivity and common aliases.
 */
export const getProductField = (obj: any, key: string): any => {
    if (!obj) return undefined;

    // Direct match
    if (obj[key] !== undefined) return obj[key];

    const lowerKey = key.toLowerCase();

    // Fallbacks for standard fields
    if (lowerKey === 'sku') {
        return obj.sku ?? obj.SKU ?? obj.sku_code ?? obj.id;
    }

    if (lowerKey === 'nombre' || lowerKey === 'name' || lowerKey.includes('producto')) {
        return obj.nombre ?? obj.name ?? obj.product_name ?? obj.Nombre;
    }

    if (lowerKey === 'precio' || lowerKey === 'price') {
        return obj.precio ?? obj.price ?? obj.unit_price ?? obj.Precio;
    }

    if (lowerKey === 'stock' || lowerKey === 'existencia' || lowerKey === 'quantity') {
        return obj.stock ?? obj.existencia ?? obj.quantity ?? obj.Stock ?? 0;
    }

    if (lowerKey === 'descuento' || lowerKey === 'discount') {
        return obj.descuento ?? obj.discount ?? obj.Descuento ?? 0;
    }

    if (lowerKey === 'bodega' || lowerKey === 'warehouse') {
        return obj.bodega ?? obj.warehouse ?? obj.warehouseName ?? obj.Bodega;
    }

    if (lowerKey === 'image' || lowerKey === 'imageurl' || lowerKey === 'imagen' || lowerKey === 'foto') {
        // Try exact match aliases first
        const imageAliases = ['image', 'imageurl', 'imagen', 'foto', 'img', 'photo', 'url', 'avatar', 'logo', 'thumbnail', 'picture'];
        const foundImageKey = Object.keys(obj).find(k => {
            const kl = k.toLowerCase().trim();
            return imageAliases.some(alias => kl === alias || kl.includes(alias));
        });

        if (foundImageKey && obj[foundImageKey]) return obj[foundImageKey];

        // Fallback to manual check of common properties
        const val = obj.image ?? obj.imageUrl ?? obj.Imagen ?? obj.imagen ?? obj.img ?? obj.foto ?? obj.Foto ?? obj.photo ?? obj.Url ?? obj.URL;
        if (val) return val;

        // Last resort: search in all string values for something that looks like an image (base64 or URL)
        const possibleUrl = Object.values(obj).find(v =>
            typeof v === 'string' && (v.startsWith('data:image') || v.startsWith('http'))
        );
        if (possibleUrl) return possibleUrl;
    }

    // Case-insensitive direct match
    const foundKey = Object.keys(obj).find(k => k.toLowerCase() === lowerKey);
    if (foundKey) return obj[foundKey];

    // Search in nested details if they exist
    if (obj.details && typeof obj.details === 'object') {
        return getProductField(obj.details, key);
    }

    return undefined;
};
