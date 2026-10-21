// Dar-e-Arqam Schools Monitoring & Evaluation Report Management System
// Main Application Container with Android Mobile-First Responsive Framework
import React, { useState, useEffect } from 'react';

// Theme & Navigation
import AppHeader from './components/AppHeader';
import BottomTabBar from './navigation/BottomTabBar';

// Screens
import DashboardScreen from './screens/DashboardScreen';
import MonitoringVisitsScreen from './screens/MonitoringVisitsScreen';
import NewVisitWizardScreen from './screens/NewVisitWizardScreen';
import ReportDetailScreen from './screens/ReportDetailScreen';
import ReportsAnalyticsScreen from './screens/ReportsAnalyticsScreen';
import SchoolsListScreen from './screens/SchoolsListScreen';
import ActionPlanScreen from './screens/ActionPlanScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsModal from './screens/NotificationsModal';

// Storage & Services
import localDatabaseDefault, { localDatabase as localDatabaseNamed, initDefaultData } from './storage/localDatabase';
const localDatabase = localDatabaseDefault?.initDefaultData ? localDatabaseDefault : (localDatabaseNamed || localDatabaseDefault);
import syncQueue from './storage/syncQueue';
import draftStorage from './storage/draftStorage';
import syncService from './services/syncService';
import authService from './services/authService';
import { USER_ROLES, REPORT_STATUSES } from './constants/reportStatuses';

