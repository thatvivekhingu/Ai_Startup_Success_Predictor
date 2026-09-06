import React from 'react';
import { AlertTriangle, CheckCircle2, CircleSlash2, Database } from 'lucide-react';
import { EvidenceBadge } from './UiPrimitives';

const InputChecks = ({ formData, modelStatus = 'checking', onJumpToField }) => {
  const checks = [
    { label: 'Venture and market', field: 'venture', complete: Boolean(formData.startup_name && formData.primary_category && formData.country_code), detail: formData.startup_name ? `${formData.primary_category || 'Category missing'} · ${formData.country_code || 'Market missing'}` : 'Startup name and market are required' },
    { label: 'Capital history', field: 'funding', complete: formData.funding_total_usd !== '' && Number(formData.funding_rounds) > 0, detail: formData.funding_total_usd !== '' ? `${formData.funding_rounds || 0} round${Number(formData.funding_rounds) === 1 ? '' : 's'} · ${Number(formData.funding_total_usd || 0).toLocaleString()} USD` : 'Capital and round count are required' },
    { label: 'Timing', field: 'timing', complete: Boolean(formData.founded_year && formData.first_funding_year && formData.last_funding_year), detail: formData.first_funding_year ? `${formData.first_funding_year} first funding · ${formData.last_funding_year || 'latest missing'}` : 'Funding years are required to run the estimate' },
    { label: 'Gujarat context', field: 'gujarat', complete: !formData.is_gujarat_based || Boolean(formData.gujarat_district), optional: true, detail: formData.is_gujarat_based ? (formData.gujarat_district || 'Select a district') : 'Not selected; no policy context will be inferred' },
  ];
  const ModelIcon = modelStatus === 'ready' ? CheckCircle2 : modelStatus === 'error' ? CircleSlash2 : Database;
  const requiredChecksComplete = checks.filter((check) => !check.optional).every((check) => check.complete);
  const runState = modelStatus === 'error' ? 'Unavailable' : modelStatus !== 'ready' ? 'Checking model' : requiredChecksComplete ? 'Ready to run' : 'Needs input';

  return (
    <div className="sp-checks-column">
      <section className="sp-panel sp-check-panel" aria-labelledby="input-checks-heading">
        <div className="sp-panel-header"><div className="sp-panel-heading"><span className="sp-eyebrow">Input checks</span><h2 id="input-checks-heading" className="sp-panel-title">What this estimate uses</h2></div><EvidenceBadge state={runState === 'Ready to run' ? 'source' : runState === 'Unavailable' ? 'error' : 'reference'}>{runState}</EvidenceBadge></div>
        <div className="sp-check-list">
          {checks.map((check) => <div key={check.field} className="sp-check-item"><span className={check.complete ? 'sp-check-icon' : 'sp-check-icon is-warning'}>{check.complete ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}</span><div className="sp-check-copy"><strong>{check.label}{check.optional ? ' · optional' : ''}</strong><span>{check.detail}</span>{!check.complete && <button type="button" className="sp-check-link sp-focus" onClick={() => onJumpToField(check.field)}>Go to field →</button>}</div></div>)}
          <div className="sp-check-item"><ModelIcon size={15} className={modelStatus === 'error' ? 'sp-check-icon is-error' : 'sp-check-icon'} /><div className="sp-check-copy"><strong>Model endpoint</strong><span>{modelStatus === 'ready' ? 'Health check returned model_ready.' : modelStatus === 'error' ? 'The model health check failed. Retry before running.' : 'Checking model availability…'}</span></div></div>
        </div>
        <div className="sp-provenance"><div className="sp-provenance-title"><Database size={14} /> Data provenance</div><p>Inputs are user-entered or reference fields. Source details are not inferred when the backend does not return them.</p></div>
      </section>
      <section className="sp-panel p-4"><span className="sp-eyebrow">Next step</span><p className="mt-2 text-xs text-sp-ink">{requiredChecksComplete && modelStatus === 'ready' ? 'Run the estimate to review model output and drivers.' : 'Complete the required fields, then retry the estimate.'}</p></section>
    </div>
  );
};

export default InputChecks;
