export const finiteNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : null;
};

export const percentValue = (value) => {
  const number = finiteNumber(value);
  if (number === null) return null;
  return Math.abs(number) <= 1 ? number * 100 : number;
};

export const formatPercent = (value, fallback = '—') => {
  const number = percentValue(value);
  return number === null ? fallback : `${number.toFixed(1)}%`;
};

export const formatCurrencyUsd = (value, fallback = '—') => {
  const number = finiteNumber(value);
  if (number === null) return fallback;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: number >= 1000000 ? 1 : 0,
    notation: number >= 1000000 ? 'compact' : 'standard',
  }).format(number);
};

export const formatCount = (value, fallback = '—') => {
  const number = finiteNumber(value);
  return number === null ? fallback : new Intl.NumberFormat('en-IN').format(number);
};

export const formatDate = (value, fallback = '—') => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

export const formatDateTime = (value, fallback = '—') => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
};

export const formatMetric = (value, fallback = '—') => formatPercent(value, fallback);

export const formatFeatureLabel = (value, fallback = 'Unknown feature') => {
  if (!value || typeof value !== 'string') return fallback;
  return value
    .replace(/^(num__|cat__)/, '')
    .replace(/_clean$/i, '')
    .replace(/_usd$/i, ' (USD)')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export const formatSourceDomain = (value, fallback = 'Source unavailable') => {
  if (!value) return fallback;
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return fallback;
  }
};

export const initials = (value = 'SP') => String(value).trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'SP';
