import React, { useMemo, useState } from 'react';
import { AlertCircle, Database, Sparkles } from 'lucide-react';
import { systemAPI } from '../api';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { normalizePredictionResult } from '../utils/normalizers';
import { PageHeader, StatePanel } from '../components/workspace/UiPrimitives';
import EvaluationForm, { EVALUATION_DEFAULTS } from '../components/workspace/EvaluationForm';
import ResultDossier from '../components/workspace/ResultDossier';

const numberOrNull = (value) => value === '' || value === null || value === undefined ? null : Number(value);

const EvaluatePage = ({ predictionResult, predictionStatus, predictionError, onPredict, onClearResult, onSaveResult, onNavigate }) => {
  const [formData, setFormData] = useState(EVALUATION_DEFAULTS);
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState('venture');
  const health = useAsyncResource(async () => {
    const response = await systemAPI.getHealth();
    return response.data;
  }, [], { normalize: (value) => value });

  const modelStatus = health.status === 'error' || health.data?.model_ready === false ? 'error' : health.status === 'ready' ? 'ready' : 'checking';
  const isLoading = predictionStatus === 'loading';

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    ['startup_name', 'primary_category', 'country_code', 'funding_total_usd', 'funding_rounds', 'founded_year', 'first_funding_year', 'last_funding_year'].forEach((field) => {
      if (formData[field] === '' || formData[field] === null || formData[field] === undefined) nextErrors[field] = 'This field is required to run an estimate.';
    });
    if (formData.funding_total_usd !== '' && Number(formData.funding_total_usd) < 0) nextErrors.funding_total_usd = 'Enter zero or a positive amount.';
    if (formData.funding_rounds !== '' && Number(formData.funding_rounds) < 1) nextErrors.funding_rounds = 'Use at least one funding round.';
    if (formData.first_funding_year && formData.last_funding_year && Number(formData.last_funding_year) < Number(formData.first_funding_year)) nextErrors.last_funding_year = 'Latest funding cannot be before first funding.';
    if (formData.is_gujarat_based && !formData.gujarat_district) nextErrors.gujarat_district = 'Select a district when Gujarat context is enabled.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(firstField)?.focus();
      setActiveStep(['startup_name', 'primary_category', 'country_code'].includes(firstField) ? 'venture' : ['funding_total_usd', 'funding_rounds'].includes(firstField) ? 'funding' : ['founded_year', 'first_funding_year', 'last_funding_year'].includes(firstField) ? 'timing' : 'gujarat');
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onPredict({
      ...formData,
      funding_total_usd: Number(formData.funding_total_usd),
      funding_rounds: Number(formData.funding_rounds),
      founded_year: numberOrNull(formData.founded_year),
      first_funding_year: numberOrNull(formData.first_funding_year),
      last_funding_year: numberOrNull(formData.last_funding_year),
      team_size: numberOrNull(formData.team_size),
      patent_count: numberOrNull(formData.patent_count) ?? 0,
      gujarat_district: formData.is_gujarat_based ? formData.gujarat_district : null,
    });
  };

  const modelStatusCopy = useMemo(() => health.status === 'error' ? 'Model health unavailable · retry on submit' : health.status === 'ready' ? 'Model health returned' : 'Checking model health', [health.status]);

  return <div className="sp-page">
    <PageHeader eyebrow="01 / Evaluation workspace" title="Evaluate a venture" description="Create an estimate from venture, funding, and market facts." actions={<><span className="sp-badge is-reference"><Database size={12} />Reference data · Source details unavailable</span><button type="button" className="sp-btn sp-btn-secondary" onClick={() => document.getElementById('benchmark-heading')?.scrollIntoView({ behavior: 'smooth' })}><Sparkles size={14} />Start from a benchmark</button></>} status={<><span>Enter the facts you have. Missing fields remain visible and never become silent defaults.</span><span className="sp-desktop-only">{modelStatusCopy}</span></>} />
    {predictionError && <StatePanel status="error" title="Estimate unavailable" actions={<button type="button" className="sp-btn sp-btn-secondary" onClick={() => onPredict(formData)}><AlertCircle size={14} />Retry estimate</button>}><p>{predictionError}</p></StatePanel>}
    <EvaluationForm formData={formData} errors={errors} onChange={updateField} onSubmit={handleSubmit} onReset={() => { setFormData(EVALUATION_DEFAULTS); setErrors({}); onClearResult?.(); }} loading={isLoading} modelStatus={modelStatus} onApplyPreset={(preset) => { setFormData(preset); setErrors({}); onClearResult?.(); }} activeStep={activeStep} onStepChange={setActiveStep} />
    {predictionResult ? <ResultDossier result={normalizePredictionResult(predictionResult, 'model_response')} onRevise={onClearResult} onSave={() => onSaveResult?.(predictionResult)} onCompare={() => onNavigate('evidence')} /> : <section className="sp-panel p-5"><div className="flex items-start gap-3"><div className="sp-icon-btn border-0 bg-sp-cobalt-soft text-sp-cobalt"><Sparkles size={16} /></div><div><h2 className="sp-panel-title">Review result after running the estimate</h2><p className="mt-2 text-xs text-sp-muted">The result dossier will show the returned estimate, confidence, drivers, risks, and next actions. No score is shown before the model responds.</p></div></div></section>}
  </div>;
};

export default EvaluatePage;
