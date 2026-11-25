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

/* ════════════════════════════════════════════════════════════════
   UI-90.01  FlowsPage  /flows
════════════════════════════════════════════════════════════════ */
export const FlowsPage: React.FC = () => {
  const flows = [
    {
      title: '路徑 A：認養毛孩完整流程',
      color: '#F57C00',
      steps: [
        { label: '首頁', path: '/' },
        { label: '探索列表', path: '/adopt' },
        { label: '動物履歷', path: '/adopt/pet/A-0001' },
        { label: '認養申請總覽', path: '/adopt/apply/A-0001' },
        { label: '聯繫意願', path: '/adopt/apply/A-0001/contact' },
        { label: 'KYC 上傳', path: '/adopt/apply/A-0001/kyc' },
        { label: '環境評估', path: '/adopt/apply/A-0001/environment' },
        { label: '教育訓練', path: '/adopt/apply/A-0001/education' },
        { label: '合約簽署', path: '/adopt/apply/A-0001/contract' },
        { label: '帶回確認', path: '/adopt/apply/A-0001/handover' },
        { label: '照護儀表板', path: '/care/dashboard' },
      ],
    },
    {
      title: '路徑 B：私人送養完整流程',
      color: '#B45309',
      steps: [
        { label: '首頁', path: '/' },
        { label: '送養入口', path: '/adopt/rehome' },
        { label: '基本資料', path: '/adopt/rehome/basic' },
        { label: '健康個性', path: '/adopt/rehome/health' },
        { label: '照片隱私', path: '/adopt/rehome/media' },
        { label: '預覽送審', path: '/adopt/rehome/preview' },
        { label: '我的送養', path: '/adopt/rehome/cases' },
        { label: '刊登管理', path: '/adopt/rehome/manage' },
      ],
    },
    {
      title: '路徑 C：飼主照護追蹤流程',
      color: '#1565C0',
      steps: [
        { label: '照護儀表板', path: '/care/dashboard' },
        { label: '每日填寫', path: '/care/log/new' },
        { label: '日曆回顧', path: '/care/log/history' },
        { label: '健康時間軸', path: '/care/health' },
        { label: 'Care Score', path: '/care/score' },
        { label: 'Care Points', path: '/care/points' },
        { label: '點數兌換', path: '/care/rewards' },
        { label: '確認兌換', path: '/care/rewards/confirm' },
        { label: '兌換完成', path: '/care/rewards/result' },
      ],
    },
    {
      title: '路徑 D：機構通知互動流程（UI-90.03）',
      color: '#0F6B5B',
      steps: [
        { label: '機構工作台', path: '/organization' },
        { label: '搜尋飼主', path: '/organization/contacts' },
        { label: '撰寫通知', path: '/organization/messages/new' },
        { label: '確認發送', path: '/organization/messages/confirm' },
        { label: '發送紀錄', path: '/organization/messages/history' },
        { label: '對話詳情', path: '/organization/messages/MSG-008' },
        { label: '飼主收件匣', path: '/care/messages' },
        { label: '通知詳情', path: '/care/messages/MSG-008' },
        { label: '飼主回覆', path: '/care/messages/MSG-008/reply' },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">UI-90.01 操作流程圖</h1>
        <p className="text-gray-500 mt-1">點擊任一步驟節點可直接跳轉至對應頁面</p>
      </div>
      {flows.map(flow => (
        <div key={flow.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4" style={{ color: flow.color }}>{flow.title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            {flow.steps.map((step, i) => (
              <React.Fragment key={step.path}>
                <a href={step.path} className="px-4 py-2 rounded-xl font-semibold text-sm text-white hover:opacity-80 transition-opacity" style={{ backgroundColor: flow.color }}>
                  {step.label}
                </a>
                {i < flow.steps.length - 1 && <span className="text-gray-400">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-90.02  RulesPage  /rules
════════════════════════════════════════════════════════════════ */
export const RulesPage: React.FC = () => {
  const rules = [
    { screen: 'UI-01.00 首頁', state: '未登入訪客', action: '點擊「我要認養」', result: '自由瀏覽至 /adopt', next: '/adopt' },
    { screen: 'UI-02.03 動物履歷', state: '未登入訪客', action: '點擊「我要認養」', result: '→ /login?redirect=...', next: '/login' },
    { screen: 'UI-02.03 動物履歷', state: '未登入訪客', action: '點擊「加入收藏」', result: '→ /login?redirect=...', next: '/login' },
    { screen: 'UI-02.17 我的認養', state: '飼主角色', action: 'KYC 審核中', result: '顯示狀態徽章，不可操作', next: '-' },
    { screen: 'UI-02.17 我的認養', state: '飼主角色', action: '待補件狀態', result: '顯示「補件」按鈕 → 跳通知', next: '/notifications' },
    { screen: 'UI-03.01 照護儀表板', state: '飼主角色', action: '今日未填', result: '顯示 3/4 進度條與提醒卡', next: '/care/log/new' },
    { screen: 'UI-03.02 每日填寫', state: '重複送出', action: '欄位與昨日完全相同', result: '顯示重複警告，二次確認', next: '-' },
    { screen: 'UI-03.11 兌換獎勵', state: '點數不足', action: '點擊兌換', result: '顯示「點數不足」提示', next: '-' },
    { screen: 'UI-04.09 聯絡通知', state: '機構管理員', action: '發送通知', result: '→ 撰寫 → 確認 → 發送 → 歷史', next: '/organization/messages/history' },
    { screen: 'UI-04.03 KYC 審核', state: '機構管理員', action: '核准通過', result: '飼主端案件狀態即時同步', next: '/organization/kyc' },
    { screen: '任意受保護頁面', state: '未登入訪客', action: '直接訪問', result: '→ /login?redirect=<path>', next: '/login' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">UI-90.02 狀態與返回規則</h1>
        <p className="text-gray-500 mt-1">各畫面在不同角色與狀態下的操作結果對照表</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">畫面</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">角色 / 狀態</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">操作</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">結果</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">跳轉</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-medium">{r.screen}</td>
                <td className="px-5 py-3 text-gray-500">{r.state}</td>
                <td className="px-5 py-3">{r.action}</td>
                <td className="px-5 py-3 text-gray-700">{r.result}</td>
                <td className="px-5 py-3">
                  {r.next !== '-' ? (
                    <a href={r.next} className="text-blue-600 hover:underline font-mono text-xs">{r.next}</a>
                  ) : <span className="text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-90.03  NotificationFlowPage  /ui-flow/notification
════════════════════════════════════════════════════════════════ */
export const NotificationFlowPage: React.FC = () => {
  const steps = [
    {
      icon: '🏢',
      actor: '機構管理員',
      action: '搜尋案件飼主',
      desc: '在「聯絡通知中心」搜尋關聯案件，選擇飼主並選取通知模板',
      link: '/organization/contacts',
      linkLabel: '前往 UI-04.09',
      color: '#0F6B5B',
    },
    {
      icon: '✍️',
      actor: '機構管理員',
      action: '撰寫通知內容',
      desc: '選擇類別（回訪聯繫 / 補件提醒 / 健康提醒），填寫主旨與內容，選擇是否 Email 副本',
      link: '/organization/messages/new',
      linkLabel: '前往 UI-04.10',
      color: '#0F6B5B',
    },
    {
      icon: '👁',
      actor: '機構管理員',
      action: '發送前預覽確認',
      desc: '完整預覽通知內容，確認無誤後按「確認發送」',
      link: '/organization/messages/confirm',
      linkLabel: '前往 UI-04.11',
      color: '#0F6B5B',
    },
    {
      icon: '📨',
      actor: '系統',
      action: '發送通知 & 寫入紀錄',
      desc: '通知同步寫入飼主端收件匣（MSG-NNN），稽核日誌記錄操作，狀態：已發送',
      link: '/organization/messages/history',
      linkLabel: '前往 UI-04.12',
      color: '#64748b',
    },
    {
      icon: '📬',
      actor: '飼主',
      action: '查看收件匣',
      desc: '在「機構通知」收件匣中看到新通知，點擊查看詳情',
      link: '/care/messages',
      linkLabel: '前往 UI-03.14',
      color: '#1565C0',
    },
    {
      icon: '📄',
      actor: '飼主',
      action: '閱讀通知詳情',
      desc: '看到完整通知內容，確認收到並選擇是否回覆',
      link: '/care/messages/MSG-008',
      linkLabel: '前往 UI-03.15',
      color: '#1565C0',
    },
    {
      icon: '💬',
      actor: '飼主',
      action: '送出回覆',
      desc: '填寫回覆內容後送出，狀態更新為「已回覆」，機構端即時同步',
      link: '/care/messages/MSG-008/reply',
      linkLabel: '前往 UI-03.16',
      color: '#1565C0',
    },
    {
      icon: '✅',
      actor: '機構管理員',
      action: '查看回覆 & 標記已處理',
      desc: '在對話詳情頁看到飼主回覆，確認後點「標記已處理」，結案',
      link: '/organization/messages/MSG-008',
      linkLabel: '前往 UI-04.13',
      color: '#0F6B5B',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">UI-90.03 機構通知互動流程</h1>
        <p className="text-gray-500 mt-1">完整雙向通知流程：機構發送 → 飼主收讀回覆 → 機構確認處理</p>
      </div>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="relative flex items-start gap-6">
              {/* circle */}
              <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm border-4 border-white" style={{ backgroundColor: `${step.color}20`, borderColor: step.color }}>
                {step.icon}
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: step.color }}>
                      Step {i + 1}  ·  {step.actor}
                    </div>
                    <div className="font-bold text-slate-900 text-base">{step.action}</div>
                    <div className="text-sm text-gray-500 mt-1 leading-relaxed">{step.desc}</div>
                  </div>
                  <a href={step.link} className="ml-4 shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-white hover:opacity-80 transition-opacity" style={{ backgroundColor: step.color }}>
                    {step.linkLabel}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
