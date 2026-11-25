import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ChevronRight, Gift, Plus, QrCode, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { usePawLink } from '../../context/PawLinkContext';

/* UI-03.11 獎勵兌換｜點數商品與使用限制 */
export const RewardsListPage: React.FC = () => {
  const { state, selectReward } = usePawLink();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EEF4FF] border border-[#1565C0]/25 font-extrabold text-base text-[#0D3C78]">
        可用點數：{state.carePoints}（示意）
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.rewards.map((rw) => {
          const affordable = state.carePoints >= rw.cost;
          return (
            <div
              key={rw.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                <div className="h-24 rounded-2xl bg-[#EEF4FF] border border-blue-100 flex flex-col items-center justify-center gap-1 text-[#0D3C78]">
                  <Gift className="h-7 w-7" />
                  <span className="text-xs font-bold">獎勵示意圖</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-950">{rw.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{rw.partner}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-xl font-extrabold text-slate-950">{rw.cost} 點</span>
                <button
                  type="button"
                  disabled={!affordable}
                  onClick={() => {
                    selectReward(rw.id);
                    navigate('/care/rewards/confirm');
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#093375] disabled:bg-slate-300 text-white font-bold text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>{affordable ? '兌換' : '點數不足'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* UI-03.12 獎勵兌換確認｜使用條款與兌換紀錄 */
export const RewardsConfirmPage: React.FC = () => {
  const { state, redeemSelectedReward } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const reward = state.rewards.find((r) => r.id === state.selectedRewardId) ?? state.rewards[0];
  const [agreed, setAgreed] = useState(true);
  const balanceAfter = state.carePoints - reward.cost;

  const handleConfirm = () => {
    if (!agreed) {
      showToast('請先勾選已閱讀並同意獎勵使用規範', 'warning');
      return;
    }
    const res = redeemSelectedReward();
    if (!res.ok) {
      showToast(res.message || '兌換失敗', 'warning');
      return;
    }
    showToast(`兌換成功！產生憑證 ${res.redeemId}`);
    navigate('/care/rewards/result');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-950">確認兌換｜{reward.title}</h2>

        <div className="space-y-3 text-base">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600 font-semibold">本次使用點數</span>
            <span className="font-extrabold text-slate-950">{reward.cost} 點（示意）</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600 font-semibold">目前點數</span>
            <span className="font-extrabold text-slate-950">{state.carePoints} 點（示意）</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600 font-semibold">兌換後餘額</span>
            <span className="font-extrabold text-[#1565C0]">{balanceAfter} 點（示意）</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-600 font-semibold">使用期限</span>
            <span className="font-semibold text-slate-800">{reward.terms}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <label className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 accent-[#0D47A1]"
            />
            <span className="text-sm font-bold text-slate-800">已閱讀並同意獎勵使用規範</span>
          </label>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base cursor-pointer"
          >
            <span>確認兌換</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <aside className="bg-[#EEF4FF] rounded-3xl border border-[#1565C0]/25 p-6 space-y-3">
        <h3 className="text-xl font-extrabold text-slate-950">完成後顯示</h3>
        <ul className="space-y-2 text-sm font-semibold text-slate-700">
          <li>• 兌換編號與 QR Code</li>
          <li>• 實際使用條款與期限</li>
          <li>• 於「兌換紀錄」查詢</li>
        </ul>
      </aside>
    </div>
  );
};

/* UI-03.13 兌換完成｜憑證與歷史紀錄 */
export const RewardsResultPage: React.FC = () => {
  const { state } = usePawLink();
  const latest = state.redemptions[0] || {
    redeemId: 'RW-000001',
    rewardTitle: '寵物用品折價券',
    cost: 100,
    remainingPoints: state.carePoints,
    expiryText: '依商家正式提供',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-sm">
          <CheckCircle2 className="h-4 w-4" />
          <span>已兌換（示意）</span>
        </span>

        <h2 className="text-3xl font-extrabold text-slate-950">{latest.rewardTitle}</h2>

        <div className="space-y-2.5 text-base">
          <div className="flex justify-between py-1.5">
            <span className="text-slate-600">兌換編號</span>
            <span className="font-extrabold text-slate-950">{latest.redeemId}（示意）</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-600">扣除點數</span>
            <span className="font-bold text-slate-900">{latest.cost} 點</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-600">剩餘點數</span>
            <span className="font-extrabold text-[#1565C0]">{latest.remainingPoints} 點</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-600">有效期限</span>
            <span className="font-semibold text-slate-800">{latest.expiryText}</span>
          </div>
        </div>

        <Link
          to="/care/points"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base"
        >
          返回 Care Points
        </Link>
      </div>

      <aside className="bg-[#EEF4FF] rounded-3xl border border-[#1565C0]/25 p-6 flex flex-col items-center justify-center text-center space-y-4">
        <h3 className="text-xl font-extrabold text-slate-950">兌換憑證顯示區</h3>
        <div className="w-40 h-40 rounded-2xl bg-white border border-blue-200 shadow-xs flex flex-col items-center justify-center gap-2 text-[#0D3C78]">
          <QrCode className="h-20 w-20" />
          <span className="text-xs font-extrabold">{latest.redeemId}</span>
        </div>
        <p className="text-xs font-semibold text-slate-600">可於兌換紀錄重新開啟</p>
      </aside>
    </div>
  );
};

/* UI-03.08 照護提醒／異常中心｜可人工確認 */
export const CareAlertsPage: React.FC = () => {
  const { state, resolveCareAlert } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-slate-950">待處理提醒</h2>
        <Link
          to="/care/messages"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1565C0] text-white font-bold text-sm"
        >
          <span>機構通知 {state.orgMessages.filter((m) => m.statusLabel === '未讀').length}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {state.careAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border ${
              alert.resolved ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  alert.resolved ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EEF4FF] text-[#1565C0]'
                }`}
              >
                {alert.resolved ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </span>
              <div>
                <div className="font-extrabold text-slate-950 text-lg">{alert.title}</div>
                <div className="text-sm text-slate-600">{alert.description}</div>
              </div>
            </div>

            {alert.resolved ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-extrabold self-start sm:self-center">
                已人工確認
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (alert.targetPath) {
                    navigate(alert.targetPath);
                  } else {
                    resolveCareAlert(alert.id);
                    showToast('已人工確認資料狀態，不會自動判定失職');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-sm cursor-pointer shrink-0"
              >
                {alert.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* UI-03.09 回訪摘要｜飼主可分享的照護報告 */
export const CareReportsPage: React.FC = () => {
  const { state } = usePawLink();
  const { showToast } = useToast();
  const activePet = state.carePets.find((p) => p.id === state.activeCarePetId) ?? state.carePets[0];
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-950">{activePet.name} · 本月照護摘要（示意）</h2>
        <div className="space-y-3 text-base">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">紀錄完整率</span>
            <span className="font-extrabold text-slate-950">25 / 30 天</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Care Score 平均</span>
            <span className="font-extrabold text-slate-950">{activePet.careScore} / 100</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">疫苗／健檢證明</span>
            <span className="font-extrabold text-slate-950">
              {state.medicalRecords.filter((m) => m.petId === activePet.id).length} 筆已建立
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-600">提醒與異常</span>
            <span className="font-extrabold text-slate-950">
              {state.careAlerts.filter((a) => !a.resolved).length} 項待確認
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitted(true);
            showToast('已將本月照護摘要提交給合作機構（臺北市動物之家）');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base cursor-pointer"
        >
          <span>{submitted ? '已提交給合作機構 ✓' : '提交給合作機構'}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <aside className="bg-[#EEF4FF] rounded-3xl border border-[#1565C0]/25 p-6 space-y-3">
        <h3 className="text-xl font-extrabold text-slate-950">可驗證內容</h3>
        <ul className="space-y-2 text-sm font-semibold text-slate-700">
          <li>• 日誌完整天數</li>
          <li>• 疫苗／絕育／回診證明</li>
          <li>• 是否有待聯絡警示</li>
          <li>• 人工回訪結果（機構）</li>
        </ul>
      </aside>
    </div>
  );
};

/* UI-03.10 我的毛孩｜新增與切換多寵物 */
export const CarePetsPage: React.FC = () => {
  const { state, setActiveCarePet, bindCarePet } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [caseCode, setCaseCode] = useState('A-0063');
  const [name, setName] = useState('豆豆');
  const [species, setSpecies] = useState<'犬' | '貓'>('犬');

  const handleBind = (e: React.FormEvent) => {
    e.preventDefault();
    bindCarePet(caseCode, name, species);
    setModalOpen(false);
    showToast(`已完成綁定：${name}（案件 ${caseCode}）`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-slate-950">我的毛孩</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.carePets.map((cp) => (
          <div
            key={cp.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-5"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-full bg-[#0D47A1] text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                {cp.badgeChar}
              </span>
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">{cp.name}</h3>
                <p className="text-sm text-slate-600">{cp.statusLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveCarePet(cp.id);
                navigate('/care/dashboard');
              }}
              className="w-full py-3 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-sm cursor-pointer"
            >
              進入照護總覽
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-[#EEF4FF] hover:bg-blue-100/80 rounded-3xl border-2 border-dashed border-[#1565C0]/40 p-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors min-h-[160px]"
        >
          <div className="flex items-center gap-1.5 text-xl font-extrabold text-[#0D3C78]">
            <Plus className="h-5 w-5" />
            <span>綁定寵物</span>
          </div>
          <p className="text-sm font-semibold text-slate-600">
            需可驗證的認養／寵物登記資料
          </p>
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <form onSubmit={handleBind} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-950">綁定認養毛孩檔案</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="block space-y-1 text-sm">
              <span className="font-bold text-slate-800">核准案件／寵物登記編號 *</span>
              <input
                type="text"
                required
                value={caseCode}
                onChange={(e) => setCaseCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <label className="block space-y-1">
                <span className="font-bold text-slate-800">毛孩名稱 *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-bold text-slate-800">種類</span>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as '犬' | '貓')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="犬">犬</option>
                  <option value="貓">貓</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0D47A1] text-white font-bold text-sm cursor-pointer"
              >
                驗證並綁定
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
