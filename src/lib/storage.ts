const USER_KEY = 'carely_user';
const HISTORY_KEY = 'carely_history';
const PROGRESS_KEY = 'carely_progress';

export interface User {
    name?: string;
    createdAt?: string;
    age?: string | number;
    gender?: string;
    weight?: string | number;
    height?: string | number;
    activityLevel?: string;
    conditions?: string[];
    dietPreference?: string;
    sleepHours?: string | number;
    goals?: string[];
    otherCondition?: string;
    otherGoal?: string;
    stressLevel?: string;
    sleepQuality?: string;
    alcoholConsumption?: string;
    smokingHabits?: string;
    workLifeBalance?: string;
    [key: string]: any;
}

export interface Plan {
    profile: User;
    recommendations: any;
    date: string;
}

export interface ProgressEntry {
    weight: string | number;
    sleep: string | number;
    mood: string | number;
    date: string;
}

export const saveUser = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const savePlanToHistory = (plan: Omit<Plan, 'date'>): void => {
    const history = getHistory();
    history.unshift({ ...plan, date: new Date().toISOString() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const getHistory = (): Plan[] => {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
};

export const saveProgressEntry = (entry: Omit<ProgressEntry, 'date'>): void => {
    const progress = getProgress();
    progress.push({ ...entry, date: new Date().toISOString() });
    // Sort by date to ensure the chart is correct
    progress.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const getProgress = (): ProgressEntry[] => {
    const progress = localStorage.getItem(PROGRESS_KEY);
    return progress ? JSON.parse(progress) : [];
};

export const clearProgress = (): void => {
    localStorage.removeItem(PROGRESS_KEY);
};
