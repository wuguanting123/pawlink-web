import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ImagePlus, UploadCloud } from 'lucide-react';
import { usePawLink } from '../../context/PawLinkContext';
import { useToast } from './ToastContext';

export function useAuthGuard() {
  const { state } = usePawLink();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const requireOwner = (targetPath: string, action?: () => void) => {
    if (state.role === 'guest') {
      showToast('此操作需先登入會員，已為您導向登入畫面', 'warning');
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
      return false;
    }
    if (action) {
      action();
    } else {
      navigate(targetPath);
    }
    return true;
  };

  return { isGuest: state.role === 'guest', isOrg: state.role === 'org', requireOwner };
}

export const PetIllustration: React.FC<{
  species: '犬' | '貓';
  name: string;
  sizeClass?: string;
}> = ({ species, name, sizeClass = 'h-36' }) => {
  const isDog = species === '犬';
  const palette =
    name.includes('小福') || name.includes('阿福')
      ? { bg: 'bg-amber-50', accent: '#E09F5A', body: '#F7E7CE' }
      : name.includes('米米')
        ? { bg: 'bg-orange-50', accent: '#D97706', body: '#FDE68A' }
        : { bg: 'bg-yellow-50', accent: '#B45309', body: '#F3D299' };

  return (
    <div
      className={`w-full ${sizeClass} rounded-2xl ${palette.bg} border border-amber-200/80 flex flex-col items-center justify-center relative overflow-hidden`}
    >
      <svg viewBox="0 0 120 90" className="w-24 h-20 drop-shadow-xs" aria-hidden="true">
        {isDog ? (
          <g>
            <ellipse cx="32" cy="36" rx="11" ry="18" fill={palette.accent} transform="rotate(-18 32 36)" />
            <ellipse cx="88" cy="36" rx="11" ry="18" fill={palette.accent} transform="rotate(18 88 36)" />
            <circle cx="60" cy="46" r="26" fill={palette.body} stroke="#78350F" strokeWidth="2.5" />
            <circle cx="50" cy="42" r="3.5" fill="#1E293B" />
            <circle cx="70" cy="42" r="3.5" fill="#1E293B" />
            <ellipse cx="60" cy="52" rx="5.5" ry="4" fill="#451A03" />
            <path d="M53 59 Q60 65 67 59" fill="none" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <polygon points="34,40 38,16 54,30" fill={palette.accent} stroke="#78350F" strokeWidth="2.5" />
            <polygon points="86,40 82,16 66,30" fill={palette.accent} stroke="#78350F" strokeWidth="2.5" />
            <circle cx="60" cy="48" r="24" fill={palette.body} stroke="#78350F" strokeWidth="2.5" />
            <circle cx="50" cy="45" r="3.5" fill="#1E293B" />
            <circle cx="70" cy="45" r="3.5" fill="#1E293B" />
            <polygon points="57,52 63,52 60,56" fill="#EC4899" />
            <path d="M35 48 L45 49 M35 54 L45 53 M85 48 L75 49 M85 54 L75 53" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </svg>
      <span className="text-xs font-bold text-amber-900/80 mt-0.5">
        {name} · 照片示意
      </span>
    </div>
  );
};

export const SimulatedUpload: React.FC<{
  label: string;
  uploadedCount: number;
  maxSlots?: number;
  onUpload: () => void;
  accentColor?: 'orange' | 'blue' | 'teal';
}> = ({ label, uploadedCount, maxSlots = 3, onUpload, accentColor = 'orange' }) => {
  const btnStyle =
    accentColor === 'blue'
      ? 'bg-[#EEF4FF] hover:bg-blue-100 border-[#1565C0]/35 text-[#0D3C78]'
      : accentColor === 'teal'
        ? 'bg-[#E6F4F1] hover:bg-emerald-100 border-[#0F6B5B]/35 text-[#07382F]'
        : 'bg-[#FFF3E0] hover:bg-orange-100 border-[#F57C00]/40 text-[#7C2D12]';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: maxSlots }).map((_, idx) => {
          const filled = idx < uploadedCount;
          return (
            <button
              key={idx}
              type="button"
              onClick={onUpload}
              className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 text-sm font-bold transition-all cursor-pointer ${
                filled
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                  : `${btnStyle}`
              }`}
            >
              {filled ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>已上傳 #{idx + 1}</span>
                </>
              ) : (
                <>
                  <ImagePlus className="h-5 w-5" />
                  <span>+ 上傳</span>
                </>
              )}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onUpload}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-colors cursor-pointer ${btnStyle}`}
      >
        <UploadCloud className="h-4 w-4" />
        <span>{label}（目前 {uploadedCount} 份）</span>
      </button>
    </div>
  );
};

export const StepIndicator: React.FC<{
  steps: { num: number; label: string; to?: string }[];
  activeNum: number;
  variant?: 'adopt' | 'rehome';
}> = ({ steps, activeNum, variant = 'adopt' }) => {
  const navigate = useNavigate();
  const activeStyle =
    variant === 'rehome'
      ? 'bg-[#F57C00] text-slate-950 border-[#B45309] shadow-sm'
      : 'bg-[#B45309] text-white border-[#92400E] shadow-sm';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {steps.map((s) => {
        const isActive = s.num === activeNum;
        const isDone = s.num < activeNum;
        return (
          <button
            key={s.num}
            type="button"
            onClick={() => s.to && navigate(s.to)}
            className={`px-3 py-2.5 rounded-xl border text-sm font-bold transition-all text-center cursor-pointer ${
              isActive
                ? activeStyle
                : isDone
                  ? 'bg-orange-100 text-[#7C2D12] border-orange-300'
                  : 'bg-[#FFF3E0]/70 text-slate-800 border-orange-200 hover:bg-[#FFF3E0]'
            }`}
          >
            {s.num} {s.label}
          </button>
        );
      })}
    </div>
  );
};
