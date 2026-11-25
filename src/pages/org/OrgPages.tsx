import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle, XCircle, AlertCircle, MessageSquare, Users, FileText,
  RefreshCw, Shield, Send, Eye, ChevronRight, Database,
  ArrowLeft, Bell, Search, Mail, Calendar,
  Activity, Package, BarChart2, Check, X,
} from 'lucide-react';
import { usePawLink } from '../../context/PawLinkContext';
import { useToast } from '../../components/common/ToastContext';

/* ─────────────────────────── helpers ─────────────────────────── */
const OrgSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-[#0F6B5B]/20 shadow-sm overflow-hidden mb-6">
    <div className="flex items-center gap-3 px-6 py-4 bg-[#E8F5F2] border-b border-[#0F6B5B]/20">
      <span className="text-[#0F6B5B]">{icon}</span>
      <h2 className="font-bold text-[#0F6B5B] text-lg">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

type StatusKey =
  | 'reviewing' | 'pending_supplement' | 'approved' | 'rejected'
  | '審核中' | '已刊登' | '待補件' | '已退回' | '草稿' | '已送養' | '已下架'
  | 'sent' | 'replied' | 'resolved'
  | '已發送' | '已讀' | '待回覆' | '已回覆' | '已處理';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<StatusKey, string> = {
    reviewing: 'bg-yellow-100 text-yellow-800',
    pending_supplement: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    審核中: 'bg-yellow-100 text-yellow-800',
    已刊登: 'bg-green-100 text-green-800',
    待補件: 'bg-orange-100 text-orange-800',
    已退回: 'bg-red-100 text-red-800',
    草稿: 'bg-gray-100 text-gray-700',
    已送養: 'bg-blue-100 text-blue-700',
    已下架: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-800',
    replied: 'bg-green-100 text-green-800',
    resolved: 'bg-gray-100 text-gray-700',
    已發送: 'bg-blue-100 text-blue-800',
    已讀: 'bg-indigo-100 text-indigo-700',
    待回覆: 'bg-yellow-100 text-yellow-700',
    已回覆: 'bg-green-100 text-green-700',
    已處理: 'bg-gray-100 text-gray-700',
  };
  const labels: Record<string, string> = {
    reviewing: '審核中', pending_supplement: '待補件', approved: '已核准',
    rejected: '已退回', sent: '已發送', replied: '已回覆', resolved: '已處理',
  };
  const cls = (map as Record<string, string>)[status] || 'bg-gray-100 text-gray-700';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{labels[status] || status}</span>;
};

