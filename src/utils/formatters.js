// GridPulse AI - Value Formatters

export function formatCurrency(amount, compact = false) {
  if (amount === undefined || amount === null) return '$0';
  if (compact) {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}
