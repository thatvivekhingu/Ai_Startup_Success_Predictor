import React, { useEffect, useId, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Info,
  LoaderCircle,
  RefreshCw,
  X,
} from 'lucide-react';

export const Button = ({ variant = 'secondary', children, className = '', type = 'button', ...props }) => (
  <button type={type} className={`sp-btn sp-btn-${variant} ${className}`} {...props}>{children}</button>
);

export const IconButton = ({ label, children, className = '', ...props }) => (
  <button type="button" aria-label={label} title={label} className={`sp-icon-btn sp-focus ${className}`} {...props}>{children}</button>
);

export const PageHeader = ({ eyebrow, title, description, actions, status }) => (
  <>
    <div className="sp-page-header">
      <div className="sp-page-heading">
        {eyebrow && <div className="sp-eyebrow">{eyebrow}</div>}
        <h1 className="sp-page-title">{title}</h1>
        {description && <p className="sp-page-description">{description}</p>}
      </div>
      {actions && <div className="sp-page-actions">{actions}</div>}
    </div>
    {status && <StatusLine>{status}</StatusLine>}
  </>
);

export const StatusLine = ({ children, right }) => (
  <div className="sp-status-line">
    <span className="sp-status-line-copy"><Info size={14} aria-hidden="true" />{children}</span>
    {right && <span>{right}</span>}
  </div>
);

export const EvidenceBadge = ({ state = 'reference', children }) => (
  <span className={`sp-badge is-${state}`}>{children}</span>
);

export const SourceMeta = ({ state = 'reference', source, date, children }) => {
  const labels = {
    source_available: 'Source available',
    reference: 'Reference record',
    source_unavailable: 'Source details unavailable',
    refresh_failed: 'Refresh failed',
  };
  return (
    <div className="flex flex-wrap items-center gap-2 text-[10px] text-sp-muted">
      <EvidenceBadge state={state === 'source_available' ? 'source' : state === 'refresh_failed' ? 'error' : 'reference'}>
        {children || labels[state] || labels.reference}
      </EvidenceBadge>
      {source && <span>{source}</span>}
      {date && <span>· {date}</span>}
    </div>
  );
};

