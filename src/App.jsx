import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { GeoScopeProvider } from './context/GeoScopeContext';
import { FsmProvider } from './context/FsmContext';
import { AppShell } from './components/common/AppShell';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { PublicDashboardPage } from './pages/public/PublicDashboardPage';
import { CitizenBookingPage } from './pages/public/CitizenBookingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Authenticated App Pages
import { RoleDashboard } from './pages/app/RoleDashboard';
import { RequestsPage } from './pages/app/RequestsPage';
import { TripsPage } from './pages/app/TripsPage';
import { LiveMapPage } from './pages/app/LiveMapPage';
import { FleetPage } from './pages/app/FleetPage';
import { PeoplePage } from './pages/app/PeoplePage';
import { FstpPage } from './pages/app/FstpPage';
import { VendorsPage } from './pages/app/VendorsPage';
import { MastersPage } from './pages/app/MastersPage';
import { ReportsPage } from './pages/app/ReportsPage';
import { AiInsightsPage } from './pages/app/AiInsightsPage';
import { DatabaseManagerPage } from './pages/app/DatabaseManagerPage';
import { AuditLogPage } from './pages/app/AuditLogPage';
import { CmsPage } from './pages/app/CmsPage';
import { SettingsPage } from './pages/app/SettingsPage';
import { ProfilePage } from './pages/app/ProfilePage';

export const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <GeoScopeProvider>
            <FsmProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/dashboard" element={<PublicDashboardPage />} />
                  <Route path="/book" element={<CitizenBookingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* App Routes wrapped in AppShell */}
                  <Route
                    path="/app"
                    element={
                      <AppShell>
                        <RoleDashboard />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/requests"
                    element={
                      <AppShell>
                        <RequestsPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/trips"
                    element={
                      <AppShell>
                        <TripsPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/map"
                    element={
                      <AppShell>
                        <LiveMapPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/fleet"
                    element={
                      <AppShell>
                        <FleetPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/people"
                    element={
                      <AppShell>
                        <PeoplePage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/fstp"
                    element={
                      <AppShell>
                        <FstpPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/vendors"
                    element={
                      <AppShell>
                        <VendorsPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/masters"
                    element={
                      <AppShell>
                        <MastersPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/reports"
                    element={
                      <AppShell>
                        <ReportsPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/ai"
                    element={
                      <AppShell>
                        <AiInsightsPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/database"
                    element={
                      <AppShell>
                        <DatabaseManagerPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/audit"
                    element={
                      <AppShell>
                        <AuditLogPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/cms"
                    element={
                      <AppShell>
                        <CmsPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/settings"
                    element={
                      <AppShell>
                        <SettingsPage />
                      </AppShell>
                    }
                  />
                  <Route
                    path="/app/profile"
                    element={
                      <AppShell>
                        <ProfilePage />
                      </AppShell>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </FsmProvider>
          </GeoScopeProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
