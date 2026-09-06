import React, { useEffect, useRef } from 'react';
import { Award, Building2, CalendarDays, Check, DollarSign, FileCheck2, Globe2, RotateCcw, Users } from 'lucide-react';
import BenchmarkPicker from './BenchmarkPicker';
import EvaluationProcessRail from './EvaluationProcessRail';
import InputChecks from './InputChecks';
import { ActionBar, Button, Field, LoadingButton, SelectField } from './UiPrimitives';

export const EVALUATION_DEFAULTS = {
  startup_name: '',
  primary_category: '',
  country_code: 'IND',
  funding_total_usd: '',
  funding_rounds: '',
  founded_year: '',
  first_funding_year: '',
  last_funding_year: '',
  team_size: '',
  has_accelerator: false,
  patent_count: '',
  is_gujarat_based: false,
  gujarat_district: '',
};

const CATEGORIES = ['Finance', 'E-Commerce', 'Software', 'Clean Technology', 'Biotechnology', 'Mobile', 'Enterprise', 'Health Care', 'Games', 'Analytics', 'Hardware', 'Education', 'Manufacturing', 'Other'];
const COUNTRIES = [{ value: 'IND', label: 'India (IND)' }, { value: 'USA', label: 'United States (USA)' }, { value: 'GBR', label: 'United Kingdom (GBR)' }, { value: 'CAN', label: 'Canada (CAN)' }, { value: 'DEU', label: 'Germany (DEU)' }, { value: 'Other', label: 'Other region' }];
const DISTRICTS = ['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Kutch', 'Other'];

