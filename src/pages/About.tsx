import React from 'react';
import { Users, Zap, Heart, Target, Shield, Sparkles } from 'lucide-react';

const teamMembers = [
  { name: 'Midde Prerana', role: 'Team Member', initials: 'MP' },
  { name: 'N M Bhavana', role: 'Team Member', initials: 'NB' },
  { name: 'Pranav Vinod Pillai', role: 'Team Member', initials: 'PV' },
  { name: 'R S Chiraag', role: 'Team Member', initials: 'RC' },
  { name: 'Rishika Talasila', role: 'Team Member', initials: 'RT' },
  { name: 'Dr. Savitha Hiremath', role: 'Mentor', initials: 'SH' },
];

const features = [
  {
    icon: Target,
    title: 'Personalized Plans',
    description: 'AI-generated health recommendations tailored to your unique profile and goals.'
  },
  {
    icon: Shield,
    title: 'Evidence-Based',
    description: 'All recommendations are backed by current health and wellness research.'
  },
  {
    icon: Sparkles,
    title: 'Holistic Approach',
    description: 'Covering diet, exercise, sleep, and stress management for complete wellness.'
  }
];

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fadeIn space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <Heart className="w-8 h-8 text-primary animate-float" />
        </div>
        <h1 className="text-5xl font-bold text-white font-heading mb-4">About Carely</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Our mission is to make personalized health guidance accessible to everyone, everywhere, using the power of cutting-edge AI technology.
        </p>
      </div>

      {/* Platform Section */}
      <div className="bg-card/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-primary/20">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white font-heading">Our Platform</h2>
        </div>
        <p className="text-gray-300 leading-relaxed text-lg mb-8">
          Carely is an innovative health advisory platform that moves beyond generic advice. By analyzing your unique health profile—including demographics, activity levels, medical conditions, and personal goals—our AI generates a holistic and actionable plan covering diet, exercise, sleep, and stress management.
        </p>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-white font-heading">Meet the Team</h2>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto">
            A passionate team of university students dedicated to leveraging technology for better health outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-card/95 backdrop-blur-sm text-center p-8 rounded-2xl shadow-lg border border-white/10 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold font-heading shadow-lg shadow-primary/25">
                {member.initials}
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
              <p className={`text-sm ${member.role === 'Mentor' ? 'text-primary font-medium' : 'text-gray-400'}`}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-2xl p-10 border border-primary/20">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Health Journey?</h2>
        <p className="text-gray-400 mb-6">Get your personalized health plan in minutes.</p>
        <a 
          href="/my-plan" 
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary/25"
        >
          <Sparkles className="w-5 h-5" />
          Create Your Plan
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
