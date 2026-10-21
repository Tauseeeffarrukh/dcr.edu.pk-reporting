// Central API Abstraction for Dar-e-Arqam M&E System
// Designed for seamless transition from offline mock storage to real backend REST/GraphQL endpoints
import localDatabase from '../storage/localDatabase';
import syncQueue from '../storage/syncQueue';

export const api = {
  // Reports
  fetchReports: async () => {
    // Simulating network delay
    await new Promise((res) => setTimeout(res, 150));
    return localDatabase.getReports();
  },

  fetchReportById: async (id) => {
    await new Promise((res) => setTimeout(res, 100));
    const reports = localDatabase.getReports();
    return reports.find((r) => r.id === id) || null;
  },

  createReport: async (reportData) => {
    await new Promise((res) => setTimeout(res, 200));
    const saved = localDatabase.saveReport(reportData);
    syncQueue.enqueue('CREATE_REPORT', reportData);
    return saved;
  },

  updateReport: async (reportData) => {
    await new Promise((res) => setTimeout(res, 200));
    const saved = localDatabase.saveReport(reportData);
    syncQueue.enqueue('UPDATE_REPORT', reportData);
    return saved;
  },

  deleteReport: async (id) => {
    await new Promise((res) => setTimeout(res, 150));
    return localDatabase.deleteReport(id);
  },

  // Schools & Regions
  fetchSchools: async () => {
    await new Promise((res) => setTimeout(res, 100));
    return localDatabase.getSchools();
  },

  fetchRegions: async () => {
    await new Promise((res) => setTimeout(res, 100));
    return localDatabase.getRegions();
  },

  // Notifications
  fetchNotifications: async () => {
    return localDatabase.getNotifications();
  },

  markNotificationAsRead: async (id) => {
    return localDatabase.markNotificationRead(id);
  },

  // Settings
  fetchSettings: async () => {
    return localDatabase.getSettings();
  },

  updateSettings: async (settings) => {
    return localDatabase.saveSettings(settings);
  },
};

export default api;
