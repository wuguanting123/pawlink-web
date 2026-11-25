import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <span>PawLink 毛孩領養與照護平台</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              畢業專題高互動原型
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
            <Link to="/overview" className="hover:text-slate-950 hover:underline">
              畫面架構總覽 (UI-00.00)
            </Link>
            <Link to="/design-system" className="hover:text-slate-950 hover:underline">
              高對比設計規範 (UI-00.01)
            </Link>
            <Link to="/flows" className="hover:text-slate-950 hover:underline">
              操作流程圖 (UI-90.01)
            </Link>
            <Link to="/rules" className="hover:text-slate-950 hover:underline">
              狀態檢查表 (UI-90.02)
            </Link>
            <Link to="/ui-flow/notification" className="hover:text-slate-950 hover:underline">
              機構通知互動流程 (UI-90.03)
            </Link>
          </div>
        </div>

        {/* UI-01.00 / UI-04.01 Low-key Organization Login Entry in Footer */}
        <Link
          to="/organization/login"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F6B5B] hover:bg-[#0A4D41] text-white font-bold text-[15px] shadow-sm transition-colors shrink-0"
        >
          <Shield className="h-4 w-4" />
          <span>動物之家／機構登入</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
};
