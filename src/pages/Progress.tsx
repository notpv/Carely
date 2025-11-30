import React, { useState, useEffect } from 'react';
import { getProgress, saveProgressEntry, clearProgress } from '../lib/storage';
import type { ProgressEntry } from '../lib/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Scale, Moon, Smile, Plus, Trash2, Calendar, AlertTriangle } from 'lucide-react';

const ProgressPage: React.FC = () => {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [entry, setEntry] = useState({ weight: '', sleep: '', mood: '3' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const progressData = getProgress();
    setProgress(progressData);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry.weight && entry.sleep) {
      saveProgressEntry(entry);
      setProgress(getProgress());
      setEntry({ weight: '', sleep: '', mood: '3' });
    }
  };

  const handleClearProgress = () => {
    clearProgress();
    setProgress([]);
    setShowDeleteConfirm(false);
  };

  const formattedData = progress.map(p => ({
    ...p,
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: parseFloat(String(p.weight)),
    sleep: parseFloat(String(p.sleep)),
    mood: parseInt(String(p.mood))
  }));

  const getMoodEmoji = (mood: number): string => {
    const emojis = ['😢', '😕', '😐', '🙂', '😄'];
    return emojis[mood - 1] || '😐';
  };

  const getLatestStats = () => {
    if (progress.length === 0) return null;
    const latest = progress[progress.length - 1];
    const previous = progress.length > 1 ? progress[progress.length - 2] : null;
    
    return {
      weight: {
        current: parseFloat(String(latest.weight)),
        change: previous ? parseFloat(String(latest.weight)) - parseFloat(String(previous.weight)) : 0
      },
      sleep: {
        current: parseFloat(String(latest.sleep)),
        change: previous ? parseFloat(String(latest.sleep)) - parseFloat(String(previous.sleep)) : 0
      },
      mood: parseInt(String(latest.mood))
    };
  };

  const stats = getLatestStats();

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white font-heading mb-2">Track Your Progress</h1>
        <p className="text-gray-400">Monitor your health journey with daily entries</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Scale className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-gray-400 text-sm">Current Weight</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">{stats.weight.current}</span>
              <span className="text-gray-400 mb-1">kg</span>
              {stats.weight.change !== 0 && (
                <span className={`text-sm mb-1 ${stats.weight.change < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.weight.change > 0 ? '+' : ''}{stats.weight.change.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          <div className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Moon className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-gray-400 text-sm">Last Night's Sleep</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">{stats.sleep.current}</span>
              <span className="text-gray-400 mb-1">hours</span>
              {stats.sleep.change !== 0 && (
                <span className={`text-sm mb-1 ${stats.sleep.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.sleep.change > 0 ? '+' : ''}{stats.sleep.change.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          <div className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Smile className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-gray-400 text-sm">Current Mood</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getMoodEmoji(stats.mood)}</span>
              <span className="text-gray-400">{stats.mood}/5</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              Your Journey
            </h2>
            {formattedData.length > 1 ? (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={formattedData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 15, 15, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                    }} 
                  />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="weight" stroke="#c084fc" fill="url(#weightGradient)" name="Weight (kg)" strokeWidth={2} />
                  <Area yAxisId="right" type="monotone" dataKey="sleep" stroke="#60a5fa" fill="url(#sleepGradient)" name="Sleep (hours)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Not Enough Data</h3>
                <p className="text-gray-400 max-w-sm">
                  Log at least two journal entries to see your progress chart. Start tracking your journey today!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Journal Entry Form */}
          <div className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              New Entry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  <Scale className="w-4 h-4 inline mr-2" />
                  Weight (kg)
                </label>
                <input 
                  type="number" 
                  name="weight" 
                  value={entry.weight} 
                  onChange={handleInputChange} 
                  className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder="e.g., 70"
                  step="0.1"
                  required 
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  <Moon className="w-4 h-4 inline mr-2" />
                  Sleep (hours)
                </label>
                <input 
                  type="number" 
                  name="sleep" 
                  value={entry.sleep} 
                  onChange={handleInputChange} 
                  className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder="e.g., 7.5"
                  step="0.5" 
                  required 
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  <Smile className="w-4 h-4 inline mr-2" />
                  Mood
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input 
                    type="range" 
                    name="mood" 
                    min="1" 
                    max="5" 
                    value={entry.mood} 
                    onChange={handleInputChange} 
                    className="flex-1" 
                  />
                  <span className="text-2xl">{getMoodEmoji(parseInt(entry.mood))}</span>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Save Entry
              </button>
            </form>
          </div>

          {/* Manage Data */}
          <div className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white">Manage Data</h2>
            {showDeleteConfirm ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    This will permanently delete all your progress data. This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleClearProgress}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                  >
                    Delete All
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={progress.length === 0}
                className={`w-full font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  progress.length === 0 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20'
                }`}
              >
                <Trash2 className="w-5 h-5" />
                Clear All Progress
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;