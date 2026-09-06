import React, { useMemo } from 'react';
import { BarChart3, Database, RefreshCw } from 'lucide-react';
import { analyticsAPI, predictionAPI } from '../api';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { formatCount, formatDate, formatMetric } from '../utils/formatters';
import { normalizeModelMetrics } from '../utils/normalizers';
import { Button, EmptyState, ErrorState, EvidenceBadge, PageHeader, SkeletonRows, StatePanel } from '../components/workspace/UiPrimitives';

const MetricsTable = ({ models, bestModel }) => (
  <div className="sp-table-wrap">
    <div className="sp-table-scroll-hint">Comparison fields remain visible together; missing values show an em dash rather than a fabricated percentage.</div>
    <table className="sp-table"><thead><tr><th>Model</th><th>ROC-AUC</th><th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1</th></tr></thead><tbody>
      {models.map((model) => <tr key={model.name}><td><strong>{model.name}</strong>{model.name === bestModel && <span className="ml-2"><EvidenceBadge state="source">Selected</EvidenceBadge></span>}</td><td className="sp-table-num">{formatMetric(model.rocAuc)}</td><td className="sp-table-num">{formatMetric(model.accuracy)}</td><td className="sp-table-num">{formatMetric(model.precision)}</td><td className="sp-table-num">{formatMetric(model.recall)}</td><td className="sp-table-num">{formatMetric(model.f1)}</td></tr>)}
    </tbody></table>
  </div>
);

const FeatureImportanceList = ({ features }) => (
  <div className="grid gap-3">{features.slice(0, 10).map((feature) => {
    const value = feature.importance === null ? null : Math.min(100, feature.importance * 100);
    return <div key={feature.originalName || feature.name}><div className="flex justify-between gap-3 text-xs"><span className="font-semibold">{feature.name}</span><span className="sp-mono text-sp-cobalt">{value === null ? '—' : `${value.toFixed(1)}%`}</span></div><div className="mt-2 h-2 overflow-hidden rounded-sm bg-[#e0e6ee]">{value !== null && <div className="h-full" style={{ width: `${value}%`, backgroundColor: 'var(--sp-cobalt)' }} />}</div></div>;
  })}</div>
);

const DatasetStat = ({ label, value, color }) => <div className="sp-toggle-row"><span className="text-xs font-semibold">{label}</span><span className="sp-mono text-sm font-bold" style={{ color }}>{formatCount(value)}</span></div>;

