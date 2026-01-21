// src/utils/tax.utils.ts

/**
 * Constantes de impuestos para El Salvador.
 */
export const TAX_RATES = {
  IVA: 0.13,         // 13% Impuesto al Valor Agregado
  IVA_RETENTION: 0.01, // 1% Retención de IVA a grandes contribuyentes
};

/**
 * Calcula el monto del IVA (13%) para un subtotal dado.
 * @param subtotal - El monto base sobre el cual calcular el impuesto.
 * @returns El monto del IVA.
 */
export const calculateIVA = (subtotal: number): number => {
  if (subtotal <= 0) return 0;
  return subtotal * TAX_RATES.IVA;
};

/**
 * Calcula el monto de la retención de IVA (1%) para un subtotal dado.
 * Esto aplica generalmente cuando se factura a un gran contribuyente.
 * @param subtotal - El monto base sobre el cual calcular la retención.
 * @returns El monto de la retención de IVA.
 */
export const calculateIVARetention = (subtotal: number): number => {
  if (subtotal <= 0) return 0;
  return subtotal * TAX_RATES.IVA_RETENTION;
};

/**
 * Calcula el total de una factura, incluyendo impuestos y retenciones.
 * @param subtotal - El subtotal de los productos/servicios.
 * @param iva - El monto de IVA calculado.
 * @param ivaRetention - El monto de retención de IVA (si aplica, de lo contrario 0).
 * @returns El total final a pagar.
 */
export const calculateGrandTotal = (subtotal: number, iva: number, ivaRetention: number = 0): number => {
  const total = subtotal + iva - ivaRetention;
  return total > 0 ? total : 0;
};
