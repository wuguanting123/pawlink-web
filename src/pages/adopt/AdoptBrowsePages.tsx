import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Bookmark,
  ChevronRight,
  ClipboardList,
  Heart,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import { PetIllustration, useAuthGuard } from '../../components/common/CommonUI';
import { useToast } from '../../components/common/ToastContext';
import { usePawLink } from '../../context/PawLinkContext';

/* UI-02.01 領養專區｜搜尋結果與私人送養入口 */
export const AdoptListPage: React.FC = () => {
  const { state } = usePawLink();
  const { requireOwner } = useAuthGuard();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [city, setCity] = useState('全臺');
  const [species, setSpecies] = useState('不限');

  const filteredPets = useMemo(() => {
    return state.pets.filter((p) => {
      if (city !== '全臺' && p.city !== city) return false;
      if (species !== '不限' && p.species !== species) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${p.name} ${p.id} ${p.city} ${p.breed} ${p.shelterName} ${p.sourceType}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [state.pets, city, species, query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredPets.length === 0) {
      navigate('/adopt/search?empty');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">尋找適合你的毛孩</h2>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/adopt/favorites"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFF3E0] hover:bg-orange-100 text-[#7C2D12] border border-[#F57C00]/35 font-bold text-sm"
            >
              <Bookmark className="h-4 w-4" />
              <span>我的收藏 ({state.favoritePetIds.length})</span>
            </Link>
            <Link
              to="/adopt/applications"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
            >
              <ClipboardList className="h-4 w-4" />
              <span>我的認養案件</span>
            </Link>
            <button
              type="button"
              onClick={() => requireOwner('/adopt/rehome')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-extrabold text-sm shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>我要送養</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-5 w-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="名稱、編號、收容所或地區（例如：小福、A-0001、臺北市）"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-base focus:outline-none focus:ring-2 focus:ring-[#F57C00]"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base cursor-pointer shrink-0"
            >
              搜尋
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              aria-label="篩選地區"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-800 cursor-pointer"
            >
              <option value="全臺">地區：全臺</option>
              <option value="臺北市">地區：臺北市</option>
              <option value="新北市">地區：新北市</option>
              <option value="桃園市">地區：桃園市</option>
            </select>

            <select
              aria-label="篩選種類"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-800 cursor-pointer"
            >
              <option value="不限">種類：不限</option>
              <option value="犬">種類：犬</option>
              <option value="貓">種類：貓</option>
            </select>

            <Link
              to="/adopt/search"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm font-bold text-slate-800"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>更多條件／地圖檢視</span>
            </Link>
          </div>
        </form>
      </div>

      {/* Results Grid */}
      {filteredPets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <p className="text-xl font-bold text-slate-900">目前找不到符合條件的毛孩</p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCity('全臺');
                setSpecies('不限');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#B45309] text-white font-bold text-sm cursor-pointer"
            >
              重設條件
            </button>
            <Link
              to="/adopt/search?empty"
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm"
            >
              前往無結果引導頁 (UI-02.05)
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <article
              key={pet.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
            >
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-28 shrink-0">
                    <PetIllustration species={pet.species} name={pet.name} sizeClass="h-28" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-extrabold text-slate-950">{pet.name}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-[#FFF3E0] text-[#7C2D12] border border-[#F57C00]/30 text-xs font-bold">
                        {pet.id}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      {pet.breed}｜{pet.gender}｜{pet.ageText}
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#B45309]" />
                      <span>
                        {pet.city} · {pet.sourceType}
                      </span>
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      {pet.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                  資料來源：{pet.sourceLabel} · {pet.updatedAt}
                </p>
              </div>

              <Link
                to={`/adopt/pet/${pet.id}`}
                className="inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-sm transition-colors"
              >
                <span>查看寵物履歷</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

/* UI-02.02 & UI-02.05 進階篩選｜列表、地圖與無結果狀態 */
export const AdoptSearchPage: React.FC = () => {
  const { state } = usePawLink();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const forceEmpty = searchParams.has('empty');
  const [city, setCity] = useState(forceEmpty ? '臺北市' : '全部');
  const [species, setSpecies] = useState(forceEmpty ? '犬' : '全部');
  const [ageGroup, setAgeGroup] = useState('全部');
  const [size, setSize] = useState('全部');
  const [neutered, setNeutered] = useState(forceEmpty ? '已結紮' : '不限');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPetId, setSelectedPetId] = useState<string>(state.pets[0]?.id || 'A-0001');

  const results = useMemo(() => {
    if (forceEmpty) return [];
    return state.pets.filter((p) => {
      if (city !== '全部' && p.city !== city) return false;
      if (species !== '全部' && p.species !== species) return false;
      if (ageGroup !== '全部' && p.ageGroup !== ageGroup) return false;
      if (size !== '全部' && p.size !== size) return false;
      if (neutered !== '不限' && p.neutered !== neutered) return false;
      return true;
    });
  }, [state.pets, city, species, ageGroup, size, neutered, forceEmpty]);

  const handleReset = () => {
    setCity('全部');
    setSpecies('全部');
    setAgeGroup('全部');
    setSize('全部');
    setNeutered('不限');
    if (forceEmpty) setSearchParams({});
  };

  // UI-02.05 Empty state
  if (results.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-100 rounded-3xl border border-slate-200 p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            目前找不到符合條件的毛孩
          </h2>
          <p className="text-base text-slate-700 max-w-md">
            試著放寬年齡、地區、體型等條件，或查看其他來源的動物。
          </p>
          <div className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-extrabold text-[#B45309] shadow-xs">
            目前篩選：{species === '全部' ? '不限' : species}／{city}／{neutered}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-7 py-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base shadow-sm cursor-pointer"
          >
            調整篩選條件
          </button>
        </div>

        <aside className="bg-[#FFF3E0] rounded-3xl border border-[#F57C00]/35 p-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-[#7C2D12]">你也可以</h3>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCity('全部');
                    setSearchParams({});
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 border border-[#F57C00]/30 font-bold text-sm text-slate-900 cursor-pointer"
                >
                  • 查看鄰近縣市（放寬地區）
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setNeutered('不限');
                    setSearchParams({});
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 border border-[#F57C00]/30 font-bold text-sm text-slate-900 cursor-pointer"
                >
                  • 取消「已結紮」限制
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 border border-[#F57C00]/30 font-bold text-sm text-slate-900 cursor-pointer"
                >
                  • 回到全部待領養列表
                </button>
              </li>
            </ul>
          </div>

          <Link
            to="/adopt"
            className="inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-sm"
          >
            <span>返回領養專區</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Filters */}
      <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
        <h2 className="text-xl font-extrabold text-slate-950">篩選條件</h2>
        <div className="space-y-3 text-sm">
          <label className="block space-y-1">
            <span className="font-bold text-slate-700">縣市</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
            >
              <option value="全部">全部縣市</option>
              <option value="臺北市">臺北市</option>
              <option value="新北市">新北市</option>
              <option value="桃園市">桃園市</option>
              <option value="臺中市">臺中市（示範無結果）</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-bold text-slate-700">種類</span>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
            >
              <option value="全部">不限</option>
              <option value="犬">犬</option>
              <option value="貓">貓</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-bold text-slate-700">年齡</span>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
            >
              <option value="全部">幼齡／成齡／高齡</option>
              <option value="幼齡">幼齡</option>
              <option value="成齡">成齡</option>
              <option value="高齡">高齡</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-bold text-slate-700">體型</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
            >
              <option value="全部">小／中／大型</option>
              <option value="小">小型</option>
              <option value="中">中型</option>
              <option value="大">大型</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-bold text-slate-700">結紮狀態</span>
            <select
              value={neutered}
              onChange={(e) => setNeutered(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
            >
              <option value="不限">不限</option>
              <option value="已結紮">已結紮</option>
              <option value="待確認">待確認</option>
            </select>
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-sm text-slate-800 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>重設</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/adopt/search?empty')}
            className="flex-1 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-sm cursor-pointer"
          >
            測試無結果
          </button>
        </div>
      </aside>

      {/* Center Results List */}
      <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-sm font-extrabold cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#FFF3E0] text-[#7C2D12] border border-[#F57C00]/40'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            列表 {results.length} 筆
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl text-sm font-extrabold cursor-pointer ${
              viewMode === 'map'
                ? 'bg-[#FFF3E0] text-[#7C2D12] border border-[#F57C00]/40'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            地圖檢視
          </button>
        </div>

        <div className="space-y-3">
          {results.map((pet, idx) => {
            const isSelected = pet.id === selectedPetId;
            return (
              <div
                key={pet.id}
                onMouseEnter={() => setSelectedPetId(pet.id)}
                className={`flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-[#F57C00] bg-orange-50/40 shadow-xs'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#B45309] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-extrabold text-slate-950 text-base">{pet.name}</div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      {pet.city}｜{pet.sourceType}｜{pet.breed}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/adopt/pet/${pet.id}`}
                  className="px-4 py-2 rounded-xl bg-[#FFF3E0] hover:bg-orange-200/70 text-[#7C2D12] font-bold text-sm shrink-0"
                >
                  查看
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right Interactive Map View */}
      <section className="lg:col-span-4 bg-[#FFF3E0] rounded-2xl border border-[#F57C00]/35 p-5 shadow-sm flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-950">地圖檢視</h3>
          <span className="text-xs font-bold text-[#7C2D12] bg-white/80 px-2.5 py-1 rounded-full">
            點擊標記切換
          </span>
        </div>

        <div className="relative h-64 rounded-2xl bg-gradient-to-br from-orange-100 via-amber-50 to-emerald-50 border border-orange-200 overflow-hidden">
          <svg viewBox="0 0 200 160" className="w-full h-full opacity-55" aria-hidden="true">
            <path d="M20,30 Q80,15 160,40 T180,130 Q100,150 30,120 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="0" y1="60" x2="200" y2="60" stroke="#CBD5E1" strokeDasharray="4 4" />
            <line x1="100" y1="0" x2="100" y2="160" stroke="#CBD5E1" strokeDasharray="4 4" />
          </svg>
          {results.map((pet, idx) => {
            const active = pet.id === selectedPetId;
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => setSelectedPetId(pet.id)}
                style={{ left: `${pet.mapCoords.x}%`, top: `${pet.mapCoords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full font-extrabold text-sm shadow-md transition-transform cursor-pointer ${
                  active
                    ? 'bg-[#B45309] text-white scale-125 ring-4 ring-[#F57C00]/40'
                    : 'bg-white text-[#7C2D12] border-2 border-[#B45309] hover:scale-110'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {(() => {
          const activePet = results.find((p) => p.id === selectedPetId) ?? results[0];
          return (
            <div className="bg-white rounded-xl p-3.5 border border-orange-200 flex items-center justify-between gap-3">
              <div>
                <div className="font-extrabold text-slate-950">{activePet.name}（{activePet.id}）</div>
                <div className="text-xs text-slate-600">{activePet.city} · {activePet.shelterName}</div>
              </div>
              <Link
                to={`/adopt/pet/${activePet.id}`}
                className="px-3.5 py-2 rounded-lg bg-[#B45309] text-white text-xs font-bold shrink-0"
              >
                看履歷
              </Link>
            </div>
          );
        })()}
        <p className="text-center text-xs font-semibold text-slate-600">地圖為視覺示意（僅顯示概略行政區）</p>
      </section>
    </div>
  );
};

/* UI-02.03 動物履歷｜統一欄位與可信狀態 */
export const PetDetailPage: React.FC = () => {
  const { petId } = useParams();
  const { state, toggleFavorite } = usePawLink();
  const { requireOwner } = useAuthGuard();
  const { showToast } = useToast();

  const pet = state.pets.find((p) => p.id === petId) ?? state.pets[0];
  const isFav = state.favoritePetIds.includes(pet.id);

  const handleToggleFavorite = () => {
    requireOwner(`/adopt/pet/${pet.id}`, () => {
      toggleFavorite(pet.id);
      showToast(isFav ? `已將 ${pet.name} 移出收藏` : `已將 ${pet.name} 加入我的收藏`);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Photo & Source Card */}
      <div className="lg:col-span-5 bg-[#FFF3E0] rounded-3xl border border-[#F57C00]/35 p-6 flex flex-col justify-between gap-5">
        <PetIllustration species={pet.species} name={pet.name} sizeClass="h-64" />
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#F57C00] text-slate-950 font-extrabold text-sm shadow-xs">
            來源｜{pet.sourceLabel}
          </div>
          <p className="text-sm font-medium text-slate-700">更新：{pet.updatedAt}</p>
        </div>
      </div>

      {/* Right Unified Attribute Table */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between gap-6">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <h2 className="text-3xl font-extrabold text-slate-950">{pet.name}</h2>
            <span className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 font-extrabold text-sm text-slate-800">
              編號 {pet.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm sm:text-base">
            <div>
              <span className="text-slate-500 font-semibold block text-xs">種類／品種</span>
              <span className="font-bold text-slate-900">
                {pet.species}｜{pet.breed}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-xs">性別／估齡</span>
              <span className="font-bold text-slate-900">
                {pet.gender}｜{pet.ageText}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-xs">體型／毛色</span>
              <span className="font-bold text-slate-900">
                {pet.size}型｜{pet.color}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-xs">結紮</span>
              <span className="font-bold text-slate-900">{pet.neutered}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-xs">疫苗</span>
              <span className="font-bold text-slate-900">{pet.vaccinated}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-xs">晶片狀態</span>
              <span className="font-bold text-slate-900">{pet.microchip}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-xs">收容日期</span>
              <span className="font-bold text-slate-900">{pet.intakeDate}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-xs">所在地區</span>
              <span className="font-bold text-slate-900">
                {pet.city} {pet.district || ''}
              </span>
            </div>
          </div>

          {(pet.personality || pet.specialNeeds) && (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-1.5 text-sm">
              {pet.personality && (
                <p>
                  <strong className="text-slate-900">性格描述：</strong>
                  <span className="text-slate-700">{pet.personality}</span>
                </p>
              )}
              {pet.specialNeeds && (
                <p>
                  <strong className="text-slate-900">照護提醒：</strong>
                  <span className="text-slate-700">{pet.specialNeeds}</span>
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-amber-50/60 border border-amber-200 px-3.5 py-2.5 rounded-xl">
            <ShieldAlert className="h-4 w-4 text-[#B45309] shrink-0" />
            <span>依隱私原則：電話、完整地址、身分資料與晶片號碼不公開。</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => requireOwner(`/adopt/apply/${pet.id}`)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-base shadow-sm cursor-pointer"
          >
            <span>我要認養{pet.name}</span>
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`sm:w-48 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border-2 font-bold text-base transition-colors cursor-pointer ${
              isFav
                ? 'bg-[#FFF3E0] border-[#B45309] text-[#7C2D12]'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-[#B45309] text-[#B45309]' : ''}`} />
            <span>{isFav ? '已加入收藏' : '加入收藏'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* UI-02.04 我的收藏｜比較與回到寵物履歷 */
export const FavoritesPage: React.FC = () => {
  const { state, toggleFavorite } = usePawLink();
  const { showToast } = useToast();

  const favoritePets = state.pets.filter((p) => state.favoritePetIds.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-slate-950">已收藏的毛孩 ({favoritePets.length})</h2>
        <Link
          to="/adopt"
          className="px-4 py-2 rounded-xl bg-[#FFF3E0] text-[#7C2D12] border border-[#F57C00]/35 font-bold text-sm"
        >
          繼續探索待領養
        </Link>
      </div>

      {favoritePets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4">
          <p className="text-lg font-bold text-slate-800">尚未收藏任何毛孩</p>
          <Link
            to="/adopt"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B45309] text-white font-bold text-sm"
          >
            前往領養專區瀏覽
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favoritePets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <PetIllustration species={pet.species} name={pet.name} sizeClass="h-32" />
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-extrabold text-slate-950">{pet.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-[#FFF3E0] text-[#7C2D12] border border-[#F57C00]/30 text-xs font-extrabold">
                    {pet.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-semibold">
                  {pet.species}｜{pet.city}｜{pet.sourceType}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/adopt/pet/${pet.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-sm"
                >
                  <span>查看履歷</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    toggleFavorite(pet.id);
                    showToast(`已移除收藏：${pet.name}`, 'info');
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  移除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
