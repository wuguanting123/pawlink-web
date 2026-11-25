import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Bell, Building2, ChevronRight, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { useToast } from '../components/common/ToastContext';
import { usePawLink } from '../context/PawLinkContext';

export const LoginPage: React.FC = () => {
  const { loginAsOwner } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/adopt';
  const [email, setEmail] = useState('wang.ming@example.com');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsOwner(email);
    showToast('已登入一般飼主（王○明）');
    navigate(redirectTo);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
      >
        <h2 className="text-2xl font-extrabold text-slate-950">歡迎回到 PawLink</h2>
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">電子郵件／手機 *</span>
            <div className="relative">
              <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F2B36]"
              />
            </div>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">密碼 *</span>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F2B36]"
              />
            </div>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => alert('示範環境：已發送重設密碼信至預設信箱。')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm cursor-pointer"
          >
            忘記密碼
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F2B36] hover:bg-[#163D4C] text-white font-bold text-base cursor-pointer"
          >
            <span>登入（一般飼主王○明）</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="lg:col-span-2 bg-slate-100 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-slate-950">新使用者建立帳號</h3>
          <ol className="space-y-3 text-slate-700 text-base">
            <li className="flex items-start gap-2.5">
              <span className="font-extrabold text-[#0F2B36]">1</span>
              <span>填寫聯絡資料與驗證信箱</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-extrabold text-[#0F2B36]">2</span>
              <span>閱讀個資告知與使用條款</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-extrabold text-[#0F2B36]">3</span>
              <span>進入認養或送養表單</span>
            </li>
          </ol>
        </div>
        <Link
          to={redirectTo ? `/account/setup?redirect=${encodeURIComponent(redirectTo)}` : '/account/setup'}
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0F2B36] hover:bg-[#163D4C] text-white font-bold text-base transition-colors"
        >
          <span>註冊帳號</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export const RegisterSetupPage: React.FC = () => {
  const { registerAccount } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/notifications';
  const [name, setName] = useState('王小明');
  const [email, setEmail] = useState('you@example.com');
  const [phone, setPhone] = useState('0912-345-678');
  const [purpose, setPurpose] = useState('認養／送養／飼主追蹤');
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    registerAccount({ name, email, phone });
    showToast('帳號建立完成，已自動登入');
    navigate(redirectTo);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">姓名／暱稱 *</span>
            <div className="relative">
              <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">Email *</span>
            <div className="relative">
              <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">手機號碼 *</span>
            <div className="relative">
              <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-800">使用目的 *</span>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option>認養／送養／飼主追蹤</option>
              <option>尋找待領養毛孩</option>
              <option>個人私人送養</option>
              <option>認養後飼主照護追蹤</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <label className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 accent-[#0F2B36]"
            />
            <span className="text-sm font-semibold text-slate-800">同意隱私權政策及個資蒐集告知</span>
          </label>

          <button
            type="submit"
            disabled={!agreed}
            className="px-6 py-3 rounded-xl bg-[#0F2B36] hover:bg-[#163D4C] disabled:opacity-50 text-white font-bold text-base cursor-pointer"
          >
            完成註冊
          </button>
        </div>
      </form>

      <aside className="bg-slate-100 rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center gap-2 font-extrabold text-lg text-slate-950">
          <ShieldCheck className="h-5 w-5 text-[#0F6B5B]" />
          <span>隱私設計</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">聯絡資料不公開。</p>
        <p className="text-sm text-slate-700 leading-relaxed">
          申請書、KYC 及醫療證明需依角色授權查看。
        </p>
      </aside>
    </div>
  );
};

export const NotificationsPage: React.FC = () => {
  const { state, markNotificationRead } = usePawLink();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  const items = state.notifications.filter((n) => (filter === 'unread' ? n.unread : true));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-slate-950 flex items-center gap-2">
          <Bell className="h-6 w-6 text-[#0F2B36]" />
          <span>我的通知</span>
        </h2>
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-bold cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            全部 ({state.notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-bold cursor-pointer ${
              filter === 'unread' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            未讀 ({state.notifications.filter((n) => n.unread).length})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
              item.unread ? 'bg-amber-50/50 border-amber-300' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-extrabold text-slate-800">
                {item.category}
              </span>
              <div>
                <div className="font-bold text-slate-950 flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.unread && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold">
                      未讀
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600">
                  {item.summary} · <span className="text-slate-400">{item.createdAt}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                markNotificationRead(item.id);
                navigate(item.targetPath);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2B36] hover:bg-[#163D4C] text-white font-bold text-sm shrink-0 cursor-pointer"
            >
              <span>查看</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OrgLoginPage: React.FC = () => {
  const { loginAsOrg } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/organization';
  const [account, setAccount] = useState('organization@example.org');
  const [code, setCode] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsOrg(account);
    showToast('已登入機構管理工作台');
    navigate(redirectTo);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
      >
        <div className="flex items-center gap-2.5">
          <Building2 className="h-6 w-6 text-[#0F6B5B]" />
          <h2 className="text-2xl font-extrabold text-slate-950">合作機構登入</h2>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-bold text-slate-800">機構帳號 *</span>
          <input
            type="text"
            required
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-bold text-slate-800">密碼／雙重驗證 *</span>
          <input
            type="password"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
          />
        </label>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F6B5B] hover:bg-[#0A4D41] text-white font-bold text-base cursor-pointer"
          >
            <span>登入工作台</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <aside className="bg-[#E6F4F1] rounded-2xl border border-[#0F6B5B]/25 p-6 space-y-3">
        <h3 className="text-xl font-extrabold text-[#07382F]">權限原則</h3>
        <ul className="space-y-2 text-sm font-semibold text-[#07382F]">
          <li>• 管理員：案件指派</li>
          <li>• 審核員：KYC／送養</li>
          <li>• 回訪員：照護追蹤</li>
          <li>• 資料管理員：來源同步</li>
        </ul>
      </aside>
    </div>
  );
};
