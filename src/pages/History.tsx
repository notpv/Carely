import React, { useState, useEffect } from 'react';
import { getHistory } from '../lib/storage';
import type { Plan } from '../lib/storage';
import { ChevronDown, ChevronUp, Calendar, Target, FileText, Activity, Apple, Moon, Brain, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';

const getPlanTitle = (goals: string[]): string => {
    if (!goals || goals.length === 0) return "Your Personalized Wellness Plan";
    const primaryGoal = goals[0];
    const titleMap: Record<string, string> = {
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

const categoryIcons = {
  diet: Apple,
  exercise: Activity,
  sleep: Moon,
  stress: Brain,
};

const categoryColors = {
  diet: 'text-green-400',
  exercise: 'text-blue-400',
  sleep: 'text-purple-400',
  stress: 'text-pink-400',
};

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Plan[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const toggleItem = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (history.length === 0) {
    return (
      <div className="text-center animate-fadeIn py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white font-heading">No Plans Yet</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          You haven't created any health plans yet. Start your wellness journey by creating your first personalized plan.
        </p>
        <Link 
          to="/my-plan"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary/25"
        >
          <Target className="w-5 h-5" />
          Create Your First Plan
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white font-heading mb-2">Your Health Plan History</h1>
        <p className="text-gray-400">
          You have {history.length} saved plan{history.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {history.map((item, index) => (
          <div 
            key={index} 
            className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden animate-fadeIn transition-all duration-300 hover:border-primary/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex justify-between items-center p-6 text-left transition-colors hover:bg-white/5"
              aria-expanded={expanded === index}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20 flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-1">
                    {getPlanTitle(item.profile.goals || [])}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  {item.profile.goals && item.profile.goals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.profile.goals.slice(0, 3).map((goal, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {goal}
                        </span>
                      ))}
                      {item.profile.goals.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400">
                          +{item.profile.goals.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className={`p-2 rounded-lg transition-colors ${expanded === index ? 'bg-primary/20' : 'bg-white/5'}`}>
                {expanded === index ? (
                  <ChevronUp className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expanded === index && (
              <div className="p-6 border-t border-white/10 bg-white/5 animate-fadeIn">
                {/* Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{item.recommendations.summary}</p>
                </div>

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['diet', 'exercise', 'sleep', 'stress'] as const).map((category) => {
                    const IconComponent = categoryIcons[category];
                    const colorClass = categoryColors[category];
                    const data = item.recommendations[category];
                    
                    if (!data) return null;
                    
                    return (
                      <div key={category} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                          <IconComponent className={`w-5 h-5 ${colorClass}`} />
                          <h4 className="font-semibold text-white capitalize">{category}</h4>
                        </div>
                        <div className="text-gray-400 text-sm prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {data.advice}
                          </ReactMarkdown>
                        </div>
                      </div>
                    );
                  })}
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