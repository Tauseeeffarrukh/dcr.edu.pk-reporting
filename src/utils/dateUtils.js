// Date and Time utility helpers for Dar-e-Arqam M&E System

export const formatDate = (dateString, formatType = 'display') => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    if (formatType === 'iso') {
      return d.toISOString().split('T')[0];
    }
    
    // Format: 16 Sep 2025
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '—';
  try {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const m = minutes || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${m} ${ampm}`;
  } catch {
    return timeString;
  }
};

export const getTodayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDefaultSession = () => {
  const d = new Date();
  const year = d.getFullYear();
  return `${year}-${String(year + 1).slice(2)}`;
};

export default {
  formatDate,
  formatTime,
  getTodayISO,
  getDefaultSession,
};
