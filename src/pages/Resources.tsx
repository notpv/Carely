import React from 'react';
import { BookOpen, ExternalLink, Heart, Activity, Moon, Brain, Sparkles, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Resource {
  title: string;
  description: string;
  link: string;
  category: 'general' | 'exercise' | 'sleep' | 'mental';
}

const resources: Resource[] = [
  {
    title: 'World Health Organization (WHO)',
    description: 'Global public health information, guidelines, and research from the leading international health authority.',
    link: 'https://www.who.int',
    category: 'general',
  },
  {
    title: 'Mayo Clinic',
    description: 'Comprehensive health information, disease conditions, and treatment options from trusted medical professionals.',
    link: 'https://www.mayoclinic.org',
    category: 'general',
  },
  {
    title: 'WebMD',
    description: 'Trusted medical information, symptom checker, and latest health news for everyday wellness.',
    link: 'https://www.webmd.com',
    category: 'general',
  },
  {
    title: 'National Institutes of Health (NIH)',
    description: 'U.S. medical research agency with cutting-edge health information and clinical trial data.',
    link: 'https://www.nih.gov/health-information',
    category: 'general',
  },
  {
    title: 'ExRx.net',
    description: 'Comprehensive exercise library with detailed instructions, muscle targeting, and workout programs.',
    link: 'https://exrx.net',
    category: 'exercise',
  },
  {
    title: 'Sleep Foundation',
    description: 'Evidence-based information on sleep health, disorders, and tips for better rest.',
    link: 'https://www.sleepfoundation.org',
    category: 'sleep',
  },
  {
    title: 'Mental Health America',
    description: 'Mental health resources, screening tools, and information for understanding and managing mental well-being.',
    link: 'https://www.mhanational.org',
    category: 'mental',
  },
  {
    title: 'Headspace',
    description: 'Meditation and mindfulness techniques, guided sessions, and tools for stress reduction.',
    link: 'https://www.headspace.com',
    category: 'mental',
  },
];

const categoryIcons = {
  general: Heart,
  exercise: Activity,
  sleep: Moon,
  mental: Brain,
};

const categoryColors = {
  general: 'from-red-500 to-red-600',
  exercise: 'from-green-500 to-green-600',
  sleep: 'from-purple-500 to-purple-600',
  mental: 'from-blue-500 to-blue-600',
};

const ResourcesPage: React.FC = () => {
  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white font-heading mb-4">Health Resources</h1>
        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Curated collection of credible external resources for further reading. Always consult a healthcare professional for personalized medical advice.
        </p>
      </div>

      {/* Featured: AI Meditation */}
      <Link
        to="/meditation"
        className="block group bg-gradient-to-r from-purple-900/50 to-primary/30 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
      >
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-primary shadow-lg flex-shrink-0">
            <Wind className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                AI-Guided Meditation
              </h2>
              <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full uppercase tracking-wide">
                New Feature
              </span>
            </div>
            <p className="text-gray-400">
              Experience personalized meditation scripts and audio generated specifically for your emotional state. Our AI creates unique, therapeutic content tailored to your needs.
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors flex-shrink-0" />
        </div>
      </Link>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => {
          const IconComponent = categoryIcons[resource.category];
          const colorClass = categoryColors[resource.category];
          
          return (
            <a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass} shadow-lg flex-shrink-0`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold text-white group-hover:text-primary transition-colors truncate">
                      {resource.title}
                    </h2>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mt-8">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/20 flex-shrink-0">
            <BookOpen className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-yellow-400 font-semibold mb-1">Important Note</h3>
            <p className="text-gray-400 text-sm">
              These resources are provided for educational purposes only. The information found on these websites should not replace professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;