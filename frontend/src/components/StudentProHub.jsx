import React, { useState } from 'react';
import { 
  GraduationCap, 
  FileText, 
  Activity, 
  Users, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  ChevronRight, 
  Compass, 
  Cpu, 
  Award, 
  ShieldCheck, 
  Layers, 
  Zap, 
  ExternalLink,
  HelpCircle,
  Building2,
  DollarSign
} from 'lucide-react';

const GUJARAT_COLLEGES = [
  'Gujarat Technological University (GTU)',
  'Dharmsinh Desai University (DDU)',
  'Pandit Deendayal Energy University (PDEU)',
  'DA-IICT Gandhinagar',
  'Nirma University',
  'L.D. College of Engineering (LDCE)',
  'VGEC Chandkheda',
  'SVNIT Surat',
  'MS University Baroda',
  'Marwadi University Rajkot',
  'Charusat University (CHARUSAT)',
  'BVM Engineering College (VV Nagar)',
  'Other Gujarat College / University'
];

const FABLAB_DIRECTORY = [
  {
    name: 'GTU Innovation Council (GIC MakerLab)',
    location: 'Ahmedabad & Statewide Centres',
    equipment: ['3D Printers (FDM & SLA)', 'PCB Prototyping Milling', 'Laser Cutters', 'IoT Sensors Kit'],
    eligibility: 'All GTU affiliated students across Gujarat',
    grantSupport: 'SSIP 2.0 (₹2.5L Prototype Grant) + IPR Filing Support',
    link: 'https://www.gtuinnovationcouncil.ac.in/'
  },
  {
    name: 'GUSEC (Gujarat University Startup & Entrepreneurship Council)',
    location: 'Navrangpura, Ahmedabad',
    equipment: ['Rapid Prototyping Center', 'AI/Cloud GPU Servers', 'Biotech Screening Lab', 'Co-working Pods'],
    eligibility: 'Open to all university students and independent innovators',
    grantSupport: 'SSIP 2.0, NIDHI-PRAYAS (₹10L), MeitY TIDE 2.0',
    link: 'https://gusec.edu.in/'
  },
  {
    name: 'PDEU IIC Innovation & Maker Lab',
    location: 'Raisan, Gandhinagar',
    equipment: ['Renewable Energy Testing', 'Solar PV Simulator', 'Battery Pack Testing Bench', 'Robotics FabLab'],
    eligibility: 'CleanTech, EV, Energy & DeepTech student innovators',
    grantSupport: 'PDEU IIC Seed Fund (Up to ₹5L) + SSIP Grant',
    link: 'https://iic.pdeu.ac.in/'
  },
  {
    name: 'DA-IICT Center for Entrepreneurship & Incubation',
    location: 'Gandhinagar',
    equipment: ['VLSI Design Workstations', 'Embedded Firmware Lab', 'Compute Clusters', 'Software Testbeds'],
    eligibility: 'ICT, AI/ML, Semiconductor Design & Algorithms',
    grantSupport: 'TIDE 2.0, SSIP 2.0 & Faculty Mentorship',
    link: 'https://www.daiict.ac.in/'
  },
  {
    name: 'SVNIT Centre for Innovation & Incubation (ASHINE)',
    location: 'Ichchanath, Surat',
    equipment: ['Mechanical CNC Milling', 'Material Characterization', 'Power Electronics Bench'],
    eligibility: 'Engineering students in South Gujarat',
    grantSupport: 'Startup Gujarat Seed Fund & SSIP 2.0',
    link: 'https://svnit.ac.in/'
  },
  {
    name: 'Marwadi University Innovation & Incubation Hub',
    location: 'Morbi Road, Rajkot',
    equipment: ['Automotive Prototype Rig', '3D Scanners', 'Agri-Machinery Prototyping Workshop'],
    eligibility: 'Saurashtra region college & diploma students',
    grantSupport: 'SSIP 2.0 & Saurashtra Angel Network pitch sessions',
    link: 'https://www.marwadiuniversity.ac.in/'
  }
];

