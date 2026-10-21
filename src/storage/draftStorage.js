// Draft Autosave and Recovery Manager
const DRAFT_STORAGE_KEY = 'das_me_visit_draft';

export const draftStorage = {
  saveDraft: (visitFormData, currentStep = 1) => {
    try {
      const payload = {
        formData: visitFormData,
        currentStep,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error('Draft autosave failed', e);
      return false;
    }
  },

  getDraft: () => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearDraft: () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear draft', e);
    }
  },

  hasDraft: () => {
    try {
      return !!localStorage.getItem(DRAFT_STORAGE_KEY);
    } catch {
      return false;
    }
  },
};

export default draftStorage;
