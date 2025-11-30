import React, { useState } from 'react';
import { Heart, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import Plasma from './Plasma';

interface DisclaimerProps {
  onAccept: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);
  
  const disclaimerPoints = [
    'This tool is NOT a substitute for professional medical advice, diagnosis, or treatment.',
    'Always consult with qualified healthcare professionals before making any health-related decisions.',
    'In case of medical emergencies, contact emergency services immediately.',
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Plasma
          color="#5227ff"
          speed={0.5}
          scale={1.5}
          opacity={0.4}
          mouseInteractive={false}
        />
      </div>
      
      <div className="max-w-2xl w-full p-8 rounded-2xl bg-card/95 backdrop-blur-xl shadow-2xl border border-white/10 relative z-10 animate-scaleIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
            <Shield className="w-6 h-6 text-primary absolute -bottom-1 -right-1" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white font-heading">
            Medical Disclaimer
          </h1>
          <p className="text-gray-400 text-sm">
            Please read carefully before proceeding
          </p>
        </div>
        
        {/* Main Content */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 leading-relaxed">
                This AI-powered Personalized Health Advice Generator is designed for{' '}
                <strong className="text-white">informational and educational purposes only</strong>.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {disclaimerPoints.map((point, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
          
          {/* Checkbox Agreement */}
          <label 
            className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group"
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="sr-only peer"
                aria-describedby="disclaimer-agreement"
              />
              <div className="w-5 h-5 border-2 border-gray-500 rounded peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
            </div>
            <span id="disclaimer-agreement" className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
              I acknowledge that I have read and understand these terms. I agree that Carely provides general wellness information only and is not a replacement for professional medical care.
            </span>
          </label>
        </div>
        
        {/* Action Button */}
        <button
          onClick={onAccept}
          disabled={!isChecked}
          className={`w-full mt-8 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform shadow-lg flex items-center justify-center gap-2 ${
            isChecked
              ? 'bg-primary hover:bg-primary-dark text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25 cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
          aria-disabled={!isChecked}
        >
          <CheckCircle2 className="w-5 h-5" />
          I Understand — Continue to Carely
        </button>
        
        <p className="text-center text-gray-500 text-xs mt-4">
          Your health and safety are our top priority
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
