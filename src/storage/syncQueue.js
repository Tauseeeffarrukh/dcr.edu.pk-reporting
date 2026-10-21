// Offline Sync Queue for Background Dispatching
const SYNC_QUEUE_KEY = 'das_me_sync_queue';

export const syncQueue = {
  getQueue: () => {
    try {
      const raw = localStorage.getItem(SYNC_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  enqueue: (action, payload) => {
    try {
      const queue = syncQueue.getQueue();
      const item = {
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        action,
        payload,
        status: 'pending', // 'pending', 'syncing', 'failed', 'synced'
        attempts: 0,
        createdAt: new Date().toISOString(),
      };
      queue.push(item);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      return item;
    } catch (e) {
      console.error('Failed to enqueue sync item', e);
      return null;
    }
  },

  removeFromQueue: (itemId) => {
    try {
      const queue = syncQueue.getQueue().filter((item) => item.id !== itemId);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      return queue;
    } catch {
      return [];
    }
  },

  clearQueue: () => {
    try {
      localStorage.removeItem(SYNC_QUEUE_KEY);
    } catch (e) {
      console.error('Failed to clear sync queue', e);
    }
  },

  getPendingCount: () => {
    return syncQueue.getQueue().filter((item) => item.status === 'pending' || item.status === 'failed').length;
  },
};

export default syncQueue;
