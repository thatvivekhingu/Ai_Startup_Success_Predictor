import React, { useEffect, useRef, useState } from 'react';
import { CircleHelp, LogIn, LogOut, Menu, Search, Settings, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PRIMARY_ROUTES, ROUTE_META, ROUTES, routeLabel } from '../../utils/routes';
import BrandMark from './BrandMark';

const WorkspaceShell = ({ route, onNavigate, onOpenProfile, children }) => {
  const { user, logout, sessionError } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleKeyDown = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const navigate = (nextRoute) => {
    setMenuOpen(false);
    onNavigate(nextRoute);
  };

  return (
    <div className="sp-app">
      <header className="sp-topbar">
        <div className="sp-topbar-inner">
          <BrandMark onClick={() => navigate(ROUTES.evaluate)} />
          <nav className="sp-nav" aria-label="Primary workspace navigation">
            {PRIMARY_ROUTES.map((item) => (
              <button key={item} type="button" className={`sp-nav-link sp-focus ${route === item ? 'is-active' : ''}`} aria-current={route === item ? 'page' : undefined} onClick={() => navigate(item)}>
                <span className="sp-nav-index">{ROUTE_META[item].index}</span>
                <span>{ROUTE_META[item].label}</span>
              </button>
            ))}
          </nav>
          <div className="sp-utilities">
            <button type="button" className="sp-utility-btn sp-focus" onClick={() => navigate(ROUTES.search)}><Search size={15} /><span className="sp-utility-label">Search</span></button>
            <button type="button" className="sp-utility-btn sp-focus sp-desktop-only" onClick={() => navigate(ROUTES.help)}><CircleHelp size={15} /><span className="sp-utility-label">Help</span></button>
            {user ? (
              <button type="button" className="sp-user-chip sp-focus" onClick={() => onOpenProfile ? onOpenProfile() : navigate(ROUTES.settings)} aria-label="Open account settings">
                <span className="sp-user-avatar">{user.avatar ? <img src={user.avatar} alt="" /> : (user.name || 'SP').slice(0, 2).toUpperCase()}</span>
                <span className="sp-user-meta"><span className="sp-user-name">{user.name}</span><span className="sp-user-role">{user.isCachedSession ? 'Cached session' : user.role}</span></span>
              </button>
            ) : <button type="button" className="sp-utility-btn sp-focus" onClick={() => navigate(ROUTES.login)}><LogIn size={15} /><span className="sp-utility-label">Sign in</span></button>}
            <button type="button" className="sp-icon-btn sp-focus sp-mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open workspace menu" aria-expanded={menuOpen}><Menu size={18} /></button>
          </div>
        </div>
      </header>

      {sessionError && <div className="mx-auto mt-3 w-[min(100%-24px,1600px)]"><div className="sp-state-panel is-warning"><div className="flex items-center justify-between gap-3"><span className="text-xs text-sp-muted">{sessionError}</span><button type="button" className="sp-btn sp-btn-ghost" onClick={logout}><LogOut size={14} />Sign out</button></div></div></div>}

      <main className="sp-main">{children}</main>
      <footer className="sp-footer"><span>StartupPulse · Decision workspace</span><span className="sp-footer-links"><button type="button" className="sp-focus border-0 bg-transparent p-0" onClick={() => onNavigate(ROUTES.help)}>Help & docs</button><button type="button" className="sp-focus border-0 bg-transparent p-0" onClick={() => onNavigate(ROUTES.privacy)}>Privacy</button><button type="button" className="sp-focus border-0 bg-transparent p-0" onClick={() => onNavigate(ROUTES.terms)}>Terms</button></span></footer>

      {menuOpen && <div className="fixed inset-0 z-[70] bg-sp-navy/25" role="presentation" onMouseDown={() => setMenuOpen(false)}>
        <section ref={menuRef} className="sp-mobile-menu-panel ml-auto flex h-full w-[min(88vw,360px)] flex-col border-l border-sp-rule bg-sp-surface p-5 shadow-sp-menu" role="dialog" aria-modal="true" aria-label="Workspace menu" onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between"><BrandMark compact /><button type="button" className="sp-icon-btn sp-focus" onClick={() => setMenuOpen(false)} aria-label="Close workspace menu"><X size={18} /></button></div>
          <div className="mt-6 grid gap-1">{PRIMARY_ROUTES.map((item) => <button key={item} type="button" className={`sp-nav-link min-h-[48px] justify-start ${route === item ? 'is-active' : ''}`} onClick={() => navigate(item)}><span className="sp-nav-index">{ROUTE_META[item].index}</span>{routeLabel(item)}</button>)}</div>
          <div className="mt-5 border-t border-sp-rule pt-4 grid gap-1"><button type="button" className="sp-nav-link min-h-[48px] justify-start" onClick={() => navigate(ROUTES.search)}><Search size={15} />Search</button><button type="button" className="sp-nav-link min-h-[48px] justify-start" onClick={() => navigate(ROUTES.help)}><CircleHelp size={15} />Help & docs</button><button type="button" className="sp-nav-link min-h-[48px] justify-start" onClick={() => navigate(ROUTES.settings)}><Settings size={15} />Settings</button></div>
          <div className="mt-auto flex gap-2"><button type="button" className="sp-btn sp-btn-secondary flex-1" onClick={() => navigate(ROUTES.access)}>Access</button>{user && <button type="button" className="sp-btn sp-btn-danger" onClick={() => { logout(); navigate(ROUTES.login); }}><LogOut size={14} />Sign out</button>}</div>
        </section>
      </div>}
    </div>
  );
};

export default WorkspaceShell;