const ModelEvidencePage = () => {
  const resource = useAsyncResource(async () => { const [metricsResponse, presetsResponse] = await Promise.all([analyticsAPI.getModelMetrics(), predictionAPI.getPresets()]); return { metrics: metricsResponse.data, presets: presetsResponse.data || [] }; }, [], { normalize: (value) => ({ ...normalizeModelMetrics(value.metrics), presets: value.presets }) });
  const model = resource.data;
  const referenceRows = useMemo(() => (model?.presets || []).filter((preset) => preset.is_gujarat_based || ['Zerodha', 'Zepto', 'Razorpay'].some((name) => preset.name?.startsWith(name))).slice(0, 6), [model?.presets]);

  return <div className="sp-page"><PageHeader eyebrow="03 / Evidence" title="Model evidence" description="Review the model quality, training composition, and feature weights that sit behind an estimate." actions={<Button variant="secondary" onClick={resource.retry}><RefreshCw size={14} />Refresh evidence</Button>} status={<><span>Metrics are rendered only when returned by the model endpoint. Missing fields remain explicit.</span><span>{model?.trainedAt ? `Trained ${formatDate(model.trainedAt)}` : 'Training date not returned'}</span></>} />
    {resource.status === 'loading' && <div className="sp-panel p-5"><SkeletonRows count={7} /></div>}
    {resource.status === 'error' && <ErrorState title="Model evidence unavailable" description="The analytics endpoint did not return a usable response. Retry to inspect model evidence." onRetry={resource.retry} />}
    {resource.status === 'ready' && model && <>
      <section className="sp-panel"><div className="sp-panel-header"><div className="sp-panel-heading"><span className="sp-eyebrow">Performance comparison</span><h2 className="sp-panel-title">{model.bestModel || 'Model'} · returned metrics</h2><p className="sp-panel-subtitle">Current model endpoint response. Missing comparison values are not backfilled from old screenshots or static constants.</p></div><EvidenceBadge state={model.models.length ? 'source' : 'reference'}>{model.models.length ? 'Endpoint response' : 'No comparison rows'}</EvidenceBadge></div><div className="sp-panel-body">{model.models.length ? <MetricsTable models={model.models} bestModel={model.bestModel} /> : <EmptyState title="No model comparison rows returned" description="The endpoint returned no algorithm comparison data. Retry when the analytics service is available." action={<Button variant="secondary" onClick={resource.retry}>Retry</Button>} />}</div><div className="sp-stat-row"><div className="sp-stat"><span className="sp-stat-label">Training rows</span><span className="sp-stat-value">{formatCount(model.datasetSummary.totalRows)}</span></div><div className="sp-stat"><span className="sp-stat-label">Acquisitions</span><span className="sp-stat-value is-teal">{formatCount(model.datasetSummary.acquiredCount)}</span></div><div className="sp-stat"><span className="sp-stat-label">Public IPOs</span><span className="sp-stat-value">{formatCount(model.datasetSummary.ipoCount)}</span></div><div className="sp-stat"><span className="sp-stat-label">Data state</span><span className="sp-stat-value is-amber text-sm">{resource.status === 'stale' ? 'Needs refresh' : 'Returned'}</span></div></div></section>
      <div className="sp-grid-two"><section className="sp-panel"><div className="sp-panel-header"><div className="sp-panel-heading"><span className="sp-eyebrow">Feature contribution</span><h2 className="sp-panel-title">What moves the estimate</h2></div><BarChart3 size={17} className="text-sp-cobalt" /></div><div className="sp-panel-body">{model.topFeatures.length ? <FeatureImportanceList features={model.topFeatures} /> : <EmptyState title="Feature weights unavailable" description="The current endpoint did not return feature contribution data." />}</div><div className="sp-provenance"><p>Feature weights describe model input contribution. They are not causal evidence or a guarantee of outcome.</p></div></section><section className="sp-panel"><div className="sp-panel-header"><div className="sp-panel-heading"><span className="sp-eyebrow">Training data</span><h2 className="sp-panel-title">Dataset composition</h2></div><Database size={17} className="text-sp-cobalt" /></div><div className="sp-panel-body grid gap-3"><DatasetStat label="Operating" value={model.datasetSummary.operatingCount} color="var(--sp-teal)" /><DatasetStat label="Acquired" value={model.datasetSummary.acquiredCount} color="var(--sp-cobalt)" /><DatasetStat label="Closed / dissolved" value={model.datasetSummary.closedCount} color="var(--sp-rose)" /><DatasetStat label="Public IPO" value={model.datasetSummary.ipoCount} color="var(--sp-amber)" /><StatePanel status="info" title="Methodology note"><p>Use the returned dataset period and model version when supplied. This page does not treat static reference records as current performance.</p></StatePanel></div></section></div>
      <section className="sp-panel"><div className="sp-panel-header"><div className="sp-panel-heading"><span className="sp-eyebrow">Reference cohort</span><h2 className="sp-panel-title">Indian and Gujarat benchmark records</h2><p className="sp-panel-subtitle">Reference records help contextualize an input; they are not current model validation unless the endpoint says so.</p></div><EvidenceBadge>Reference data</EvidenceBadge></div><div className="sp-panel-body">{referenceRows.length ? <div className="sp-table-wrap"><table className="sp-table"><thead><tr><th>Venture</th><th>Sector</th><th>Market</th><th>Capital</th><th>Reference value</th></tr></thead><tbody>{referenceRows.map((row) => <tr key={row.id}><td><strong>{row.name?.split(' – ')[0]}</strong></td><td>{row.primary_category || '—'}</td><td>{row.country_code || '—'}</td><td className="sp-table-num">{row.funding_total_usd ? `$${Number(row.funding_total_usd).toLocaleString()}` : '—'}</td><td>{row.valuation || '—'}</td></tr>)}</tbody></table></div> : <EmptyState title="No reference cohort returned" description="Benchmark records will appear when the presets endpoint responds." />}</div></section>
    </>}
  </div>;
};

export default ModelEvidencePage;
