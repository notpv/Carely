const USER_KEY = 'carely_user';
const HISTORY_KEY = 'carely_history';
const PROGRESS_KEY = 'carely_progress';

export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const savePlanToHistory = (plan) => {
  const history = getHistory();
  history.unshift({ ...plan, date: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const getHistory = () => {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const saveProgressEntry = (entry) => {
    const progress = getProgress();
    progress.push({ ...entry, date: new Date().toISOString() });
    // Sort by date to ensure the chart is correct
    progress.sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const getProgress = () => {
    const progress = localStorage.getItem(PROGRESS_KEY);
    return progress ? JSON.parse(progress) : [];
};