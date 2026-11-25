import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ToastProvider } from './components/common/ToastContext';
import { PawLinkProvider } from './context/PawLinkContext';

// System & Auth
import { LoginPage, NotificationsPage, OrgLoginPage, RegisterSetupPage } from './pages/AuthPages';
import { HomePage } from './pages/HomePage';
import { DesignSystemPage, FlowsPage, NotificationFlowPage, OverviewPage, RulesPage } from './pages/SystemPages';
import { ZoneStubPage } from './pages/ZoneStubPage';

// Adopt browse
import {
  AdoptListPage,
  AdoptSearchPage,
  FavoritesPage,
  PetDetailPage,
} from './pages/adopt/AdoptBrowsePages';

// Adopt apply
import {
  AdoptApplyContactPage,
  AdoptApplyContractPage,
  AdoptApplyEducationPage,
  AdoptApplyEnvironmentPage,
  AdoptApplyHandoverPage,
  AdoptApplyKycPage,
  AdoptApplyOverviewPage,
  MyApplicationsPage,
} from './pages/adopt/AdoptApplyPages';

// Rehome
import {
  MyRehomeCasesPage,
  RehomeBasicPage,
  RehomeHealthPage,
  RehomeIntroPage,
  RehomeManagePage,
  RehomeMediaPage,
  RehomePreviewPage,
} from './pages/adopt/RehomePages';

// Care dashboard & log
import {
  CareDashboardPage,
  DailyLogHistoryPage,
  DailyLogNewPage,
} from './pages/care/CareDashboardAndLogPages';

// Care health & score
import {
  CarePointsPage,
  CareScorePage,
  HealthRecordsPage,
  MedicalNewPage,
} from './pages/care/CareHealthAndScorePages';

// Care rewards & alerts
import {
  CareAlertsPage,
  CarePetsPage,
  CareReportsPage,
  RewardsConfirmPage,
  RewardsListPage,
  RewardsResultPage,
} from './pages/care/CareRewardsAndAlertsPages';

// Care messages
import {
  CareMessageDetailPage,
  CareMessageReplyPage,
  CareMessagesInboxPage,
} from './pages/care/CareMessagesPages';

// Org pages
import {
  OrgContactsPage,
  OrgDashboardPage,
  OrgFollowupDetailPage,
  OrgFollowupsPage,
  OrgKycPage,
  OrgMessageConfirmPage,
  OrgMessageDetailPage,
  OrgMessageHistoryPage,
  OrgMessageNewPage,
  OrgPermissionsPage,
  OrgRehomeReviewPage,
  OrgSyncPage,
} from './pages/org/OrgPages';

export const App: React.FC = () => {
  return (
    <PawLinkProvider>
      <ToastProvider>
        <HashRouter>
          <AppLayout>
            <Routes>
              {/* ── 00 & 90 System / Flow Docs ─────────────────────── */}
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/design-system" element={<DesignSystemPage />} />
              <Route path="/flows" element={<FlowsPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/ui-flow/notification" element={<NotificationFlowPage />} />

              {/* ── 01 Shared Portal ───────────────────────────────── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/account/setup" element={<RegisterSetupPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* ── 02 Adoption & Private Rehome ───────────────────── */}
              <Route path="/adopt" element={<AdoptListPage />} />
              <Route path="/adopt/search" element={<AdoptSearchPage />} />
              <Route path="/adopt/pet/:petId" element={<PetDetailPage />} />
              <Route path="/adopt/favorites" element={<FavoritesPage />} />

              {/* Apply steps */}
              <Route path="/adopt/apply/:petId" element={<AdoptApplyOverviewPage />} />
              <Route path="/adopt/apply/:petId/contact" element={<AdoptApplyContactPage />} />
              <Route path="/adopt/apply/:petId/kyc" element={<AdoptApplyKycPage />} />
              <Route path="/adopt/apply/:petId/environment" element={<AdoptApplyEnvironmentPage />} />
              <Route path="/adopt/apply/:petId/education" element={<AdoptApplyEducationPage />} />
              <Route path="/adopt/apply/:petId/contract" element={<AdoptApplyContractPage />} />
              <Route path="/adopt/apply/:petId/handover" element={<AdoptApplyHandoverPage />} />
              <Route path="/adopt/applications" element={<MyApplicationsPage />} />

              {/* Rehome steps */}
              <Route path="/adopt/rehome" element={<RehomeIntroPage />} />
              <Route path="/adopt/rehome/basic" element={<RehomeBasicPage />} />
              <Route path="/adopt/rehome/health" element={<RehomeHealthPage />} />
              <Route path="/adopt/rehome/media" element={<RehomeMediaPage />} />
              <Route path="/adopt/rehome/preview" element={<RehomePreviewPage />} />
              <Route path="/adopt/rehome/cases" element={<MyRehomeCasesPage />} />
              <Route path="/adopt/rehome/manage" element={<RehomeManagePage />} />

              {/* ── 03 Care Tracking ───────────────────────────────── */}
              <Route path="/care/dashboard" element={<CareDashboardPage />} />
              <Route path="/care/log/new" element={<DailyLogNewPage />} />
              <Route path="/care/log/history" element={<DailyLogHistoryPage />} />
              <Route path="/care/health" element={<HealthRecordsPage />} />
              <Route path="/care/medical/new" element={<MedicalNewPage />} />
              <Route path="/care/score" element={<CareScorePage />} />
              <Route path="/care/points" element={<CarePointsPage />} />
              <Route path="/care/alerts" element={<CareAlertsPage />} />
              <Route path="/care/reports" element={<CareReportsPage />} />
              <Route path="/care/pets" element={<CarePetsPage />} />
              {/* Rewards — specific before dynamic */}
              <Route path="/care/rewards/confirm" element={<RewardsConfirmPage />} />
              <Route path="/care/rewards/result" element={<RewardsResultPage />} />
              <Route path="/care/rewards" element={<RewardsListPage />} />
              {/* Messages — specific before dynamic */}
              <Route path="/care/messages/:msgId/reply" element={<CareMessageReplyPage />} />
              <Route path="/care/messages/:msgId" element={<CareMessageDetailPage />} />
              <Route path="/care/messages" element={<CareMessagesInboxPage />} />

              {/* ── 04 Organization Management ─────────────────────── */}
              <Route path="/organization/login" element={<OrgLoginPage />} />
              <Route path="/organization" element={<OrgDashboardPage />} />
              <Route path="/organization/kyc" element={<OrgKycPage />} />
              <Route path="/organization/rehome-review" element={<OrgRehomeReviewPage />} />
              <Route path="/organization/followups" element={<OrgFollowupsPage />} />
              <Route path="/organization/followups/:caseId" element={<OrgFollowupDetailPage />} />
              <Route path="/organization/sync" element={<OrgSyncPage />} />
              <Route path="/organization/permissions" element={<OrgPermissionsPage />} />
              <Route path="/organization/contacts" element={<OrgContactsPage />} />
              <Route path="/organization/messages/new" element={<OrgMessageNewPage />} />
              <Route path="/organization/messages/confirm" element={<OrgMessageConfirmPage />} />
              {/* specific before dynamic */}
              <Route path="/organization/messages/history" element={<OrgMessageHistoryPage />} />
              <Route path="/organization/messages/:msgId" element={<OrgMessageDetailPage />} />

              {/* Fallback */}
              <Route path="*" element={<ZoneStubPage />} />
            </Routes>
          </AppLayout>
        </HashRouter>
      </ToastProvider>
    </PawLinkProvider>
  );
};
