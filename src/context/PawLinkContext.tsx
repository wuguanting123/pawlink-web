import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_STATE, PawLinkState } from '../data/mockData';
import {
  AdoptablePet,
  AdoptionApplication,
  DailyCareLog,
  MedicalRecord,
  OrgSubRole,
  RehomeCase,
  UserRole,
} from '../types/pawlink';

const STORAGE_KEY = 'pawlink_prototype_state_v1';

interface PawLinkContextValue {
  state: PawLinkState;
  switchRole: (role: UserRole) => void;
  setOrgSubRole: (subRole: OrgSubRole) => void;
  loginAsOwner: (email?: string) => void;
  registerAccount: (payload: { name: string; email: string; phone: string }) => void;
  loginAsOrg: (account?: string) => void;
  logout: () => void;
  toggleFavorite: (petId: string) => void;
  updateApplication: (petId: string, patch: Partial<AdoptionApplication>) => void;
  reviewAdoptionCase: (
    caseId: string,
    decision: 'approved' | 'pending_supplement' | 'rejected',
    reason: string,
  ) => void;
  updateRehomeDraft: (patch: Partial<RehomeCase>) => void;
  submitRehomeDraft: (asDraft?: boolean) => string;
  resubmitRehomeCase: (caseId: string) => void;
  updateRehomeCaseStatus: (caseId: string, status: RehomeCase['status']) => void;
  reviewRehomeCase: (
    caseId: string,
    decision: '已刊登' | '待補件',
    note: string,
  ) => void;
  setActiveCarePet: (petId: string) => void;
  submitDailyCareLog: (log: Omit<DailyCareLog, 'id' | 'updatedAt'>) => {
    duplicateDetected: boolean;
    pointsAwarded: number;
  };
  addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'dayBadge' | 'verification'>) => void;
  resolveCareAlert: (alertId: string) => void;
  bindCarePet: (caseCode: string, name: string, species: '犬' | '貓') => void;
  selectReward: (rewardId: string) => void;
  redeemSelectedReward: () => { ok: boolean; redeemId?: string; message?: string };
  markNotificationRead: (notifId: string) => void;
  acknowledgeOrgMessage: (msgId: string) => void;
  replyToOrgMessage: (msgId: string, replyText: string) => void;
  orgReplyMessage: (msgId: string, replyText: string) => void;
  resolveOrgMessageThread: (msgId: string) => void;
  setMessageDraft: (draft: PawLinkState['messageDraft']) => void;
  confirmSendOrgMessage: () => string | null;
  saveFollowUpResult: (
    caseId: string,
    method: '電話' | '現場',
    result: '待回訪' | '需追蹤' | '正常結案' | '待確認',
    note: string,
  ) => void;
  triggerSyncSource: (sourceId: string) => void;
  resetDemoState: () => void;
}

const PawLinkContext = createContext<PawLinkContextValue | null>(null);

function loadState(): PawLinkState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<PawLinkState>;
    return {
      ...INITIAL_STATE,
      ...parsed,
      currentUser: { ...INITIAL_STATE.currentUser, ...parsed.currentUser },
    };
  } catch {
    return INITIAL_STATE;
  }
}

