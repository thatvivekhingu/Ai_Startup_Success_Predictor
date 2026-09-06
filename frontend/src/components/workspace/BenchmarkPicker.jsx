import React, { useMemo, useState } from 'react';
import { Search, Database, RefreshCw } from 'lucide-react';
import { predictionAPI } from '../../api';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { ErrorState, EvidenceBadge, SkeletonRows } from './UiPrimitives';

const BenchmarkPicker = ({ onApply }) => {
  const [query, setQuery] = useState('');
  const resource = useAsyncResource(async () => {
    const response = await predictionAPI.getPresets();
    return response.data || [];
  }, [], { normalize: (value) => value });

  const presets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (resource.data || []).filter((preset) => !normalizedQuery || [preset.name, preset.primary_category, preset.country_code, preset.founder].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery));
  }, [resource.data, query]);

  return (
    <section className="sp-reference-block" aria-labelledby="benchmark-heading">
      <div className="sp-reference-head"><div className="flex items-center gap-2"><Database size={15} className="text-sp-cobalt" /><strong id="benchmark-heading" className="text-sm">Start from a benchmark</strong><EvidenceBadge>Reference record</EvidenceBadge></div><span className="text-[10px] text-sp-muted">Compare first. Review every field before running.</span></div>
      <div className="sp-search-field mb-3"><Search size={15} aria-hidden="true" /><input className="sp-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Zerodha, Zepto, Gujarat…" aria-label="Search benchmark records" /></div>
      {resource.status === 'loading' && <SkeletonRows count={3} />}
      {resource.status === 'error' && <ErrorState title="Benchmarks unavailable" description="Reference records could not be loaded. You can still enter an evaluation manually." onRetry={resource.retry} />}
      {resource.status === 'ready' && presets.length === 0 && <div className="py-3 text-center text-xs text-sp-muted">No reference records match “{query}”.</div>}
      {resource.status === 'ready' && presets.length > 0 && <div className="sp-reference-list">{presets.slice(0, 5).map((preset) => <div className="sp-reference-row" key={preset.id}><div className="sp-reference-name"><strong>{preset.name?.split(' – ')[0] || preset.name}</strong><span className="sp-reference-meta">{preset.primary_category || '—'} · {preset.country_code || '—'} · {preset.is_gujarat_based ? 'Gujarat reference' : 'India reference'}</span></div><span className="sp-reference-value">{preset.valuation || 'Reference value'}</span><button type="button" className="sp-btn sp-btn-ghost min-h-[36px] px-2" onClick={() => onApply(preset)}>Use as starting point</button></div>)}</div>}
      {resource.status === 'stale' && <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-sp-amber"><span>Reference list may be stale.</span><button type="button" className="sp-btn sp-btn-ghost min-h-[32px] px-2" onClick={resource.retry}><RefreshCw size={12} />Refresh</button></div>}
    </section>
  );
};

export default BenchmarkPicker;
