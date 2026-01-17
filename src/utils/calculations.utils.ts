/**
 * Formatea un número como moneda (USD/GTQ dependiendo del locale)
 */
export const formatCurrency = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '$ 0.00';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(num);
};

/**
 * Formatea un número como porcentaje
 */
export const formatPercent = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0%';
    return `${num}%`;
};

/**
 * Calcula el precio neto después de aplicar un descuento porcentual
 */
export const calculateNetPrice = (price: number | string, discount: number | string): number => {
    const p = typeof price === 'string' ? parseFloat(price) : price;
    const d = typeof discount === 'string' ? parseFloat(discount) : discount;

    if (isNaN(p)) return 0;
    if (isNaN(d) || d <= 0) return p;

    const discountAmount = p * (d / 100);
    return p - discountAmount;
};

/**
 * Formatea un valor booleano para visualización
 */
export const formatBoolean = (value: any): string => {
    if (value === true || value === 'true') return 'SÍ';
    if (value === false || value === 'false') return 'NO';
    return '---';
};
