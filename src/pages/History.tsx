import React, { useState, useEffect } from 'react';
import { getHistory } from '../lib/storage';
import { ChevronDown, ChevronUp } from 'lucide-react';

const getPlanTitle = (goals) => {
    const primaryGoal = goals[0];
    const titleMap = {
        'Weight Loss': "Your Path to a Lighter You",
        'Muscle Gain': "Blueprint for a Stronger Physique",
        'Better Sleep': "Journey to Restful Nights",
        'Stress Management': "Finding Your Inner Calm",
        'Increased Energy': "Unlocking Your Energy Potential",
        'Better Digestion': "A Guide to a Happy Gut",
        'Improve Flexibility': "Your Flexibility and Mobility Plan"
    };
    return titleMap[primaryGoal] || "Your Personalized Wellness Plan";
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const toggleItem = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  if (history.length === 0) {
    return (
      <div className="text-center animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">History</h1>
        <p className="text-gray-700 dark:text-gray-400">You have no saved health plans yet.</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Health Plan History</h1>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md animate-fadeIn" style={{ animationDelay: `${index * 100}ms`}}>
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex justify-between items-center p-6 text-left transition-colors hover:bg-gray-200 dark:hover:bg-gray-700/50"
            >
              <div>
                <p className="text-xl font-semibold">
                  {getPlanTitle(item.profile.goals)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created on {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              {expanded === index ? <ChevronUp className="w-6 h-6 text-primary" /> : <ChevronDown className="w-6 h-6 text-primary" />}
            </button>
            {expanded === index && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-primary">Summary</h3>
                <p className="text-gray-800 dark:text-gray-300 mb-4">{item.recommendations.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold">Diet</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.recommendations.diet.advice}</p>
                  </div>
                  <div>
                    <h4 className="font-bold">Exercise</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.recommendations.exercise.advice}</p>
                  </div>
                  <div>
                    <h4 className="font-bold">Sleep</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.recommendations.sleep.advice}</p>
                  </div>
                  <div>
                    <h4 className="font-bold">Stress</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.recommendations.stress.advice}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;