import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Building2, LogOut, Menu, ShieldCheck, User, X } from 'lucide-react';
import { ZoneTheme } from '../../config/theme';
import { usePawLink } from '../../context/PawLinkContext';

interface NavbarProps {
  theme: ZoneTheme;
}

export const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const { state, logout } = usePawLink();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadNotifications = state.notifications.filter((n) => n.unread).length;
  const unreadMessages = state.orgMessages.filter((m) => m.statusLabel === '未讀').length;
  const isOrgZone = theme.zone === 'org';

  const navItems = isOrgZone
    ? [
        { label: '審核工作台', to: '/organization', end: true },
        { label: 'KYC 審核', to: '/organization/kyc' },
        { label: '回訪追蹤', to: '/organization/followups' },
        { label: '通知聯絡', to: '/organization/contacts', badge: unreadMessages },
        { label: '來源同步', to: '/organization/sync' },
      ]
    : [
        { label: '領養專區', to: '/adopt' },
        { label: '追蹤專區', to: '/care/dashboard' },
        ...(state.role === 'org' ? [{ label: '機構管理', to: '/organization' }] : []),
        { label: '平台介紹', to: '/design-system' },
        { label: '聯絡通知', to: '/notifications', badge: unreadNotifications },
      ];

  const handleAccountClick = () => {
    setMobileOpen(false);
    if (state.role === 'guest') {
      navigate(isOrgZone ? '/organization/login' : '/login');
    } else if (state.role === 'org') {
      navigate('/organization');
    } else {
      navigate('/notifications');
    }
  };

  return (
    <header className={`${theme.navBg} border-b ${theme.navBorder} text-white transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <span
            className={`w-9 h-9 rounded-xl ${theme.navBrandBg} ${theme.navBrandText} font-extrabold text-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105`}
          >
            P
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl font-extrabold tracking-tight text-white">PawLink</span>
            <span className="hidden md:inline text-sm font-medium text-white/85">
              {isOrgZone ? '機構管理中心' : '毛孩領養與照護平台'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5" aria-label="主導覽列">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-[15px] font-semibold transition-colors inline-flex items-center gap-1.5 ${
                  isActive
                    ? theme.navActivePill
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white leading-none">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Account & Quick Status */}
        <div className="hidden lg:flex items-center gap-2.5">
          {state.role !== 'guest' && (
            <Link
              to="/care/messages"
              title="機構通知收件匣"
              className="relative p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Link>
          )}

          <button
            type="button"
            onClick={handleAccountClick}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[15px] transition-colors cursor-pointer ${theme.navAccountBtn}`}
          >
            {state.role === 'org' ? (
              <>
                <Building2 className="h-4 w-4" />
                <span>{state.orgSubRole}</span>
              </>
            ) : state.role === 'owner' ? (
              <>
                <User className="h-4 w-4" />
                <span>{state.currentUser.maskedName}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>登入／帳號</span>
              </>
            )}
          </button>

          {state.role !== 'guest' && (
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="登出"
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white cursor-pointer"
          aria-label="切換導覽選單"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/15 px-4 py-3 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3.5 py-2.5 rounded-lg text-base font-semibold ${
                  isActive ? theme.navActivePill : 'text-white/90 hover:bg-white/10'
                }`
              }
            >
              <span className="flex items-center justify-between">
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </span>
            </NavLink>
          ))}
          <div className="pt-2 border-t border-white/15 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAccountClick}
              className={`flex-1 py-2.5 px-4 rounded-lg text-base ${theme.navAccountBtn}`}
            >
              {state.role === 'guest'
                ? '登入／帳號'
                : state.role === 'org'
                  ? `已登入：${state.orgSubRole}`
                  : `已登入：${state.currentUser.maskedName}`}
            </button>
            {state.role !== 'guest' && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  navigate('/');
                }}
                className="py-2.5 px-4 rounded-lg bg-white/15 text-white font-semibold"
              >
                登出
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
