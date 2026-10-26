import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Layout
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public & Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { RequestTrackingPage } from './pages/requests/RequestTrackingPage';

// Elderly Pages
import { ElderlyOverviewPage } from './pages/elderly/ElderlyOverviewPage';
import { RequestHelpPage } from './pages/elderly/RequestHelpPage';
import { MyRequestsPage } from './pages/elderly/MyRequestsPage';
import { AssignedVolunteerPage } from './pages/elderly/AssignedVolunteerPage';
import { ElderlyNotificationsPage } from './pages/elderly/ElderlyNotificationsPage';
import { ElderlyFeedbackPage } from './pages/elderly/ElderlyFeedbackPage';
import { ElderlyProfilePage } from './pages/elderly/ElderlyProfilePage';

// Family Pages
import { FamilyOverviewPage } from './pages/family/FamilyOverviewPage';
import { CreateForRelativePage } from './pages/family/CreateForRelativePage';
import { RelativesRequestsPage } from './pages/family/RelativesRequestsPage';
import { FamilyVolunteerPage } from './pages/family/FamilyVolunteerPage';
import { FamilyProfilePage } from './pages/family/FamilyProfilePage';

// Volunteer Pages
import { VolunteerOverviewPage } from './pages/volunteer/VolunteerOverviewPage';
import { AvailableRequestsPage } from './pages/volunteer/AvailableRequestsPage';
import { MyTasksPage } from './pages/volunteer/MyTasksPage';
import { CompletedHistoryPage } from './pages/volunteer/CompletedHistoryPage';
import { VolunteerProfilePage } from './pages/volunteer/VolunteerProfilePage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';
import { AdminVolunteersPage } from './pages/admin/AdminVolunteersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Shared Request Tracking View (Inside DashboardLayout) */}
              <Route element={<DashboardLayout />}>
                <Route path="/requests/:id" element={<RequestTrackingPage />} />
              </Route>

              {/* Elderly Portal Routes */}
              <Route path="/elderly" element={<DashboardLayout allowedRoles={['elderly', 'admin']} />}>
                <Route index element={<ElderlyOverviewPage />} />
                <Route path="request-help" element={<RequestHelpPage />} />
                <Route path="requests" element={<MyRequestsPage />} />
                <Route path="volunteer" element={<AssignedVolunteerPage />} />
                <Route path="notifications" element={<ElderlyNotificationsPage />} />
                <Route path="feedback" element={<ElderlyFeedbackPage />} />
                <Route path="profile" element={<ElderlyProfilePage />} />
              </Route>

              {/* Family Coordinator Routes */}
              <Route path="/family" element={<DashboardLayout allowedRoles={['family', 'admin']} />}>
                <Route index element={<FamilyOverviewPage />} />
                <Route path="request-help" element={<CreateForRelativePage />} />
                <Route path="requests" element={<RelativesRequestsPage />} />
                <Route path="volunteer" element={<FamilyVolunteerPage />} />
                <Route path="notifications" element={<ElderlyNotificationsPage />} />
                <Route path="profile" element={<FamilyProfilePage />} />
              </Route>

              {/* Volunteer Workspace Routes */}
              <Route path="/volunteer" element={<DashboardLayout allowedRoles={['volunteer', 'admin']} />}>
                <Route index element={<VolunteerOverviewPage />} />
                <Route path="available" element={<AvailableRequestsPage />} />
                <Route path="tasks" element={<MyTasksPage />} />
                <Route path="history" element={<CompletedHistoryPage />} />
                <Route path="profile" element={<VolunteerProfilePage />} />
              </Route>

              {/* Coordinator Admin Routes */}
              <Route path="/admin" element={<DashboardLayout allowedRoles={['admin']} />}>
                <Route index element={<AdminOverviewPage />} />
                <Route path="requests" element={<AdminRequestsPage />} />
                <Route path="volunteers" element={<AdminVolunteersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
