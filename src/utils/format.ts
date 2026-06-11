export function formatPrice(price: number): string {
  if (price == null || isNaN(price)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatChange(change: number): string {
  if (change == null || isNaN(change)) return '—';
  const prefix = change >= 0 ? '+' : '';
  return `${prefix}${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(change)}`;
}

export function formatPercent(value: number): string {
  if (value == null || isNaN(value)) return '—';
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function getChangeClass(value: number): string {
  if (value > 0) return 'price-positive';
  if (value < 0) return 'price-negative';
  return 'price-neutral';
}

export function getRowClass(value: number): string {
  if (value > 0) return 'row-positive';
  if (value < 0) return 'row-negative';
  return 'row-neutral';
}

export function getBadgeClass(value: number): string {
  if (value > 0) return 'badge-positive';
  if (value < 0) return 'badge-negative';
  return 'badge-neutral';
}

export function getArrow(value: number): string {
  if (value > 0) return '▲';
  if (value < 0) return '▼';
  return '—';
}
