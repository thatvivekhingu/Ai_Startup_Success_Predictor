export const ROUTES = Object.freeze({
  evaluate: 'evaluate',
  portfolio: 'portfolio',
  evidence: 'evidence',
  funding: 'funding',
  student: 'student',
  search: 'search',
  access: 'access',
  help: 'help',
  docs: 'docs',
  privacy: 'privacy',
  terms: 'terms',
  recovery: 'recover-password',
  settings: 'settings',
  login: 'login',
});

export const LEGACY_ROUTE_ALIASES = Object.freeze({
  predict: ROUTES.evaluate,
  dashboard: ROUTES.portfolio,
  insights: ROUTES.evidence,
  'student-hub': ROUTES.student,
});

export const ROUTE_META = Object.freeze({
  [ROUTES.evaluate]: { label: 'Evaluate', index: '01' },
  [ROUTES.portfolio]: { label: 'Portfolio', index: '02' },
  [ROUTES.evidence]: { label: 'Model Evidence', index: '03' },
  [ROUTES.funding]: { label: 'Funding Research', index: '04' },
  [ROUTES.student]: { label: 'Student Workspace', index: '05' },
  [ROUTES.search]: { label: 'Search' },
  [ROUTES.access]: { label: 'Pricing & Access' },
  [ROUTES.help]: { label: 'Help & docs' },
  [ROUTES.docs]: { label: 'API docs' },
  [ROUTES.privacy]: { label: 'Privacy' },
  [ROUTES.terms]: { label: 'Terms' },
  [ROUTES.recovery]: { label: 'Password recovery' },
  [ROUTES.settings]: { label: 'Settings' },
  [ROUTES.login]: { label: 'Sign in' },
});

export const PRIMARY_ROUTES = [
  ROUTES.evaluate,
  ROUTES.portfolio,
  ROUTES.evidence,
  ROUTES.funding,
  ROUTES.student,
];

export const UTILITY_ROUTES = [
  ROUTES.search,
  ROUTES.help,
  ROUTES.access,
  ROUTES.docs,
  ROUTES.settings,
  ROUTES.privacy,
  ROUTES.terms,
  ROUTES.recovery,
];

export const normalizeRoute = (value) => {
  const cleaned = String(value || '').replace(/^#\/?/, '').trim();
  const route = LEGACY_ROUTE_ALIASES[cleaned] || cleaned;
  return ROUTE_META[route] ? route : ROUTES.evaluate;
};

export const readRoute = () => normalizeRoute(window.location.hash);

export const toHash = (route) => `#${normalizeRoute(route)}`;

export const routeLabel = (route) => ROUTE_META[normalizeRoute(route)]?.label || ROUTE_META[ROUTES.evaluate].label;
