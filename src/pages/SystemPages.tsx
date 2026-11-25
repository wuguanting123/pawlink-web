import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SCREEN_REGISTRY } from '../config/screens';
import { ZONE_THEMES } from '../config/theme';

export const DesignSystemPage: React.FC = () => {
  const zones = [
    {
      title: '領養專區',
      desc: '待領養搜尋・私人送養・認養申請',
      hex: '#F57C00',
      ctaHex: '#B45309',
      badgeClass: 'bg-[#F57C00] text-slate-950',
      softClass: 'bg-[#FFF3E0] text-[#7C2D12] border-[#F57C00]/30',
      barClass: 'bg-[#F57C00]',
      to: '/adopt',
      note: '亮橘底配深色文字確保高對比；重要按鈕採深橘底 #B45309 與白字。',
    },
    {
      title: '飼主追蹤',
      desc: '每日照護・健康紀錄・Care Score',
      hex: '#1565C0',
      badgeClass: 'bg-[#1565C0] text-white',
      softClass: 'bg-[#EEF4FF] text-[#0D3C78] border-[#1565C0]/30',
      barClass: 'bg-[#1565C0]',
      to: '/care/dashboard',
      note: '高對比深藍主色搭配冰藍底卡，區分照護分數與可兌換點數。',
    },
    {
      title: '機構管理',
      desc: 'KYC 審核・回訪・聯絡通知',
      hex: '#0F6B5B',
      badgeClass: 'bg-[#0F6B5B] text-white',
      softClass: 'bg-[#E6F4F1] text-[#07382F] border-[#0F6B5B]/30',
      barClass: 'bg-[#0F6B5B]',
      to: '/organization',
      note: '墨綠專業識別，僅由頁尾入口或權限登入後進入管理工作台。',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {zones.map((z) => (
          <div key={z.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-5">
            <div className="flex items-start gap-3">
              <div className={`w-1.5 h-14 rounded-full ${z.barClass}`} />
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">{z.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{z.desc}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`rounded-xl py-4 text-center font-extrabold text-xl tracking-wide shadow-xs ${z.badgeClass}`}>
                {z.hex}
              </div>
              <div className={`rounded-xl py-2.5 px-3 text-center text-sm font-bold border ${z.softClass}`}>
                主色 / 清楚辨識專區
              </div>
              <p className="text-sm text-slate-600">{z.note}</p>
            </div>

            <Link
              to={z.to}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors"
            >
              <span>前往此專區</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-start gap-4">
        <div className="w-1.5 self-stretch rounded-full bg-[#0F6B5B]" />
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-950">
            主標題 ≥ 24 pt｜操作文字 12–16 pt｜必要資訊以標籤區分
          </h3>
          <p className="text-base text-slate-700">
            亮橘底若搭配白字對比不足，改用深色文字（<code className="px-1.5 py-0.5 rounded bg-slate-100">text-slate-950</code>）；重要按鈕採深橘底（<code className="px-1.5 py-0.5 rounded bg-slate-100">#B45309</code>）與白字。頂部導覽列與右下角畫面徽章隨專區自動切換色彩。
          </p>
        </div>
      </div>
    </div>
  );
};

export const OverviewPage: React.FC = () => {
  const sections = [
    { code: '01', name: '共用入口', desc: '首頁、登入、通知', zone: 'portal' as const },
    { code: '02', name: '領養與私人送養', desc: '搜尋、六步驟申請、刊登審核', zone: 'adopt' as const },
    { code: '03', name: '飼主照護', desc: '日常、醫療、分數、點數、機構通知', zone: 'care' as const },
    { code: '04', name: '機構管理', desc: 'KYC、送養審核、回訪、資料同步、飼主聯絡', zone: 'org' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((sec) => {
          const zTheme = ZONE_THEMES[sec.zone];
          const screens = SCREEN_REGISTRY.filter((s) => s.id.startsWith(`UI-${sec.code}.`));
          return (
            <div key={sec.code} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${zTheme.uiBadgeBg} ${zTheme.uiBadgeText}`}>
                  {sec.code}
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950">{sec.name}</h2>
                  <p className="text-sm text-slate-600">{sec.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {screens.map((sc) => {
                  const resolved = sc.pattern
                    .replace(':petId', 'A-0001')
                    .replace(':msgId', 'MSG-008')
                    .replace(':caseId', 'A-0001');
                  return (
                    <Link
                      key={sc.id}
                      to={resolved}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      <span className="font-extrabold">{sc.id}</span>
                      <span className="text-slate-600">{sc.title.split('｜')[0]}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <h3 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#0F6B5B]" />
          <span>示範操作順序</span>
        </h3>
        <p className="text-base text-slate-700">
          首頁 → 領養搜尋／我要送養 → 審核與媒合 → 認養成功後進入照護追蹤。動物之家與合作機構由首頁頁尾登入，負責 KYC、送養審核、回訪與資料更新。
        </p>
      </div>
    </div>
  );
};
