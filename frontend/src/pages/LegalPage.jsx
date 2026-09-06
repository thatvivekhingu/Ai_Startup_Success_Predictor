import React from 'react';
import { FileText } from 'lucide-react';
import { EvidenceBadge, PageHeader, StatePanel } from '../components/workspace/UiPrimitives';

const LegalPage = ({ kind }) => { const title = kind === 'privacy' ? 'Privacy' : 'Terms'; return <div className="sp-page"><PageHeader eyebrow={`Utility / ${title}`} title={title} description={`Readable ${title.toLowerCase()} surface for the StartupPulse deployment.`} status={<><span>Effective date and version history are not supplied in this deployment.</span><EvidenceBadge>Policy text unavailable</EvidenceBadge></>} /><section className="sp-panel"><div className="sp-panel-body sp-legal"><div className="flex items-start gap-3"><FileText size={18} className="mt-1 text-sp-cobalt" /><div><h2 className="mt-0">{title} content is not published here</h2><p>StartupPulse has not provided a signed {title.toLowerCase()} document or effective date to this deployment. No placeholder policy text is being presented as legal guidance.</p><StatePanel status="warning" title="Before sharing sensitive information"><p>Use the product only with data your organization is permitted to submit. Contact the deployment owner for the current policy document.</p></StatePanel></div></div></div></section></div>; };

export default LegalPage;