export default function App() {
  // Global State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDeviceFrame, setIsDeviceFrame] = useState(false); // Mobile frame simulator
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Data State
  const [reports, setReports] = useState([]);
  const [schools, setSchools] = useState([]);
  const [regions, setRegions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    academicSession: '2024-25',
    reportYear: '2025',
    autoSaveInterval: 15,
  });

  // Current User / Role (Defaults to Monitoring Officer for data entry)
  const [currentUser, setCurrentUser] = useState({
    id: 'usr_mo_1',
    name: 'Muhammad Salman Siddiqui',
    role: USER_ROLES.MONITORING_OFFICER,
    phone: '0302-8877665',
    email: 'm.salman@darearqam.edu.pk',
  });

  // Overlay / Modal views
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Initialize DB and load initial data on startup
  useEffect(() => {
    if (typeof initDefaultData === 'function') {
      initDefaultData();
    } else if (localDatabase && typeof localDatabase.initDefaultData === 'function') {
      localDatabase.initDefaultData();
    }
    refreshAllData();

    // Listen to network changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update theme class on HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const refreshAllData = () => {
    const loadedReports = localDatabase.getReports();
    const loadedSchools = localDatabase.getSchools();
    const loadedRegions = localDatabase.getRegions();
    const loadedSettings = localDatabase.getSettings();

    setReports(loadedReports);
    setSchools(loadedSchools);
    setRegions(loadedRegions);
    if (loadedSettings) setSettings(loadedSettings);

    setPendingSyncCount(syncQueue.getPendingCount());

    // Generate in-app notifications from reports state
    const generatedNotifs = [];
    loadedReports.forEach((r) => {
      if (r.status === REPORT_STATUSES.SUBMITTED) {
        generatedNotifs.push({
          id: `notif_${r.id}_sub`,
          title: `Report Submitted: ${r.branchName}`,
          message: `${r.srNo} submitted by ${r.monitoringOfficerName} for Regional Director review.`,
          timestamp: r.submittedAt || r.updatedAt,
          type: 'submission',
          report: r,
        });
      } else if (r.status === REPORT_STATUSES.APPROVED) {
        generatedNotifs.push({
          id: `notif_${r.id}_app`,
          title: `Report Approved: ${r.branchName}`,
          message: `${r.srNo} officially approved by Regional Directorate.`,
          timestamp: r.updatedAt,
          type: 'approval',
          report: r,
        });
      } else if (r.status === REPORT_STATUSES.RETURNED) {
        generatedNotifs.push({
          id: `notif_${r.id}_ret`,
          title: `Report Returned: ${r.branchName}`,
          message: `Correction requested: ${r.reviewRemarks || 'Please address feedback'}`,
          timestamp: r.updatedAt,
          type: 'returned',
          report: r,
        });
      }
    });

    setNotifications(generatedNotifs);
  };

  // Switch role helper
  const handleSwitchRole = (roleOrUser) => {
    if (typeof roleOrUser === 'string') {
      const found = authService.getMockUserByRole(roleOrUser);
      setCurrentUser(found || { ...currentUser, role: roleOrUser });
    } else {
      setCurrentUser(roleOrUser);
    }
  };

  // Open inspection wizard for new visit or preselected school
  const handleStartNewVisit = (prefilledSchool = null) => {
    let initialTemplate = null;
    if (prefilledSchool) {
      initialTemplate = {
        branchName: prefilledSchool.branchName,
        region: prefilledSchool.region,
        principalName: prefilledSchool.principalName,
        principalContact: prefilledSchool.principalContact,
        directorName: prefilledSchool.directorName,
        directorContact: prefilledSchool.directorContact,
        schoolBuilding: prefilledSchool.schoolBuilding,
      };
    }
    setEditingReport(initialTemplate);
    setWizardOpen(true);
  };

  // Edit existing report
  const handleEditReport = (report) => {
    setEditingReport(report);
    setViewingReport(null);
    setWizardOpen(true);
  };

  // Save report (Draft or Final submission)
  const handleSaveReport = (reportData) => {
    localDatabase.saveReport(reportData);
    syncQueue.enqueue('SAVE_REPORT', reportData);
    refreshAllData();
    setWizardOpen(false);
    setEditingReport(null);
    // Show report in viewer
    setViewingReport(reportData);
  };

  // Workflow status update (Approved, Returned, etc.)
  const handleUpdateReportStatus = (reportId, newStatus, remarks = '') => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    const updated = {
      ...report,
      status: newStatus,
      reviewRemarks: remarks || report.reviewRemarks,
      updatedAt: new Date().toISOString(),
    };

    localDatabase.saveReport(updated);
    syncQueue.enqueue('STATUS_CHANGE', { reportId, newStatus, remarks });
    refreshAllData();
    setViewingReport(updated);
  };

  // Update action item status in Corrective Action Plan
  const handleUpdateActionStatus = (reportId, findingIndex, newStatus) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report || !report.findings) return;

    const updatedFindings = [...report.findings];
    if (updatedFindings[findingIndex]) {
      updatedFindings[findingIndex] = {
        ...updatedFindings[findingIndex],
        currentStatus: newStatus,
      };
    }

    const updated = {
      ...report,
      findings: updatedFindings,
      updatedAt: new Date().toISOString(),
    };

    localDatabase.saveReport(updated);
    refreshAllData();
  };

  // Manual Trigger Cloud Sync
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncService.syncAll();
      refreshAllData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset demo sample data
  const handleResetData = () => {
    if (window.confirm('Reset all sample branches and reports to initial factory demo?')) {
      localDatabase.resetData();
      draftStorage.clearDraft();
      refreshAllData();
      setViewingReport(null);
      setWizardOpen(false);
      setActiveTab('dashboard');
    }
  };

  // Calculate pending action items count for the tab badge
  const pendingActionsCount = reports.reduce((acc, r) => {
    const pending = (r.findings || []).filter((f) => f.currentStatus === 'Pending').length;
    return acc + pending;
  }, 0);

  // Main Screen Renderer
  const renderCurrentScreen = () => {
    // 1. Wizard Overlay has top priority
    if (wizardOpen) {
      return (
        <NewVisitWizardScreen
          initialData={editingReport}
          schools={schools}
          regions={regions}
          currentUser={currentUser}
          onSaveReport={handleSaveReport}
          onCancel={() => {
            setWizardOpen(false);
            setEditingReport(null);
          }}
          onPreviewReport={(currentDraft) => {
            setViewingReport(currentDraft);
          }}
        />
      );
    }

    // 2. Report Detail Viewer has second priority
    if (viewingReport) {
      return (
        <ReportDetailScreen
          report={viewingReport}
          currentUser={currentUser}
          onBack={() => setViewingReport(null)}
          onEdit={(rep) => handleEditReport(rep)}
          onUpdateStatus={handleUpdateReportStatus}
          settings={settings}
        />
      );
    }

    // 3. Tab Screens
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            reports={reports}
            schools={schools}
            regions={regions}
            currentUser={currentUser}
            onNavigateToTab={(tabId: string) => setActiveTab(tabId)}
            onStartNewVisit={() => handleStartNewVisit()}
            onViewReport={(rep: any) => setViewingReport(rep)}
          />
        );

      case 'visits':
        return (
          <MonitoringVisitsScreen
            reports={reports}
            regions={regions}
            currentUser={currentUser}
            onStartNewVisit={() => handleStartNewVisit()}
            onViewReport={(rep: any) => setViewingReport(rep)}
            onEditReport={(rep: any) => handleEditReport(rep)}
            onDeleteReport={(reportId: string) => {
              if (window.confirm('Are you sure you want to delete this report?')) {
                localDatabase.deleteReport(reportId);
                refreshAllData();
              }
            }}
            settings={settings}
          />
        );

      case 'schools':
        return (
          <SchoolsListScreen
            schools={schools}
            regions={regions}
            reports={reports}
            onSelectSchoolForInspection={(sch) => handleStartNewVisit(sch)}
            onViewReport={(rep) => setViewingReport(rep)}
          />
        );

      case 'reports':
        return (
          <ReportsAnalyticsScreen
            reports={reports}
            regions={regions}
            onViewReport={(rep) => setViewingReport(rep)}
            settings={settings}
          />
        );

      case 'action_plan':
        return (
          <ActionPlanScreen
            reports={reports}
            onUpdateActionStatus={handleUpdateActionStatus}
            onViewReport={(rep) => setViewingReport(rep)}
          />
        );

      case 'profile':
        return (
          <SettingsScreen
            currentUser={currentUser}
            onSwitchUser={handleSwitchRole}
            theme={isDarkMode ? 'dark' : 'light'}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            settings={settings}
            onUpdateSettings={(s) => {
              setSettings(s);
              localDatabase.saveSettings(s);
            }}
            onResetData={handleResetData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8F0E5] dark:bg-[#041029] font-sans text-[#222d3d] dark:text-[#F8F0E5] flex flex-col ${isDeviceFrame ? 'items-center justify-center p-2 sm:p-6 bg-[#041029]' : ''}`}>
      
      {/* Mobile Frame Container (if toggled) */}
      <div className={`w-full flex flex-col flex-1 ${
        isDeviceFrame 
          ? 'max-w-md h-[92vh] max-h-[860px] bg-white dark:bg-[#082052] rounded-[38px] shadow-2xl border-8 border-[#082052] overflow-hidden relative ring-1 ring-[#C59B27]/40' 
          : 'min-h-screen'
      }`}>

        {/* Top Institutional Header */}
        <AppHeader
          currentUser={currentUser}
          onSwitchRole={handleSwitchRole}
          isOnline={isOnline}
          pendingSyncCount={pendingSyncCount}
          onSyncNow={handleManualSync}
          isSyncing={isSyncing}
          isMobileDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          unreadNotifsCount={notifications.length}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenSettings={() => setActiveTab('profile')}
          academicSession={settings.academicSession}
        />

        {/* Main Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto">
          {renderCurrentScreen()}
        </main>

        {/* Bottom Tab Bar (Visible on primary screens) */}
        {!wizardOpen && !viewingReport && (
          <BottomTabBar
            activeTab={activeTab}
            onTabChange={(tabId) => {
              setActiveTab(tabId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            pendingActionCount={pendingActionsCount}
          />
        )}

        {/* In-App Notifications Drawer */}
        <NotificationsModal
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          notifications={notifications}
          onSelectNotification={(n) => {
            if (n.report) setViewingReport(n.report);
          }}
        />

      </div>

    </div>
  );
}
