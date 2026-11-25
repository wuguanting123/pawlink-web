import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Layers, Palette, RotateCcw, User, UserX, Workflow } from 'lucide-react';
import { usePawLink } from '../../context/PawLinkContext';
import { OrgSubRole, UserRole } from '../../types/pawlink';

const ROLE_OPTIONS: { value: UserRole; label: string; icon: React.ReactNode }[] = [
  { value: 'guest', label: '未登入訪客', icon: <UserX className="h-3.5 w-3.5" /> },
  { value: 'owner', label: '一般飼主（王○明）', icon: <User className="h-3.5 w-3.5" /> },
  { value: 'org', label: '機構管理員（臺北市動物之家）', icon: <Building2 className="h-3.5 w-3.5" /> },
];

const ORG_SUBROLES: OrgSubRole[] = ['機構管理員', '審核人員', '回訪人員', '資料管理員'];

export const RoleSwitcherBar: React.FC = () => {
  const { state, switchRole, setOrgSubRole, resetDemoState } = usePawLink();

  return (
    <div className="bg-slate-950 text-slate-100 border-b border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300 tracking-wide uppercase">
            Demo 角色切換
          </span>
          <div className="inline-flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {ROLE_OPTIONS.map((opt) => {
              const active = state.role === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => switchRole(opt.value)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {state.role === 'org' && (
            <label className="inline-flex items-center gap-1.5 text-emerald-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              <span>權限身分:</span>
              <select
                value={state.orgSubRole}
                onChange={(e) => setOrgSubRole(e.target.value as OrgSubRole)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                aria-label="機構權限子角色"
              >
                {ORG_SUBROLES.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-white">
                    {r}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/overview"
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>UI-00.00 總覽</span>
          </Link>
          <Link
            to="/design-system"
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Palette className="h-3.5 w-3.5" />
            <span>UI-00.01 規範</span>
          </Link>
          <Link
            to="/flows"
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Workflow className="h-3.5 w-3.5" />
            <span>UI-90.01 流程圖</span>
          </Link>
          <button
            type="button"
            onClick={resetDemoState}
            title="還原所有假資料至初始簡報狀態"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>重設狀態</span>
          </button>
        </div>
      </div>
    </div>
  );
};
