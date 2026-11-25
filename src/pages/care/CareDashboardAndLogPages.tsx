import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileBarChart2,
  HeartPulse,
  PawPrint,
  UploadCloud,
} from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { usePawLink } from '../../context/PawLinkContext';

/* UI-03.01 飼主追蹤｜多寵物照護總覽 */
export const CareDashboardPage: React.FC = () => {
  const { state, setActiveCarePet } = usePawLink();
  const activePet = state.carePets.find((p) => p.id === state.activeCarePetId) ?? state.carePets[0];

  const todayLog = state.dailyLogs.find(
    (l) => l.petId === activePet.id && l.date === '2026-11-25',
  );
  const completedCols = todayLog
    ? [todayLog.diet, todayLog.water, todayLog.activity, todayLog.excretion].filter((v) =>
        Boolean(v?.trim()),
      ).length
    : 0;
  const unreadOrgMsgs = state.orgMessages.filter((m) => m.statusLabel === '未讀').length;

  return (
    <div className="space-y-6">
      {/* Top Pet Switcher & Org Messages Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-xs text-sm font-bold text-slate-900">
            <span>目前寵物：</span>
            <select
              value={activePet.id}
              onChange={(e) => setActiveCarePet(e.target.value)}
              className="bg-transparent font-extrabold text-[#1565C0] focus:outline-none cursor-pointer"
            >
              {state.carePets.map((cp) => (
                <option key={cp.id} value={cp.id}>
                  {cp.name}
                </option>
              ))}
            </select>
          </label>

          <Link
            to="/care/pets"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEF4FF] hover:bg-blue-100 text-[#0D3C78] text-sm font-bold"
          >
            <PawPrint className="h-4 w-4" />
            <span>管理多寵物</span>
          </Link>
        </div>

        <Link
          to="/care/messages"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold text-sm shadow-sm"
        >
          <Bell className="h-4 w-4" />
          <span>機構通知 {unreadOrgMsgs}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main Hero Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {activePet.name}，今天也辛苦了
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/care/score"
              className="rounded-2xl bg-[#EEF4FF] border border-[#1565C0]/25 p-5 hover:border-[#1565C0] transition-colors"
            >
              <div className="text-3xl font-extrabold text-slate-950">
                {activePet.careScore} / 100
              </div>
              <div className="text-xs font-bold text-[#0D3C78] mt-1 tracking-wide">
                CARE SCORE · 示意
              </div>
            </Link>

            <Link
              to="/care/points"
              className="rounded-2xl bg-[#EEF4FF] border border-[#1565C0]/25 p-5 hover:border-[#1565C0] transition-colors"
            >
              <div className="text-3xl font-extrabold text-slate-950">{state.carePoints}</div>
              <div className="text-xs font-bold text-[#0D3C78] mt-1 tracking-wide">
                CARE POINTS · 示意
              </div>
            </Link>

            <Link
              to="/care/log/new"
              className="rounded-2xl bg-[#EEF4FF] border border-[#1565C0]/25 p-5 hover:border-[#1565C0] transition-colors"
            >
              <div className="text-3xl font-extrabold text-slate-950">{completedCols} / 4</div>
              <div className="text-xs font-bold text-[#0D3C78] mt-1 tracking-wide">
                今日必填項目
              </div>
            </Link>
          </div>
        </div>

        <aside className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <h3 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-[#1565C0]" />
              <span>健康提醒</span>
            </h3>
            <ul className="space-y-1.5 text-sm font-semibold text-slate-700">
              <li>• 疫苗證明待更新</li>
              <li>• 回診日期待確認</li>
              <li>• 未完成提醒：{state.careAlerts.filter((a) => !a.resolved).length} 項</li>
            </ul>
          </div>
          <Link
            to="/care/alerts"
            className="inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-sm"
          >
            <span>查看提醒</span>
          </Link>
        </aside>
      </div>

      {/* Bottom Primary Quick Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/care/log/new"
          className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base shadow-sm"
        >
          <span>填寫今日紀錄</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          to="/care/health"
          className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base shadow-sm"
        >
          <span>查看健康紀錄</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          to="/care/score"
          className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base shadow-sm"
        >
          <span>Care Score</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          to="/care/points"
          className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base shadow-sm"
        >
          <span>Care Points</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Secondary Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/care/log/history"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-bold text-slate-800"
        >
          <Calendar className="h-4 w-4 text-[#1565C0]" />
          <span>每日紀錄歷史日曆 (UI-03.03)</span>
        </Link>
        <Link
          to="/care/reports"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-bold text-slate-800"
        >
          <FileBarChart2 className="h-4 w-4 text-[#1565C0]" />
          <span>本月回訪摘要報告 (UI-03.09)</span>
        </Link>
      </div>
    </div>
  );
};

/* UI-03.02 每日照護填寫｜四欄必要日誌 */
export const DailyLogNewPage: React.FC = () => {
  const { state, submitDailyCareLog } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activePet = state.carePets.find((p) => p.id === state.activeCarePetId) ?? state.carePets[0];
  const targetDate = searchParams.get('date') || '2026-11-25';
  const existing = state.dailyLogs.find((l) => l.petId === activePet.id && l.date === targetDate);

  const [diet, setDiet] = useState(existing?.diet || '乾糧 120 g');
  const [water, setWater] = useState(existing?.water || '約 380 ml');
  const [activity, setActivity] = useState(existing?.activity || '散步 30 分鐘');
  const [excretion, setExcretion] = useState(existing?.excretion || '排便 2 次・正常');
  const [hasMedia, setHasMedia] = useState(existing?.hasMedia ?? false);
  const [dupWarning, setDupWarning] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitDailyCareLog({
      petId: activePet.id,
      date: targetDate,
      diet,
      water,
      activity,
      excretion,
      hasMedia,
      isDuplicateConfirmed: dupWarning,
    });

    if (res.duplicateDetected && !dupWarning) {
      setDupWarning(true);
      showToast('偵測到與前日完全相同，已標記提示並儲存，建議補充佐證或確認無變動', 'warning');
      return;
    }

    showToast(
      res.pointsAwarded > 0
        ? `已儲存 ${targetDate} 四欄照護紀錄！獲得 +${res.pointsAwarded} Care Points`
        : `已暫存 ${targetDate} 照護紀錄`,
    );
    navigate('/care/dashboard');
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="px-4 py-1.5 rounded-full bg-[#EEF4FF] text-[#0D3C78] font-extrabold text-sm">
          寵物：{activePet.name}　日期：{targetDate}
        </span>
        <Link
          to="/care/log/history"
          className="text-sm font-bold text-[#1565C0] hover:underline"
        >
          檢視歷史日曆 ›
        </Link>
      </div>

      {dupWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-sm font-semibold flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            偵測到本次填寫與前日內容完全相同；若今日確實無變動，請再次點擊「儲存今日紀錄」確認送出，或附上傳照片佐證。
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="rounded-2xl bg-[#EEF4FF] border border-[#1565C0]/25 p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-950">01 飲食</span>
            <span className="text-xs font-semibold text-slate-600">飼料種類／克數</span>
          </div>
          <input
            type="text"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            placeholder="例如：乾糧 120 g"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-semibold"
          />
        </label>

        <label className="rounded-2xl bg-[#EEF4FF] border border-[#1565C0]/25 p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-950">02 飲水</span>
            <span className="text-xs font-semibold text-slate-600">今日飲水量／ml</span>
          </div>
          <input
            type="text"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            placeholder="例如：約 380 ml"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-semibold"
          />
        </label>

        <label className="rounded-2xl bg-[#EEF4FF] border border-[#1565C0]/25 p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-950">03 活動</span>
            <span className="text-xs font-semibold text-slate-600">活動類型／分鐘</span>
          </div>
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="例如：散步 30 分鐘"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-semibold"
          />
        </label>

        <label className="rounded-2xl bg-[#EEF4FF] border border-[#1565C0]/25 p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-950">04 排泄</span>
            <span className="text-xs font-semibold text-slate-600">次數／狀況</span>
          </div>
          <input
            type="text"
            value={excretion}
            onChange={(e) => setExcretion(e.target.value)}
            placeholder="例如：排便 2 次・正常"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-semibold"
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() => {
            setHasMedia(true);
            showToast('已附加今日照護照片佐證');
          }}
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm cursor-pointer ${
            hasMedia
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
          }`}
        >
          {hasMedia ? <CheckCircle2 className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
          <span>{hasMedia ? '已附加照片／影片佐證 ✓' : '＋ 上傳照片或影片（佐證；選填）'}</span>
        </button>

        <button
          type="submit"
          className="px-7 py-3 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base shadow-sm cursor-pointer"
        >
          儲存今日紀錄
        </button>
      </div>
    </form>
  );
};

/* UI-03.03 每日紀錄歷史｜日曆、補登與異常標示 */
export const DailyLogHistoryPage: React.FC = () => {
  const { state } = usePawLink();
  const activePet = state.carePets.find((p) => p.id === state.activeCarePetId) ?? state.carePets[0];
  const [selectedDay, setSelectedDay] = useState(16);

  const incompleteDays = useMemo(() => new Set([1, 6, 11, 16, 21, 26]), []);
  const dateKey = `2026-11-${String(selectedDay).padStart(2, '0')}`;
  const storedLog = state.dailyLogs.find((l) => l.petId === activePet.id && l.date === dateKey);

  const isPresetIncomplete = incompleteDays.has(selectedDay) && !storedLog?.excretion;
  const rows = [
    { label: '飲食', value: storedLog?.diet ? '已填寫 · 自填' : isPresetIncomplete ? '已填寫 · 自填' : '已填寫 · 自填', ok: true },
    { label: '飲水', value: storedLog?.water ? '已填寫 · 自填' : '已填寫 · 自填', ok: true },
    { label: '活動', value: storedLog?.activity ? '已填寫 · 附照片' : '已填寫 · 附照片', ok: true },
    {
      label: '排泄',
      value: storedLog?.excretion ? '已填寫 · 自填' : isPresetIncomplete ? '尚未填寫' : '已填寫 · 自填',
      ok: storedLog ? Boolean(storedLog.excretion) : !isPresetIncomplete,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-950">11 月 2026 日曆（示意）</h2>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">
          {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
            const k = `2026-11-${String(day).padStart(2, '0')}`;
            const log = state.dailyLogs.find((l) => l.petId === activePet.id && l.date === k);
            const missing = log ? !log.diet || !log.water || !log.activity || !log.excretion : incompleteDays.has(day);
            const active = day === selectedDay;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border ${
                  active
                    ? 'bg-[#1565C0] text-white border-[#0D47A1] shadow-sm scale-105'
                    : missing
                      ? 'bg-[#FFF3E0] text-[#7C2D12] border-amber-300 hover:bg-orange-100'
                      : 'bg-[#EEF4FF] text-[#0D3C78] border-blue-200 hover:bg-blue-100'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </section>

      <aside className="lg:col-span-5 bg-slate-100 rounded-3xl border border-slate-200 p-6 flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-extrabold text-slate-950">11/{selectedDay} 紀錄詳情</h3>
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3">
                <span className="font-bold text-slate-800">{r.label}</span>
                <span
                  className={`flex-1 max-w-[220px] text-center py-2 px-3 rounded-xl text-sm font-bold border ${
                    r.ok
                      ? 'bg-[#EEF4FF] text-[#0D3C78] border-blue-200'
                      : 'bg-[#FFF3E0] text-[#B45309] border-amber-300'
                  }`}
                >
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link
          to={`/care/log/new?date=${dateKey}`}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base"
        >
          <span>前往補登</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </aside>
    </div>
  );
};
