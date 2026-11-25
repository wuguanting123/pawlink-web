import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PawLinkProvider } from './context/PawLinkContext';
import { LoginPage, NotificationsPage, OrgLoginPage, RegisterSetupPage } from './pages/AuthPages';
import { HomePage } from './pages/HomePage';
import { DesignSystemPage, OverviewPage } from './pages/SystemPages';
import { ZoneStubPage } from './pages/ZoneStubPage';

export const App: React.FC = () => {
  return (
    <PawLinkProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* 00 & 90 System & Flow Docs */}
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="/flows" element={<ZoneStubPage />} />
            <Route path="/rules" element={<ZoneStubPage />} />
            <Route path="/ui-flow/notification" element={<ZoneStubPage />} />

            {/* 01 Shared Portal */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account/setup" element={<RegisterSetupPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* 02 Adoption & Private Rehome Zone */}
            <Route path="/adopt" element={<ZoneStubPage />} />
            <Route path="/adopt/search" element={<ZoneStubPage />} />
            <Route path="/adopt/pet/:petId" element={<ZoneStubPage />} />
            <Route path="/adopt/favorites" element={<ZoneStubPage />} />
            <Route path="/adopt/apply/:petId" element={<ZoneStubPage />} />
            <Route path="/adopt/apply/:petId/contact" element={<ZoneStubPage />} />
            <Route path="/adopt/apply/:petId/kyc" element={<ZoneStubPage />} />
            <Route path="/adopt/apply/:petId/environment" element={<ZoneStubPage />} />
            <Route path="/adopt/apply/:petId/education" element={<ZoneStubPage />} />
            <Route path="/adopt/apply/:petId/contract" element={<ZoneStubPage />} />
            <Route path="/adopt/apply/:petId/handover" element={<ZoneStubPage />} />
            <Route path="/adopt/applications" element={<ZoneStubPage />} />
            <Route path="/adopt/rehome" element={<ZoneStubPage />} />
            <Route path="/adopt/rehome/basic" element={<ZoneStubPage />} />
            <Route path="/adopt/rehome/health" element={<ZoneStubPage />} />
            <Route path="/adopt/rehome/media" element={<ZoneStubPage />} />
            <Route path="/adopt/rehome/preview" element={<ZoneStubPage />} />
            <Route path="/adopt/rehome/cases" element={<ZoneStubPage />} />
            <Route path="/adopt/rehome/manage" element={<ZoneStubPage />} />

            {/* 03 Care Tracking Zone */}
            <Route path="/care/dashboard" element={<ZoneStubPage />} />
            <Route path="/care/log/new" element={<ZoneStubPage />} />
            <Route path="/care/log/history" element={<ZoneStubPage />} />
            <Route path="/care/health" element={<ZoneStubPage />} />
            <Route path="/care/medical/new" element={<ZoneStubPage />} />
            <Route path="/care/score" element={<ZoneStubPage />} />
            <Route path="/care/points" element={<ZoneStubPage />} />
            <Route path="/care/alerts" element={<ZoneStubPage />} />
            <Route path="/care/reports" element={<ZoneStubPage />} />
            <Route path="/care/pets" element={<ZoneStubPage />} />
            <Route path="/care/rewards" element={<ZoneStubPage />} />
            <Route path="/care/rewards/confirm" element={<ZoneStubPage />} />
            <Route path="/care/rewards/result" element={<ZoneStubPage />} />
            <Route path="/care/messages" element={<ZoneStubPage />} />
            <Route path="/care/messages/:msgId" element={<ZoneStubPage />} />
            <Route path="/care/messages/:msgId/reply" element={<ZoneStubPage />} />

            {/* 04 Organization Management Zone */}
            <Route path="/organization/login" element={<OrgLoginPage />} />
            <Route path="/organization" element={<ZoneStubPage />} />
            <Route path="/organization/kyc" element={<ZoneStubPage />} />
            <Route path="/organization/rehome-review" element={<ZoneStubPage />} />
            <Route path="/organization/followups" element={<ZoneStubPage />} />
            <Route path="/organization/followups/:caseId" element={<ZoneStubPage />} />
            <Route path="/organization/sync" element={<ZoneStubPage />} />
            <Route path="/organization/permissions" element={<ZoneStubPage />} />
            <Route path="/organization/contacts" element={<ZoneStubPage />} />
            <Route path="/organization/messages/new" element={<ZoneStubPage />} />
            <Route path="/organization/messages/confirm" element={<ZoneStubPage />} />
            <Route path="/organization/messages/history" element={<ZoneStubPage />} />
            <Route path="/organization/messages/:msgId" element={<ZoneStubPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </PawLinkProvider>
  );
};

export default App;
