import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Plus, UploadCloud } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { usePawLink } from '../../context/PawLinkContext';

/* UI-03.04 健康紀錄｜時間軸與資料來源 */
export const HealthRecordsPage: React.FC = () => {
  const { state } = usePawLink();
  const activePet = state.carePets.find((p) => p.id === state.activeCarePetId) ?? state.carePets[0];
  const records = state.medicalRecords.filter((r) => r.petId === activePet.id);

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Link
          to="/care/medical/new"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-sm shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>新增醫療紀錄</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-2xl font-extrabold text-slate-950">{activePet.name}的健康時間軸</h2>

          <div className="space-y-4">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-full bg-[#0D47A1] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                    {rec.dayBadge}
                  </span>
                  <div>
                    <div className="font-extrabold text-slate-950 text-base">{rec.title}</div>
                    <div className="text-sm text-slate-600">
                      {rec.sourceNote}
                      {rec.clinic ? ` · ${rec.clinic}` : ''} · {rec.date}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border self-start sm:self-center ${
                    rec.verification === '已驗證' || rec.verification === '機構確認'
                      ? 'bg-[#EEF4FF] text-[#0D3C78] border-blue-200'
                      : rec.verification === '待查核'
                        ? 'bg-[#FFF3E0] text-[#B45309] border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {rec.verification}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-[#EEF4FF] rounded-3xl border border-[#1565C0]/25 p-6 space-y-3 h-fit">
          <h3 className="text-xl font-extrabold text-slate-950">資料可信度</h3>
          <div className="space-y-2.5">
            <div className="px-4 py-3 rounded-xl bg-white border border-blue-200 text-sm font-bold text-[#0D3C78]">
              院所／機構已確認
            </div>
            <div className="px-4 py-3 rounded-xl bg-white border border-blue-200 text-sm font-bold text-[#0D3C78]">
              附佐證，待人工查核
            </div>
            <div className="px-4 py-3 rounded-xl bg-white border border-blue-200 text-sm font-bold text-[#0D3C78]">
              飼主自填，未驗證
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* UI-03.05 醫療新增／提醒｜疫苗、絕育與回診 */
export const MedicalNewPage: React.FC = () => {
  const { state, addMedicalRecord } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const activePet = state.carePets.find((p) => p.id === state.activeCarePetId) ?? state.carePets[0];
  const [category, setCategory] = useState<'疫苗' | '絕育' | '回診' | '健檢'>('疫苗');
  const [date, setDate] = useState('2026/11/07');
  const [clinic, setClinic] = useState('');
  const [nextReminderDate, setNextReminderDate] = useState('2027/11/07');
  const [hasAttachment, setHasAttachment] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicalRecord({
      petId: activePet.id,
      category,
      title: `${category}紀錄`,
      date,
      clinic: clinic || '飼主自填院所',
      nextReminderDate,
      sourceNote: hasAttachment ? '已附單據，待人工查核' : '飼主手動填寫',
      hasAttachment,
    });
    showToast(hasAttachment ? '已儲存醫療紀錄（待查核）' : '已儲存醫療紀錄（自填）');
    navigate('/care/health');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">紀錄類別 *</span>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as '疫苗' | '絕育' | '回診' | '健檢')
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
            >
              <option value="疫苗">疫苗</option>
              <option value="絕育">絕育</option>
              <option value="回診">回診</option>
              <option value="健檢">健檢</option>
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">實際日期 *</span>
            <input
              type="text"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">院所／醫師（選填）</span>
            <input
              type="text"
              value={clinic}
              onChange={(e) => setClinic(e.target.value)}
              placeholder="請輸入動物醫院或獸醫師名稱"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">下次提醒日期</span>
            <input
              type="text"
              value={nextReminderDate}
              onChange={(e) => setNextReminderDate(e.target.value)}
              placeholder="依院所建議設定"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => {
            setHasAttachment(true);
            showToast('已上傳疫苗手冊／醫療單據照片');
          }}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm cursor-pointer ${
            hasAttachment
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
              : 'bg-[#EEF4FF] hover:bg-blue-100 border-blue-200 text-[#0D3C78]'
          }`}
        >
          {hasAttachment ? <CheckCircle2 className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
          <span>{hasAttachment ? '已上傳單據照片 ✓' : '＋ 上傳疫苗手冊／醫療單據照片'}</span>
        </button>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base cursor-pointer"
          >
            儲存紀錄
          </button>
        </div>
      </form>

      <aside className="bg-slate-100 rounded-3xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-xl font-extrabold text-slate-950">查核狀態</h3>
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFF3E0] text-[#7C2D12] border border-amber-300 font-extrabold text-sm">
          {hasAttachment ? '待查核（已附單據）' : '待提交證明'}
        </span>
        <p className="text-sm text-slate-700 leading-relaxed">
          上傳後先標示「待查核」。正式確認需由授權機構或醫療院所完成。
        </p>
      </aside>
    </div>
  );
};

/* UI-03.06 Care Score｜分數構成與可信度 */
export const CareScorePage: React.FC = () => {
  const { state } = usePawLink();
  const activePet = state.carePets.find((p) => p.id === state.activeCarePetId) ?? state.carePets[0];

  const bars = [
    { label: '每日四欄完整度', value: activePet.scoreBreakdown.dailyLog, note: '手動填寫＋證據' },
    { label: '疫苗與醫療時程', value: activePet.scoreBreakdown.medical, note: '證明及逾期紀錄' },
    { label: '活動／遛狗紀錄', value: activePet.scoreBreakdown.activity, note: '時間＋照片佐證' },
    { label: '回診與健檢', value: activePet.scoreBreakdown.checkup, note: '機構或醫療院所查核' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-[#EEF4FF] rounded-3xl border border-[#1565C0]/25 p-8 flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">本週 Care Score</h2>
        <div className="text-6xl font-extrabold text-slate-950">{activePet.careScore}</div>
        <div className="text-sm font-semibold text-slate-600">／100 · 示意數值</div>
        <div className="w-full py-2.5 px-4 rounded-xl bg-white border border-blue-200 font-extrabold text-sm text-[#0D3C78]">
          達標門檻：80 / 90
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-xl font-extrabold text-slate-950">分數來源（權重待團隊確認）</h3>
        <div className="space-y-5">
          {bars.map((b) => (
            <div key={b.label} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
              <div className="sm:col-span-4 font-bold text-slate-900">{b.label}</div>
              <div className="sm:col-span-5 h-3.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0D47A1]"
                  style={{ width: `${b.value}%` }}
                />
              </div>
              <div className="sm:col-span-3 text-xs font-semibold text-slate-600 sm:text-right">
                {b.note}（{b.value}%）
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* UI-03.07 Care Points｜三軸累積、明細與兌換 */
export const CarePointsPage: React.FC = () => {
  const { state } = usePawLink();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#EEF4FF] rounded-2xl border border-[#1565C0]/25 p-5">
          <div className="text-4xl font-extrabold text-slate-950">{state.carePoints}</div>
          <div className="text-sm font-bold text-[#0D3C78] mt-1">目前累積點數（示意）</div>
        </div>
        <div className="bg-[#EEF4FF] rounded-2xl border border-[#1565C0]/25 p-5 space-y-1">
          <div className="font-extrabold text-slate-950">① 達標積分</div>
          <p className="text-xs font-semibold text-slate-700">週／月 Score ≥80：+5；≥90：+8（取高）</p>
        </div>
        <div className="bg-[#EEF4FF] rounded-2xl border border-[#1565C0]/25 p-5 space-y-1">
          <div className="font-extrabold text-slate-950">② 連續回報</div>
          <p className="text-xs font-semibold text-slate-700">連續 7 天：+5；連續 30 天：+15</p>
        </div>
        <div className="bg-[#EEF4FF] rounded-2xl border border-[#1565C0]/25 p-5 space-y-1">
          <div className="font-extrabold text-slate-950">③ 任務完成</div>
          <p className="text-xs font-semibold text-slate-700">教育／疫苗／絕育／遛狗／回診</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-slate-950">近期點數異動</h3>
          <div className="space-y-2.5">
            {state.pointsTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-100 last:border-b-0 text-sm sm:text-base"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-500 w-14">{tx.date}</span>
                  <span className="font-semibold text-slate-900">{tx.title}</span>
                </div>
                <span
                  className={`font-extrabold ${
                    tx.delta >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {tx.delta >= 0 ? `+${tx.delta}` : tx.delta}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-slate-100 rounded-3xl border border-slate-200 p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2.5">
            <h3 className="text-xl font-extrabold text-slate-950">獎勵兌換（規劃）</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              優惠券／合作店家折扣，實際品項需另洽合作商家。
            </p>
          </div>
          <Link
            to="/care/rewards"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base"
          >
            <span>查看可兌換獎勵</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
};
