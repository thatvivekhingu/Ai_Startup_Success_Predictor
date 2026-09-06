import React from 'react';
import { Check, Circle } from 'lucide-react';

const steps = [
  { id: 'venture', number: '01', label: 'Venture', description: 'Name and market' },
  { id: 'funding', number: '02', label: 'Funding', description: 'Capital history' },
  { id: 'timing', number: '03', label: 'Timing', description: 'Years and rounds' },
  { id: 'team', number: '04', label: 'Team & IP', description: 'Optional context' },
  { id: 'gujarat', number: '05', label: 'Gujarat context', description: 'Optional track' },
];

const EvaluationProcessRail = ({ formData, activeStep = 'venture', onStepChange }) => {
  const completed = {
    venture: Boolean(formData.startup_name && formData.primary_category && formData.country_code),
    funding: formData.funding_total_usd !== '' && Number(formData.funding_total_usd) >= 0 && Number(formData.funding_rounds) > 0,
    timing: Boolean(formData.founded_year && formData.first_funding_year && formData.last_funding_year),
    team: formData.team_size !== '' || formData.patent_count !== '',
    gujarat: formData.is_gujarat_based ? Boolean(formData.gujarat_district) : false,
  };
  const completeCount = Object.values(completed).filter(Boolean).length;

  return (
    <aside className="sp-panel sp-process-rail" aria-label="Evaluation sections">
      <div className="flex items-center justify-between gap-2"><span className="sp-eyebrow">Evaluation path</span><Circle size={14} className="text-sp-subtle" aria-hidden="true" /></div>
      <ol className="sp-process-list">
        {steps.map((step) => (
          <li key={step.id} className={`sp-process-item ${activeStep === step.id ? 'is-active' : ''} ${completed[step.id] ? 'is-complete' : ''}`}>
            <button type="button" className="flex items-start gap-2 border-0 bg-transparent p-0 text-left sp-focus" onClick={() => onStepChange?.(step.id)}>
              <span className="sp-process-index">{completed[step.id] ? <Check size={13} strokeWidth={3} /> : step.number}</span>
              <span className="sp-process-label"><span>{step.label}</span><span className="sp-process-state">{completed[step.id] ? 'Complete' : step.description}</span></span>
            </button>
          </li>
        ))}
      </ol>
      <div className="sp-completion"><span>Completion · {completeCount}/5 sections</span><div className="sp-progress"><div className="sp-progress-fill" style={{ width: `${(completeCount / 5) * 100}%` }} /></div></div>
    </aside>
  );
};

export default EvaluationProcessRail;
