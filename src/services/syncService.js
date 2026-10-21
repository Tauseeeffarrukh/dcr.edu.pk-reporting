// Offline Synchronization Service
import syncQueue from '../storage/syncQueue';

export const syncService = {
  isOnline: () => {
    return typeof navigator !== 'undefined' && 'onLine' in navigator ? navigator.onLine : true;
  },

  syncAllPending: async (onProgress = () => {}) => {
    const queue = syncQueue.getQueue();
    const pending = queue.filter((item) => item.status === 'pending' || item.status === 'failed');

    if (pending.length === 0) {
      return { success: true, count: 0 };
    }

    let syncedCount = 0;
    for (let i = 0; i < pending.length; i++) {
      const item = pending[i];
      try {
        // Simulate network dispatch
        await new Promise((res) => setTimeout(res, 300));
        syncQueue.removeFromQueue(item.id);
        syncedCount++;
        onProgress(syncedCount, pending.length);
      } catch (err) {
        console.error('Failed to sync item:', item.id, err);
      }
    }

    return {
      success: true,
      count: syncedCount,
      syncedCount,
    };
  },

  syncAll: async (onProgress = () => {}) => {
    return await syncService.syncAllPending(onProgress);
  },
};

export default syncService;
