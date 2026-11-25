export type UserRole = 'guest' | 'owner' | 'org';

export type ZoneType = 'portal' | 'adopt' | 'care' | 'org' | 'system';

export type OrgSubRole = '機構管理員' | '審核人員' | '回訪人員' | '資料管理員';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface ScreenMeta {
  id: string; // e.g., 'UI-01.00'
  title: string;
  subtitle: string;
  zone: ZoneType;
  pattern: string; // route pattern for matching
  breadcrumbs: BreadcrumbItem[];
  prevId?: string;
  nextIds?: string[];
  navLabel?: string;
}

export type PetSourceType = '公立' | '民間' | '個人';

export interface AdoptablePet {
  id: string; // e.g., 'A-0001'
  name: string;
  species: '犬' | '貓';
  breed: string;
  gender: '公' | '母' | '未知';
  ageText: string;
  ageGroup: '幼齡' | '成齡' | '高齡';
  size: '小' | '中' | '大';
  color: string;
  city: string;
  district?: string;
  sourceType: PetSourceType;
  sourceLabel: string; // e.g., '公立動物之家'
  shelterName: string;
  neutered: '已結紮' | '未結紮' | '待確認';
  vaccinated: string;
  microchip: string;
  intakeDate: string;
  updatedAt: string;
  status: '開放申請' | '已送出申請' | '資料更新中' | '已領養' | '已下架';
  personality?: string;
  specialNeeds?: string;
  mapCoords: { x: number; y: number };
}

export type ApplicationStatus =
  | 'draft'
  | 'pending_supplement'
  | 'reviewing'
  | 'approved'
  | 'completed'
  | 'rejected';

export interface AdoptionApplication {
  caseId: string; // e.g., 'A-0001'
  petId: string;
  petName: string;
  applicantName: string;
  applicantPhone: string;
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  status: ApplicationStatus;
  statusLabel: string;
  statusNote: string;
  contactMethod: 'Email' | '電話' | '線上表單';
  contactTime: string;
  intentSummary: string;
  kycBirthAge: string;
  kycDocUploaded: boolean;
  kycConfirmed: boolean;
  housingType: '公寓' | '透天' | '其他';
  canKeepPets: '是' | '需確認';
  householdConsensus: string;
  careSchedule: string;
  envPhotoCount: number;
  educationCompleted: boolean;
  educationGuideRead: boolean;
  appointmentDate: string;
  appointmentLocation: string;
  contractSigned: boolean;
  handoverChecklist: {
    contractDone: boolean;
    chipDone: boolean;
    neuterDone: boolean;
    careActivated: boolean;
  };
  reviewReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type RehomeCaseStatus = '草稿' | '審核中' | '待補件' | '已刊登' | '已送養' | '已下架';

export interface RehomeCase {
  caseId: string; // e.g., 'P-0008'
  petName: string;
  species: '犬' | '貓';
  breed: string;
  gender: '公' | '母' | '未知';
  ageText: string;
  size: '小' | '中' | '大';
  city: string;
  district: string;
  neutered: '已' | '未' | '未知';
  vaccinated: '已' | '未' | '未知';
  microchip: '有' | '無' | '未知';
  healthStatus: '良好' | '治療中' | '待確認';
  specialNeeds: string;
  personality: string[];
  photoCount: number;
  photoAuthorized: boolean;
  contactPrivate: string;
  publicRegion: string;
  status: RehomeCaseStatus;
  reviewNote: string;
  inquiryCount: number;
  updatedAt: string;
  checklist: {
    basicFields: '已檢查' | '待檢查';
    photosAuth: '已通過' | '需補件';
    medicalInfo: '已確認' | '待確認';
    privacyRules: '符合隱私規則' | '需調整';
  };
}

export interface CarePet {
  id: string;
  caseId: string;
  name: string;
  species: '犬' | '貓';
  badgeChar: string;
  statusLabel: string;
  trackingDays: number;
  needsMedicalSupplement?: boolean;
  careScore: number;
  scoreBreakdown: {
    dailyLog: number;
    medical: number;
    activity: number;
    checkup: number;
  };
}

export interface DailyCareLog {
  id: string;
  petId: string;
  date: string; // YYYY-MM-DD
  diet: string;
  water: string;
  activity: string;
  excretion: string;
  hasMedia: boolean;
  isDuplicateConfirmed?: boolean;
  duplicateFlag?: boolean;
  updatedAt: string;
}

export type VerificationLevel = '已驗證' | '機構確認' | '待查核' | '自填';

export interface MedicalRecord {
  id: string;
  petId: string;
  dayBadge: string; // e.g., '07'
  category: '疫苗' | '絕育' | '回診' | '健檢' | '日常紀錄';
  title: string;
  date: string;
  clinic?: string;
  nextReminderDate?: string;
  sourceNote: string;
  verification: VerificationLevel;
  hasAttachment: boolean;
}

export interface PointsTransaction {
  id: string;
  date: string;
  title: string;
  delta: number;
  axis: '達標積分' | '連續回報' | '任務完成' | '獎勵兌換';
}

export interface RewardItem {
  id: string;
  title: string;
  partner: string;
  cost: number;
  description: string;
  terms: string;
}

export interface RedemptionRecord {
  redeemId: string; // e.g., 'RW-000001'
  rewardId: string;
  rewardTitle: string;
  cost: number;
  remainingPoints: number;
  redeemedAt: string;
  expiryText: string;
}

export interface CareAlertItem {
  id: string;
  petId: string;
  title: string;
  description: string;
  type: 'missing_log' | 'vaccine_due' | 'duplicate_data';
  resolved: boolean;
  actionLabel: string;
  targetPath?: string;
}

export interface OrgMessageEntry {
  id: string;
  sender: 'org' | 'owner';
  senderLabel: string;
  content: string;
  timestamp: string;
}

export interface OrgMessageThread {
  id: string; // e.g., 'MSG-008'
  caseId: string;
  petId: string;
  petName: string;
  ownerDisplayName: string; // e.g., '王○明'
  orgName: string; // e.g., '臺北市動物之家'
  category: '回訪聯繫' | '補件提醒' | '健康提醒';
  tagLabel: '待辦' | '補件' | '提醒';
  subject: string;
  statusLabel: '未讀' | '已讀' | '已回覆' | '已結案';
  deliveryStatus: '已送達' | '已讀';
  replyStatus: '待回覆' | '已回覆' | '已處理';
  channel: '站內通知' | '站內通知（含 Email 提醒）';
  acknowledged: boolean;
  resolvedByOrg: boolean;
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
  entries: OrgMessageEntry[];
}

export interface FollowUpCase {
  caseId: string;
  petId: string;
  petName: string;
  ownerDisplayName: string;
  priorityNote: string;
  validLogs7d: number;
  scoreTrend: string;
  medicalSummary: string;
  alertSummary: string;
  status: '待回訪' | '需追蹤' | '正常結案' | '待確認';
  lastFollowUpMethod?: '電話' | '現場';
  lastFollowUpNote?: string;
}

export interface SyncSourceStatus {
  id: string;
  name: string;
  scheduleOrMode: string;
  status: '成功' | '人工審核' | '未啟用' | '異常';
  lastSyncAt: string;
  recordCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: OrgSubRole;
  action: string;
  target: string;
}

export interface NotificationItem {
  id: string;
  category: '領養' | '送養' | '照護' | '健康' | '機構';
  title: string;
  summary: string;
  targetPath: string;
  unread: boolean;
  createdAt: string;
}