export const StatePanel = ({ status = 'info', title, children, actions, className = '' }) => {
  const Icon = status === 'error' ? AlertCircle : status === 'warning' ? AlertTriangle : status === 'success' ? CheckCircle2 : Info;
  return (
    <div className={`sp-state-panel ${status === 'error' ? 'is-error' : status === 'warning' ? 'is-warning' : ''} ${className}`} role={status === 'error' ? 'alert' : 'status'}>
      <div className="flex items-start gap-3">
        <Icon className={status === 'error' ? 'text-sp-rose' : status === 'warning' ? 'text-sp-amber' : status === 'success' ? 'text-sp-teal' : 'text-sp-cobalt'} size={18} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          {title && <h3>{title}</h3>}
          {children && <div className="mt-1">{children}</div>}
          {actions && <div className="sp-state-actions">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export const EmptyState = ({ title, description, action }) => (
  <div className="sp-empty">
    <h3>{title}</h3>
    <p>{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorState = ({ title = 'Could not load this workspace', description = 'The request failed. Your current inputs and filters are still available.', onRetry }) => (
  <StatePanel status="error" title={title} actions={onRetry && <Button variant="secondary" onClick={onRetry}><RefreshCw size={14} />Try again</Button>}>
    <p>{description}</p>
  </StatePanel>
);

export const SkeletonRows = ({ count = 5 }) => (
  <div aria-label="Loading data" aria-busy="true">
    {Array.from({ length: count }).map((_, index) => <div key={index} className="sp-skeleton sp-skeleton-row" />)}
  </div>
);

const FieldLabel = ({ htmlFor, children, required }) => (
  <label className="sp-field-label" htmlFor={htmlFor}>{children} {required && <span className="sp-required" aria-hidden="true">*</span>}</label>
);

export const Field = ({ label, required, helper, error, id, children }) => (
  <div className="sp-field">
    <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>
    {React.cloneElement(children, { id, 'aria-invalid': Boolean(error), 'aria-describedby': `${id}-helper ${error ? `${id}-error` : ''}`.trim(), className: `${children.props.className || ''} ${error ? 'is-invalid' : ''}` })}
    {helper && <p className="sp-helper" id={`${id}-helper`}>{helper}</p>}
    {error && <p className="sp-error" id={`${id}-error`} role="alert">{error}</p>}
  </div>
);

export const SelectField = ({ label, required, helper, error, id, value, onChange, options, placeholder }) => (
  <Field label={label} required={required} helper={helper} error={error} id={id}>
    <select className="sp-control" value={value ?? ''} onChange={onChange}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>)}
    </select>
  </Field>
);

export const TextareaField = ({ label, required, helper, error, id, value, onChange, rows = 3, placeholder }) => (
  <Field label={label} required={required} helper={helper} error={error} id={id}>
    <textarea className="sp-control" value={value ?? ''} onChange={onChange} rows={rows} placeholder={placeholder} />
  </Field>
);

export const ActionBar = ({ children, className = '' }) => <div className={`sp-form-actions ${className}`}>{children}</div>;

export const ScoreMeter = ({ value, label = 'Model estimate', caption, dark = false }) => {
  const finite = typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : null;
  return (
    <div className={dark ? 'text-white' : ''}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="sp-decision-label">{label}</div>
          <div className="sp-score-number">{finite === null ? '—' : `${finite.toFixed(1)}%`}</div>
        </div>
        {caption && <div className="sp-score-caption text-right">{caption}</div>}
      </div>
      <div className="sp-score-meter" aria-label={finite === null ? 'Estimate unavailable' : `${finite.toFixed(1)} percent model estimate`} role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow={finite ?? undefined}>
        {finite !== null && <div className="sp-score-fill" style={{ width: `${finite}%` }} />}
      </div>
      <div className="sp-score-ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onChange, labelledBy }) => {
  const tabListRef = useRef(null);
  const onKeyDown = (event) => {
    const buttons = Array.from(tabListRef.current?.querySelectorAll('[role="tab"]') || []);
    const currentIndex = buttons.indexOf(event.currentTarget);
    if (!buttons.length || currentIndex < 0) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      buttons[(currentIndex + 1) % buttons.length].focus();
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      buttons[(currentIndex - 1 + buttons.length) % buttons.length].focus();
    }
  };
  return (
    <div className="sp-tabs" role="tablist" aria-labelledby={labelledBy} ref={tabListRef}>
      {tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} tabIndex={activeTab === tab.id ? 0 : -1} className={`sp-tab sp-focus ${activeTab === tab.id ? 'is-active' : ''}`} onClick={() => onChange(tab.id)} onKeyDown={onKeyDown}>{tab.label}</button>)}
    </div>
  );
};

export const ConfirmDialog = ({ open, title, description, confirmLabel = 'Confirm', onConfirm, onClose, destructive = false }) => {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-sp-navy/35 p-4" role="presentation" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-sp-dialog border border-sp-rule bg-sp-surface p-5 shadow-sp-menu" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="confirm-title" className="sp-panel-title">{title}</h2><p className="mt-2 text-sm text-sp-muted">{description}</p></div>
          <IconButton label="Close dialog" onClick={onClose}><X size={17} /></IconButton>
        </div>
        <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button></div>
      </div>
    </div>
  );
};

export const InspectorPanel = ({ title, description, children, actions }) => (
  <aside className="sp-panel sp-inspector">
    <div className="sp-inspector-header"><div className="sp-panel-heading"><h2 className="sp-panel-title">{title}</h2>{description && <p className="sp-panel-subtitle">{description}</p>}</div></div>
    <div className="sp-panel-body">{children}</div>
    {actions && <div className="sp-inspector-footer">{actions}</div>}
  </aside>
);

export const LoadingButton = ({ loading, children, type = 'button', variant = 'secondary', className = '', disabled, ...props }) => <button type={type} className={`sp-btn sp-btn-${variant} ${className}`} {...props} disabled={loading || disabled}>{loading && <LoaderCircle size={14} className="animate-spin" />}{children}</button>;

export const ChevronAction = ({ children, ...props }) => <Button variant="ghost" {...props}>{children}<ChevronRight size={14} /></Button>;

export const useStableId = (prefix = 'field') => `${prefix}-${useId().replace(/:/g, '')}`;

export const SelectIcon = ({ open }) => <ChevronDown size={15} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />;
