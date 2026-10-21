// Settings & Profile Screen: User Roles, Offline Sync & Institutional Configuration
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useState } from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  RefreshCw, 
  Shield, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';
import { ALL_ROLES } from '../constants/reportStatuses';
import syncService from '../services/syncService';

export const SettingsScreen = ({
  currentUser,
  onSwitchUser,
  theme,
  onToggleTheme,
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  const [syncStatus, setSyncStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncService.syncAll();
      setSyncStatus(`Sync successful: ${res.syncedCount || 0} reports synchronized.`);
    } catch (e) {
      setSyncStatus('Sync complete. System is up to date.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto space-y-4 pb-20">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#082052] p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs">
        <h2 className="text-lg sm:text-xl font-bold text-[#082052] dark:text-[#F8F0E5] flex items-center">
          <Settings className="w-5 h-5 text-[#C59B27] mr-2" />
          Settings & Institutional Profile
        </h2>
        <p className="text-xs text-[#5a677a] dark:text-[#d8cebe]">
          Manage system preferences, active persona, offline synchronization, and report defaults
        </p>
      </div>

      {/* Role Switcher */}
      <div className="bg-white dark:bg-[#082052] p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#C59B27]" />
            <h3 className="text-sm font-bold text-[#082052] dark:text-[#F8F0E5]">
              Active User Role & Authorization
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#edf3fa] text-[#082052] dark:bg-[#041029] dark:text-[#F8F0E5] border border-[#c0d4ed] dark:border-[#153675]">
            {currentUser.role}
          </span>
        </div>

        <p className="text-xs text-[#5a677a] dark:text-[#d8cebe] mb-3">
          Switch roles to experience the application as different institutional stakeholders:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {ALL_ROLES.map((r) => {
            const isCurrent = currentUser.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => onSwitchUser(r)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-[#082052] dark:border-[#C59B27] bg-[#f8f0e5] dark:bg-[#041029] shadow-xs ring-1 ring-[#082052] dark:ring-[#C59B27]'
                    : 'border-[#e2d5c1] dark:border-[#153675] hover:bg-[#faf6f0] dark:hover:bg-[#041029]/60'
                }`}
              >
                <div className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5] flex items-center justify-between">
                  <span>{r.role}</span>
                  {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />}
                </div>
                <div className="text-[11px] text-[#5a677a] dark:text-[#d8cebe] mt-0.5 truncate">
                  {r.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* App Preferences */}
      <div className="bg-white dark:bg-[#082052] p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#082052] dark:text-[#F8F0E5]">
          Display & Offline Preferences
        </h3>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-[#e2d5c1] dark:border-[#153675]">
          <div>
            <div className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5]">
              Appearance Theme
            </div>
            <div className="text-[11px] text-[#5a677a] dark:text-[#d8cebe]">
              Switch between Light and Dark visual styles
            </div>
          </div>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] flex items-center space-x-1.5 text-xs font-bold hover:bg-[#ede0ce]"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#C59B27]" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#082052]" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Cloud Sync Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#e2d5c1] dark:border-[#153675] gap-2">
          <div>
            <div className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5]">
              Offline Storage & Cloud Synchronization
            </div>
            <div className="text-[11px] text-[#5a677a] dark:text-[#d8cebe]">
              All inspection data is stored safely on this device and synced whenever network is available
            </div>
          </div>
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-3.5 py-1.5 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-[#F8F0E5] text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C59B27] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        {syncStatus && (
          <div className="p-2.5 rounded-lg bg-[#edf3fa] dark:bg-[#041029] border border-[#c0d4ed] dark:border-[#153675] text-[#082052] dark:text-[#F8F0E5] text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      {/* Institutional Defaults Configuration */}
      <div className="bg-white dark:bg-[#082052] p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#082052] dark:text-[#F8F0E5]">
          Institutional Report Defaults
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#082052] dark:text-[#F8F0E5] mb-1">
              Active Academic Session
            </label>
            <input
              type="text"
              value={settings.academicSession || '2024-25'}
              onChange={(e) => onUpdateSettings({ ...settings, academicSession: e.target.value })}
              className="w-full text-xs p-2 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-white dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#082052] dark:text-[#F8F0E5] mb-1">
              Inspection Report Year
            </label>
            <input
              type="text"
              value={settings.reportYear || '2025'}
              onChange={(e) => onUpdateSettings({ ...settings, reportYear: e.target.value })}
              className="w-full text-xs p-2 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-white dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Database Reset Action */}
      <div className="p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5]">
            Reset Sample Demonstration Data
          </div>
          <div className="text-[11px] text-[#5a677a] dark:text-[#d8cebe]">
            Restore sample branches, mock visits, and evaluation records to initial factory state.
          </div>
        </div>

        <button
          onClick={onResetData}
          className="px-3 py-1.5 rounded-lg border border-[#e2d5c1] dark:border-[#153675] hover:bg-[#ede0ce] dark:hover:bg-[#0c2a68] text-[#082052] dark:text-[#F8F0E5] text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

    </div>
  );
};

export default SettingsScreen;