const EvaluationForm = ({ formData, errors, onChange, onSubmit, onReset, loading, modelStatus, onApplyPreset, onJumpToField, activeStep, onStepChange }) => {
  const fieldRefs = useRef({});
  useEffect(() => {
    const focusField = (field) => fieldRefs.current[field]?.focus();
    window.__startupPulseFocusField = focusField;
    return () => { delete window.__startupPulseFocusField; };
  }, []);

  const setField = (field, value) => onChange(field, value);
  const applyPreset = (preset) => onApplyPreset({
    startup_name: preset.name?.split(' – ')[0] || preset.name || '',
    primary_category: preset.primary_category || '',
    country_code: preset.country_code || 'IND',
    funding_total_usd: preset.funding_total_usd ?? '',
    funding_rounds: preset.funding_rounds ?? '',
    founded_year: preset.founded_year ?? '',
    first_funding_year: preset.first_funding_year ?? '',
    last_funding_year: preset.last_funding_year ?? '',
    team_size: preset.team_size ?? '',
    has_accelerator: Boolean(preset.has_accelerator),
    patent_count: preset.patent_count ?? '',
    is_gujarat_based: Boolean(preset.is_gujarat_based),
    gujarat_district: preset.gujarat_district || '',
  });

  return <div className="sp-grid-evaluate">
    <EvaluationProcessRail formData={formData} activeStep={activeStep} onStepChange={onStepChange} />
    <form className="sp-panel sp-form-sheet" onSubmit={onSubmit} noValidate>
      <div className="sp-form-intro"><div className="flex items-center justify-between gap-3"><div><span className="sp-eyebrow">Input sheet</span><h2 className="sp-panel-title mt-1">Venture facts</h2></div><span className="sp-status is-warning">Draft · Not saved</span></div><p>Enter the facts you have. Missing fields stay visible; reference records are starting points, not evidence of current performance.</p></div>
      <BenchmarkPicker onApply={applyPreset} />
      <section className="sp-form-section" id="section-venture"><div className="sp-form-section-head"><h3 className="sp-form-section-title"><span className="sp-section-number">01</span> Venture profile</h3><span className="sp-status is-neutral">Required</span></div><div className="sp-fields"><div className="sp-field sp-field-full"><Field label="Startup / venture name" required error={errors.startup_name} id="startup_name"><div className="sp-control-affix"><Building2 size={15} className="absolute left-3 top-3.5 z-10 text-sp-subtle" /><input ref={(element) => { fieldRefs.current.startup_name = element; }} className="sp-control pl-9" value={formData.startup_name} onChange={(event) => setField('startup_name', event.target.value)} placeholder="e.g. Acme AI Systems" /></div></Field></div><SelectField label="Primary industry vertical" required error={errors.primary_category} id="primary_category" value={formData.primary_category} onChange={(event) => setField('primary_category', event.target.value)} options={CATEGORIES} placeholder="Select a category" /><SelectField label="Headquarters / primary market" required error={errors.country_code} id="country_code" value={formData.country_code} onChange={(event) => setField('country_code', event.target.value)} options={COUNTRIES} /></div></section>
      <section className="sp-form-section" id="section-market"><div className="sp-form-section-head"><h3 className="sp-form-section-title"><span className="sp-section-number">02</span> Market and location</h3><span className="sp-status is-neutral">Optional context</span></div><div className="sp-toggle-row"><div className="sp-toggle-copy"><strong>Use Gujarat innovation context</strong><span>Shows district context when returned by the evaluation response; it does not establish eligibility.</span></div><button type="button" className={`sp-check sp-focus ${formData.is_gujarat_based ? 'is-checked' : ''}`} role="switch" aria-checked={formData.is_gujarat_based} aria-label="Use Gujarat innovation context" onClick={() => { setField('is_gujarat_based', !formData.is_gujarat_based); if (formData.is_gujarat_based) setField('gujarat_district', ''); }}>{formData.is_gujarat_based && <Check size={15} />}</button></div>{formData.is_gujarat_based && <div className="sp-fields mt-4"><SelectField label="Gujarat district" required error={errors.gujarat_district} id="gujarat_district" value={formData.gujarat_district} onChange={(event) => setField('gujarat_district', event.target.value)} options={DISTRICTS} placeholder="Select a district" /><Field label="Operating market note" helper="Optional context for review." id="operating_market"><input className="sp-control" value={formData.operating_market || ''} onChange={(event) => setField('operating_market', event.target.value)} placeholder="India / national market" /></Field></div>}</section>
      <section className="sp-form-section" id="section-funding"><div className="sp-form-section-head"><h3 className="sp-form-section-title"><span className="sp-section-number">03</span> Capital history</h3><span className="sp-status is-neutral">Required inputs</span></div><div className="sp-fields"><div className="sp-field sp-field-full"><Field label="Total capital raised (USD)" required helper="Use USD. Reference shortcuts are available only after a value is returned." error={errors.funding_total_usd} id="funding_total_usd"><div className="sp-control-affix"><DollarSign size={15} className="absolute left-3 top-3.5 z-10 text-sp-subtle" /><input ref={(element) => { fieldRefs.current.funding_total_usd = element; }} className="sp-control pl-9 font-mono" type="number" min="0" step="1000" value={formData.funding_total_usd} onChange={(event) => setField('funding_total_usd', event.target.value)} placeholder="0" /><span className="sp-control-suffix">USD</span></div></Field></div><Field label="Funding rounds" required error={errors.funding_rounds} id="funding_rounds"><input ref={(element) => { fieldRefs.current.funding_rounds = element; }} className="sp-control" type="number" min="1" max="50" value={formData.funding_rounds} onChange={(event) => setField('funding_rounds', event.target.value)} placeholder="e.g. 1" /></Field><Field label="Founded year" required error={errors.founded_year} id="founded_year"><div className="sp-control-affix"><CalendarDays size={15} className="absolute left-3 top-3.5 z-10 text-sp-subtle" /><input ref={(element) => { fieldRefs.current.founded_year = element; }} className="sp-control pl-9" type="number" min="1900" max="2100" value={formData.founded_year} onChange={(event) => setField('founded_year', event.target.value)} placeholder="YYYY" /></div></Field><Field label="First funding year" required error={errors.first_funding_year} id="first_funding_year"><input ref={(element) => { fieldRefs.current.first_funding_year = element; }} className="sp-control" type="number" min="1900" max="2100" value={formData.first_funding_year} onChange={(event) => setField('first_funding_year', event.target.value)} placeholder="YYYY" /></Field><Field label="Latest funding year" required error={errors.last_funding_year} id="last_funding_year"><input ref={(element) => { fieldRefs.current.last_funding_year = element; }} className="sp-control" type="number" min="1900" max="2100" value={formData.last_funding_year} onChange={(event) => setField('last_funding_year', event.target.value)} placeholder="YYYY" /></Field></div></section>
      <section className="sp-form-section" id="section-team"><div className="sp-form-section-head"><h3 className="sp-form-section-title"><span className="sp-section-number">04</span> Team and defensibility</h3><span className="sp-status is-neutral">Optional context</span></div><div className="sp-fields"><Field label="Core team size" helper="Optional. Keep blank if unknown." id="team_size"><div className="sp-control-affix"><Users size={15} className="absolute left-3 top-3.5 z-10 text-sp-subtle" /><input className="sp-control pl-9" type="number" min="1" max="100000" value={formData.team_size} onChange={(event) => setField('team_size', event.target.value)} placeholder="Not entered" /></div></Field><Field label="Patents / IP filings" helper="Optional count of filed or granted patents." id="patent_count"><div className="sp-control-affix"><FileCheck2 size={15} className="absolute left-3 top-3.5 z-10 text-sp-subtle" /><input className="sp-control pl-9" type="number" min="0" max="10000" value={formData.patent_count} onChange={(event) => setField('patent_count', event.target.value)} placeholder="Not entered" /></div></Field><div className="sp-field sp-field-full"><div className="sp-toggle-row"><div className="sp-toggle-copy"><strong>Top accelerator backing</strong><span>YC, Techstars, 500 Global or another accelerator returned by your records.</span></div><button type="button" className={`sp-check sp-focus ${formData.has_accelerator ? 'is-checked' : ''}`} role="switch" aria-checked={formData.has_accelerator} aria-label="Top accelerator backing" onClick={() => setField('has_accelerator', !formData.has_accelerator)}>{formData.has_accelerator && <Check size={15} />}</button></div></div></div></section>
      <section className="sp-form-section" id="section-timing"><div className="sp-form-section-head"><h3 className="sp-form-section-title"><span className="sp-section-number">05</span> Timing</h3><span className="sp-status is-warning">Required to run</span></div><p className="sp-helper">The estimate uses the timing fields to calculate age and funding duration. Missing values are not silently substituted.</p></section>
      <ActionBar><span className="text-[10px] text-sp-muted">Inputs remain editable until you save a returned result.</span><div className="flex gap-2"><Button variant="secondary" onClick={onReset}><RotateCcw size={14} />Reset</Button><LoadingButton variant="primary" loading={loading} type="submit"><span>{loading ? 'Running estimate' : 'Run estimate'}</span></LoadingButton></div></ActionBar>
    </form>
    <InputChecks formData={formData} modelStatus={modelStatus} onJumpToField={(field) => { const target = field === 'venture' ? 'startup_name' : field === 'funding' ? 'funding_total_usd' : field === 'timing' ? 'first_funding_year' : field; document.getElementById(target)?.focus(); document.getElementById(`section-${field === 'venture' ? 'venture' : field === 'funding' ? 'funding' : field}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); onJumpToField?.(field); }} />
  </div>;
};

export default EvaluationForm;
