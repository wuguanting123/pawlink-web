import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Lock, MessageSquare, ShieldCheck, X } from 'lucide-react';
import { PetIllustration, SimulatedUpload, StepIndicator } from '../../components/common/CommonUI';
import { useToast } from '../../components/common/ToastContext';
import { usePawLink } from '../../context/PawLinkContext';

const REHOME_STEPS = [
  { num: 1, label: '基本資料', to: '/adopt/rehome/basic' },
  { num: 2, label: '健康與個性', to: '/adopt/rehome/health' },
  { num: 3, label: '照片與聯絡', to: '/adopt/rehome/media' },
  { num: 4, label: '預覽送審', to: '/adopt/rehome/preview' },
];

/* UI-02.20 私人送養｜送養入口與基本說明 */
export const RehomeIntroPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#FFF3E0] rounded-3xl border border-[#F57C00]/35 p-7 sm:p-9 flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-[#7C2D12]">讓毛孩找到適合的新家庭</h2>
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed">
            提供標準化送養履歷，記錄基本資料、健康、性格、照片與聯絡方式。
          </p>
          <ul className="space-y-2.5 text-sm sm:text-base font-semibold text-slate-800">
            <li>• 可先儲存草稿，稍後繼續編輯</li>
            <li>• 送養者聯絡方式不直接公開</li>
            <li>• 審核通過才會出現在待領養列表</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/adopt/rehome/basic"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-extrabold text-base shadow-sm"
          >
            <span>建立送養履歷</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
          <Link
            to="/adopt/rehome/cases"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#B45309]/40 text-[#92400E] font-bold text-base"
          >
            <span>查看我的送養履歷</span>
          </Link>
        </div>
      </div>

      <aside className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm space-y-4">
        <h3 className="text-xl font-extrabold text-slate-950">填寫步驟</h3>
        <ol className="space-y-3 text-base font-semibold text-slate-800">
          <li>1. 寵物基本資料</li>
          <li>2. 健康／個性</li>
          <li>3. 照片／聯絡</li>
          <li>4. 預覽／送審</li>
        </ol>
      </aside>
    </div>
  );
};

