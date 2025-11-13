import React from 'react';
import { Users, Zap } from 'lucide-react';

const teamMembers = [
  { name: 'Midde Prerana', role: 'Team Member' },
  { name: 'N M Bhavana', role: 'Team Member' },
  { name: 'Pranav Vinod Pillai', role: 'Team Member' },
  { name: 'R S Chiraag', role: 'Team Member' },
  { name: 'Rishika Talasila', role: 'Team Member' },
  { name: 'Dr. Savitha Hiremath', role: 'Mentor' },
];

const AboutPage = () => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">About Carely</h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Our mission is to make personalized health guidance accessible to everyone, everywhere, using the power of cutting-edge AI.
        </p>
      </div>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg mb-12">
        <div className="flex items-center gap-4 mb-4">
          <Zap className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-white">Our Platform</h2>
        </div>
        <p className="text-gray-300 leading-relaxed">
          Carely is an innovative health advisory platform that moves beyond generic advice. By analyzing your unique health profile—including demographics, activity levels, medical conditions, and personal goals—our AI generates a holistic and actionable plan covering diet, exercise, sleep, and stress management. We believe that personalization is key to building sustainable, healthy habits, and we provide transparent, evidence-based reasoning for every recommendation.
        </p>
      </div>

      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Users className="w-10 h-10 text-primary" />
          <h2 className="text-3xl font-bold text-white">Meet the Team</h2>
        </div>
        <p className="text-lg text-gray-400">A passionate team of university students dedicated to leveraging technology for better health outcomes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-gray-800 text-center p-8 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-primary-500/20 transition-all duration-300">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark mx-auto mb-4 flex items-center justify-center text-white text-4xl font-heading">
              {member.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-primary-300">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
