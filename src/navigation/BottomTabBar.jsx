// Bottom Tab Navigation Bar for Android Mobile First UX
// Redesigned with Etoile Palette: #082052 (Navy), #F8F0E5 (Alabaster Cream), #C59B27 (Etoile Gold)
import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Building2, 
  FileText, 
  CheckSquare, 
  User 
} from 'lucide-react';

export const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'visits', label: 'Visits', icon: ClipboardCheck },
  { id: 'schools', label: 'Schools', icon: Building2 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'action_plan', label: 'Action Plan', icon: CheckSquare },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomTabBar = ({
  activeTab = 'dashboard',
  onTabChange,
  pendingActionCount = 0,
}) => {
  return (
    <nav className="bg-white dark:bg-[#082052] border-t border-[#e2d5c1] dark:border-[#153675] shadow-lg px-2 py-1.5 flex items-center justify-around z-40">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-1 px-1 flex flex-col items-center justify-center relative transition-colors ${
              isActive
                ? 'text-[#082052] dark:text-[#F8F0E5] font-bold'
                : 'text-[#7f8c9f] dark:text-[#d8cebe]/70 hover:text-[#082052] dark:hover:text-[#F8F0E5]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {tab.id === 'action_plan' && pendingActionCount > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-[#C59B27] text-[#082052] rounded-full text-[8px] font-bold flex items-center justify-center ring-1 ring-white dark:ring-[#082052]">
                  {pendingActionCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight leading-none whitespace-nowrap">
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27] mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomTabBar;