function nowTimeStr(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${mm}/${dd} ${hh}:${min}`;
}

export const PawLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PawLinkState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors in prototype mode
    }
  }, [state]);

  const switchRole = (role: UserRole) => {
    setState((prev) => ({ ...prev, role }));
  };

  const setOrgSubRole = (orgSubRole: OrgSubRole) => {
    setState((prev) => ({ ...prev, orgSubRole }));
  };

  const loginAsOwner = (email?: string) => {
    setState((prev) => ({
      ...prev,
      role: 'owner',
      currentUser: {
        ...prev.currentUser,
        email: email?.trim() || prev.currentUser.email,
      },
    }));
  };

  const registerAccount = (payload: { name: string; email: string; phone: string }) => {
    const rawName = payload.name.trim() || '王小明';
    const maskedName =
      rawName.length >= 2 ? `${rawName[0]}○${rawName.slice(-1)}` : `${rawName}○`;
    setState((prev) => ({
      ...prev,
      role: 'owner',
      currentUser: {
        ...prev.currentUser,
        name: rawName,
        maskedName,
        email: payload.email.trim() || prev.currentUser.email,
        phone: payload.phone.trim() || prev.currentUser.phone,
      },
    }));
  };

  const loginAsOrg = () => {
    setState((prev) => ({
      ...prev,
      role: 'org',
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          timestamp: `2026/${nowTimeStr()}`,
          actor: prev.orgSubRole,
          role: prev.orgSubRole,
          action: '登入機構管理工作台（雙重驗證通過）',
          target: prev.currentUser.orgName,
        },
        ...prev.auditLogs,
      ],
    }));
  };

  const logout = () => {
    setState((prev) => ({ ...prev, role: 'guest' }));
  };

  const toggleFavorite = (petId: string) => {
    setState((prev) => {
      const exists = prev.favoritePetIds.includes(petId);
      return {
        ...prev,
        favoritePetIds: exists
          ? prev.favoritePetIds.filter((id) => id !== petId)
          : [...prev.favoritePetIds, petId],
      };
    });
  };

  const updateApplication = (petId: string, patch: Partial<AdoptionApplication>) => {
    setState((prev) => {
      const targetPet = prev.pets.find((p) => p.id === petId);
      const exists = prev.applications.some((a) => a.petId === petId || a.caseId === petId);
      if (!exists && targetPet) {
        const created: AdoptionApplication = {
          caseId: targetPet.id,
          petId: targetPet.id,
          petName: targetPet.name,
          applicantName: prev.currentUser.maskedName,
          applicantPhone: '09xx-xxx-xxx',
          currentStep: 2,
          status: 'reviewing',
          statusLabel: '申請填寫中',
          statusNote: '已開始填寫認養意願與資格',
          contactMethod: 'Email',
          contactTime: '平日晚上',
          intentSummary: '',
          kycBirthAge: '成年申請人',
          kycDocUploaded: false,
          kycConfirmed: false,
          housingType: '公寓',
          canKeepPets: '是',
          householdConsensus: '已取得家庭共識',
          careSchedule: '每日早晚照顧',
          envPhotoCount: 0,
          educationCompleted: false,
          educationGuideRead: false,
          appointmentDate: '2026/12/05 下午',
          appointmentLocation: targetPet.shelterName,
          contractSigned: false,
          handoverChecklist: {
            contractDone: false,
            chipDone: false,
            neuterDone: false,
            careActivated: false,
          },
          ...patch,
        };
        return {
          ...prev,
          applications: [created, ...prev.applications],
        };
      }

      return {
        ...prev,
        applications: prev.applications.map((app) =>
          app.petId === petId || app.caseId === petId ? { ...app, ...patch } : app,
        ),
      };
    });
  };

  const reviewAdoptionCase = (
    caseId: string,
    decision: 'approved' | 'pending_supplement' | 'rejected',
    reason: string,
  ) => {
    const labelMap = {
      approved: '核准通過',
      pending_supplement: '待補件',
      rejected: '已退回',
    } as const;

    setState((prev) => {
      const target = prev.applications.find((a) => a.caseId === caseId);
      return {
        ...prev,
        applications: prev.applications.map((app) =>
          app.caseId === caseId
            ? {
                ...app,
                status: decision,
                statusLabel: labelMap[decision],
                statusNote: reason || labelMap[decision],
                reviewReason: reason,
                reviewedBy: prev.orgSubRole,
                reviewedAt: `2026/${nowTimeStr()}`,
                currentStep: decision === 'approved' ? 5 : app.currentStep,
              }
            : app,
        ),
        notifications: [
          {
            id: `notif-${Date.now()}`,
            category: '領養',
            title: `${caseId} ${target?.petName ?? ''} 認養審查結果：${labelMap[decision]}`,
            summary: reason || '請至認養案件查看最新進度',
            targetPath: '/adopt/applications',
            unread: true,
            createdAt: `今天 ${nowTimeStr().split(' ')[1]}`,
          },
          ...prev.notifications,
        ],
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            timestamp: `2026/${nowTimeStr()}`,
            actor: prev.orgSubRole,
            role: prev.orgSubRole,
            action: `認養 KYC 審核：${labelMap[decision]}（${reason || '無補充'}）`,
            target: `案件 ${caseId}`,
          },
          ...prev.auditLogs,
        ],
      };
    });
  };

  const updateRehomeDraft = (patch: Partial<RehomeCase>) => {
    setState((prev) => ({
      ...prev,
      rehomeDraft: { ...prev.rehomeDraft, ...patch },
    }));
  };

  const submitRehomeDraft = (asDraft = false): string => {
    const newId = `P-${String(Math.floor(1000 + Math.random() * 8999))}`;
    setState((prev) => {
      const d = prev.rehomeDraft;
      const newCase: RehomeCase = {
        caseId: newId,
        petName: d.petName || '未命名毛孩',
        species: d.species || '犬',
        breed: d.breed || '混種',
        gender: d.gender || '未知',
        ageText: d.ageText || '未知',
        size: d.size || '中',
        city: d.city || '新北市',
        district: d.district || '板橋區',
        neutered: d.neutered || '未知',
        vaccinated: d.vaccinated || '未知',
        microchip: d.microchip || '未知',
        healthStatus: d.healthStatus || '待確認',
        specialNeeds: d.specialNeeds || '無特殊說明',
        personality: d.personality || ['親人'],
        photoCount: d.photoCount ?? 1,
        photoAuthorized: Boolean(d.photoAuthorized),
        contactPrivate: d.contactPrivate || prev.currentUser.phone,
        publicRegion: d.publicRegion || `${d.city || '新北市'}${d.district || ''}`,
        status: asDraft ? '草稿' : '審核中',
        reviewNote: asDraft ? '已暫存草稿，待正式送審' : '平台審查照片與基本欄位中',
        inquiryCount: 0,
        updatedAt: `2026/${nowTimeStr()}`,
        checklist: {
          basicFields: '已檢查',
          photosAuth: (d.photoCount ?? 0) >= 1 && d.photoAuthorized ? '已通過' : '需補件',
          medicalInfo: '待確認',
          privacyRules: '符合隱私規則',
        },
      };
      return {
        ...prev,
        rehomeCases: [newCase, ...prev.rehomeCases],
      };
    });
    return newId;
  };

  const resubmitRehomeCase = (caseId: string) => {
    setState((prev) => ({
      ...prev,
      rehomeCases: prev.rehomeCases.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: '審核中',
              photoCount: Math.max(c.photoCount, 3),
              photoAuthorized: true,
              reviewNote: '已補齊清晰照片，重新進入平台審核',
              updatedAt: `2026/${nowTimeStr()}`,
              checklist: { ...c.checklist, photosAuth: '已通過' },
            }
          : c,
      ),
    }));
  };

  const updateRehomeCaseStatus = (caseId: string, status: RehomeCase['status']) => {
    setState((prev) => ({
      ...prev,
      rehomeCases: prev.rehomeCases.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status,
              reviewNote: status === '已送養' ? '已標記送養並關閉刊登' : c.reviewNote,
              updatedAt: `2026/${nowTimeStr()}`,
            }
          : c,
      ),
    }));
  };

  const reviewRehomeCase = (caseId: string, decision: '已刊登' | '待補件', note: string) => {
    setState((prev) => {
      const target = prev.rehomeCases.find((c) => c.caseId === caseId);
      let updatedPets = prev.pets;
      if (decision === '已刊登' && target && !prev.pets.some((p) => p.id === target.caseId)) {
        const publishedPet: AdoptablePet = {
          id: target.caseId,
          name: target.petName,
          species: target.species,
          breed: target.breed,
          gender: target.gender,
          ageText: target.ageText,
          ageGroup: '成齡',
          size: target.size,
          color: '依照片示意',
          city: target.city,
          district: target.district,
          sourceType: '個人',
          sourceLabel: '私人送養（平台審核通過）',
          shelterName: '個人送養者（權限保護）',
          neutered:
            target.neutered === '已'
              ? '已結紮'
              : target.neutered === '未'
                ? '未結紮'
                : '待確認',
          vaccinated: target.vaccinated === '已' ? '已完成疫苗' : '待確認',
          microchip: target.microchip === '有' ? '已植入（不公開號碼）' : '待確認',
          intakeDate: `2026/${nowTimeStr().split(' ')[0]}`,
          updatedAt: `機構審核公開（2026/${nowTimeStr()}）`,
          status: '開放申請',
          personality: target.personality.join('、'),
          specialNeeds: target.specialNeeds,
          mapCoords: { x: 54, y: 45 },
        };
        updatedPets = [publishedPet, ...prev.pets];
      }

      return {
        ...prev,
        pets: updatedPets,
        rehomeCases: prev.rehomeCases.map((c) =>
          c.caseId === caseId
            ? {
                ...c,
                status: decision,
                reviewNote:
                  note || (decision === '已刊登' ? '已公開於領養專區' : '退回補件'),
                updatedAt: `2026/${nowTimeStr()}`,
                checklist: {
                  ...c.checklist,
                  photosAuth: decision === '已刊登' ? '已通過' : '需補件',
                },
              }
            : c,
        ),
        notifications: [
          {
            id: `notif-${Date.now()}`,
            category: '送養',
            title: `${caseId} ${target?.petName ?? ''} 審查結果：${decision}`,
            summary: note || (decision === '已刊登' ? '已正式公開於領養專區' : '請依備註補件'),
            targetPath: '/adopt/rehome/cases',
            unread: true,
            createdAt: `今天 ${nowTimeStr().split(' ')[1]}`,
          },
          ...prev.notifications,
        ],
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            timestamp: `2026/${nowTimeStr()}`,
            actor: prev.orgSubRole,
            role: prev.orgSubRole,
            action: `私人送養審查：${decision}`,
            target: `案件 ${caseId} / ${target?.petName ?? ''}`,
          },
          ...prev.auditLogs,
        ],
      };
    });
  };

  const setActiveCarePet = (petId: string) => {
    setState((prev) => ({ ...prev, activeCarePetId: petId }));
  };

  const submitDailyCareLog = (
    log: Omit<DailyCareLog, 'id' | 'updatedAt'>,
  ): { duplicateDetected: boolean; pointsAwarded: number } => {
    const prevDay = state.dailyLogs.find(
      (l) => l.petId === log.petId && l.date !== log.date && l.diet && l.water && l.activity && l.excretion,
    );
    const duplicateDetected =
      Boolean(prevDay) &&
      prevDay?.diet.trim() === log.diet.trim() &&
      prevDay?.water.trim() === log.water.trim() &&
      prevDay?.activity.trim() === log.activity.trim() &&
      prevDay?.excretion.trim() === log.excretion.trim();

    const isComplete = Boolean(
      log.diet.trim() && log.water.trim() && log.activity.trim() && log.excretion.trim(),
    );
    const pointsAwarded = isComplete ? 5 : 0;

    setState((prev) => {
      const existingIdx = prev.dailyLogs.findIndex(
        (l) => l.petId === log.petId && l.date === log.date,
      );
      const entry: DailyCareLog = {
        ...log,
        id: existingIdx >= 0 ? prev.dailyLogs[existingIdx].id : `log-${Date.now()}`,
        duplicateFlag: duplicateDetected,
        updatedAt: `2026/${nowTimeStr()}`,
      };
      const updatedLogs =
        existingIdx >= 0
          ? prev.dailyLogs.map((l, idx) => (idx === existingIdx ? entry : l))
          : [entry, ...prev.dailyLogs];

      return {
        ...prev,
        dailyLogs: updatedLogs,
        carePoints: prev.carePoints + pointsAwarded,
        pointsTransactions:
          pointsAwarded > 0
            ? [
                {
                  id: `pt-${Date.now()}`,
                  date: nowTimeStr().split(' ')[0],
                  title: `完成每日四欄照護紀錄（${log.date}）`,
                  delta: pointsAwarded,
                  axis: '任務完成',
                },
                ...prev.pointsTransactions,
              ]
            : prev.pointsTransactions,
        carePets: prev.carePets.map((pet) =>
          pet.id === log.petId && isComplete
            ? { ...pet, careScore: Math.min(100, pet.careScore + 2) }
            : pet,
        ),
        careAlerts: prev.careAlerts.map((al) =>
          al.petId === log.petId && al.type === 'missing_log' && isComplete
            ? { ...al, resolved: true }
            : al,
        ),
      };
    });

    return { duplicateDetected, pointsAwarded };
  };

  const addMedicalRecord = (
    record: Omit<MedicalRecord, 'id' | 'dayBadge' | 'verification'>,
  ) => {
    const dayBadge = record.date.split('/').pop()?.slice(0, 2) || '25';
    setState((prev) => ({
      ...prev,
      medicalRecords: [
        {
          ...record,
          id: `med-${Date.now()}`,
          dayBadge,
          verification: record.hasAttachment ? '待查核' : '自填',
        },
        ...prev.medicalRecords,
      ],
    }));
  };

  const resolveCareAlert = (alertId: string) => {
    setState((prev) => ({
      ...prev,
      careAlerts: prev.careAlerts.map((al) =>
        al.id === alertId ? { ...al, resolved: true } : al,
      ),
    }));
  };

  const bindCarePet = (caseCode: string, name: string, species: '犬' | '貓') => {
    const id = `pet-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      carePets: [
        ...prev.carePets,
        {
          id,
          caseId: caseCode || 'A-0063',
          name,
          species,
          badgeChar: name.slice(0, 1) || '毛',
          statusLabel: `${species}｜已綁定｜開始追蹤 1 天`,
          trackingDays: 1,
          careScore: 80,
          scoreBreakdown: {
            dailyLog: 80,
            medical: 80,
            activity: 80,
            checkup: 80,
          },
        },
      ],
      activeCarePetId: id,
    }));
  };

  const selectReward = (rewardId: string) => {
    setState((prev) => ({ ...prev, selectedRewardId: rewardId }));
  };

  const redeemSelectedReward = (): { ok: boolean; redeemId?: string; message?: string } => {
    const reward = state.rewards.find((r) => r.id === state.selectedRewardId);
    if (!reward) return { ok: false, message: '找不到獎勵項目' };
    if (state.carePoints < reward.cost) {
      return { ok: false, message: '目前 Care Points 點數不足' };
    }
    const nextNum = state.redemptions.length + 1;
    const redeemId = `RW-${String(nextNum).padStart(6, '0')}`;
    const remaining = state.carePoints - reward.cost;

    setState((prev) => ({
      ...prev,
      carePoints: remaining,
      pointsTransactions: [
        {
          id: `pt-${Date.now()}`,
          date: nowTimeStr().split(' ')[0],
          title: `兌換：${reward.title}`,
          delta: -reward.cost,
          axis: '獎勵兌換',
        },
        ...prev.pointsTransactions,
      ],
      redemptions: [
        {
          redeemId,
          rewardId: reward.id,
          rewardTitle: reward.title,
          cost: reward.cost,
          remainingPoints: remaining,
          redeemedAt: `2026/${nowTimeStr()}`,
          expiryText: '依商家正式提供',
        },
        ...prev.redemptions,
      ],
    }));

    return { ok: true, redeemId };
  };

  const markNotificationRead = (notifId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notifId ? { ...n, unread: false } : n,
      ),
    }));
  };

  const acknowledgeOrgMessage = (msgId: string) => {
    setState((prev) => ({
      ...prev,
      orgMessages: prev.orgMessages.map((m) =>
        m.id === msgId
          ? {
              ...m,
              acknowledged: true,
              statusLabel: m.statusLabel === '未讀' ? '已讀' : m.statusLabel,
              deliveryStatus: '已讀',
              readAt: m.readAt || nowTimeStr(),
            }
          : m,
      ),
    }));
  };

  const replyToOrgMessage = (msgId: string, replyText: string) => {
    if (!replyText.trim()) return;
    const t = nowTimeStr();
    setState((prev) => ({
      ...prev,
      orgMessages: prev.orgMessages.map((m) =>
        m.id === msgId
          ? {
              ...m,
              acknowledged: true,
              statusLabel: '已回覆',
              deliveryStatus: '已讀',
              replyStatus: '已回覆',
              readAt: m.readAt || t,
              repliedAt: t,
              entries: [
                ...m.entries,
                {
                  id: `e-${Date.now()}`,
                  sender: 'owner',
                  senderLabel: `飼主 ${prev.currentUser.maskedName}`,
                  content: replyText.trim(),
                  timestamp: t,
                },
              ],
            }
          : m,
      ),
    }));
  };

  const orgReplyMessage = (msgId: string, replyText: string) => {
    if (!replyText.trim()) return;
    const t = nowTimeStr();
    setState((prev) => ({
      ...prev,
      orgMessages: prev.orgMessages.map((m) =>
        m.id === msgId
          ? {
              ...m,
              entries: [
                ...m.entries,
                {
                  id: `e-${Date.now()}`,
                  sender: 'org',
                  senderLabel: prev.currentUser.orgName,
                  content: replyText.trim(),
                  timestamp: t,
                },
              ],
            }
          : m,
      ),
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          timestamp: `2026/${t}`,
          actor: prev.orgSubRole,
          role: prev.orgSubRole,
          action: `回覆通知對話 ${msgId}`,
          target: msgId,
        },
        ...prev.auditLogs,
      ],
    }));
  };

  const resolveOrgMessageThread = (msgId: string) => {
    setState((prev) => ({
      ...prev,
      orgMessages: prev.orgMessages.map((m) =>
        m.id === msgId
          ? {
              ...m,
              resolvedByOrg: true,
              statusLabel: '已結案',
              replyStatus: '已處理',
            }
          : m,
      ),
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          timestamp: `2026/${nowTimeStr()}`,
          actor: prev.orgSubRole,
          role: prev.orgSubRole,
          action: `標記通知對話已處理結案`,
          target: msgId,
        },
        ...prev.auditLogs,
      ],
    }));
  };

  const setMessageDraft = (draft: PawLinkState['messageDraft']) => {
    setState((prev) => ({ ...prev, messageDraft: draft }));
  };

  const confirmSendOrgMessage = (): string | null => {
    const d = state.messageDraft;
    if (!d) return null;
    const msgId = `MSG-${String(10 + state.orgMessages.length).padStart(3, '0')}`;
    const t = nowTimeStr();
    const tagMap = {
      回訪聯繫: '待辦',
      補件提醒: '補件',
      健康提醒: '提醒',
    } as const;

    setState((prev) => ({
      ...prev,
      orgMessages: [
        {
          id: msgId,
          caseId: d.caseId,
          petId: d.petId,
          petName: d.petName,
          ownerDisplayName: d.ownerDisplayName,
          orgName: prev.currentUser.orgName,
          category: d.category,
          tagLabel: tagMap[d.category],
          subject: d.subject,
          statusLabel: '未讀',
          deliveryStatus: '已送達',
          replyStatus: '待回覆',
          channel: d.includeEmail ? '站內通知（含 Email 提醒）' : '站內通知',
          acknowledged: false,
          resolvedByOrg: false,
          createdAt: `今天 ${t.split(' ')[1]}`,
          entries: [
            {
              id: `e-${Date.now()}`,
              sender: 'org',
              senderLabel: prev.currentUser.orgName,
              content: d.content,
              timestamp: t,
            },
          ],
        },
        ...prev.orgMessages,
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          category: '機構',
          title: d.subject,
          summary: `${prev.currentUser.orgName} · 案件 ${d.caseId}`,
          targetPath: `/care/messages/${msgId}`,
          unread: true,
          createdAt: `今天 ${t.split(' ')[1]}`,
        },
        ...prev.notifications,
      ],
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          timestamp: `2026/${t}`,
          actor: prev.orgSubRole,
          role: prev.orgSubRole,
          action: `發送機構通知 ${msgId}（${d.category}）`,
          target: `${d.caseId} / ${d.petName} / ${d.ownerDisplayName}`,
        },
        ...prev.auditLogs,
      ],
      messageDraft: null,
    }));

    return msgId;
  };

  const saveFollowUpResult = (
    caseId: string,
    method: '電話' | '現場',
    result: '待回訪' | '需追蹤' | '正常結案' | '待確認',
    note: string,
  ) => {
    setState((prev) => ({
      ...prev,
      followUpCases: prev.followUpCases.map((fc) =>
        fc.caseId === caseId
          ? {
              ...fc,
              status: result,
              lastFollowUpMethod: method,
              lastFollowUpNote: note,
            }
          : fc,
      ),
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          timestamp: `2026/${nowTimeStr()}`,
          actor: prev.orgSubRole,
          role: prev.orgSubRole,
          action: `登記回訪紀錄（${method} → ${result}）`,
          target: `案件 ${caseId}`,
        },
        ...prev.auditLogs,
      ],
    }));
  };

  const triggerSyncSource = (sourceId: string) => {
    setState((prev) => ({
      ...prev,
      syncSources: prev.syncSources.map((s) =>
        s.id === sourceId
          ? {
              ...s,
              status: '成功',
              lastSyncAt: `2026/${nowTimeStr()}`,
              recordCount: s.recordCount + 3,
            }
          : s,
      ),
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          timestamp: `2026/${nowTimeStr()}`,
          actor: prev.orgSubRole,
          role: prev.orgSubRole,
          action: `手動觸發資料來源同步`,
          target: sourceId,
        },
        ...prev.auditLogs,
      ],
    }));
  };

  const resetDemoState = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
  };

  return (
    <PawLinkContext.Provider
      value={{
        state,
        switchRole,
        setOrgSubRole,
        loginAsOwner,
        registerAccount,
        loginAsOrg,
        logout,
        toggleFavorite,
        updateApplication,
        reviewAdoptionCase,
        updateRehomeDraft,
        submitRehomeDraft,
        resubmitRehomeCase,
        updateRehomeCaseStatus,
        reviewRehomeCase,
        setActiveCarePet,
        submitDailyCareLog,
        addMedicalRecord,
        resolveCareAlert,
        bindCarePet,
        selectReward,
        redeemSelectedReward,
        markNotificationRead,
        acknowledgeOrgMessage,
        replyToOrgMessage,
        orgReplyMessage,
        resolveOrgMessageThread,
        setMessageDraft,
        confirmSendOrgMessage,
        saveFollowUpResult,
        triggerSyncSource,
        resetDemoState,
      }}
    >
      {children}
    </PawLinkContext.Provider>
  );
};

export function usePawLink(): PawLinkContextValue {
  const ctx = useContext(PawLinkContext);
  if (!ctx) throw new Error('usePawLink must be used inside PawLinkProvider');
  return ctx;
}
