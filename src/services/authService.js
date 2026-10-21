// Authentication & Role Management Service
import { USER_ROLES } from '../constants/reportStatuses';

const AUTH_USER_KEY = 'das_me_authenticated_user';

export const MOCK_USERS = [
  {
    id: 'usr_mo_01',
    name: 'Muhammad Salman Siddiqui',
    role: USER_ROLES.MONITORING_OFFICER,
    designation: 'Senior Monitoring & Evaluation Officer',
    region: 'Lahore Central Region',
    email: 'salman.me@dar-e-arqam.edu.pk',
    phone: '0302-8877665',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
  },
  {
    id: 'usr_admin_01',
    name: 'Dr. Waqar Ahmad',
    role: USER_ROLES.CENTRAL_ADMIN,
    designation: 'Central Director of Academics & M&E',
    region: 'Head Office Lahore',
    email: 'admin.me@dar-e-arqam.edu.pk',
    phone: '0300-1122334',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
  },
  {
    id: 'usr_rd_01',
    name: 'Prof. Muhammad Arshad Nadeem',
    role: USER_ROLES.REGIONAL_DIRECTOR,
    designation: 'Regional Director (Central Regions)',
    region: 'Lahore Central Region',
    email: 'rd.lahore@dar-e-arqam.edu.pk',
    phone: '0321-9988776',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
  },
  {
    id: 'usr_rm_01',
    name: 'Hafiz Muhammad Bilal',
    role: USER_ROLES.REGIONAL_MANAGER,
    designation: 'Regional Manager M&E',
    region: 'Lahore Central Region',
    email: 'rm.lahore@dar-e-arqam.edu.pk',
    phone: '0333-5544332',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
  },
  {
    id: 'usr_pr_01',
    name: 'Mrs. Farzana Kausar',
    role: USER_ROLES.PRINCIPAL,
    designation: 'Campus Principal',
    region: 'Lahore Central Region',
    schoolId: 'sch_lhr_model_town',
    branchName: 'Model Town Campus (Boys & Girls)',
    email: 'principal.modeltown@dar-e-arqam.edu.pk',
    phone: '0300-8451234',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
  },
  {
    id: 'usr_dir_01',
    name: 'Chaudhry Muhammad Saleem',
    role: USER_ROLES.SCHOOL_DIRECTOR,
    designation: 'Campus Director & Board Member',
    region: 'Lahore Central Region',
    schoolId: 'sch_lhr_model_town',
    branchName: 'Model Town Campus (Boys & Girls)',
    email: 'director.modeltown@dar-e-arqam.edu.pk',
    phone: '0321-4567890',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop',
  },
  {
    id: 'usr_rev_01',
    name: 'Tariq Mehmood Hashmi',
    role: USER_ROLES.REVIEWER,
    designation: 'External Quality Auditor',
    region: 'Central Regions',
    email: 'reviewer@dar-e-arqam.edu.pk',
    phone: '0345-2233445',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop',
  },
  {
    id: 'usr_view_01',
    name: 'Executive Guest',
    role: USER_ROLES.VIEWER,
    designation: 'Central Trustee / Read-only Observer',
    region: 'All Regions',
    email: 'viewer@dar-e-arqam.edu.pk',
    phone: '0300-0000000',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
  },
];

export const authService = {
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : MOCK_USERS[0]; // Default to Monitoring Officer
    } catch {
      return MOCK_USERS[0];
    }
  },

  setCurrentUser: (user) => {
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      return user;
    } catch (e) {
      console.error('Failed to set current user', e);
      return user;
    }
  },

  loginWithRole: (role) => {
    const user = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    return authService.setCurrentUser(user);
  },

  logout: () => {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  },

  getAllMockUsers: () => MOCK_USERS,

  getMockUserByRole: (role) => {
    return MOCK_USERS.find((u) => u.role === role) || null;
  },
};

export default authService;
