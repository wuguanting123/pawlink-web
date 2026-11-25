import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { resolveScreenMeta, SCREEN_REGISTRY } from '../config/screens';
import { ZONE_THEMES } from '../config/theme';
import { usePawLink } from '../context/PawLinkContext';

/**
 * Foundational route preview shell for Phase 1 routing architecture.
 * Displays live global store context and links to prev/next screens in the PDF flow.
 */
export const ZoneStubPage: React.FC = () => {
  const location = useLocation();
  const screen = resolveScreenMeta(location.pathname, location.search);
  const theme = ZONE_THEMES[screen.zone];
  const { state } = usePawLink();

  const resolveLink = (id: string) => {
    const target = SCREEN_REGISTRY.find((s) => s.id === id);
    if (!target) return '/';
    return target.pattern
      .replace(':petId', 'A-0001')
      .replace(':msgId', 'MSG-008')
      .replace(':caseId', 'A-0001');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className={`px-3 py-1 rounded-lg text-sm font-extrabold ${theme.uiBadgeBg} ${theme.uiBadgeText}`}>
            {screen.id}
          </span>
          <span className="text-base font-bold text-slate-800">專區路由與主題架構已就緒</span>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          目前角色：{state.role === 'guest' ? '未登入訪客' : state.role === 'owner' ? state.currentUser.maskedName : state.orgSubRole}
        </span>
      </div>

      <div className={`rounded-2xl p-5 border ${theme.softBg} ${theme.softBorder} ${theme.softText} space-y-2`}>
        <div className="font-bold text-base flex items-center gap-2">
          <Layers className="h-5 w-5" />
          <span>全局模擬資料即時連動狀態</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          <li>待領養毛孩：{state.pets.map((p) => `${p.name}(${p.id})`).join('、')}</li>
          <li>認養案件：{state.applications.map((a) => `${a.caseId}:${a.statusLabel}`).join('、')}</li>
          <li>送養案件：{state.rehomeCases.map((r) => `${r.caseId}:${r.status}`).join('、')}</li>
          <li>Care Points：{state.carePoints} 點</li>
          <li>機構通知：{state.orgMessages.length} 則（未讀 {state.orgMessages.filter((m) => m.statusLabel === '未讀').length}）</li>
          <li>稽核紀錄：{state.auditLogs.length} 筆</li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {screen.prevId ? (
          <Link
            to={resolveLink(screen.prevId)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>上一畫面 ({screen.prevId})</span>
          </Link>
        ) : (
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回首頁 (UI-01.00)</span>
          </Link>
        )}

        <div className="flex flex-wrap gap-2">
          {screen.nextIds?.map((nid) => (
            <Link
              key={nid}
              to={resolveLink(nid)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${theme.ctaBg} ${theme.ctaHoverBg} ${theme.ctaText}`}
            >
              <span>前往 {nid}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