const StudentProHub = () => {
  const [activeTab, setActiveTab] = useState('drafter');

  // ==========================================
  // FEATURE 1: SSIP 2.0 PROPOSAL DRAFTER STATE
  // ==========================================
  const [proposalInputs, setProposalInputs] = useState({
    projectTitle: 'Smart IoT Precision Drip Irrigation & Soil Nutrient Sensor',
    college: 'Gujarat Technological University (GTU)',
    domain: 'AgriTech / Embedded IoT',
    teamSize: '3 Students (Final Year)',
    targetGrant: '₹2,50,000 (SSIP 2.0 Prototype Grant)',
    problemStatement: 'Smallholder farmers in arid Gujarat face 40% water waste due to unmonitored flood irrigation and over-fertilization.',
    noveltyClaim: 'Low-cost sub-surface NPK probe coupled with LoRaWAN wireless mesh requiring zero cellular SIM charges.'
  });

  const [generatedProposal, setGeneratedProposal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateProposal = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedProposal({
        executiveSummary: `Project "${proposalInputs.projectTitle}" is a student-led engineering innovation developed at ${proposalInputs.college}. The initiative solves the pressing regional problem: "${proposalInputs.problemStatement}". By leveraging ${proposalInputs.noveltyClaim}, the team bridges the gap between academic lab research and an affordable, field-deployable commercial MVP under the Gujarat Student Startup & Innovation Policy (SSIP 2.0).`,
        noveltyPoints: [
          `Indigenous Hardware Architecture: Custom PCB engineered using open-source EDA tools, reducing sensor unit cost by 65% compared to imported Israeli equipment.`,
          `Edge-Intelligence: Low-power microcontroller firmware running on-device threshold detection without perpetual cloud subscription dependency.`,
          `IP Moat Potential: Novel sub-surface casing design qualifies for Indian Design Registration and Provisional Patent under SSIP IPR subsidy scheme.`
        ],
        milestones: [
          { phase: 'Phase 1 (Months 1–2)', milestone: 'Component sourcing, PCB schematic layout & bench calibration in college lab', budget: '₹55,000' },
          { phase: 'Phase 2 (Months 3–4)', milestone: 'Sub-surface sensor casing 3D printing & enclosure sealing (IP67 rating)', budget: '₹45,000' },
          { phase: 'Phase 3 (Months 5–6)', milestone: 'Field pilot testing with 5 local farmers in Anand / Kheda district', budget: '₹75,000' },
          { phase: 'Phase 4 (Months 7–8)', milestone: 'Provisional patent drafting, SSIP demo day pitch & commercial entity registration', budget: '₹75,000' }
        ],
        budgetBreakdown: [
          { item: 'Hardware Components, Microcontrollers & LoRa Transceivers', amount: '₹85,000', pct: '34%' },
          { item: 'Rapid Prototyping, Enclosure Fabrication & PCB Manufacturing', amount: '₹65,000', pct: '26%' },
          { item: 'Field Validation, Soil Testing Benchmarks & Farmer Feedback Trials', amount: '₹50,000', pct: '20%' },
          { item: 'IPR Filing (Provisional Patent Attorney & Govt Fees under SSIP Scheme)', amount: '₹35,000', pct: '14%' },
          { item: 'Contingency Testing & Calibration Consumables', amount: '₹15,000', pct: '6%' }
        ],
        facultyEndorsementTemplate: `I hereby confirm that the student team comprising ${proposalInputs.teamSize} has conceptualized this project under departmental faculty guidance. The prototype is technically defensible, addresses state priorities under Gujarat STI Policy 2026–31, and is recommended for full disbursement of ${proposalInputs.targetGrant}.`
      });
      setIsGenerating(false);
    }, 600);
  };

  const handleCopyProposal = () => {
    if (!generatedProposal) return;
    const text = `
SSIP 2.0 OFFICIAL STUDENT GRANT APPLICATION
Project: ${proposalInputs.projectTitle}
Institution: ${proposalInputs.college}
Domain: ${proposalInputs.domain}
Budget Request: ${proposalInputs.targetGrant}

1. EXECUTIVE SUMMARY:
${generatedProposal.executiveSummary}

2. NOVELTY & IPR CLAIMS:
${generatedProposal.noveltyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

3. MILESTONE SCHEDULE:
${generatedProposal.milestones.map(m => `• ${m.phase}: ${m.milestone} [Allocated: ${m.budget}]`).join('\n')}

4. BUDGET ALLOCATION:
${generatedProposal.budgetBreakdown.map(b => `• ${b.item}: ${b.amount} (${b.pct})`).join('\n')}

5. FACULTY GUIDE SIGN-OFF:
${generatedProposal.facultyEndorsementTemplate}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ==========================================
  // FEATURE 2: TRL CAMPUS-TO-MARKET METER STATE
  // ==========================================
  const [trlAnswers, setTrlAnswers] = useState({
    prototypeStage: 2,   // 0: Concept, 1: Breadboard/Lab, 2: Integrated Alpha, 3: Field Beta
    mentorSignoff: 1,    // 0: No mentor, 1: Faculty guide assigned, 2: Industry/Incubator co-guide
    patentSearch: 1,     // 0: None, 1: Google Patent free search done, 2: Novelty search clear
    pilotFeedback: 1,    // 0: 0 users, 1: 5-10 student/faculty testers, 2: Real external customers
    legalEntity: 0       // 0: College project, 1: LLP/Private Limited registered, 2: DPIIT recognized
  });

  const calculateTRL = () => {
    let score = 1;
    score += trlAnswers.prototypeStage * 1.5;
    score += trlAnswers.mentorSignoff * 0.8;
    score += trlAnswers.patentSearch * 0.9;
    score += trlAnswers.pilotFeedback * 1.2;
    score += trlAnswers.legalEntity * 1.0;
    return Math.min(9, Math.max(1, Math.round(score)));
  };

  const currentTrl = calculateTRL();

  const getTrlStageInfo = (lvl) => {
    if (lvl <= 2) return { stage: 'Basic Principles (Research / Idea Stage)', badge: 'Academic Lab', color: 'text-slate-500 bg-slate-100', nextStep: 'Build a physical breadboard/software simulation proof-of-concept in your college lab.' };
    if (lvl <= 4) return { stage: 'Laboratory Validated Proof-of-Concept', badge: 'Lab Prototype (SSIP Ready)', color: 'text-blue-700 bg-blue-50 border-blue-200', nextStep: 'Apply for ₹2.5 Lakhs SSIP 2.0 grant to fabricate custom enclosures and run real-world tests.' };
    if (lvl <= 6) return { stage: 'Relevant Environment Pilot (Alpha MVP)', badge: 'Incubation Ready (i-Hub / GUSEC)', color: 'text-amber-700 bg-amber-50 border-amber-200', nextStep: 'Incorporate as an LLP/Pvt Ltd and pitch for i-Hub ₹30 Lakhs seed support.' };
    return { stage: 'Commercial Grade Operational System (Beta Tested)', badge: 'Venture / Scale-up Ready', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', nextStep: 'Pitch Tier-1 angel investors (GVFL, TiE Ahmedabad, Surat Angels) for institutional seed capital.' };
  };

  const trlInfo = getTrlStageInfo(currentTrl);

  // ==========================================
  // FEATURE 3: CO-FOUNDER & FABLAB STATE
  // ==========================================
  const [teamSkills, setTeamSkills] = useState(['Coding & Software']);
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('All');

  const toggleSkill = (skill) => {
    if (teamSkills.includes(skill)) {
      setTeamSkills(teamSkills.filter(s => s !== skill));
    } else {
      setTeamSkills([...teamSkills, skill]);
    }
  };

  const missingSkills = ['Hardware & Circuit Design', 'UI/UX Design', 'Sales & B2B Go-To-Market', 'Finance & Grant Compliance'].filter(
    s => !teamSkills.includes(s)
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Figma-Style Header Canvas */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-indigo-500/20 shadow-xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-300">
                CAMPUS INNOVATOR COMMAND CENTER
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[9px] font-bold text-indigo-200 uppercase tracking-widest">
                STUDENT PRO SUITE
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Student Venture Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              Transform your final-year engineering project, hackathon prototype, or research thesis into an official grant-backed, DPIIT-recognized startup under Gujarat SSIP 2.0.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-slate-900/80 border border-indigo-500/30 p-4 rounded-2xl flex items-center space-x-4 shrink-0 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <GraduationCap className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">SSIP 2.0 Max Cap</div>
              <div className="text-xl font-black text-amber-400 font-mono">₹2.5 Lakhs</div>
              <div className="text-[10px] text-slate-400">Equity-Free Prototype Grant</div>
            </div>
          </div>
        </div>

        {/* Figma Segmented Pill Control */}
        <div className="flex flex-wrap items-center gap-2 pt-8 border-t border-indigo-800/40 mt-6">
          <button
            onClick={() => setActiveTab('drafter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'drafter'
                ? 'bg-white text-slate-950 shadow-md scale-102'
                : 'bg-indigo-950/60 text-slate-300 hover:text-white border border-indigo-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>1. SSIP 2.0 Proposal Drafter</span>
          </button>

          <button
            onClick={() => setActiveTab('trl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'trl'
                ? 'bg-white text-slate-950 shadow-md scale-102'
                : 'bg-indigo-950/60 text-slate-300 hover:text-white border border-indigo-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. TRL Campus-to-Market Meter</span>
          </button>

          <button
            onClick={() => setActiveTab('fablab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'fablab'
                ? 'bg-white text-slate-950 shadow-md scale-102'
                : 'bg-indigo-950/60 text-slate-300 hover:text-white border border-indigo-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>3. Co-Founder & FabLab Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('dpiit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'dpiit'
                ? 'bg-white text-slate-950 shadow-md scale-102'
                : 'bg-indigo-950/60 text-slate-300 hover:text-white border border-indigo-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>4. Startup India & Central Schemes</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: SSIP 2.0 GRANT PROPOSAL DRAFTER */}
      {/* ======================================================== */}
      {activeTab === 'drafter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form Inputs */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                  STUDENT GENERATOR
                </span>
                <h3 className="text-lg font-black text-slate-950 font-display">
                  Project Details
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                Format: SSIP 2.0
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Project Title / Working Name
                </label>
                <input
                  type="text"
                  value={proposalInputs.projectTitle}
                  onChange={(e) => setProposalInputs({ ...proposalInputs, projectTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  College / University
                </label>
                <select
                  value={proposalInputs.college}
                  onChange={(e) => setProposalInputs({ ...proposalInputs, college: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600"
                >
                  {GUJARAT_COLLEGES.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Sector / Tech Domain
                  </label>
                  <input
                    type="text"
                    value={proposalInputs.domain}
                    onChange={(e) => setProposalInputs({ ...proposalInputs, domain: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Target Grant
                  </label>
                  <select
                    value={proposalInputs.targetGrant}
                    onChange={(e) => setProposalInputs({ ...proposalInputs, targetGrant: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="₹2,50,000 (SSIP 2.0 Prototype Grant)">₹2.5 Lakhs (SSIP 2.0)</option>
                    <option value="₹30,00,000 (i-Hub Seed Support)">₹30 Lakhs (i-Hub Seed)</option>
                    <option value="₹10,00,000 (NIDHI-PRAYAS Grant)">₹10 Lakhs (NIDHI-PRAYAS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Problem Statement (What does it solve?)
                </label>
                <textarea
                  rows={2}
                  value={proposalInputs.problemStatement}
                  onChange={(e) => setProposalInputs({ ...proposalInputs, problemStatement: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Technical Novelty & Secret Sauce
                </label>
                <textarea
                  rows={2}
                  value={proposalInputs.noveltyClaim}
                  onChange={(e) => setProposalInputs({ ...proposalInputs, noveltyClaim: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateProposal}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isGenerating ? 'Structuring Proposal...' : 'Generate Official SSIP 2.0 Pitch Proposal'}</span>
              </button>
            </div>
          </div>

          {/* Right Preview Output (Figma Document Sheet) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
            {generatedProposal ? (
              <div className="space-y-5 animate-fade-in text-xs">
                
                {/* Header Sheet Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                      Ready for College Scrutiny Committee
                    </span>
                    <h2 className="text-xl font-black text-slate-900 font-display">
                      {proposalInputs.projectTitle}
                    </h2>
                  </div>

                  <button
                    onClick={handleCopyProposal}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Formatted Proposal'}</span>
                  </button>
                </div>

                {/* 1. Executive Summary */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                    1. Executive Summary & SSIP Alignment
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {generatedProposal.executiveSummary}
                  </p>
                </div>

                {/* 2. Technical Novelty & IP Moat */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    2. Novelty Claims & Patent Justification
                  </span>
                  <div className="space-y-1.5">
                    {generatedProposal.noveltyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Milestone Schedule */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    3. Milestone Timeline & Phase Goals
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {generatedProposal.milestones.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-600 uppercase">{m.phase}</span>
                          <p className="text-[11px] text-slate-800 font-semibold mt-0.5">{m.milestone}</p>
                        </div>
                        <span className="text-right font-mono font-black text-slate-900 text-xs mt-1">{m.budget}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Budget Breakdown Table */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    4. Line-Item Grant Utilization (Max: {proposalInputs.targetGrant})
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px] border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Expense Head</th>
                          <th className="py-2 px-3">Share</th>
                          <th className="py-2 px-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {generatedProposal.budgetBreakdown.map((b, i) => (
                          <tr key={i}>
                            <td className="py-2 px-3">{b.item}</td>
                            <td className="py-2 px-3 font-mono text-slate-500">{b.pct}</td>
                            <td className="py-2 px-3 font-mono font-bold text-slate-900 text-right">{b.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full py-20 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <FileText className="w-7 h-7 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-display">Proposal Document Canvas</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Fill out the project parameters on the left and click "Generate" to construct an official Gujarat SSIP 2.0 grant proposal.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: TRL CAMPUS-TO-MARKET METER */}
      {/* ======================================================== */}
      {activeTab === 'trl' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Diagnostic Questionnaire */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                COMMERCIAL MATURITY DIAGNOSTIC
              </span>
              <h3 className="text-xl font-black text-slate-950 font-display">
                Technology Readiness Level (TRL) Assessment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Answer these 5 quick questions to calculate whether your college project qualifies for SSIP 2.0 or institutional seed funds.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Q1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-extrabold text-slate-800">
                  1. Current State of the Working Prototype:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'Concept / CAD Simulation Only', val: 0 },
                    { label: 'Lab Breadboard / Raw Circuit', val: 1 },
                    { label: 'Integrated Alpha Prototype in Enclosure', val: 2 },
                    { label: 'Field-Tested Beta with End Users', val: 3 }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setTrlAnswers({ ...trlAnswers, prototypeStage: opt.val })}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        trlAnswers.prototypeStage === opt.val
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-extrabold text-slate-800">
                  2. University Guide & Mentor Alignment:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'No Assigned Guide', val: 0 },
                    { label: 'College Faculty Guide', val: 1 },
                    { label: 'Faculty + Industry Mentor', val: 2 }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setTrlAnswers({ ...trlAnswers, mentorSignoff: opt.val })}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        trlAnswers.mentorSignoff === opt.val
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-extrabold text-slate-800">
                  3. Prior Art & Patentability Search:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Not Conducted', val: 0 },
                    { label: 'Google Patents Search Done', val: 1 },
                    { label: 'Novelty Cleared by IP Cell', val: 2 }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setTrlAnswers({ ...trlAnswers, patentSearch: opt.val })}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        trlAnswers.patentSearch === opt.val
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-extrabold text-slate-800">
                  4. User Validation Trials:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: '0 External Users', val: 0 },
                    { label: '5-15 Student Testers', val: 1 },
                    { label: 'External Letters of Intent', val: 2 }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setTrlAnswers({ ...trlAnswers, pilotFeedback: opt.val })}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        trlAnswers.pilotFeedback === opt.val
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right TRL Scorecard */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Meter Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                CALCULATED MATURITY SCORE
              </span>

              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="58" stroke="#E2E8F0" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="58" 
                    stroke="#10B981" 
                    strokeWidth="12" 
                    strokeDasharray={364} 
                    strokeDashoffset={364 - (currentTrl / 9) * 364} 
                    strokeLinecap="round" 
                    fill="transparent" 
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 font-display">TRL {currentTrl}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Scale: 1 to 9</span>
                </div>
              </div>

              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${trlInfo.color}`}>
                  {trlInfo.badge}
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mt-2">
                  {trlInfo.stage}
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-left space-y-1 text-xs">
                <span className="font-extrabold text-emerald-800 uppercase tracking-wide text-[10px] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Immediate Action Plan This Semester:</span>
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {trlInfo.nextStep}
                </p>
              </div>
            </div>

            {/* Checklist Box */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-extrabold uppercase text-[10px] text-indigo-300">
                  Campus Grant Eligibility Checklist
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-slate-300">
                  <span className={currentTrl >= 3 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    {currentTrl >= 3 ? "✓" : "○"}
                  </span>
                  <span>Eligible for SSIP 2.0 Prototype Grant (₹2.5 Lakhs)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <span className={currentTrl >= 5 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    {currentTrl >= 5 ? "✓" : "○"}
                  </span>
                  <span>Eligible for i-Hub Startup Seed Support (₹30 Lakhs)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <span className={currentTrl >= 7 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    {currentTrl >= 7 ? "✓" : "○"}
                  </span>
                  <span>Eligible for Gujarat Venture Finance Limited (GVFL)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: CO-FOUNDER & CAMPUS FABLAB DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'fablab' && (
        <div className="space-y-8">
          
          {/* Team Skill Gap Analyzer */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                  TEAM SYNERGY CHECKER
                </span>
                <h3 className="text-xl font-black text-slate-950 font-display">
                  Student Founder Skill Balancer
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select the skills your current student team already possesses to uncover critical talent gaps investors look for.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'Coding & Software',
                  'Hardware & Circuit Design',
                  'UI/UX Design',
                  'Sales & B2B Go-To-Market',
                  'Finance & Grant Compliance'
                ].map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      teamSkills.includes(skill)
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {teamSkills.includes(skill) ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Missing Gaps Alert */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                <span className="font-extrabold text-emerald-800 uppercase tracking-wider text-[10px]">
                  Current Team Core Competencies ({teamSkills.length})
                </span>
                <p className="text-slate-700 font-medium">
                  {teamSkills.join(', ') || 'No skills selected yet.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                <span className="font-extrabold text-amber-800 uppercase tracking-wider text-[10px]">
                  Recommended Co-Founder Recruitments ({missingSkills.length})
                </span>
                <p className="text-slate-700 font-medium">
                  {missingSkills.length > 0 
                    ? `You should recruit co-founders for: ${missingSkills.join(', ')} from college hackathons.`
                    : 'Balanced founding team! All core engineering and commercial competencies covered.'}
                </p>
              </div>
            </div>
          </div>

          {/* Gujarat University FabLab Directory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                  CAMPUS PROTOTYPING INFRASTRUCTURE
                </span>
                <h3 className="text-2xl font-black text-slate-950 font-display">
                  Gujarat University MakerSpace & FabLab Directory
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                Free equipment access under SSIP 2.0 for enrolled students
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FABLAB_DIRECTORY.map((lab, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors font-display">
                        {lab.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[9px] uppercase tracking-wider shrink-0">
                        {lab.location.split(',')[0]}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Available Equipment:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lab.equipment.map((eq, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-medium border border-indigo-100">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Grant Support:</span>
                        <p className="text-[11px] text-slate-700 font-semibold mt-0.5">
                          {lab.grantSupport}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500 font-medium">Eligible for Enrolled Students</span>
                    <a
                      href={lab.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Visit Lab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 4: STARTUP INDIA & CENTRAL SCHEMES (DPIIT & MEITY) */}
      {/* ======================================================== */}
      {activeTab === 'dpiit' && (
        <div className="space-y-8 animate-fade-in text-xs">
          
          {/* Top Banner Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                  GOVERNMENT OF INDIA STATUTORY RECOGNITION
                </span>
                <h3 className="text-2xl font-black text-slate-950 font-display">
                  DPIIT Startup India Recognition & Central Schemes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Understand mandatory criteria, 3-year 100% tax holidays (Section 80-IAC), 80% patent discounts, and MeitY seed grants.
                </p>
              </div>

              <a
                href="https://www.startupindia.gov.in/content/sih/en/startup-scheme.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-xs shrink-0 transition-colors"
              >
                <span>Official Startup India Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 4 Eligibility Criteria Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Entity Type</span>
                <div className="font-extrabold text-slate-900 text-xs">Pvt Ltd / LLP / Partnership</div>
                <div className="text-[10px] text-slate-500">Sole proprietorship not eligible</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Company Age</span>
                <div className="font-extrabold text-slate-900 text-xs">&lt; 10 Years from Incorporation</div>
                <div className="text-[10px] text-slate-500">From the date of MCA registration</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Turnover Limit</span>
                <div className="font-extrabold text-slate-900 text-xs">&lt; ₹100 Crore Annual</div>
                <div className="text-[10px] text-slate-500">In any preceding financial year</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Nature of Work</span>
                <div className="font-extrabold text-slate-900 text-xs">Original Innovation / Moat</div>
                <div className="text-[10px] text-slate-500">Must not be split/reconstruction</div>
              </div>
            </div>
          </div>

          {/* Statutory Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Benefit 1: 80-IAC */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-400 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase border border-emerald-200">
                  Income Tax Holiday
                </span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="text-base font-black text-slate-900 font-display">
                Section 80-IAC Tax Exemption
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eligible DPIIT-recognized startups can receive a <strong>100% tax deduction on business profits for 3 consecutive financial years</strong> out of their first 10 years after approval by the Inter-Ministerial Board (IMB).
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero tax on profits during growth phase</span>
              </div>
            </div>

            {/* Benefit 2: Angel Tax Section 56 */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-400 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase border border-blue-200">
                  Investor Exemption
                </span>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="text-base font-black text-slate-900 font-display">
                Angel Tax Exemption (Sec 56(2))
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exempts consideration received for shares issued above fair market value to angel investors or Category-I/II AIFs. Total paid-up capital & share premium must not exceed <strong>₹25 Crore</strong>.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Form 2 self-declaration on Startup India</span>
              </div>
            </div>

            {/* Benefit 3: 80% Patent Rebate */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-400 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black uppercase border border-purple-200">
                  Fast-Track IPR
                </span>
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="text-base font-black text-slate-900 font-display">
                80% Patent & 50% TM Fee Rebate
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                SIPP (Start-ups Intellectual Property Protection) scheme provides <strong>80% reduction in government patent filing fees</strong>, 50% discount on trademarks, and free empanelled facilitators to guide IP drafting.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Fast-track expedited patent examination</span>
              </div>
            </div>

            {/* Benefit 4: Self-Certification */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-400 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase border border-amber-200">
                  Regulatory Ease
                </span>
                <Layers className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="text-base font-black text-slate-900 font-display">
                9 Labor & Environmental Self-Certifications
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Startups can self-certify compliance under <strong>6 Labor Laws</strong> (Gratuity, Contract Labor, EPF, ESI) and <strong>3 Environmental Acts</strong> (Water & Air Pollution). No inspector visits for up to 5 years.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Zero routine harassment from statutory auditors</span>
              </div>
            </div>

            {/* Benefit 5: GeM Public Procurement */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-400 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase border border-indigo-200">
                  Govt Contracts
                </span>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <h4 className="text-base font-black text-slate-900 font-display">
                GeM Tender Prior Turnover Exemption
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                DPIIT startups can pitch directly for government tenders on the <strong>Government e-Marketplace (GeM)</strong> with complete waiver of prior turnover, prior experience criteria, and Earnest Money Deposit (EMD).
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Direct procurement from ministries & PSUs</span>
              </div>
            </div>

            {/* Benefit 6: MeitY Startup Hub */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-400 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black uppercase border border-rose-200">
                  MeitY Digital India
                </span>
                <Cpu className="w-4 h-4 text-rose-600" />
              </div>
              <h4 className="text-base font-black text-slate-900 font-display">
                MeitY SAMRIDH & TIDE 2.0
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ministry of Electronics and IT (MeitY) offers up to <strong>₹40 Lakhs matching accelerator capital under SAMRIDH</strong>, software prototyping grants under TIDE 2.0, and $10,000+ cloud credits across AWS and Google Cloud.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Access to 100+ national tech incubators</span>
              </div>
            </div>

          </div>

          {/* Official Launch Portals Banner */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Direct Access Directory</span>
                <h4 className="text-base font-black font-display">Official Government Portals & Registration Gateways</h4>
              </div>
              <span className="text-[11px] text-slate-400">All applications processed online with zero physical submissions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href="https://www.startupindia.gov.in/content/sih/en/startup-scheme.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-amber-400 transition-colors">Startup India Hub</div>
                  <div className="text-[10px] text-slate-400">DPIIT & IMB Application</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </a>

              <a
                href="https://www.nsws.gov.in/portal/approvalsandregistrations"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-amber-400 transition-colors">NSWS Single Window</div>
                  <div className="text-[10px] text-slate-400">Central & State Approvals</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </a>

              <a
                href="https://www.digitalindia.gov.in/initiative/meitys-startup-hub/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-amber-400 transition-colors">MeitY Startup Hub</div>
                  <div className="text-[10px] text-slate-400">TIDE 2.0 & SAMRIDH</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </a>

              <a
                href="https://razorpay.com/rize/blogs/startup-india-certificate-apply-online-benefits-eligibility-process/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-amber-400 transition-colors">Razorpay Rize Guide</div>
                  <div className="text-[10px] text-slate-400">DPIIT Filing Step-by-Step</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default StudentProHub;
