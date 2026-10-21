// In-App Notification Drawer for Workflow Events
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export const NotificationsModal = ({
  isOpen,
  onClose,
  notifications = [],
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-xs p-2 sm:p-4">
      <div className="bg-white dark:bg-[#082052] rounded-2xl border border-[#e2d5c1] dark:border-[#153675] shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-top-4">
        
        {/* Header */}
        <div className="p-4 border-b border-[#e2d5c1] dark:border-[#153675] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#C59B27]" />
            <h3 className="font-bold text-[#082052] dark:text-[#F8F0E5] text-sm">
              Notifications & Activity Alerts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#faf6f0] dark:hover:bg-[#041029] text-[#7f8c9f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto divide-y divide-[#e2d5c1] dark:divide-[#153675] space-y-2">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectNotification && onSelectNotification(n);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-[#faf6f0] dark:hover:bg-[#0e2e6e]/60 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] shrink-0 mt-0.5 border border-[#c0d4ed] dark:border-[#153675]">
                    {n.type === 'approval' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#082052] dark:text-[#C59B27]" />
                    ) : n.type === 'returned' ? (
                      <RotateCcw className="w-4 h-4 text-rose-500" />
                    ) : (
                      <Bell className="w-4 h-4 text-[#C59B27]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5]">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-[#5a677a] dark:text-[#d8cebe] mt-0.5">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-[#7f8c9f] font-mono mt-1 block">
                      {formatDate(n.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-[#7f8c9f]">
              No recent notifications.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationsModal;