/* ════════════════════════════════════════════════════════════════
   UI-04.02  OrgDashboardPage  /organization
════════════════════════════════════════════════════════════════ */
export const OrgDashboardPage: React.FC = () => {
  const { state } = usePawLink();
  const pendingKyc = state.applications.filter(a => a.status === 'reviewing' || a.status === 'pending_supplement').length;
  const pendingRehome = state.rehomeCases.filter(c => c.status === '審核中').length;
  const followUpCount = state.followUpCases.length;
  const pendingMsg = state.orgMessages.filter(m => m.replyStatus === '已回覆').length;

  const stats = [
    { label: 'KYC 待審', value: pendingKyc, icon: <FileText size={28} />, link: '/organization/kyc', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { label: '送養待審', value: pendingRehome, icon: <Package size={28} />, link: '/organization/rehome-review', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { label: '追蹤案件', value: followUpCount, icon: <Activity size={28} />, link: '/organization/followups', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { label: '待處理訊息', value: pendingMsg, icon: <MessageSquare size={28} />, link: '/organization/messages/history', color: 'bg-teal-50 border-teal-200 text-teal-700' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0F6B5B]">今日工作台</h1>
        <p className="text-gray-500 mt-1">歡迎回來，台北市立動物之家管理員</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Link key={s.label} to={s.link} className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 ${s.color} hover:scale-105 transition-transform`}>
            {s.icon}
            <span className="text-3xl font-black">{s.value}</span>
            <span className="text-sm font-semibold">{s.label}</span>
          </Link>
        ))}
      </div>

      <OrgSection title="快速導覽" icon={<BarChart2 size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: '📋 KYC 認養審核', desc: '審核身分與環境評估', to: '/organization/kyc' },
            { label: '🏡 送養刊登審查', desc: '審查私人送養申請', to: '/organization/rehome-review' },
            { label: '🔍 後續追蹤關注', desc: '已認養案件定期回訪', to: '/organization/followups' },
            { label: '📡 資料同步管理', desc: '政府資料庫 Sync Log', to: '/organization/sync' },
            { label: '🔐 角色權限矩陣', desc: '稽核紀錄與權限設定', to: '/organization/permissions' },
            { label: '✉️ 聯絡通知中心', desc: '發送飼主通知訊息', to: '/organization/contacts' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="flex items-start gap-4 p-4 rounded-xl border border-[#0F6B5B]/20 hover:bg-[#E8F5F2] transition-colors">
              <div>
                <div className="font-semibold text-[#0F6B5B]">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
              <ChevronRight size={16} className="ml-auto mt-1 text-[#0F6B5B]" />
            </Link>
          ))}
        </div>
      </OrgSection>

      <OrgSection title="優先處理案件" icon={<AlertCircle size={20} />}>
        {state.applications.filter(a => a.status === 'reviewing').slice(0, 3).map(app => (
          <div key={app.caseId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <div className="font-semibold">KYC 審核 #{app.caseId}</div>
              <div className="text-sm text-gray-500">申請人：{app.applicantName}  |  毛孩：{app.petName}</div>
            </div>
            <Link to="/organization/kyc" className="text-sm text-[#0F6B5B] font-semibold hover:underline">前往審核 →</Link>
          </div>
        ))}
        {state.applications.filter(a => a.status === 'reviewing').length === 0 && (
          <p className="text-gray-400 text-sm">目前無待審案件 🎉</p>
        )}
      </OrgSection>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.03  OrgKycPage  /organization/kyc
════════════════════════════════════════════════════════════════ */
export const OrgKycPage: React.FC = () => {
  const { state, reviewAdoptionCase } = usePawLink();
  const { showToast } = useToast();
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const cases = state.applications.filter(a => ['reviewing', 'pending_supplement'].includes(a.status));

  const handleDecision = (id: string, decision: 'approved' | 'rejected' | 'pending_supplement') => {
    reviewAdoptionCase(id, decision, reasons[id] || '');
    const labels: Record<string, string> = { approved: '已核准', rejected: '已退回', pending_supplement: '已要求補件' };
    showToast(`案件 ${id} ${labels[decision]}，飼主端狀態已同步更新`, 'success');
    setExpanded(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 工作台</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">KYC 認養審核</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">認養 KYC 審核</h1>
      <p className="text-gray-500">待審案件 {cases.length} 件，請逐一審核後操作</p>

      {cases.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle size={48} className="mx-auto mb-3 opacity-30" />
          <p>目前無待審 KYC 案件</p>
        </div>
      )}

      {cases.map(app => (
        <div key={app.caseId} className="bg-white rounded-2xl border border-[#0F6B5B]/20 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-[#E8F5F2]">
            <div>
              <span className="font-bold text-[#0F6B5B]">案件 #{app.caseId}</span>
              <span className="ml-3 text-sm text-gray-600">申請人：{app.applicantName}  毛孩：{app.petName}</span>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={app.status} />
              <button onClick={() => setExpanded(expanded === app.caseId ? null : app.caseId)} className="text-sm text-[#0F6B5B] font-semibold hover:underline">
                {expanded === app.caseId ? '收起' : '展開審核'}
              </button>
            </div>
          </div>

          {expanded === app.caseId && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-semibold text-gray-700 mb-2">📋 基本資料</div>
                  <div>姓名：{app.applicantName}（遮蔽保護）</div>
                  <div>電話：{app.applicantPhone}</div>
                  <div>居住型態：{app.housingType}</div>
                  <div>其他寵物共識：{app.householdConsensus}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-semibold text-gray-700 mb-2">📄 上傳文件</div>
                  <div className="flex items-center gap-2 text-green-700"><CheckCircle size={14} /> KYC 文件（{app.kycDocUploaded ? '已上傳' : '未上傳'}）</div>
                  <div className="flex items-center gap-2 text-green-700"><CheckCircle size={14} /> 環境照片 {app.envPhotoCount} 張</div>
                  <div className="flex items-center gap-2 text-green-700"><CheckCircle size={14} /> 教育訓練（{app.educationCompleted ? '已完成' : '未完成'}）</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">審核備註（補件/退回原因）</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6B5B]"
                  rows={3}
                  placeholder="請填寫補件要求或退回原因..."
                  value={reasons[app.caseId] || ''}
                  onChange={e => setReasons(r => ({ ...r, [app.caseId]: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <button onClick={() => handleDecision(app.caseId, 'approved')} className="flex items-center gap-2 px-5 py-2.5 bg-[#0F6B5B] text-white font-bold rounded-xl hover:bg-[#0A4D41] transition-colors">
                  <CheckCircle size={16} /> 核准通過
                </button>
                <button onClick={() => handleDecision(app.caseId, 'pending_supplement')} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                  <AlertCircle size={16} /> 要求補件
                </button>
                <button onClick={() => handleDecision(app.caseId, 'rejected')} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
                  <XCircle size={16} /> 退回申請
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <OrgSection title="已處理案件" icon={<CheckCircle size={20} />}>
        {state.applications.filter(a => !['reviewing', 'pending_supplement'].includes(a.status)).map(app => (
          <div key={app.caseId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
            <span>案件 #{app.caseId}  —  {app.petName}</span>
            <StatusBadge status={app.status} />
          </div>
        ))}
      </OrgSection>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.04  OrgRehomeReviewPage  /organization/rehome-review
════════════════════════════════════════════════════════════════ */
export const OrgRehomeReviewPage: React.FC = () => {
  const { state, reviewRehomeCase } = usePawLink();
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const cases = state.rehomeCases.filter(c => c.status === '審核中');

  const handleDecision = (caseId: string, decision: '已刊登' | '待補件') => {
    reviewRehomeCase(caseId, decision, notes[caseId] || '');
    showToast(`送養案件 ${caseId} 已${decision}，飼主端狀態已更新`, 'success');
    setExpanded(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 工作台</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">送養審查</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">私人送養審查</h1>
      <p className="text-gray-500">審核通過後將自動刊登於領養列表</p>

      {cases.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle size={48} className="mx-auto mb-3 opacity-30" />
          <p>目前無待審送養案件</p>
        </div>
      )}

      {cases.map(c => (
        <div key={c.caseId} className="bg-white rounded-2xl border border-[#0F6B5B]/20 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-[#E8F5F2]">
            <div>
              <span className="font-bold text-[#0F6B5B]">案件 {c.caseId}</span>
              <span className="ml-3 text-sm text-gray-600">{c.petName}  ({c.species})</span>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={c.status} />
              <button onClick={() => setExpanded(expanded === c.caseId ? null : c.caseId)} className="text-sm text-[#0F6B5B] font-semibold hover:underline">
                {expanded === c.caseId ? '收起' : '展開審查'}
              </button>
            </div>
          </div>

          {expanded === c.caseId && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-semibold mb-2">📋 動物資料</div>
                  <div>名字：{c.petName}</div>
                  <div>品種：{c.breed || '混種'}</div>
                  <div>年齡：{c.ageText}</div>
                  <div>已絕育：{c.neutered}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-semibold mb-2">🖼 照片</div>
                  <div>已上傳：{c.photoCount ?? 0} 張</div>
                  <div>授權公開：{c.photoAuthorized ? '是' : '否'}</div>
                  <div className="mt-2 text-gray-400 text-xs">（實際原型以模擬圖呈現）</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">審查備註（補件原因）</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6B5B]"
                  rows={2}
                  placeholder="如需補件請填寫原因..."
                  value={notes[c.caseId] || ''}
                  onChange={e => setNotes(n => ({ ...n, [c.caseId]: e.target.value }))}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleDecision(c.caseId, '已刊登')} className="flex items-center gap-2 px-5 py-2.5 bg-[#0F6B5B] text-white font-bold rounded-xl hover:bg-[#0A4D41] transition-colors">
                  <CheckCircle size={16} /> 通過刊登
                </button>
                <button onClick={() => handleDecision(c.caseId, '待補件')} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                  <AlertCircle size={16} /> 退回補件
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <OrgSection title="已審查案件" icon={<CheckCircle size={20} />}>
        {state.rehomeCases.filter(c => c.status !== '審核中').map(c => (
          <div key={c.caseId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
            <span>{c.caseId}  —  {c.petName}</span>
            <StatusBadge status={c.status} />
          </div>
        ))}
      </OrgSection>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.05  OrgFollowupsPage  /organization/followups
════════════════════════════════════════════════════════════════ */
export const OrgFollowupsPage: React.FC = () => {
  const { state } = usePawLink();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 工作台</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">後續追蹤</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">後續追蹤關注名單</h1>
      <p className="text-gray-500">{state.followUpCases.length} 個案件需要追蹤回訪</p>

      <div className="bg-white rounded-2xl border border-[#0F6B5B]/20 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#E8F5F2]">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-[#0F6B5B]">案件 ID</th>
              <th className="text-left px-5 py-3 font-semibold text-[#0F6B5B]">毛孩名稱</th>
              <th className="text-left px-5 py-3 font-semibold text-[#0F6B5B]">7日日誌</th>
              <th className="text-left px-5 py-3 font-semibold text-[#0F6B5B]">狀態</th>
              <th className="text-left px-5 py-3 font-semibold text-[#0F6B5B]">異常摘要</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {state.followUpCases.map(fc => (
              <tr key={fc.caseId} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-xs">{fc.caseId}</td>
                <td className="px-5 py-3 font-semibold">{fc.petName}</td>
                <td className="px-5 py-3">{fc.validLogs7d}/7 天</td>
                <td className="px-5 py-3">
                  <StatusBadge status={fc.status} />
                </td>
                <td className="px-5 py-3 text-xs text-gray-500 max-w-xs truncate">{fc.alertSummary}</td>
                <td className="px-5 py-3">
                  <Link to={`/organization/followups/${fc.caseId}`} className="flex items-center gap-1 text-[#0F6B5B] font-semibold hover:underline text-xs">
                    查看 <ChevronRight size={14} />
                  </Link>
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
   UI-04.06  OrgFollowupDetailPage  /organization/followups/:caseId
════════════════════════════════════════════════════════════════ */
export const OrgFollowupDetailPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { state, saveFollowUpResult } = usePawLink();
  const { showToast } = useToast();
  const [method, setMethod] = useState<'電話' | '現場'>('電話');
  const [result, setResult] = useState<'待回訪' | '需追蹤' | '正常結案' | '待確認' | ''>('');
  const [note, setNote] = useState('');

  const fc = state.followUpCases.find(f => f.caseId === caseId);

  if (!fc) return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <p className="text-gray-500">找不到案件 {caseId}</p>
      <Link to="/organization/followups" className="text-[#0F6B5B] hover:underline mt-4 block">← 返回追蹤列表</Link>
    </div>
  );

  const handleSave = () => {
    if (!result) { showToast('請選擇回訪結果', 'warning'); return; }
    saveFollowUpResult(fc.caseId, method, result, note);
    showToast(`回訪結果已登記，案件 ${fc.caseId} 已更新`, 'success');
    setResult(''); setNote('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization/followups" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 追蹤名單</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">{fc.caseId}</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">回訪案件詳情</h1>

      <OrgSection title="飼主 & 毛孩概況" icon={<Users size={20} />}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-1">案件編號</div>
            <div className="font-mono font-bold">{fc.caseId}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">毛孩名稱</div>
            <div className="font-bold">{fc.petName}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">飼主</div>
            <div className="font-bold">{fc.ownerDisplayName}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">案件狀態</div>
            <StatusBadge status={fc.status} />
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">7日有效日誌</div>
            <div className="font-bold text-[#0F6B5B]">{fc.validLogs7d}/7 天</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">分數趨勢</div>
            <div>{fc.scoreTrend}</div>
          </div>
        </div>
        {fc.priorityNote && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
            ⚠️ 備註：{fc.priorityNote}
          </div>
        )}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm">
          <div className="font-semibold text-blue-800 mb-1">醫療摘要</div>
          <div className="text-blue-700">{fc.medicalSummary}</div>
        </div>
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm">
          <div className="font-semibold text-orange-800 mb-1">異常提醒摘要</div>
          <div className="text-orange-700">{fc.alertSummary}</div>
        </div>
      </OrgSection>

      <OrgSection title="登記回訪紀錄" icon={<Calendar size={20} />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">聯繫方式</label>
            <div className="flex gap-3">
              {(['電話', '現場'] as const).map(m => (
                <button key={m} onClick={() => setMethod(m)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${method === m ? 'bg-[#0F6B5B] text-white border-[#0F6B5B]' : 'border-gray-200 text-gray-600 hover:border-[#0F6B5B]'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">回訪結果 <span className="text-red-500">*</span></label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5B]"
              value={result}
              onChange={e => setResult(e.target.value as typeof result)}
            >
              <option value="">請選擇結果...</option>
              <option value="正常結案">正常結案（飼養情況良好）</option>
              <option value="需追蹤">需追蹤（已提醒）</option>
              <option value="待回訪">待回訪（需再次聯繫）</option>
              <option value="待確認">待確認（情況不明）</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">詳細備註</label>
            <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6B5B]" rows={3} placeholder="填寫回訪觀察記錄..." value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-[#0F6B5B] text-white font-bold rounded-xl hover:bg-[#0A4D41] transition-colors">
            <Check size={18} /> 儲存回訪紀錄
          </button>
        </div>
      </OrgSection>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.07  OrgSyncPage  /organization/sync
════════════════════════════════════════════════════════════════ */
export const OrgSyncPage: React.FC = () => {
  const { state, triggerSyncSource } = usePawLink();
  const { showToast } = useToast();

  const handleSync = (id: string, name: string) => {
    triggerSyncSource(id);
    showToast(`${name} 資料同步已觸發，請稍候...`, 'info');
  };

  const statusColorMap: Record<string, string> = {
    成功: 'bg-green-100 text-green-700',
    人工審核: 'bg-yellow-100 text-yellow-700',
    未啟用: 'bg-gray-100 text-gray-700',
    異常: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 工作台</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">資料同步</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">資料來源與 Sync Log</h1>

      <OrgSection title="資料來源清單" icon={<Database size={20} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">資料來源</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">排程 / 模式</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">最後同步</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">筆數</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">狀態</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {state.syncSources.map(src => (
                <tr key={src.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{src.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{src.scheduleOrMode}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{src.lastSyncAt}</td>
                  <td className="px-4 py-3">{src.recordCount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColorMap[src.status] || 'bg-gray-100 text-gray-700'}`}>
                      {src.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleSync(src.id, src.name)} className="flex items-center gap-1 px-3 py-1 bg-[#0F6B5B] text-white text-xs font-semibold rounded-lg hover:bg-[#0A4D41] transition-colors">
                      <RefreshCw size={12} /> 手動同步
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OrgSection>

      <OrgSection title="Sync Log 紀錄" icon={<Activity size={20} />}>
        <div className="space-y-2 text-sm font-mono">
          {[
            { time: '2026-11-25 09:12', src: '台北市動物保護處', result: 'OK +3 筆', color: 'text-green-700' },
            { time: '2026-11-25 06:00', src: '農委會動物登記', result: 'OK +0 筆', color: 'text-green-700' },
            { time: '2026-11-24 23:59', src: '台北市動物保護處', result: 'OK +1 筆', color: 'text-green-700' },
            { time: '2026-11-24 15:30', src: '合作獸醫診所API', result: 'ERROR: timeout', color: 'text-red-600' },
            { time: '2026-11-24 06:00', src: '農委會動物登記', result: 'OK +0 筆', color: 'text-green-700' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-4 py-1 border-b border-gray-100 last:border-0">
              <span className="text-gray-400 w-36">{log.time}</span>
              <span className="text-gray-600 flex-1">{log.src}</span>
              <span className={log.color}>{log.result}</span>
            </div>
          ))}
        </div>
      </OrgSection>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.08  OrgPermissionsPage  /organization/permissions
════════════════════════════════════════════════════════════════ */
export const OrgPermissionsPage: React.FC = () => {
  const { state } = usePawLink();

  const roles = ['管理員', '審核員', '回訪員', '資料管理員'];
  const permissions = [
    { action: 'KYC 審核', cols: [true, true, false, false] },
    { action: '送養審查', cols: [true, true, false, false] },
    { action: '後續回訪', cols: [true, false, true, false] },
    { action: '發送通知', cols: [true, true, true, false] },
    { action: '資料同步', cols: [true, false, false, true] },
    { action: '權限管理', cols: [true, false, false, false] },
    { action: '稽核查看', cols: [true, true, true, true] },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 工作台</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">角色權限</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">角色權限矩陣</h1>

      <OrgSection title="權限矩陣" icon={<Shield size={20} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">功能項目</th>
                {roles.map(r => <th key={r} className="text-center px-4 py-3 font-semibold text-gray-600">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.action}</td>
                  {p.cols.map((has, j) => (
                    <td key={j} className="px-4 py-3 text-center">
                      {has ? <Check size={16} className="inline text-[#0F6B5B]" /> : <X size={16} className="inline text-gray-300" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OrgSection>

      <OrgSection title="稽核紀錄" icon={<Activity size={20} />}>
        <div className="space-y-2">
          {state.auditLogs.map(log => (
            <div key={log.id} className="flex items-start gap-4 py-2 border-b border-gray-100 last:border-0 text-sm">
              <span className="text-gray-400 text-xs w-40 shrink-0">{log.timestamp}</span>
              <span className="font-medium text-gray-700">{log.actor}</span>
              <span className="text-gray-600 flex-1">{log.action}</span>
              <span className="text-xs text-gray-400">{log.target}</span>
            </div>
          ))}
        </div>
      </OrgSection>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.09  OrgContactsPage  /organization/contacts
════════════════════════════════════════════════════════════════ */
export const OrgContactsPage: React.FC = () => {
  const { state, setMessageDraft } = usePawLink();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  type FollowUpCaseType = typeof state.followUpCases[number];
  const cases = state.followUpCases.filter((fc: FollowUpCaseType) =>
    !search || fc.petName.includes(search) || fc.caseId.includes(search)
  );

  const handleCompose = (fc: FollowUpCaseType, category: '回訪聯繫' | '補件提醒' | '健康提醒') => {
    setMessageDraft({
      toOwnerId: 'owner-001',
      toOwnerName: fc.ownerDisplayName,
      caseId: fc.caseId,
      petName: fc.petName,
      category,
      subject: `【${category}】${fc.petName} - ${fc.caseId}`,
      content: '',
      includeEmail: false,
    });
    navigate('/organization/messages/new');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 工作台</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">聯絡通知</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">搜尋關聯案件與飼主</h1>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5B]"
          placeholder="搜尋案件編號或毛孩名稱..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#0F6B5B]/20 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-[#E8F5F2] border-b border-[#0F6B5B]/20">
          <span className="font-bold text-[#0F6B5B]">關聯案件列表（{cases.length}）</span>
        </div>
        {cases.map((fc: FollowUpCaseType) => (
          <div key={fc.caseId} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div>
              <div className="font-semibold">{fc.petName} <span className="text-xs text-gray-400 ml-2 font-mono">{fc.caseId}</span></div>
              <div className="text-sm text-gray-500 mt-0.5">飼主：{fc.ownerDisplayName}  |  7日日誌：{fc.validLogs7d}/7</div>
            </div>
            <div className="flex gap-2">
              {(['回訪聯繫', '補件提醒', '健康提醒'] as const).map(cat => (
                <button key={cat} onClick={() => handleCompose(fc, cat)} className="px-3 py-1.5 bg-[#0F6B5B] text-white text-xs font-semibold rounded-lg hover:bg-[#0A4D41] transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        ))}
        {cases.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">無符合條件的案件</div>
        )}
      </div>

      <OrgSection title="快速通知模板" icon={<Mail size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['回訪聯繫', '補件提醒', '健康提醒'] as const).map(cat => (
            <button key={cat} onClick={() => {
              setMessageDraft({
                toOwnerId: 'owner-001',
                toOwnerName: '（請先選擇案件）',
                caseId: '',
                petName: '',
                category: cat,
                subject: `【${cat}】`,
                content: '',
                includeEmail: false,
              });
              navigate('/organization/messages/new');
            }} className="p-4 border border-[#0F6B5B]/20 rounded-xl text-left hover:bg-[#E8F5F2] transition-colors">
              <div className="font-semibold text-[#0F6B5B]">{cat}</div>
              <div className="text-xs text-gray-500 mt-1">使用 {cat} 模板快速撰寫</div>
            </button>
          ))}
        </div>
      </OrgSection>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.10  OrgMessageNewPage  /organization/messages/new
════════════════════════════════════════════════════════════════ */
export const OrgMessageNewPage: React.FC = () => {
  const { state, setMessageDraft } = usePawLink();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const draft = state.messageDraft;
  const [subject, setSubject] = useState(draft?.subject || '');
  const [content, setContent] = useState(draft?.content || '');
  const [category, setCategory] = useState<'回訪聯繫' | '補件提醒' | '健康提醒'>(
    (draft?.category as '回訪聯繫' | '補件提醒' | '健康提醒') || '回訪聯繫'
  );
  const [includeEmail, setIncludeEmail] = useState(draft?.includeEmail ?? false);

  const handleNext = () => {
    if (!subject.trim() || !content.trim()) {
      showToast('請填寫主旨與通知內容', 'warning');
      return;
    }
    setMessageDraft({
      toOwnerId: draft?.toOwnerId || 'owner-001',
      toOwnerName: draft?.toOwnerName || '（未選擇）',
      caseId: draft?.caseId || '',
      petName: draft?.petName || '',
      category,
      subject,
      content,
      includeEmail,
    });
    navigate('/organization/messages/confirm');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization/contacts" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 聯絡通知</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">撰寫通知</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">撰寫通知訊息</h1>

      <div className="flex items-center gap-2 text-sm">
        {['搜尋飼主', '撰寫通知', '確認發送', '發送完成'].map((s, i) => (
          <React.Fragment key={s}>
            <span className={`px-3 py-1 rounded-full font-medium ${i === 1 ? 'bg-[#0F6B5B] text-white' : i < 1 ? 'bg-[#0F6B5B]/20 text-[#0F6B5B]' : 'bg-gray-100 text-gray-400'}`}>{s}</span>
            {i < 3 && <ChevronRight size={14} className="text-gray-300" />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#0F6B5B]/20 shadow-sm p-6 space-y-5">
        <div className="p-4 bg-[#E8F5F2] rounded-xl text-sm">
          <div className="font-semibold text-[#0F6B5B]">收件人資訊</div>
          <div className="text-gray-700 mt-1">
            飼主：{draft?.toOwnerName || '（未選擇）'}
            {draft?.petName && <>  |  毛孩：{draft.petName}</>}
            {draft?.caseId && <>  |  案件：{draft.caseId}</>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">通知類別</label>
          <div className="flex gap-3 flex-wrap">
            {(['回訪聯繫', '補件提醒', '健康提醒'] as const).map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${category === cat ? 'bg-[#0F6B5B] text-white border-[#0F6B5B]' : 'border-gray-200 text-gray-600 hover:border-[#0F6B5B]'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">通知主旨 <span className="text-red-500">*</span></label>
          <input className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5B]" placeholder="例：11月定期回訪提醒" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">通知內容 <span className="text-red-500">*</span></label>
          <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6B5B]" rows={6} placeholder="請輸入通知內容..." value={content} onChange={e => setContent(e.target.value)} />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#0F6B5B]" checked={includeEmail} onChange={e => setIncludeEmail(e.target.checked)} />
          <span className="text-sm text-gray-700">同時發送 Email 通知</span>
        </label>

        <div className="flex gap-3 pt-2">
          <Link to="/organization/contacts" className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">取消</Link>
          <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 bg-[#0F6B5B] text-white font-bold rounded-xl hover:bg-[#0A4D41] transition-colors">
            <Eye size={16} /> 預覽確認
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.11  OrgMessageConfirmPage  /organization/messages/confirm
════════════════════════════════════════════════════════════════ */
export const OrgMessageConfirmPage: React.FC = () => {
  const { state, confirmSendOrgMessage } = usePawLink();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);

  const draft = state.messageDraft;

  if (!draft?.subject) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <p className="text-gray-500">尚無待確認的草稿，請先撰寫通知</p>
        <Link to="/organization/messages/new" className="text-[#0F6B5B] hover:underline mt-4 block">← 返回撰寫</Link>
      </div>
    );
  }

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    confirmSendOrgMessage();
    showToast('通知已成功發送！飼主將在 App 收到通知', 'success');
    navigate('/organization/messages/history');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization/messages/new" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 撰寫通知</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">確認發送</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">發送前預覽確認</h1>

      <div className="flex items-center gap-2 text-sm">
        {['搜尋飼主', '撰寫通知', '確認發送', '發送完成'].map((s, i) => (
          <React.Fragment key={s}>
            <span className={`px-3 py-1 rounded-full font-medium ${i === 2 ? 'bg-[#0F6B5B] text-white' : i < 2 ? 'bg-[#0F6B5B]/20 text-[#0F6B5B]' : 'bg-gray-100 text-gray-400'}`}>{s}</span>
            {i < 3 && <ChevronRight size={14} className="text-gray-300" />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-2xl border-2 border-[#0F6B5B]/30 shadow-md p-6 space-y-4">
        <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">通知預覽</div>
        <div className="border-b border-gray-100 pb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">收件人</span>
            <span className="font-semibold">{draft.toOwnerName}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">類別</span>
            <span className="font-semibold">{draft.category}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Email 副本</span>
            <span>{draft.includeEmail ? '是' : '否'}</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-1">主旨</div>
          <div className="text-base font-bold">{draft.subject}</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-1">內容</div>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-4">{draft.content}</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/organization/messages/new" className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">← 返回修改</Link>
        <button onClick={handleSend} disabled={sending} className="flex items-center gap-2 px-6 py-2.5 bg-[#0F6B5B] text-white font-bold rounded-xl hover:bg-[#0A4D41] transition-colors disabled:opacity-60">
          <Send size={16} /> {sending ? '發送中...' : '確認發送'}
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.12  OrgMessageHistoryPage  /organization/messages/history
════════════════════════════════════════════════════════════════ */
export const OrgMessageHistoryPage: React.FC = () => {
  const { state } = usePawLink();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 工作台</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">發送紀錄</span>
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F6B5B]">通知發送紀錄</h1>
      <p className="text-gray-500">共 {state.orgMessages.length} 則通知</p>

      <div className="space-y-3">
        {state.orgMessages.map(msg => (
          <div key={msg.id} className="bg-white rounded-2xl border border-[#0F6B5B]/20 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-gray-400">{msg.id}</span>
                  <StatusBadge status={msg.deliveryStatus} />
                  <StatusBadge status={msg.replyStatus} />
                </div>
                <div className="font-bold text-gray-900">{msg.subject}</div>
                <div className="text-sm text-gray-500 mt-1">
                  收件人：{msg.toOwnerName}  |  類別：{msg.category}  |  {msg.sentAt}
                </div>
                {msg.thread.length > 1 && (
                  <div className="text-xs text-[#0F6B5B] mt-1">{msg.thread.length} 則對話</div>
                )}
              </div>
              <Link to={`/organization/messages/${msg.id}`} className="flex items-center gap-1 px-4 py-2 bg-[#0F6B5B] text-white text-sm font-semibold rounded-xl hover:bg-[#0A4D41] transition-colors ml-4">
                查看 <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Link to="/organization/contacts" className="flex items-center gap-2 px-6 py-3 border-2 border-[#0F6B5B] text-[#0F6B5B] font-bold rounded-xl hover:bg-[#E8F5F2] transition-colors">
          <Bell size={16} /> 發送新通知
        </Link>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   UI-04.13  OrgMessageDetailPage  /organization/messages/:msgId
════════════════════════════════════════════════════════════════ */
export const OrgMessageDetailPage: React.FC = () => {
  const { msgId } = useParams<{ msgId: string }>();
  const { state, orgReplyMessage, resolveOrgMessageThread } = usePawLink();
  const { showToast } = useToast();
  const [replyText, setReplyText] = useState('');

  const msg = state.orgMessages.find(m => m.id === msgId);

  if (!msg) return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <p className="text-gray-500">找不到通知 {msgId}</p>
      <Link to="/organization/messages/history" className="text-[#0F6B5B] hover:underline mt-4 block">← 返回發送紀錄</Link>
    </div>
  );

  const handleReply = () => {
    if (!replyText.trim()) { showToast('請輸入回覆內容', 'warning'); return; }
    orgReplyMessage(msg.id, replyText);
    showToast('回覆已發送', 'success');
    setReplyText('');
  };

  const handleResolve = () => {
    resolveOrgMessageThread(msg.id);
    showToast(`通知 ${msg.id} 已標記為已處理`, 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organization/messages/history" className="text-[#0F6B5B] hover:underline flex items-center gap-1"><ArrowLeft size={16} /> 發送紀錄</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#0F6B5B]">{msg.id}</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F6B5B]">{msg.subject}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={msg.deliveryStatus} />
            <StatusBadge status={msg.replyStatus} />
            <span className="text-sm text-gray-400">{msg.sentAt}</span>
          </div>
        </div>
        {msg.replyStatus !== '已處理' && (
          <button onClick={handleResolve} className="flex items-center gap-2 px-4 py-2 border border-[#0F6B5B] text-[#0F6B5B] font-semibold rounded-xl hover:bg-[#E8F5F2] transition-colors text-sm">
            <CheckCircle size={14} /> 標記已處理
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#0F6B5B]/20 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-[#E8F5F2] border-b border-[#0F6B5B]/20">
          <span className="font-bold text-[#0F6B5B]">對話紀錄（{msg.thread.length}）</span>
        </div>
        <div className="p-6 space-y-4">
          {msg.thread.map((entry, i) => (
            <div key={i} className={`flex ${entry.sender === 'org' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md rounded-2xl px-5 py-3 ${entry.sender === 'org' ? 'bg-[#0F6B5B] text-white' : 'bg-gray-100 text-gray-800'}`}>
                <div className="text-xs opacity-70 mb-1">{entry.sender === 'org' ? '機構' : '飼主'}  ·  {entry.time}</div>
                <div className="text-sm leading-relaxed">{entry.content}</div>
              </div>
            </div>
          ))}
        </div>

        {msg.replyStatus !== '已處理' && (
          <div className="border-t border-gray-100 p-6 space-y-3">
            <label className="block text-sm font-semibold text-gray-700">機構回覆</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6B5B]"
              rows={3}
              placeholder="輸入回覆訊息..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <button onClick={handleReply} className="flex items-center gap-2 px-5 py-2.5 bg-[#0F6B5B] text-white font-bold rounded-xl hover:bg-[#0A4D41] transition-colors">
              <Send size={16} /> 發送回覆
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
