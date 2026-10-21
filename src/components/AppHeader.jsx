// Institutional Header for Dar-e-Arqam M&E System
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Etoile Gold)
import React, { useState } from 'react';
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Smartphone, 
  Maximize2, 
  Moon, 
  Sun, 
  UserCheck, 
  Settings as SettingsIcon,
  ChevronDown,
  Check,
  Sparkles
} from 'lucide-react';
import { USER_ROLES_LIST } from '../constants/reportStatuses';

export const AppHeader = ({
  currentUser,
  onSwitchRole,
  isOnline = true,
  pendingSyncCount = 0,
  onSyncNow = () => {},
  isSyncing = false,
  isMobileDeviceFrame = false,
  onToggleDeviceFrame = () => {},
  isDarkMode = false,
  onToggleDarkMode = () => {},
  unreadNotifsCount = 2,
  onOpenNotifications = () => {},
  onOpenSettings = () => {},
  academicSession = '2024-25',
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="bg-[#082052] text-[#F8F0E5] shadow-md border-b border-[#041029] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between">
        
        {/* Brand Zone - Clean typography and official emblem */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#041029] border border-[#C59B27]/50 flex flex-col items-center justify-center font-extrabold shadow-xs shrink-0">
            <span className="text-[#C59B27] text-[11px] font-black leading-none tracking-tight">DAS</span>
            <span className="text-[8px] text-[#F8F0E5]/90 tracking-tighter mt-0.5 font-bold">M&E</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-sm sm:text-base text-[#F8F0E5] tracking-tight leading-none whitespace-nowrap">
                DAR-E-ARQAM SCHOOLS
              </h1>
              <span className="hidden sm:inline-block text-[#C59B27] text-xs font-semibold">
                · Session {academicSession}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#F8F0E5]/75 font-medium tracking-wide mt-0.5 truncate max-w-[200px] sm:max-w-none">
              Central Regions · Digital Monitoring & Evaluation Portal
            </p>
          </div>
        </div>

        {/* Right Controls & Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">

          {/* Sync & Offline Status */}
          <button
            onClick={onSyncNow}
            title={isOnline ? (pendingSyncCount > 0 ? `${pendingSyncCount} items pending sync` : 'All inspection data synced') : 'Offline Mode (Inspection data stored locally)'}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              !isOnline 
                ? 'bg-rose-950/80 text-rose-200 border border-rose-800' 
                : pendingSyncCount > 0 
                  ? 'bg-amber-950/70 text-amber-200 border border-amber-700' 
                  : 'bg-[#041029] text-[#F8F0E5] hover:bg-[#0c2a68] border border-[#C59B27]/30'
            }`}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-[#C59B27]" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className="hidden md:inline text-[11px]">
              {!isOnline ? 'Offline' : pendingSyncCount > 0 ? `${pendingSyncCount} Pending` : 'Synced'}
            </span>
            {pendingSyncCount > 0 && (
              <RefreshCw className={`w-3 h-3 text-[#C59B27] ${isSyncing ? 'animate-spin' : ''}`} />
            )}
          </button>

          {/* Device Frame Simulator Toggle */}
          <button
            onClick={onToggleDeviceFrame}
            title={isMobileDeviceFrame ? 'Switch to Full Screen View' : 'Switch to Android Mobile Device Preview'}
            className="p-1.5 rounded-md bg-[#041029] text-[#F8F0E5]/80 hover:text-[#F8F0E5] hover:bg-[#0c2a68] border border-white/10 transition-colors"
          >
            {isMobileDeviceFrame ? (
              <Maximize2 className="w-4 h-4 text-[#C59B27]" />
            ) : (
              <Smartphone className="w-4 h-4 text-[#F8F0E5]/80" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle Light / Dark mode"
            className="p-1.5 rounded-md bg-[#041029] text-[#F8F0E5]/80 hover:text-[#F8F0E5] hover:bg-[#0c2a68] border border-white/10 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#C59B27]" /> : <Moon className="w-4 h-4 text-[#F8F0E5]/80" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-md bg-[#041029] text-[#F8F0E5]/80 hover:text-[#F8F0E5] hover:bg-[#0c2a68] border border-white/10 transition-colors"
            title="Inspection Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C59B27] text-[#082052] rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-[#082052]">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Settings Shortcut */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-md bg-[#041029] text-[#F8F0E5]/80 hover:text-[#F8F0E5] hover:bg-[#0c2a68] border border-white/10 transition-colors"
            title="M&E System Configuration"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Active Role Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1.5 pl-2.5 pr-2 py-1 rounded-md bg-[#041029] border border-[#C59B27]/40 hover:border-[#C59B27] text-left transition-all"
            >
              <div className="hidden lg:block text-right">
                <div className="text-[11px] font-bold text-[#F8F0E5] leading-tight truncate max-w-[120px]">
                  {currentUser?.name?.split(' ')[0] || 'User'}
                </div>
                <div className="text-[9px] text-[#C59B27] font-semibold leading-none truncate max-w-[120px]">
                  {currentUser?.role}
                </div>
              </div>
              <div className="w-6 h-6 rounded-md bg-[#082052] border border-[#C59B27]/50 flex items-center justify-center font-bold text-[10px] text-[#F8F0E5]">
                <UserCheck className="w-3.5 h-3.5 text-[#C59B27]" />
              </div>
              <ChevronDown className="w-3 h-3 text-[#F8F0E5]/70" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#082052] rounded-xl shadow-2xl border border-[#e2d5c1] dark:border-[#153675] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2 border-b border-[#f1e7d8] dark:border-[#153675]">
                  <div className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5]">Switch Active Role</div>
                  <div className="text-[10px] text-[#5a677a] dark:text-[#d8cebe]">Preview field officer, principal or director views</div>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {USER_ROLES_LIST.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onSwitchRole(role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#f8f0e5] dark:hover:bg-[#0e2e6e] transition-colors ${
                        currentUser?.role === role
                          ? 'font-bold text-[#082052] dark:text-[#F8F0E5] bg-[#f8f0e5] dark:bg-[#0e2e6e]'
                          : 'text-[#222d3d] dark:text-slate-200'
                      }`}
                    >
                      <span>{role}</span>
                      {currentUser?.role === role && (
                        <Check className="w-3.5 h-3.5 text-[#C59B27]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default AppHeader;
