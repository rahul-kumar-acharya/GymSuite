import React from 'react';

export const PortalPageShell = ({ eyebrow = 'Workspace', title, subtitle, actions, children, className = '' }) => (
  <section className={`mx-auto w-full max-w-6xl space-y-6 ${className}`}>
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brass-600">{eyebrow}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-espresso-800 sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-mutedGray">{subtitle}</p>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
    {children}
  </section>
);

export const PortalSurface = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-sand bg-white p-5 shadow-xs sm:p-6 ${className}`}>{children}</div>
);

export const PortalState = ({ children, tone = 'muted' }) => (
  <div className={`rounded-xl border p-4 text-xs font-medium ${tone === 'error' ? 'border-statusRed-text/20 bg-statusRed-bg text-statusRed-text' : 'border-dashed border-sand bg-cream-50 text-mutedGray'}`} role={tone === 'error' ? 'alert' : undefined}>{children}</div>
);
