// src/lib/utils/formatPrice.ts

/**
 * Formats a price with consistent locale settings for both server and client rendering
 * @param price - The price to format
 * @returns Formatted price string
 */
export function formatPrice(price: number | 'Gratuit'): string {
  if (typeof price === 'number') {
    return `${price.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    })} €`;
  }
  return price;
}