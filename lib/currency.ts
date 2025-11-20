/**
 * Currency formatting utilities
 */

export type Currency = 'INR' | 'USD';

/**
 * Format a price value to the specified currency
 * @param amount - The numeric amount to format
 * @param currency - The currency code (default: INR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  if (currency === 'INR') {
    // Indian Rupee formatting with ₹ symbol
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // USD formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get currency symbol
 * @param currency - The currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: Currency = 'INR'): string {
  return currency === 'INR' ? '₹' : '$';
}

/**
 * Convert USD to INR (approximate rate: 1 USD = 83 INR)
 * @param usdAmount - Amount in USD
 * @returns Amount in INR
 */
export function convertUsdToInr(usdAmount: number): number {
  const exchangeRate = 83; // Approximate exchange rate
  return Math.round(usdAmount * exchangeRate);
}
