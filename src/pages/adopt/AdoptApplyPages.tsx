import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, FileText, Lock, ShieldCheck, X } from 'lucide-react';
import { SimulatedUpload, StepIndicator } from '../../components/common/CommonUI';
import { useToast } from '../../components/common/ToastContext';
import { usePawLink } from '../../context/PawLinkContext';

function useApplyPet(paramId?: string) {
  const { state } = usePawLink();
  const petId = paramId || 'A-0001';
  const pet = state.pets.find((p) => p.id === petId) ?? state.pets[0];
  const app = state.applications.find((a) => a.petId === pet.id || a.caseId === pet.id);
  return { pet, app };
}

function getApplySteps(petId: string) {
  return [
    { num: 1, label: '瀏覽選擇', to: `/adopt/apply/${petId}` },
    { num: 2, label: '初步聯繫', to: `/adopt/apply/${petId}/contact` },
    { num: 3, label: '資格審核', to: `/adopt/apply/${petId}/kyc` },
    { num: 4, label: '教育課程', to: `/adopt/apply/${petId}/education` },
    { num: 5, label: '文件合約', to: `/adopt/apply/${petId}/contract` },
    { num: 6, label: '帶回追蹤', to: `/adopt/apply/${petId}/handover` },
  ];
}

/* UI-02.10 認養流程｜六大程序總覽 */
export const AdoptApplyOverviewPage: React.FC = () => {
  const { petId } = useParams();
  const { pet } = useApplyPet(petId);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
          開始認養申請：{pet.name}（{pet.id}）
        </h2>
        <StepIndicator steps={getApplySteps(pet.id)} activeNum={1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-slate-950">接下來需要完成的事項</h3>
          <ul className="space-y-3 text-base text-slate-800">
            <li className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" />
              <span>聯繫送養單位並填寫認養意願</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" />
              <span>完成身分與居住條件評估</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" />
              <span>依機構規定完成教育、預約與簽約</span>
            </li>
          </ul>
        </div>

        <aside className="bg-[#FFF3E0] rounded-2xl border border-[#F57C00]/35 p-6 flex flex-col justify-between gap-6">
          <div className="space-y-2.5">
            <h3 className="text-xl font-extrabold text-[#7C2D12]">申請提醒</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              先確認寵物是否仍開放認養；提交資料後仍需原機構審核。
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/adopt/apply/${pet.id}/contact`)}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base shadow-sm cursor-pointer"
          >
            <span>開始填寫意願</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </aside>
      </div>
    </div>
  );
};

/* UI-02.11 第 2 步｜聯繫與認養意願確認 */
export const AdoptApplyContactPage: React.FC = () => {
  const { petId } = useParams();
  const { pet, app } = useApplyPet(petId);
  const { updateApplication } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [contactMethod, setContactMethod] = useState<'Email' | '電話' | '線上表單'>(
    app?.contactMethod || 'Email',
  );
  const [contactTime, setContactTime] = useState(app?.contactTime || '平日晚上');
  const [intentSummary, setIntentSummary] = useState(
    app?.intentSummary || '已有飼養經驗，家中成員皆支持認養並可配合機構追蹤。',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentSummary.trim()) {
      showToast('請填寫認養意願簡述', 'warning');
      return;
    }
    updateApplication(pet.id, {
      contactMethod,
      contactTime,
      intentSummary,
      currentStep: 3,
      status: 'reviewing',
      statusLabel: '申請填寫中',
      statusNote: '已建立初步聯繫意願',
    });
    showToast('已儲存聯繫與認養意願');
    navigate(`/adopt/apply/${pet.id}/kyc`);
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={getApplySteps(pet.id)} activeNum={2} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">希望聯絡方式 *</span>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value as 'Email' | '電話' | '線上表單')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
              >
                <option value="Email">Email</option>
                <option value="電話">電話</option>
                <option value="線上表單">線上表單</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">方便聯絡時段</span>
              <select
                value={contactTime}
                onChange={(e) => setContactTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
              >
                <option>平日晚上</option>
                <option>平日白天</option>
                <option>假日全天</option>
              </select>
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">認養意願簡述 *</span>
            <textarea
              rows={4}
              required
              value={intentSummary}
              onChange={(e) => setIntentSummary(e.target.value)}
              placeholder="請簡述飼養經驗、家中成員及希望認養的原因。"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F57C00]"
            />
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base cursor-pointer"
            >
              <span>下一步：資格</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <aside className="bg-slate-100 rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-xl font-extrabold text-slate-950">機構聯絡狀態</h3>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFF3E0] text-[#7C2D12] border border-[#F57C00]/30 text-sm font-extrabold">
            {app ? `案件 ${app.caseId}｜${app.statusLabel}` : '尚未送出'}
          </span>
          <p className="text-sm text-slate-700 leading-relaxed">
            案件編號將於送出後建立。回覆以機構公告為準。
          </p>
        </aside>
      </div>
    </div>
  );
};

/* UI-02.12 第 3 步 A｜認養資格／KYC 認證 */
export const AdoptApplyKycPage: React.FC = () => {
  const { petId } = useParams();
  const { pet, app } = useApplyPet(petId);
  const { state, updateApplication } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [applicantName, setApplicantName] = useState(
    app?.applicantName || state.currentUser.maskedName || '王○明',
  );
  const [phone, setPhone] = useState(app?.applicantPhone || '09xx-xxx-xxx');
  const [birthAge, setBirthAge] = useState(app?.kycBirthAge || '成年申請人');
  const [docUploaded, setDocUploaded] = useState(app?.kycDocUploaded ?? true);
  const [confirmed, setConfirmed] = useState(app?.kycConfirmed ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docUploaded) {
      showToast('請先上傳身分證明文件', 'warning');
      return;
    }
    if (!confirmed) {
      showToast('請勾選確認資料真實並同意審核', 'warning');
      return;
    }
    updateApplication(pet.id, {
      applicantName,
      applicantPhone: phone,
      kycBirthAge: birthAge,
      kycDocUploaded: true,
      kycConfirmed: true,
    });
    showToast('已完成 KYC 身分資料儲存');
    navigate(`/adopt/apply/${pet.id}/environment`);
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={getApplySteps(pet.id)} activeNum={3} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">申請人姓名 *</span>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">聯絡電話 *</span>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">出生年月／資格 *</span>
              <input
                type="text"
                required
                value={birthAge}
                onChange={(e) => setBirthAge(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <div className="space-y-1.5">
              <span className="text-sm font-bold text-slate-800 block">證件資料 *</span>
              <button
                type="button"
                onClick={() => {
                  setDocUploaded(true);
                  showToast('已模擬上傳身分證明（已自動套用浮水印與權限遮蔽）');
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-left font-bold text-sm flex items-center justify-between cursor-pointer ${
                  docUploaded
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <span>{docUploaded ? '已上傳身分證明（僅審核端可見）' : '上傳身分證明 +'}</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <label className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="h-4 w-4 accent-[#B45309]"
              />
              <span className="text-sm font-bold text-slate-800">我確認資料真實並同意審核</span>
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base cursor-pointer"
            >
              <span>儲存並繼續</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <aside className="bg-[#FFF3E0] rounded-2xl border border-[#F57C00]/35 p-6 space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-xl text-[#7C2D12]">
            <Lock className="h-5 w-5" />
            <span>個資保護</span>
          </div>
          <ul className="space-y-2 text-sm font-semibold text-slate-800">
            <li>• 對外：只顯示審核狀態</li>
            <li>• 審核端：需具授權身分</li>
            <li>• 文件：依隱私規範限期保存</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

/* UI-02.13 第 3 步 B｜居住環境與照顧能力評估 */
export const AdoptApplyEnvironmentPage: React.FC = () => {
  const { petId } = useParams();
  const { pet, app } = useApplyPet(petId);
  const { updateApplication } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [housingType, setHousingType] = useState<'公寓' | '透天' | '其他'>(
    app?.housingType || '公寓',
  );
  const [canKeepPets, setCanKeepPets] = useState<'是' | '需確認'>(app?.canKeepPets || '是');
  const [householdConsensus, setHouseholdConsensus] = useState(
    app?.householdConsensus || '已取得家庭共識',
  );
  const [careSchedule, setCareSchedule] = useState(app?.careSchedule || '每日早晚照顧安排');
  const [photoCount, setPhotoCount] = useState(app?.envPhotoCount ?? 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplication(pet.id, {
      housingType,
      canKeepPets,
      householdConsensus,
      careSchedule,
      envPhotoCount: photoCount,
      currentStep: 4,
      status: photoCount >= 2 ? 'reviewing' : app?.status || 'reviewing',
      statusLabel: photoCount >= 2 ? '審核中' : app?.statusLabel || '審核中',
      statusNote:
        photoCount >= 2 ? '已補齊居住環境照片，等待機構檢視' : '居住環境資料已更新',
    });
    showToast('已儲存居住環境與活動空間照片');
    navigate(`/adopt/apply/${pet.id}/education`);
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={getApplySteps(pet.id)} activeNum={3} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">居住類型 *</span>
              <select
                value={housingType}
                onChange={(e) => setHousingType(e.target.value as '公寓' | '透天' | '其他')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
              >
                <option value="公寓">公寓</option>
                <option value="透天">透天</option>
                <option value="其他">其他</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">住所可否飼養 *</span>
              <select
                value={canKeepPets}
                onChange={(e) => setCanKeepPets(e.target.value as '是' | '需確認')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
              >
                <option value="是">是（自有或房東同意）</option>
                <option value="需確認">需確認</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">同住成員 *</span>
              <input
                type="text"
                required
                value={householdConsensus}
                onChange={(e) => setHouseholdConsensus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">照護時間 *</span>
              <input
                type="text"
                required
                value={careSchedule}
                onChange={(e) => setCareSchedule(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
          </div>

          <SimulatedUpload
            label="上傳活動空間照片／說明"
            uploadedCount={photoCount}
            onUpload={() => {
              setPhotoCount((c) => Math.min(3, c + 1));
              showToast('已上傳居住環境與防護照片');
            }}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base cursor-pointer"
            >
              <span>下一步</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <aside className="bg-slate-100 rounded-2xl border border-slate-200 p-6 space-y-3">
          <h3 className="text-xl font-extrabold text-slate-950">審核項目</h3>
          <ul className="space-y-2.5 text-sm font-semibold text-slate-700">
            <li>• 環境安全與衛生</li>
            <li>• 飼養經驗與責任認知</li>
            <li>• 醫療、飲食與活動安排</li>
            <li>• 機構人工訪視（必要時）</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

/* UI-02.14 第 4 步｜教育訓練與完成證明 */
export const AdoptApplyEducationPage: React.FC = () => {
  const { petId } = useParams();
  const { pet, app } = useApplyPet(petId);
  const { updateApplication } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [courseDone, setCourseDone] = useState(app?.educationCompleted ?? false);
  const [guideRead, setGuideRead] = useState(app?.educationGuideRead ?? true);

  const handleNext = () => {
    updateApplication(pet.id, {
      educationCompleted: courseDone,
      educationGuideRead: guideRead,
      currentStep: 5,
    });
    navigate(`/adopt/apply/${pet.id}/contract`);
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={getApplySteps(pet.id)} activeNum={4} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-2xl font-extrabold text-slate-950">本次認養適用課程</h2>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-extrabold text-slate-950">認養前責任教育</h3>
                <p className="text-sm text-slate-600">
                  形式：依機構要求提供（線上課程或上傳完成證明）
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCourseDone(true);
                  showToast('已完成「認養前責任教育」測驗與證明登記');
                }}
                className={`px-4 py-2 rounded-xl font-bold text-sm cursor-pointer shrink-0 ${
                  courseDone
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-[#FFF3E0] hover:bg-orange-100 text-[#7C2D12] border border-[#F57C00]/40'
                }`}
              >
                {courseDone ? '已完成 ✓' : '待完成（點擊完成）'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-extrabold text-slate-950">照護知識與環境安全</h3>
                <p className="text-sm text-slate-600">可參考飼養前知識與常見問題</p>
              </div>
              <button
                type="button"
                onClick={() => setGuideRead((v) => !v)}
                className={`px-4 py-2 rounded-xl font-bold text-sm cursor-pointer shrink-0 ${
                  guideRead
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {guideRead ? '已閱讀 ✓' : '標記已閱讀'}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base cursor-pointer"
            >
              <span>下一步</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <aside className="bg-[#FFF3E0] rounded-2xl border border-[#F57C00]/35 p-6 space-y-3">
          <h3 className="text-xl font-extrabold text-[#7C2D12]">完成方式</h3>
          <ul className="space-y-2.5 text-sm font-semibold text-slate-800">
            <li>• 線上課程與測驗</li>
            <li>• 現場教育課程預約</li>
            <li>• 上傳既有完成證明</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

/* UI-02.15 第 5 步｜預約、申請書與合約簽署 */
export const AdoptApplyContractPage: React.FC = () => {
  const { petId } = useParams();
  const { pet, app } = useApplyPet(petId);
  const { updateApplication } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [appointmentDate, setAppointmentDate] = useState(
    app?.appointmentDate || '2026/12/01 14:00',
  );
  const [location, setLocation] = useState(app?.appointmentLocation || pet.shelterName);
  const [signed, setSigned] = useState(app?.contractSigned ?? false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirmSign = () => {
    setSigned(true);
    setModalOpen(false);
    updateApplication(pet.id, {
      appointmentDate,
      appointmentLocation: location,
      contractSigned: true,
      currentStep: 6,
    });
    showToast('已完成電子認養合約閱讀與簽署');
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={getApplySteps(pet.id)} activeNum={5} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">預約現場認養 *</span>
              <input
                type="text"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-800">辦理地點 *</span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-950">認養申請書</h3>
                <p className="text-sm text-slate-600">確認姓名、聯絡資訊、飼養條件</p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
                已帶入資料
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-950">認養合約／切結書</h3>
                <p className="text-sm text-slate-600">下載、閱讀並依機構方式簽署</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFF3E0] hover:bg-orange-100 text-[#7C2D12] border border-[#F57C00]/40 font-bold text-sm cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span>{signed ? '檢視已簽署合約' : '開啟合約閱讀並簽署'}</span>
              </button>
            </div>
          </div>
        </div>

        <aside className="bg-slate-100 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-extrabold text-slate-950">合約狀態</h3>
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-extrabold ${
                signed
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-[#FFF3E0] text-[#7C2D12] border border-[#F57C00]/30'
              }`}
            >
              {signed ? '已簽署' : '待簽署'}
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              線上簽署是否有效需依機構與法律要求確認。
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!signed) {
                setModalOpen(true);
                return;
              }
              navigate(`/adopt/apply/${pet.id}/handover`);
            }}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base cursor-pointer"
          >
            <span>前往帶回確認</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </aside>
      </div>

      {/* Contract Signing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-extrabold text-slate-950">認養合約／切結書（{pet.name}）</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 space-y-2 leading-relaxed">
              <p>1. 認養人承諾提供安全、衛生之飼養環境，並依動物保護法規定辦理寵物登記及絕育事宜。</p>
              <p>2. 認養後同意配合機構進行必要之電訪或實地追蹤回訪，並可透過 PawLink 每日紀錄照護狀態。</p>
              <p>3. 若因故無法繼續飼養，應立即聯繫原送養機構協助，不得任意遺棄或私下轉讓。</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-sm text-slate-700 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmSign}
                className="px-6 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-sm cursor-pointer"
              >
                我已詳閱條款並同意簽署
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* UI-02.16 第 6 步｜帶回、晶片與認養後 啟用 */
export const AdoptApplyHandoverPage: React.FC = () => {
  const { petId } = useParams();
  const { pet, app } = useApplyPet(petId);
  const { state, updateApplication, bindCarePet } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [checks, setChecks] = useState(
    app?.handoverChecklist || {
      contractDone: true,
      chipDone: true,
      neuterDone: true,
      careActivated: false,
    },
  );

  const handleActivateCare = () => {
    const alreadyBound = state.carePets.some((cp) => cp.caseId === pet.id || cp.name === pet.name);
    if (!alreadyBound) {
      bindCarePet(pet.id, pet.name, pet.species);
    }
    updateApplication(pet.id, {
      currentStep: 6,
      status: 'completed',
      statusLabel: '完成',
      statusNote: '已完成領養交付與照護檔案啟用',
      handoverChecklist: { ...checks, careActivated: true },
    });
    showToast(`已啟用 ${pet.name} 的飼主照護檔案！`);
    navigate('/care/dashboard');
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={getApplySteps(pet.id)} activeNum={6} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-950">帶回前確認清單</h2>

          <div className="space-y-3">
            {[
              { key: 'contractDone' as const, label: '認養合約與交付紀錄', badge: '已完成' },
              { key: 'chipDone' as const, label: '晶片登記狀態／變更', badge: '已核對' },
              { key: 'neuterDone' as const, label: '絕育與醫療安排', badge: '依寵物狀況' },
              { key: 'careActivated' as const, label: '照護追蹤帳號綁定', badge: '點擊右方啟用' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50"
              >
                <span className="inline-flex items-center gap-3 font-bold text-slate-900">
                  <input
                    type="checkbox"
                    checked={checks[item.key]}
                    onChange={(e) =>
                      setChecks((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="h-4 w-4 accent-[#B45309]"
                  />
                  <span>{item.label}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FFF3E0] text-[#7C2D12] text-xs font-extrabold">
                  {checks[item.key] ? '已完成' : item.badge}
                </span>
              </label>
            ))}
          </div>
        </div>

        <aside className="bg-[#FFF3E0] rounded-2xl border border-[#F57C00]/35 p-6 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-extrabold text-[#7C2D12]">完成後</h3>
            <ul className="space-y-2 text-sm font-semibold text-slate-800">
              <li>• 建立 {pet.name} 照護檔案</li>
              <li>• 開啟每日紀錄與健康提醒</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={handleActivateCare}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base shadow-sm cursor-pointer"
          >
            <span>進入飼主追蹤</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </aside>
      </div>
    </div>
  );
};

/* UI-02.17 我的認養案件｜進度、補件與通知 */
export const MyApplicationsPage: React.FC = () => {
  const { state } = usePawLink();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-slate-950">認養案件管理</h2>
        <Link
          to="/adopt"
          className="px-4 py-2 rounded-xl bg-[#FFF3E0] text-[#7C2D12] border border-[#F57C00]/35 font-bold text-sm"
        >
          瀏覽更多待領養毛孩
        </Link>
      </div>

      <div className="space-y-3">
        {state.applications.map((app) => (
          <div
            key={app.caseId}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-[#F57C00]/50 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-extrabold text-slate-900 text-base w-20">{app.caseId}</span>
              <span className="font-extrabold text-slate-950 text-lg">{app.petName}</span>
              <div>
                <div className="text-sm font-semibold text-slate-700">{app.statusNote}</div>
                {app.reviewReason && (
                  <div className="text-xs text-[#B45309] font-semibold mt-0.5">
                    機構備註：{app.reviewReason}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold ${
                  app.status === 'completed' || app.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-900'
                    : app.status === 'pending_supplement'
                      ? 'bg-[#FFF3E0] text-[#B45309] border border-[#F57C00]/40'
                      : 'bg-slate-100 text-slate-800'
                }`}
              >
                {app.statusLabel}
              </span>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    app.status === 'pending_supplement'
                      ? `/adopt/apply/${app.petId}/environment`
                      : app.status === 'completed'
                        ? '/care/dashboard'
                        : `/adopt/apply/${app.petId}`,
                  )
                }
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-sm cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{app.status === 'pending_supplement' ? '前往補件' : '檢視'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
