import React from 'react';

const BrandMark = ({ compact = false, onClick }) => {
  const content = (
    <>
      <span className="sp-brand-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="sp-brand-copy">
        <span className="sp-brand-title">StartupPulse</span>
        {!compact && <span className="sp-brand-subtitle">Decision workspace</span>}
      </span>
    </>
  );

  if (onClick) {
    return <button type="button" className="sp-brand sp-focus" onClick={onClick} aria-label="Go to Evaluate">{content}</button>;
  }

  return <span className="sp-brand">{content}</span>;
};

export default BrandMark;
