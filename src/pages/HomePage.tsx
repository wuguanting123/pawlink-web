import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, HeartHandshake, PawPrint, ShieldCheck } from 'lucide-react';
import { useAuthGuard } from '../components/common/CommonUI';
import { usePawLink } from '../context/PawLinkContext';

export const HomePage: React.FC = () => {
  const { state } = usePawLink();
  const { requireOwner } = useAuthGuard();
  const openPetsCount = state.pets.filter((p) => p.status === '開放申請').length;
  const activeCarePet = state.carePets.find((p) => p.id === state.activeCarePetId) ?? state.carePets[0];

  return (
    <div className="space-y-6">
      {/* Left & Right Dual Entry Cards matching UI-01.00 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 01 想認養毛孩 - Orange Zone */}
        <section className="rounded-3xl bg-[#FFF3E0] border border-[#F57C00]/35 shadow-sm overflow-hidden flex flex-col">
          <div className="h-2 bg-[#F57C00]" />
          <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F57C00] text-slate-950 font-extrabold text-sm shadow-xs">
                <PawPrint className="h-4 w-4" />
                <span>01 想認養毛孩</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                我要領養
              </h2>
              <p className="text-lg text-slate-800 leading-relaxed">
                搜尋公立、民間與個人送養資訊，也可以建立自己的送養履歷。
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-[#7C2D12] font-semibold">
                <span className="px-3 py-1 rounded-lg bg-white/80 border border-[#F57C00]/30">
                  目前待領養：{state.pets.length} 隻（開放申請 {openPetsCount} 隻）
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/80 border border-[#F57C00]/30">
                  六步驟透明申請流程
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/adopt"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base shadow-sm transition-colors"
              >
                <span>探索待領養毛孩</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={() => requireOwner('/adopt/rehome')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-orange-50 text-[#92400E] border border-[#B45309]/40 font-bold text-base transition-colors cursor-pointer"
              >
                <span>＋ 我要送養</span>
              </button>
            </div>
          </div>
        </section>

        {/* 02 已是飼主 - Blue Zone */}
        <section className="rounded-3xl bg-[#EEF4FF] border border-[#1565C0]/30 shadow-sm overflow-hidden flex flex-col">
          <div className="h-2 bg-[#1565C0]" />
          <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1565C0] text-white font-extrabold text-sm shadow-xs">
                <HeartHandshake className="h-4 w-4" />
                <span>02 已是飼主</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                飼主追蹤
              </h2>
              <p className="text-lg text-slate-800 leading-relaxed">
                記錄飲食、飲水、活動與排泄；追蹤健康、Care Score 與點數。
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-[#0D3C78] font-semibold">
                <span className="px-3 py-1 rounded-lg bg-white/85 border border-[#1565C0]/25">
                  示範毛孩：{activeCarePet?.name} · Care Score {activeCarePet?.careScore}/100
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/85 border border-[#1565C0]/25">
                  Care Points：{state.carePoints} 點
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => requireOwner('/care/dashboard')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold text-base shadow-sm transition-colors cursor-pointer"
              >
                <span>進入照護追蹤</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => requireOwner('/care/messages')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-[#0D3C78] border border-[#1565C0]/35 font-bold text-base transition-colors cursor-pointer"
              >
                <span>機構通知 ({state.orgMessages.filter((m) => m.statusLabel === '未讀').length})</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Demo Walkthrough Guide Strip */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              目前測試角色：
              {state.role === 'guest'
                ? '未登入訪客（瀏覽待領養免登入）'
                : state.role === 'owner'
                  ? `一般飼主｜${state.currentUser.maskedName}`
                  : `機構管理員｜${state.currentUser.orgName}（${state.orgSubRole}）`}
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              可使用上方「Demo 角色切換」工具列一鍵切換身分，或透過頁尾「動物之家／機構登入」體驗完整審查與通知流程。
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            to="/design-system"
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold transition-colors"
          >
            UI-00.01 設計系統
          </Link>
          <Link
            to="/ui-flow/notification"
            className="px-4 py-2 rounded-lg bg-[#0F6B5B] hover:bg-[#0A4D41] text-white text-sm font-bold transition-colors"
          >
            UI-90.03 通知流程
          </Link>
          <Link
            to="/overview"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors"
          >
            UI-00.00 畫面總覽
          </Link>
        </div>
      </section>
    </div>
  );
};