/* UI-02.21 送養表單 1/4｜寵物基本資料 */
export const RehomeBasicPage: React.FC = () => {
  const { state, updateRehomeDraft } = usePawLink();
  const navigate = useNavigate();
  const d = state.rehomeDraft;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/adopt/rehome/health');
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={REHOME_STEPS} activeNum={1} variant="rehome" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">寵物名稱 *</span>
              <input
                type="text"
                required
                value={d.petName || ''}
                onChange={(e) => updateRehomeDraft({ petName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">種類 *</span>
              <select
                value={d.species || '犬'}
                onChange={(e) => updateRehomeDraft({ species: e.target.value as '犬' | '貓' })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="犬">犬</option>
                <option value="貓">貓</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">品種 *</span>
              <input
                type="text"
                required
                value={d.breed || ''}
                onChange={(e) => updateRehomeDraft({ breed: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">性別 *</span>
              <select
                value={d.gender || '母'}
                onChange={(e) =>
                  updateRehomeDraft({ gender: e.target.value as '公' | '母' | '未知' })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="公">公</option>
                <option value="母">母</option>
                <option value="未知">未知</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">年齡或估齡 *</span>
              <input
                type="text"
                required
                value={d.ageText || ''}
                onChange={(e) => updateRehomeDraft({ ageText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">體型 *</span>
              <select
                value={d.size || '中'}
                onChange={(e) => updateRehomeDraft({ size: e.target.value as '小' | '中' | '大' })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="小">小</option>
                <option value="中">中</option>
                <option value="大">大</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-extrabold text-base cursor-pointer"
            >
              <span>下一步</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <aside className="bg-[#FFF3E0] rounded-2xl border border-[#F57C00]/35 p-6 space-y-3">
          <h3 className="text-xl font-extrabold text-[#7C2D12]">額外欄位</h3>
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">
            可選填：毛色、體重、生日、飼養地區、特徵、來源與已知健康史。未知資訊請明確選「未知」，切勿填入虛構資料。
          </p>
        </aside>
      </div>
    </div>
  );
};

/* UI-02.22 送養表單 2/4｜健康、性格與照護 */
export const RehomeHealthPage: React.FC = () => {
  const { state, updateRehomeDraft } = usePawLink();
  const navigate = useNavigate();
  const d = state.rehomeDraft;
  const personalities = d.personality || ['親人'];

  const toggleTrait = (trait: string) => {
    const next = personalities.includes(trait)
      ? personalities.filter((t) => t !== trait)
      : [...personalities, trait];
    updateRehomeDraft({ personality: next });
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={REHOME_STEPS} activeNum={2} variant="rehome" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">結紮狀態 *</span>
              <select
                value={d.neutered || '已'}
                onChange={(e) =>
                  updateRehomeDraft({ neutered: e.target.value as '已' | '未' | '未知' })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="已">已結紮</option>
                <option value="未">未結紮</option>
                <option value="未知">未知</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">疫苗狀態 *</span>
              <select
                value={d.vaccinated || '未知'}
                onChange={(e) =>
                  updateRehomeDraft({ vaccinated: e.target.value as '已' | '未' | '未知' })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="已">已施打</option>
                <option value="未">未施打</option>
                <option value="未知">未知</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">晶片狀態 *</span>
              <select
                value={d.microchip || '有'}
                onChange={(e) =>
                  updateRehomeDraft({ microchip: e.target.value as '有' | '無' | '未知' })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="有">有晶片</option>
                <option value="無">無晶片</option>
                <option value="未知">未知</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">健康情況 *</span>
              <select
                value={d.healthStatus || '良好'}
                onChange={(e) =>
                  updateRehomeDraft({
                    healthStatus: e.target.value as '良好' | '治療中' | '待確認',
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="良好">良好</option>
                <option value="治療中">治療中</option>
                <option value="待確認">待確認</option>
              </select>
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">疾病史／特殊照顧需求</span>
            <input
              type="text"
              value={d.specialNeeds || ''}
              onChange={(e) => updateRehomeDraft({ specialNeeds: e.target.value })}
              placeholder="需服藥、食物過敏、行為注意事項"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
            />
          </label>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/adopt/rehome/media')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-extrabold text-base cursor-pointer"
            >
              <span>下一步</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <aside className="bg-[#FFF3E0] rounded-2xl border border-[#F57C00]/35 p-6 space-y-3">
          <h3 className="text-xl font-extrabold text-[#7C2D12]">行為與個性（點擊標籤）</h3>
          <div className="flex flex-wrap gap-2">
            {['親人', '親狗／親貓', '活動量適中', '已訓練定點如廁', '適合多寵物家庭'].map(
              (trait) => {
                const active = personalities.includes(trait);
                return (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => toggleTrait(trait)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                      active
                        ? 'bg-[#B45309] text-white border-[#92400E]'
                        : 'bg-white text-slate-800 border-orange-200'
                    }`}
                  >
                    {trait}
                  </button>
                );
              },
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

/* UI-02.23 送養表單 3/4｜照片、聯絡與公開設定 */
export const RehomeMediaPage: React.FC = () => {
  const { state, updateRehomeDraft } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const d = state.rehomeDraft;

  return (
    <div className="space-y-6">
      <StepIndicator steps={REHOME_STEPS} activeNum={3} variant="rehome" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-xl font-extrabold text-slate-950">上傳寵物照片 *</h2>
          <SimulatedUpload
            label="新增正面／全身清晰照片"
            uploadedCount={d.photoCount ?? 1}
            onUpload={() => {
              updateRehomeDraft({ photoCount: Math.min(3, (d.photoCount ?? 0) + 1) });
              showToast('已上傳寵物清晰照片');
            }}
          />

          <label className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer w-full">
            <input
              type="checkbox"
              checked={Boolean(d.photoAuthorized)}
              onChange={(e) => updateRehomeDraft({ photoAuthorized: e.target.checked })}
              className="h-4 w-4 accent-[#B45309]"
            />
            <span className="text-sm font-bold text-slate-800">圖片為本人拍攝或已取得使用授權</span>
          </label>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">聯絡方式 * *</span>
              <input
                type="text"
                value={d.contactPrivate || state.currentUser.phone}
                onChange={(e) => updateRehomeDraft({ contactPrivate: e.target.value })}
                placeholder="手機／Email（僅供平台審核）"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">可公開地區 * *</span>
              <input
                type="text"
                value={d.publicRegion || '新北市板橋區'}
                onChange={(e) => updateRehomeDraft({ publicRegion: e.target.value })}
                placeholder="例如：新北市板橋區"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFF3E0] border border-[#F57C00]/35 text-sm font-bold text-[#7C2D12]">
              <Lock className="h-4 w-4 shrink-0" />
              <span>聯絡及完整地址將受到權限保護，不會顯示於公開履歷</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/adopt/rehome/preview')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-extrabold text-base cursor-pointer"
            >
              <span>下一步</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* UI-02.24 送養表單 4/4｜履歷預覽與送出審核 */
export const RehomePreviewPage: React.FC = () => {
  const { state, submitRehomeDraft } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const d = state.rehomeDraft;

  const [c1, setC1] = useState(true);
  const [c2, setC2] = useState(true);
  const [c3, setC3] = useState(true);

  const handleSubmit = (asDraft: boolean) => {
    if (!asDraft && (!c1 || !c2 || !c3)) {
      showToast('請先勾選右側三項確認規範', 'warning');
      return;
    }
    const newCaseId = submitRehomeDraft(asDraft);
    showToast(asDraft ? `已暫存草稿 ${newCaseId}` : `送養履歷 ${newCaseId} 已送出審查`);
    navigate('/adopt/rehome/cases');
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={REHOME_STEPS} activeNum={4} variant="rehome" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6">
          <div className="sm:w-52 shrink-0">
            <PetIllustration
              species={(d.species as '犬' | '貓') || '犬'}
              name={d.petName || '豆豆'}
              sizeClass="h-48"
            />
          </div>
          <div className="space-y-2.5 text-base">
            <h2 className="text-2xl font-extrabold text-slate-950">
              {d.petName || '豆豆'} · {d.breed || '混種犬'}
            </h2>
            <p className="text-slate-700 font-semibold">
              性別：{d.gender || '母'}｜{d.ageText || '約 2 歲'}｜{d.size || '中'}型
            </p>
            <p className="text-slate-700 font-semibold">
              結紮：{d.neutered || '已'}｜疫苗：{d.vaccinated || '待確認'}
            </p>
            <p className="text-slate-700">
              性格：{(d.personality || ['親人', '活動量適中']).join('、')}
            </p>
            <p className="text-slate-700 font-semibold">
              送養地區：{d.publicRegion || '新北市'}（公開）
            </p>
          </div>
        </div>

        <aside className="bg-[#FFF3E0] rounded-2xl border border-[#F57C00]/35 p-6 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="px-4 py-2 rounded-full bg-white text-center font-extrabold text-sm text-[#7C2D12] border border-[#F57C00]/30">
              資料完整度：{c1 && c2 && c3 ? '已確認可送審' : '待確認'}
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
              <input type="checkbox" checked={c1} onChange={(e) => setC1(e.target.checked)} />
              <span>我確認資料為真實資訊</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
              <input type="checkbox" checked={c2} onChange={(e) => setC2(e.target.checked)} />
              <span>同意送養審查規則</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
              <input type="checkbox" checked={c3} onChange={(e) => setC3(e.target.checked)} />
              <span>知悉審核通過後才公開</span>
            </label>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="flex-1 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 font-bold text-sm text-slate-800 cursor-pointer"
            >
              儲存草稿
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="flex-1 inline-flex items-center justify-center gap-1 py-3 rounded-xl bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-extrabold text-sm cursor-pointer"
            >
              <span>送出審核</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* UI-02.25 我的送養案件｜送審、補件與結果 */
export const MyRehomeCasesPage: React.FC = () => {
  const { state, resubmitRehomeCase } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [modalCaseId, setModalCaseId] = useState<string | null>(null);

  const selectedCase = state.rehomeCases.find((c) => c.caseId === modalCaseId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-slate-950">我的送養履歷</h2>
        <Link
          to="/adopt/rehome/basic"
          className="px-4 py-2.5 rounded-xl bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-extrabold text-sm"
        >
          ＋ 新增送養案件
        </Link>
      </div>

      <div className="space-y-3">
        {state.rehomeCases.map((rc) => (
          <div
            key={rc.caseId}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200"
          >
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-[#F57C00] text-slate-950 font-extrabold text-base flex items-center justify-center shrink-0">
                {rc.petName.slice(0, 1)}
              </span>
              <div>
                <div className="font-extrabold text-slate-950 text-lg">
                  {rc.petName} · {rc.caseId}
                </div>
                <div className="text-sm text-slate-600">{rc.reviewNote}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold ${
                  rc.status === '已刊登'
                    ? 'bg-emerald-100 text-emerald-900'
                    : rc.status === '待補件'
                      ? 'bg-[#FFF3E0] text-[#B45309] border border-[#F57C00]/40'
                      : 'bg-slate-100 text-slate-800'
                }`}
              >
                {rc.status}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (rc.status === '已刊登') {
                    navigate('/adopt/rehome/manage');
                  } else {
                    setModalCaseId(rc.caseId);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-extrabold text-sm cursor-pointer"
              >
                查看／修改
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-950">
                {selectedCase.petName}（{selectedCase.caseId}）
              </h3>
              <button
                type="button"
                onClick={() => setModalCaseId(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-700 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
              <strong>審查狀態：</strong>
              {selectedCase.status} — {selectedCase.reviewNote}
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setModalCaseId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer"
              >
                關閉
              </button>
              {selectedCase.status === '待補件' && (
                <button
                  type="button"
                  onClick={() => {
                    resubmitRehomeCase(selectedCase.caseId);
                    showToast(`已完成 ${selectedCase.caseId} 照片補件並重新送審`);
                    setModalCaseId(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-sm cursor-pointer"
                >
                  一鍵補傳清晰照片並送審
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* UI-02.26 送養刊登管理｜回覆、更新與下架 */
export const RehomeManagePage: React.FC = () => {
  const { state, updateRehomeCaseStatus } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const published =
    state.rehomeCases.find((c) => c.status === '已刊登') ?? state.rehomeCases[0];
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySent, setReplySent] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-[#7C2D12]">
            {published.petName} · {published.status === '已刊登' ? '公開刊登中' : published.status}
          </h2>
          <span className="px-4 py-1.5 rounded-full bg-[#FFF3E0] text-[#7C2D12] border border-[#F57C00]/30 font-extrabold text-xs">
            {published.status === '已刊登' ? '公開中' : published.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-950">收到詢問</h3>
              <p className="text-sm text-slate-600">
                新通知 {published.inquiryCount} 則｜聯絡安排由送養者與申請人確認
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReplyOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FFF3E0] hover:bg-orange-100 text-[#7C2D12] font-bold text-sm cursor-pointer"
            >
              檢視
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-950">寵物狀態更新</h3>
              <p className="text-sm text-slate-600">如已送養、暫停送養、醫療狀況異動</p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateRehomeCaseStatus(published.caseId, '已下架');
                showToast('已更新寵物刊登狀態為暫停／已下架', 'info');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer"
            >
              暫停刊登
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              updateRehomeCaseStatus(published.caseId, '已送養');
              showToast(`已標記 ${published.petName} 為已送養並關閉案件！`);
              navigate('/adopt/rehome/cases');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-extrabold text-base cursor-pointer"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>標記已送養</span>
          </button>
          <Link
            to="/adopt"
            className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-sm text-slate-800"
          >
            返回領養專區
          </Link>
        </div>
      </div>

      <aside className="bg-[#FFF3E0] rounded-2xl border border-[#F57C00]/35 p-6 space-y-3">
        <div className="flex items-center gap-2 font-extrabold text-xl text-[#7C2D12]">
          <ShieldCheck className="h-5 w-5" />
          <span>安全與隱私</span>
        </div>
        <ul className="space-y-2.5 text-sm font-semibold text-slate-800">
          <li>• 不直接公開完整住址、身分證號</li>
          <li>• 可對詢問者回覆但避免揭露敏感資料</li>
          <li>• 刊登關閉後保留必要審查軌跡</li>
        </ul>
      </aside>

      {replyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#B45309]" />
                <span>領養人詢問（遮蔽個資）</span>
              </h3>
              <button
                type="button"
                onClick={() => setReplyOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1">
              <div className="font-bold text-slate-900">陳○涵（已通過基礎會員驗證）</div>
              <p className="text-slate-700">您好，想詢問{published.petName}平時的作息與是否親近陌生人？</p>
            </div>
            {replySent ? (
              <p className="text-sm font-bold text-emerald-700">✓ 已安全回覆（不公開個人聯絡電話）</p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setReplySent(true);
                  showToast('已透過站內安全通道回覆詢問者');
                }}
                className="w-full py-2.5 rounded-xl bg-[#B45309] text-white font-bold text-sm cursor-pointer"
              >
                發送站內回覆（約定公開互動時間）
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
