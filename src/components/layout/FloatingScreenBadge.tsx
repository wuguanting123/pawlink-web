import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, Compass, X } from 'lucide-react';
import { SCREEN_REGISTRY } from '../../config/screens';
import { ZoneTheme, ZONE_THEMES } from '../../config/theme';
import { ScreenMeta } from '../../types/pawlink';

interface FloatingScreenBadgeProps {
  screen: ScreenMeta;
  theme: ZoneTheme;
}

export const FloatingScreenBadge: React.FC<FloatingScreenBadgeProps> = ({ screen, theme }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const jumpTo = (pattern: string) => {
    setOpen(false);
    const resolved = pattern
      .replace(':petId', 'A-0001')
      .replace(':msgId', 'MSG-008')
      .replace(':caseId', 'A-0001');
    navigate(resolved);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-80 sm:w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Compass className="h-4 w-4 text-amber-300" />
              <span>簡報畫面快速跳轉（{SCREEN_REGISTRY.length} 頁）</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-slate-800 cursor-pointer"
              aria-label="關閉畫面索引"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-y-auto p-2 space-y-1">
            {SCREEN_REGISTRY.map((item) => {
              const itemTheme = ZONE_THEMES[item.zone];
              const isCurrent = item.id === screen.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jumpTo(item.pattern)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${itemTheme.uiBadgeBg} ${itemTheme.uiBadgeText}`}
                  >
                    {item.id}
                  </span>
                  <span className="truncate">{item.title.split('｜')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title="點擊展開所有 UI 畫面跳轉選單"
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-extrabold text-sm shadow-lg border-2 transition-transform hover:scale-105 cursor-pointer ${theme.uiBadgeBg} ${theme.uiBadgeText} ${theme.uiBadgeBorder}`}
      >
        <span className="tracking-wide">{screen.id}</span>
        <span className="opacity-75 font-semibold hidden sm:inline">· {theme.label}</span>
        <ChevronUp className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
