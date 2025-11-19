import React, { useState, useEffect } from 'react';
import { getProgress, saveProgressEntry, clearProgress } from '../lib/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [entry, setEntry] = useState({ weight: '', sleep: '', mood: '3' });

  useEffect(() => {
    const progressData = getProgress();
    setProgress(progressData);
  }, []);

  const handleInputChange = (e) => setEntry({ ...entry, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entry.weight && entry.sleep) {
      saveProgressEntry(entry);
      setProgress(getProgress());
      setEntry({ weight: '', sleep: '', mood: '3' });
    }
  };

  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all your progress data? This action cannot be undone.')) {
      clearProgress();
      setProgress([]);
    }
  };

  const formattedData = progress.map(p => ({
      ...p,
      date: new Date(p.date).toLocaleDateString(),
      weight: parseFloat(p.weight),
      sleep: parseFloat(p.sleep),
      mood: parseInt(p.mood)
  }));

  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8 text-center">Track Your Progress</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
            {/* Chart Section */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Your Journey</h2>
              {formattedData.length > 1 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="date" stroke="#A0AEC0" />
                    <YAxis yAxisId="left" stroke="#A0AEC0" />
                    <YAxis yAxisId="right" orientation="right" stroke="#A0AEC0" />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#c084fc" name="Weight (kg)" />
                    <Line yAxisId="right" type="monotone" dataKey="sleep" stroke="#60a5fa" name="Sleep (hours)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-600 dark:text-gray-400">Log at least two journal entries to see your progress chart.</p>
                </div>
              )}
            </div>
        </div>

        <div className="space-y-8">
            {/* Journal Entry Section */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Add New Journal Entry</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-300">Weight (kg)</label>
                  <input type="number" name="weight" value={entry.weight} onChange={handleInputChange} className="w-full p-3 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white" required />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-300">Sleep (hours)</label>
                  <input type="number" name="sleep" value={entry.sleep} onChange={handleInputChange} className="w-full p-3 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white" step="0.5" required />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-300">Mood (1-5)</label>
                  <input type="range" name="mood" min="1" max="5" value={entry.mood} onChange={handleInputChange} className="w-full slider-primary" />
                  <div className="text-center text-primary font-bold">{entry.mood}</div>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md">
                  Save Entry
                </button>
              </form>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Manage Data</h2>
                <button onClick={handleClearProgress} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md">
                    Clear All Progress
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;