import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, MailOpen, Send } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { usePawLink } from '../../context/PawLinkContext';

/* UI-03.14 機構通知收件匣｜案件通知集中查看 */
export const CareMessagesInboxPage: React.FC = () => {
  const { state } = usePawLink();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const messages = state.orgMessages.filter((m) => {
    if (filter === 'unread') return m.statusLabel === '未讀';
    if (filter === 'read') return m.statusLabel !== '未讀';
    return true;
  });

  const unreadCount = state.orgMessages.filter((m) => m.statusLabel === '未讀').length;
  const readCount = state.orgMessages.length - unreadCount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">我的機構通知</h2>
          <p className="text-sm text-slate-600 mt-1">顯示與本人認養／照護案件有關的訊息</p>
        </div>

        <div className="space-y-3">
          {messages.map((msg) => (
            <Link
              key={msg.id}
              to={`/care/messages/${msg.id}`}
              className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
                msg.statusLabel === '未讀'
                  ? 'bg-[#EEF4FF] border-[#1565C0]/35 hover:border-[#1565C0]'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="font-extrabold text-slate-950 text-base">{msg.subject}</div>
                <div className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  {msg.orgName} · 案件 {msg.caseId} · {msg.createdAt}
                </div>
              </div>
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-extrabold shrink-0 ${
                  msg.statusLabel === '未讀'
                    ? 'bg-[#1565C0] text-white'
                    : msg.statusLabel === '已回覆'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-slate-100 text-slate-700'
                }`}
              >
                {msg.statusLabel}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <aside className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-5 h-fit">
        <div className="space-y-3">
          <h3 className="text-xl font-extrabold text-slate-950">通知篩選</h3>
          <p className="text-xs text-slate-600">可按閱讀狀態篩選案件通知</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold border cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#EEF4FF] border-[#1565C0] text-[#0D3C78]'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              全部通知 {String(state.orgMessages.length).padStart(2, '0')}
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold border cursor-pointer ${
                filter === 'unread'
                  ? 'bg-[#EEF4FF] border-[#1565C0] text-[#0D3C78]'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              待我處理 {String(unreadCount).padStart(2, '0')}
            </button>
            <button
              type="button"
              onClick={() => setFilter('read')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold border cursor-pointer ${
                filter === 'read'
                  ? 'bg-[#EEF4FF] border-[#1565C0] text-[#0D3C78]'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              已讀／已覆 {String(readCount).padStart(2, '0')}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/care/messages/${messages[0]?.id || 'MSG-008'}`)}
          className="w-full py-3 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold text-sm cursor-pointer"
        >
          開啟通知內容
        </button>
      </aside>
    </div>
  );
};

/* UI-03.15 通知詳情與回覆｜飼主查看機構訊息 */
export const CareMessageDetailPage: React.FC = () => {
  const { msgId } = useParams();
  const { state, acknowledgeOrgMessage } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const msg = state.orgMessages.find((m) => m.id === msgId) ?? state.orgMessages[0];

  const handleAck = () => {
    acknowledgeOrgMessage(msg.id);
    showToast('已確認收到通知（已讀不等於回訪已完成，請視需要回覆）');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-950">{msg.subject}</h2>
          <p className="text-sm text-slate-600">
            發送單位：{msg.orgName} · 案件 {msg.caseId} · 已驗證機構
          </p>
        </div>

        <div className="space-y-3">
          {msg.entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-2xl border text-base ${
                entry.sender === 'org'
                  ? 'bg-[#EEF4FF] border-blue-200 text-slate-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="text-xs font-bold text-slate-500 mb-1">
                {entry.senderLabel} · {entry.timestamp}
              </div>
              <p>{entry.content}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleAck}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold text-base cursor-pointer"
          >
            {msg.acknowledged ? <CheckCircle2 className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
            <span>{msg.acknowledged ? '已確認收到 ✓' : '確認收到'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/care/messages/${msg.id}/reply`)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D47A1] hover:bg-[#093375] text-white font-bold text-base cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>回覆訊息</span>
          </button>
        </div>
      </div>

      <aside className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 h-fit">
        <h3 className="text-xl font-extrabold text-slate-950">訊息資訊</h3>
        <p className="text-xs text-slate-500">資料只對案件相關人員可見</p>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-slate-500 block text-xs">通知類型</span>
            <span className="font-bold text-slate-900">{msg.category}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">通知狀態</span>
            <span className="font-bold text-slate-900">
              {msg.deliveryStatus}・{msg.replyStatus}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">聯絡方式</span>
            <span className="font-bold text-slate-900">{msg.channel}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

/* UI-03.16 回覆機構通知｜飼主送出回覆 */
export const CareMessageReplyPage: React.FC = () => {
  const { msgId } = useParams();
  const { state, replyToOrgMessage } = usePawLink();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const msg = state.orgMessages.find((m) => m.id === msgId) ?? state.orgMessages[0];
  const [replyText, setReplyText] = useState('您好，下週二下午方便安排回訪，謝謝！');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      showToast('請輸入回覆內容', 'warning');
      return;
    }
    replyToOrgMessage(msg.id, replyText);
    showToast('已送出回覆，機構端對話紀錄已同步更新！');
    navigate('/care/messages');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
      >
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">回覆{msg.orgName}</h2>
          <p className="text-sm text-slate-600 mt-1">
            對話主旨：{msg.subject} · 案件 {msg.caseId}
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-sm font-bold text-slate-800 block">原始訊息</span>
          <div className="p-4 rounded-2xl bg-[#EEF4FF] border border-blue-200 text-sm text-slate-800">
            {msg.entries[0]?.content}
          </div>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-bold text-slate-800">我的回覆 *</span>
          <textarea
            rows={4}
            required
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
          />
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold text-base cursor-pointer"
          >
            送出回覆並返回收件匣
          </button>
        </div>
      </form>

      <aside className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 h-fit">
        <h3 className="text-xl font-extrabold text-slate-950">回覆對象</h3>
        <p className="text-xs text-slate-500">僅發送給原通知所屬機構</p>
        <div className="text-sm font-semibold text-slate-800 space-y-1">
          <p>{msg.orgName}</p>
          <p>案件：{msg.caseId}</p>
          <p>動物：{msg.petName}</p>
        </div>
        <p className="text-xs text-slate-600 pt-2 leading-relaxed">
          送出後顯示在通知對話中，並供機構管理員於 UI-04.13 確認。
        </p>
      </aside>
    </div>
  );
};
