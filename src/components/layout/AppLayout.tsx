import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { resolveScreenMeta } from '../../config/screens';
import { ZONE_THEMES } from '../../config/theme';
import { FloatingScreenBadge } from './FloatingScreenBadge';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { RoleSwitcherBar } from './RoleSwitcherBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const screen = resolveScreenMeta(location.pathname, location.search);
  const theme = ZONE_THEMES[screen.zone];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top 4px high-contrast zone bar */}
      <div className={`h-1.5 w-full ${theme.accentStripe}`} />

      {/* Demo Role Switcher Testing Toolbar */}
      <RoleSwitcherBar />

      {/* Dynamic Zone-Colored Navbar */}
      <Navbar theme={theme} />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">
        {/* Presentation Header + Breadcrumb */}
        <div className="mb-6 space-y-3">
          {/* Breadcrumb */}
          <nav aria-label="麵包屑導覽" className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-slate-600">
            {screen.breadcrumbs.map((crumb, idx) => {
              const isLast = idx === screen.breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${crumb.label}-${idx}`}>
                  {idx > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                  {crumb.to && !isLast ? (
                    <Link
                      to={crumb.to}
                      className="hover:text-slate-950 hover:underline transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'text-slate-950 font-bold' : ''}>{crumb.label}</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Screen Title Banner matching PDF slide header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className={`w-1.5 self-stretch rounded-full shrink-0 ${theme.accentStripe}`} />
              <div>
                <h1 className="heading-main text-slate-950">{screen.title}</h1>
                <p className="mt-1 text-base text-slate-600">{screen.subtitle}</p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2 self-start">
              <span
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-extrabold border shadow-xs ${theme.uiBadgeBg} ${theme.uiBadgeText} ${theme.uiBadgeBorder}`}
              >
                {screen.id}
              </span>
            </div>
          </div>
        </div>

        {/* Active Page Body */}
        {children}
      </main>

      {/* Shared Footer with Org Login Entry */}
      <Footer />

      {/* Floating Bottom-Right Screen ID Badge for Presentation */}
      <FloatingScreenBadge screen={screen} theme={theme} />
    </div>
  );
};
