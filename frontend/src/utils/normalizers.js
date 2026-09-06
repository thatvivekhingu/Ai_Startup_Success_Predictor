import { finiteNumber, formatFeatureLabel, formatSourceDomain } from './formatters';

const pick = (object, keys, fallback = null) => {
  if (!object) return fallback;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(object, key) && object[key] !== null && object[key] !== undefined) {
      return object[key];
    }
  }
  return fallback;
};

const metricValue = (object, ...keys) => finiteNumber(pick(object, keys));

const normalizePercentNumber = (value) => {
  const number = finiteNumber(value);
  if (number === null) return null;
  return Math.abs(number) <= 1 ? number * 100 : number;
};

export const normalizePredictionResult = (raw, source = 'model_response') => {
  if (!raw) return null;
  const contributions = Array.isArray(raw.feature_contributions)
    ? raw.feature_contributions.filter(Boolean).map((item) => ({
      name: item.name || item.feature || 'Feature',
      value: item.value ?? '—',
      impact: item.impact || 'Not returned',
      weight: finiteNumber(item.weight ?? item.importance),
    }))
    : [];

  return {
    ...raw,
    source,
    startupName: raw.startup_name || raw.startupName || 'Unnamed venture',
    primaryCategory: raw.primary_category || raw.primaryCategory || '—',
    countryCode: raw.country_code || raw.countryCode || '—',
    fundingTotalUsd: finiteNumber(raw.funding_total_usd ?? raw.fundingTotalUsd),
    fundingRounds: finiteNumber(raw.funding_rounds ?? raw.fundingRounds),
    successProbability: normalizePercentNumber(raw.success_probability ?? raw.successProbability),
    confidenceScore: normalizePercentNumber(raw.confidence_score ?? raw.confidenceScore),
    statusTier: raw.status_tier || raw.statusTier || 'Result tier unavailable',
    strengths: Array.isArray(raw.strengths) ? raw.strengths : [],
    riskFactors: Array.isArray(raw.risk_factors || raw.riskFactors) ? (raw.risk_factors || raw.riskFactors) : [],
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : [],
    featureContributions: contributions.length ? contributions : (Array.isArray(raw.featureContributions) ? raw.featureContributions : []),
    featureContributionsAvailable: contributions.length > 0,
    sourceState: source === 'saved_record' ? 'reference' : 'source_available',
  };
};

export const normalizeHistoryItem = (raw) => ({
  ...raw,
  id: raw?.id,
  startupName: raw?.startup_name || 'Unnamed venture',
  primaryCategory: raw?.primary_category || '—',
  countryCode: raw?.country_code || '—',
  fundingTotalUsd: finiteNumber(raw?.funding_total_usd),
  fundingRounds: finiteNumber(raw?.funding_rounds),
  successProbability: normalizePercentNumber(raw?.success_probability),
  confidenceScore: normalizePercentNumber(raw?.confidence_score),
  statusTier: raw?.status_tier || 'Result tier unavailable',
  createdAt: raw?.created_at || null,
});

export const normalizeFundingDeal = (raw) => {
  const sourceUrl = raw?.source_url || null;
  return {
    ...raw,
    id: raw?.id,
    startupName: raw?.startup_name || 'Unnamed funding record',
    amount: raw?.amount || '—',
    amountUsd: finiteNumber(raw?.amount_usd),
    round: raw?.round || '—',
    leadInvestors: raw?.lead_investors || '—',
    existingInvestors: raw?.existing_investors || '—',
    sector: raw?.sector || '—',
    valuation: raw?.valuation || '—',
    summary: raw?.summary || 'Summary was not returned for this record.',
    sourceUrl,
    sourceTitle: raw?.source_title || 'Open source',
    sourceDomain: formatSourceDomain(sourceUrl, null),
    sourceState: sourceUrl ? 'source_available' : 'source_unavailable',
    sourceDate: null,
  };
};

export const normalizeFundingStats = (raw) => ({
  totalCapitalFormatted: raw?.total_capital_formatted || '—',
  totalDeals: finiteNumber(raw?.total_deals),
  megaDealsCount: finiteNumber(raw?.mega_deals_count),
  uniqueSectorsCount: finiteNumber(raw?.unique_sectors_count),
});

export const normalizeModelMetrics = (raw) => {
  const rawMetrics = raw?.metrics || {};
  const metricKeys = {
    rocAuc: ['roc_auc', 'ROC-AUC', 'roc-auc', 'rocAuc'],
    accuracy: ['accuracy', 'Accuracy'],
    precision: ['precision', 'Precision'],
    recall: ['recall', 'Recall'],
    f1: ['f1_score', 'F1-Score', 'f1', 'F1'],
  };

  const readMetrics = (source) => Object.fromEntries(Object.entries(metricKeys).map(([key, aliases]) => [key, metricValue(source, ...aliases)]));
  const comparisons = raw?.models_comparison || {};
  const models = Object.entries(comparisons).map(([name, values]) => ({ name, ...readMetrics(values) }));
  const dataset = raw?.dataset_summary || {};

  return {
    bestModel: raw?.best_model || null,
    metrics: readMetrics(rawMetrics),
    models,
    topFeatures: Array.isArray(raw?.top_features)
      ? raw.top_features.map((feature) => ({
        name: formatFeatureLabel(feature?.feature || feature?.name),
        originalName: feature?.feature || feature?.name || null,
        importance: finiteNumber(feature?.importance),
      }))
      : [],
    datasetSummary: {
      totalRows: finiteNumber(dataset.total_rows),
      resolvedRows: finiteNumber(dataset.resolved_rows),
      operatingCount: finiteNumber(dataset.operating_count),
      acquiredCount: finiteNumber(dataset.acquired_count),
      closedCount: finiteNumber(dataset.closed_count),
      ipoCount: finiteNumber(dataset.ipo_count),
    },
    topCategories: Array.isArray(raw?.top_categories) ? raw.top_categories : [],
    topCountries: Array.isArray(raw?.top_countries) ? raw.top_countries : [],
    trainedAt: raw?.trained_at || null,
  };
};

export const normalizeGujaratSchemes = (raw) => Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];

export const normalizeDistrictDirectory = (raw) => ({
  districts: Array.isArray(raw?.districts) ? raw.districts : [],
  directory: raw?.directory || {},
});

export const normalizeNews = (raw) => Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];

export const deriveResourceStatus = ({ data, error, loading, previousData = null }) => {
  if (loading && !data && !previousData) return 'loading';
  if (error && (data || previousData)) return 'stale';
  if (error) return 'error';
  if (Array.isArray(data) && data.length === 0) return 'empty';
  if (data === null || data === undefined) return 'unavailable';
  return 'ready';
};
