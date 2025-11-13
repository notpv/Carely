import React from 'react';
import { Heart } from 'lucide-react';

const Disclaimer = ({ onAccept }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full p-8 rounded-2xl bg-gray-800 shadow-2xl border border-red-500/30">
        <div className="text-center mb-6">
          <Heart className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold mb-2 text-white">Medical Disclaimer</h2>
        </div>
        <div className="space-y-4 text-sm text-gray-300">
          <p className="leading-relaxed">
            This AI-powered Personalized Health Advice Generator is designed for <strong>informational and educational purposes only</strong>.
          </p>
          <div className="space-y-2 pl-4 border-l-4 border-red-500">
            <p>• This tool is <strong>NOT a substitute</strong> for professional medical advice, diagnosis, or treatment.</p>
            <p>• Always consult with qualified healthcare professionals before making any health-related decisions.</p>
            <p>• In case of medical emergencies, contact emergency services immediately.</p>
          </div>
          <p className="leading-relaxed pt-4">
            By continuing, you acknowledge that you understand and accept these terms.
          </p>
        </div>
        <button
          onClick={onAccept}
          className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          I Understand - Continue
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;
