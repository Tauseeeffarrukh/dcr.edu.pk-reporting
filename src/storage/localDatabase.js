// Local offline database abstraction for reports, schools, and app settings
import { mockSchools } from '../data/mockSchools';
import { mockRegions } from '../data/mockRegions';
import { mockMonitoringReports } from '../data/mockMonitoringReports';
import { DEFAULT_PERFORMANCE_CATEGORIES } from '../utils/performanceCategories';

export const STORAGE_KEYS = {
  REPORTS: 'das_me_reports_db',
  SCHOOLS: 'das_me_schools_db',
  REGIONS: 'das_me_regions_db',
  SETTINGS: 'das_me_app_settings',
  NOTIFICATIONS: 'das_me_notifications_db',
};

export const DEFAULT_SETTINGS = {
  reportYear: '2025',
  academicSession: '2024-25',
  reportTitle: 'Monitoring & Evaluation Report 2025',
  ratingDisplayMode: 'both', // 'numeric', 'descriptive', 'both'
  performanceCategories: DEFAULT_PERFORMANCE_CATEGORIES,
  allowOfflineSync: true,
  autoSaveIntervalSeconds: 30,
};

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_01',
    title: 'Report Approved',
    message: 'Report DAS-M&E-2025-014 for Model Town Campus has been approved by Regional Director.',
    timestamp: '2 hours ago',
    type: 'success',
    read: false,
  },
  {
    id: 'notif_02',
    title: 'Action Item Due Soon',
    message: 'Corrective action for Science Lab eyewash calibration at Model Town Campus is due in 3 days.',
    timestamp: '5 hours ago',
    type: 'warning',
    read: false,
  },
  {
    id: 'notif_03',
    title: 'New Visit Assigned',
    message: 'You have been assigned to conduct an M&E audit at Peoples Colony Campus on 24th March.',
    timestamp: '1 day ago',
    type: 'info',
    read: true,
  },
];

export const initDefaultData = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(mockMonitoringReports));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCHOOLS)) {
      localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(mockSchools));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REGIONS)) {
      localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(mockRegions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
  } catch (e) {
    console.error('Failed to initialize local database defaults', e);
  }
};

export const resetData = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(mockMonitoringReports));
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(mockSchools));
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(mockRegions));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    return true;
  } catch (e) {
    console.error('Failed to reset local database defaults', e);
    return false;
  }
};

export const getReports = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return mockMonitoringReports;
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : mockMonitoringReports;
  } catch {
    return mockMonitoringReports;
  }
};

export const saveReport = (report) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const current = getReports();
    const idx = current.findIndex((r) => r.id === report.id);
    let updated;
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = { ...updated[idx], ...report, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...report, createdAt: new Date().toISOString() }, ...current];
    }
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving report to local db', e);
    return null;
  }
};

export const deleteReport = (id) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const current = getReports();
    const filtered = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));
    return filtered;
  } catch {
    return [];
  }
};

export const getSchools = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return mockSchools;
    const data = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
    return data ? JSON.parse(data) : mockSchools;
  } catch {
    return mockSchools;
  }
};

export const getRegions = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return mockRegions;
    const data = localStorage.getItem(STORAGE_KEYS.REGIONS);
    return data ? JSON.parse(data) : mockRegions;
  } catch {
    return mockRegions;
  }
};

export const getNotifications = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_NOTIFICATIONS;
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
};

export const markNotificationRead = (id) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const notifs = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return notifs;
  } catch {
    return [];
  }
};

export const getSettings = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_SETTINGS;
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_SETTINGS;
    const updated = { ...getSettings(), ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const localDatabase = {
  initDefaultData,
  resetData,
  getReports,
  saveReport,
  deleteReport,
  getSchools,
  getRegions,
  getNotifications,
  markNotificationRead,
  getSettings,
  saveSettings,
};

export default localDatabase;
