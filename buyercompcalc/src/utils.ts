/**
 * Parse a currency string like "$1,234,567" or "1234567" into a number.
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format a raw number string into a display-friendly currency string.
 * Used for input field display.
 */
export function formatInputCurrency(value: string): string {
  const num = parseCurrency(value);
  if (num === 0 && value === '') return '';
  return num.toLocaleString('en-US');
}
