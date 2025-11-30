import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw,
  Clock,
  Brain,
  Heart,
  Wind,
  Moon,
  AlertCircle,
  CheckCircle,
  History,
  Square,
  Download,
  FileText,
  Mic,
  Volume2,
  Settings
} from 'lucide-react';
import { saveMeditation, getMeditationHistory } from '../lib/storage';
import type { MeditationEntry } from '../lib/storage';

interface MeditationFormData {
  stressSources: string[];
  customStressSource: string;
  currentMoods: string[];
  sleepQuality: string;
  meditationType: string;
  duration: string;
  backgroundSound: string;
  additionalContext: string;
}

interface GeneratedMeditation {
  title: string;
  script: string;
  duration: string;
  breathingPattern?: {
    inhale: number;
    hold: number;
    exhale: number;
  };
  affirmations?: string[];
}

interface VoiceSettings {
  rate: number;
  pitch: number;
}

const stressSources = [
  { value: 'work', label: 'Work Pressure', icon: Brain },
  { value: 'academic', label: 'Academic Anxiety', icon: Brain },
  { value: 'relationship', label: 'Relationship Issues', icon: Heart },
  { value: 'health', label: 'Health Concerns', icon: Heart },
  { value: 'financial', label: 'Financial Stress', icon: AlertCircle },
  { value: 'family', label: 'Family Matters', icon: Heart },
  { value: 'social', label: 'Social Anxiety', icon: Brain },
  { value: 'general', label: 'General Anxiety', icon: Wind },
  { value: 'insomnia', label: 'Sleep Difficulties', icon: Moon },
  { value: 'other', label: 'Other (Specify)', icon: Sparkles },
];

const meditationTypes = [
  { value: 'guided', label: 'Guided Relaxation', description: 'Step-by-step relaxation journey' },
  { value: 'breathing', label: 'Breathing Exercise', description: 'Focused breathwork patterns' },
  { value: 'body-scan', label: 'Body Scan', description: 'Progressive muscle relaxation' },
  { value: 'visualization', label: 'Visualization', description: 'Peaceful imagery journey' },
  { value: 'mindfulness', label: 'Mindfulness', description: 'Present moment awareness' },
  { value: 'sleep', label: 'Sleep Meditation', description: 'Calming bedtime routine' },
];

const moods = [
  { value: 'anxious', label: '😰 Anxious', color: 'from-yellow-500 to-orange-500' },
  { value: 'stressed', label: '😫 Stressed', color: 'from-red-500 to-orange-500' },
  { value: 'sad', label: '😢 Sad', color: 'from-blue-500 to-indigo-500' },
  { value: 'overwhelmed', label: '😵 Overwhelmed', color: 'from-purple-500 to-pink-500' },
  { value: 'restless', label: '😤 Restless', color: 'from-orange-500 to-red-500' },
  { value: 'tired', label: '😴 Tired', color: 'from-indigo-500 to-purple-500' },
  { value: 'neutral', label: '😐 Neutral', color: 'from-gray-500 to-gray-600' },
  { value: 'hopeful', label: '🙂 Hopeful', color: 'from-green-500 to-teal-500' },
];

// Voice categories for better organization
const voiceCategories = {
  soothing: ['Samantha', 'Karen', 'Moira', 'Fiona', 'Victoria', 'Tessa', 'Serena', 'Veena'],
  calm: ['Google UK English Female', 'Google US English', 'Microsoft Zira', 'Microsoft Hazel', 'Aria', 'Jenny'],
  natural: ['Natural', 'Neural', 'Enhanced', 'Premium'],
};

const MeditationPage: React.FC = () => {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [formData, setFormData] = useState<MeditationFormData>({
    stressSources: [],
    customStressSource: '',
    currentMoods: [],
    sleepQuality: '',
    meditationType: 'guided',
    duration: '5',
    backgroundSound: 'none',
    additionalContext: '',
  });
  const [meditation, setMeditation] = useState<GeneratedMeditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<MeditationEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({ rate: 0.75, pitch: 0.85 });
  const [isDownloading, setIsDownloading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Categorize and sort voices for better UX
  const categorizeVoice = (voice: SpeechSynthesisVoice): 'soothing' | 'calm' | 'other' => {
    const name = voice.name.toLowerCase();
    for (const soothingName of voiceCategories.soothing) {
      if (name.includes(soothingName.toLowerCase())) return 'soothing';
    }
    for (const calmName of voiceCategories.calm) {
      if (name.includes(calmName.toLowerCase())) return 'calm';
    }
    for (const naturalName of voiceCategories.natural) {
      if (name.includes(naturalName.toLowerCase())) return 'calm';
    }
    return 'other';
  };

  // Load voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      // Filter for English voices
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      
      // Sort voices by category (soothing first, then calm, then other)
      const sortedVoices = englishVoices.sort((a, b) => {
        const catA = categorizeVoice(a);
        const catB = categorizeVoice(b);
        const order = { soothing: 0, calm: 1, other: 2 };
        return order[catA] - order[catB];
      });
      
      setAvailableVoices(sortedVoices);
      
      // Auto-select the first soothing voice if available
      if (sortedVoices.length > 0 && !selectedVoice) {
        const soothingVoice = sortedVoices.find(v => categorizeVoice(v) === 'soothing');
        const calmVoice = sortedVoices.find(v => categorizeVoice(v) === 'calm');
        setSelectedVoice((soothingVoice || calmVoice || sortedVoices[0]).name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    setHistory(getMeditationHistory());
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Toggle stress source selection (multi-select)
  const toggleStressSource = (value: string) => {
    setFormData(prev => {
      const current = prev.stressSources;
      if (current.includes(value)) {
        return { ...prev, stressSources: current.filter(s => s !== value) };
      } else {
        return { ...prev, stressSources: [...current, value] };
      }
    });
  };

  // Toggle mood selection (multi-select)
  const toggleMood = (value: string) => {
    setFormData(prev => {
      const current = prev.currentMoods;
      if (current.includes(value)) {
        return { ...prev, currentMoods: current.filter(m => m !== value) };
      } else {
        return { ...prev, currentMoods: [...current, value] };
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return formData.stressSources.length > 0 && formData.currentMoods.length > 0 && formData.meditationType && formData.duration;
  };

  const generateMeditation = async () => {
    if (!isFormValid()) return;
    
    setError(null);
    setStep('loading');

    try {
      // Format multi-select values for the API
      const stressSourcesText = formData.stressSources
        .map(s => s === 'other' ? formData.customStressSource : stressSources.find(src => src.value === s)?.label || s)
        .join(', ');
      
      const moodsText = formData.currentMoods
        .map(m => moods.find(mood => mood.value === m)?.label.replace(/^[^\s]+\s/, '') || m)
        .join(', ');

      const response = await fetch('http://localhost:3001/api/generate-meditation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stressSource: stressSourcesText,
          currentMood: moodsText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate meditation');
      }

      const result = await response.json();
      setMeditation(result);
      
      // Save to history
      saveMeditation({
        title: result.title,
        stressSource: stressSourcesText,
        mood: moodsText,
        type: formData.meditationType,
        duration: formData.duration,
        script: result.script,
      });
      
      setHistory(getMeditationHistory());
      setStep('result');
    } catch (err) {
      console.error('Failed to generate meditation:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate meditation. Please try again.');
      setStep('form');
    }
  };

  const speakMeditation = useCallback(() => {
    if (!meditation || !speechSupported) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const paragraphs = meditation.script.split('\n\n').filter(p => p.trim());
    let currentIndex = 0;

    const speakNextParagraph = () => {
      if (currentIndex >= paragraphs.length) {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentParagraph(0);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(paragraphs[currentIndex]);
      
      // Find the selected voice
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
      
      // Use customizable voice settings for soothing playback
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = 1;

      utterance.onstart = () => {
        setCurrentParagraph(currentIndex);
      };

      utterance.onend = () => {
        currentIndex++;
        // Add a longer pause between paragraphs for meditation
        setTimeout(() => {
          if (!isPaused) {
            speakNextParagraph();
          }
        }, 2000);
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsPlaying(false);
      };

      speechSynthesis.speak(utterance);
    };

    setIsPlaying(true);
    setIsPaused(false);
    speakNextParagraph();
  }, [meditation, speechSupported, selectedVoice, availableVoices, isPaused, voiceSettings]);

  const togglePlayPause = () => {
    if (!speechSupported) return;

    if (isPlaying && !isPaused) {
      // Pause
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      // Resume
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      // Start fresh
      speakMeditation();
    }
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentParagraph(0);
  };

  const resetForm = () => {
    speechSynthesis.cancel();
    setStep('form');
    setMeditation(null);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentParagraph(0);
  };

  const loadFromHistory = (entry: MeditationEntry) => {
    setMeditation({
      title: entry.title,
      script: entry.script,
      duration: entry.duration,
    });
    setShowHistory(false);
    setStep('result');
  };

  // Download script as text file
  const downloadScript = () => {
    if (!meditation) return;
    
    const content = `${meditation.title}\n${'='.repeat(meditation.title.length)}\n\nDuration: ${meditation.duration} minutes\n\n${meditation.script}${meditation.affirmations ? `\n\nAffirmations:\n${meditation.affirmations.map((a, i) => `${i + 1}. ${a}`).join('\n')}` : ''}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meditation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_meditation.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download audio as WAV file using Web Audio API
  const downloadAudio = async () => {
    if (!meditation || !speechSupported) return;
    
    setIsDownloading(true);
    
    try {
      // Create audio context for recording
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Create a destination for recording
      const dest = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(dest.stream, { mimeType: 'audio/webm' });
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${meditation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_meditation.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Use speech synthesis with the current settings
      const utterance = new SpeechSynthesisUtterance(meditation.script);
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      
      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
          audioContext.close();
        }, 500);
      };
      
      utterance.onerror = () => {
        mediaRecorder.stop();
        audioContext.close();
        setIsDownloading(false);
      };
      
      speechSynthesis.speak(utterance);
      
    } catch (err) {
      console.error('Failed to download audio:', err);
      // Fallback: just play and let user know
      alert('Audio download requires browser support. Playing meditation instead - you can use screen recording software to capture the audio.');
      setIsDownloading(false);
      speakMeditation();
    }
  };

  // Get voice category label for display
  const getVoiceCategoryLabel = (voice: SpeechSynthesisVoice): string => {
    const cat = categorizeVoice(voice);
    if (cat === 'soothing') return '🌸 Soothing';
    if (cat === 'calm') return '🌊 Calm';
    return '🎤 Standard';
  };

  // Loading state
  if (step === 'loading') {
    const loadingMessages = [
      'Understanding your emotional state...',
      'Crafting a personalized meditation script...',
      'Tailoring breathing patterns for you...',
      'Adding calming affirmations...',
      'Preparing your meditation...',
    ];
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-primary/20 animate-pulse flex items-center justify-center">
            <Wind className="w-16 h-16 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <h3 className="text-3xl font-bold text-white mb-3 text-center font-heading">Creating Your Meditation</h3>
        <p className="text-lg text-gray-400 text-center max-w-md mb-6">
          Our AI is crafting a personalized meditation experience tailored to your current emotional state.
        </p>
        <div className="space-y-2 text-center">
          {loadingMessages.map((msg, i) => (
            <p 
              key={i} 
              className="text-sm text-gray-500 animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              {msg}
            </p>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  // Result state with browser TTS player
  if (step === 'result' && meditation) {
    const paragraphs = meditation.script.split('\n\n').filter(p => p.trim());
    
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-primary mb-6 shadow-lg shadow-primary/25">
            <Wind className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white font-heading mb-2">{meditation.title}</h1>
          <p className="text-gray-400">Your personalized meditation is ready</p>
        </div>

        {/* Audio Player Card - Browser TTS */}
        <div className="bg-gradient-to-br from-purple-900/50 to-primary/30 rounded-3xl p-8 border border-white/10 shadow-2xl">
          {!speechSupported ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Text-to-Speech Not Supported</p>
              <p className="text-gray-400 text-sm">Your browser doesn't support speech synthesis. Please read the script below.</p>
            </div>
          ) : (
            <>
              {/* Voice Selection and Settings */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-wrap items-end gap-4">
                  {/* Voice Selector */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Voice Selection
                    </label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      disabled={isPlaying}
                      className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 focus:border-primary outline-none transition-all disabled:opacity-50"
                    >
                      {availableVoices.map((voice) => (
                        <option key={voice.name} value={voice.name} className="bg-gray-900 text-white">
                          {getVoiceCategoryLabel(voice)} {voice.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Settings Toggle */}
                  <button
                    onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                    className={`p-3 rounded-xl transition-all ${showVoiceSettings ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'}`}
                    title="Voice Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Voice Settings Panel */}
                {showVoiceSettings && (
                  <div className="bg-white/5 rounded-xl p-4 space-y-4 animate-fadeIn border border-white/10">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-primary" />
                      Voice Settings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Speed */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Speed: {voiceSettings.rate.toFixed(2)}x
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="1"
                          step="0.05"
                          value={voiceSettings.rate}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                          disabled={isPlaying}
                          className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Slower (Calmer)</span>
                          <span>Normal</span>
                        </div>
                      </div>
                      
                      {/* Pitch */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Pitch: {voiceSettings.pitch.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="1.2"
                          step="0.05"
                          value={voiceSettings.pitch}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                          disabled={isPlaying}
                          className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Lower (Soothing)</span>
                          <span>Higher</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      💡 Tip: Lower speed and pitch create a more soothing meditation experience
                    </p>
                  </div>
                )}
              </div>

              {/* Waveform Visualization (decorative) */}
              <div className="flex items-center justify-center gap-1 h-16 mb-6">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-gradient-to-t from-primary to-purple-400 rounded-full transition-all duration-150`}
                    style={{
                      height: isPlaying && !isPaused 
                        ? `${Math.sin((i + Date.now() / 200) * 0.3) * 30 + 35}%` 
                        : `${Math.sin(i * 0.3) * 20 + 25}%`,
                      opacity: isPlaying && !isPaused ? 0.8 : 0.4,
                      animation: isPlaying && !isPaused ? `wave ${0.5 + i * 0.02}s ease-in-out infinite` : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Progress indicator */}
              <div className="mb-6">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full transition-all duration-500"
                    style={{ width: `${((currentParagraph + 1) / paragraphs.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>Paragraph {currentParagraph + 1} of {paragraphs.length}</span>
                  <span>{meditation.duration} min session</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={stopSpeech}
                  disabled={!isPlaying}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Stop"
                >
                  <Square className="w-5 h-5" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="p-5 rounded-full bg-primary hover:bg-primary-dark transition-all transform hover:scale-105 text-white shadow-lg shadow-primary/50"
                  aria-label={isPlaying && !isPaused ? 'Pause' : 'Play'}
                >
                  {isPlaying && !isPaused ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                
                <button
                  onClick={() => { stopSpeech(); speakMeditation(); }}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  aria-label="Restart"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Status */}
              <p className="text-center text-gray-400 text-sm mt-4">
                {isDownloading && '⏳ Generating audio for download...'}
                {isPlaying && !isPaused && !isDownloading && '🎧 Playing meditation...'}
                {isPlaying && isPaused && '⏸️ Paused'}
                {!isPlaying && !isDownloading && 'Press play to start your meditation'}
              </p>
            </>
          )}
        </div>

        {/* Download Options */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Download Options
          </h3>
          <p className="text-gray-400 text-sm mb-4">Save your meditation for offline use or future reference</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={downloadScript}
              className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white border border-white/10 hover:border-white/20"
            >
              <FileText className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="font-medium">Download Script</div>
                <div className="text-xs text-gray-400">Text file (.txt)</div>
              </div>
            </button>
            
            <button
              onClick={downloadAudio}
              disabled={!speechSupported || isDownloading || isPlaying}
              className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white border border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <div className="font-medium">{isDownloading ? 'Generating...' : 'Download Audio'}</div>
                <div className="text-xs text-gray-400">Audio file (.webm)</div>
              </div>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            💡 Audio download will speak the meditation using your selected voice and save it as an audio file.
          </p>
        </div>

        {/* Breathing Pattern */}
        {meditation.breathingPattern && (
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Wind className="w-5 h-5 text-primary" />
              Breathing Pattern
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-3xl font-bold text-primary">{meditation.breathingPattern.inhale}s</div>
                <div className="text-gray-400 text-sm mt-1">Inhale</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-400">{meditation.breathingPattern.hold}s</div>
                <div className="text-gray-400 text-sm mt-1">Hold</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-3xl font-bold text-pink-400">{meditation.breathingPattern.exhale}s</div>
                <div className="text-gray-400 text-sm mt-1">Exhale</div>
              </div>
            </div>
          </div>
        )}

        {/* Script with highlight */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Meditation Script
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {paragraphs.map((paragraph, i) => (
              <p 
                key={i} 
                className={`text-sm leading-relaxed p-3 rounded-lg transition-all duration-300 ${
                  i === currentParagraph && isPlaying
                    ? 'bg-primary/20 text-white border-l-4 border-primary'
                    : i < currentParagraph && isPlaying
                    ? 'text-gray-500'
                    : 'text-gray-300'
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Affirmations */}
        {meditation.affirmations && meditation.affirmations.length > 0 && (
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Personalized Affirmations
            </h3>
            <div className="space-y-3">
              {meditation.affirmations.map((affirmation, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 italic">"{affirmation}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button
            onClick={resetForm}
            className="px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg bg-card hover:bg-card-hover text-white border border-white/10"
          >
            Create New Meditation
          </button>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-primary mb-6 shadow-lg shadow-primary/25">
          <Wind className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white font-heading mb-4">AI-Guided Meditation</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience personalized meditation scripts generated specifically for your current emotional state. Select multiple options to create a tailored experience.
        </p>
      </div>

      {/* Browser TTS Info */}
      {!speechSupported && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-yellow-400 font-semibold">Limited Audio Support</h4>
            <p className="text-gray-400 text-sm">Your browser doesn't support text-to-speech. You can still generate and read meditation scripts.</p>
          </div>
        </div>
      )}

      {/* History Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
        >
          <History className="w-4 h-4" />
          {showHistory ? 'Hide History' : 'View History'}
        </button>
      </div>

      {/* History Panel */}
      {showHistory && history.length > 0 && (
        <div className="mb-6 bg-card/95 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-fadeIn">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Meditations</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {history.slice(0, 5).map((entry, i) => (
              <button
                key={i}
                onClick={() => loadFromHistory(entry)}
                className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{entry.title}</h4>
                    <p className="text-gray-400 text-sm">{entry.duration} min • {entry.type}</p>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-400 font-semibold">Error</h4>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="space-y-8">
          {/* Stress Source - Multi-Select */}
          <div>
            <label className="block mb-3 text-sm font-semibold text-white">
              What's causing your stress? <span className="text-primary">*</span>
              <span className="text-gray-400 font-normal ml-2">(Select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {stressSources.map(source => {
                const Icon = source.icon;
                const isSelected = formData.stressSources.includes(source.value);
                return (
                  <button
                    key={source.value}
                    type="button"
                    onClick={() => toggleStressSource(source.value)}
                    className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 flex flex-col items-center gap-2 relative ${
                      isSelected
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <Icon className="w-5 h-5" />
                    <span className="text-center text-xs">{source.label}</span>
                  </button>
                );
              })}
            </div>
            {formData.stressSources.includes('other') && (
              <input
                type="text"
                name="customStressSource"
                value={formData.customStressSource}
                onChange={handleInputChange}
                placeholder="Describe what's on your mind..."
                className="mt-4 w-full p-4 rounded-xl bg-white/5 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-gray-500"
              />
            )}
            {formData.stressSources.length > 0 && (
              <p className="text-sm text-primary mt-2">
                ✓ {formData.stressSources.length} source{formData.stressSources.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Current Mood - Multi-Select */}
          <div>
            <label className="block mb-3 text-sm font-semibold text-white">
              How are you feeling right now? <span className="text-primary">*</span>
              <span className="text-gray-400 font-normal ml-2">(Select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {moods.map(mood => {
                const isSelected = formData.currentMoods.includes(mood.value);
                return (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => toggleMood(mood.value)}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 relative ${
                      isSelected
                        ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {mood.label}
                  </button>
                );
              })}
            </div>
            {formData.currentMoods.length > 0 && (
              <p className="text-sm text-primary mt-2">
                ✓ {formData.currentMoods.length} mood{formData.currentMoods.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Meditation Type */}
          <div>
            <label className="block mb-3 text-sm font-semibold text-white">
              Type of Meditation <span className="text-primary">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {meditationTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, meditationType: type.value }))}
                  className={`p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] ${
                    formData.meditationType === type.value
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="font-medium text-white">{type.label}</div>
                  <div className={`text-xs mt-1 ${formData.meditationType === type.value ? 'text-white/80' : 'text-gray-400'}`}>
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration and Sleep Quality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-3 text-sm font-semibold text-white">
                <Clock className="w-4 h-4 inline mr-2" />
                Duration <span className="text-primary">*</span>
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl bg-white/5 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="3" className="bg-gray-900 text-white">3 minutes - Quick Reset</option>
                <option value="5" className="bg-gray-900 text-white">5 minutes - Short Break</option>
                <option value="10" className="bg-gray-900 text-white">10 minutes - Standard</option>
                <option value="15" className="bg-gray-900 text-white">15 minutes - Deep Relaxation</option>
                <option value="20" className="bg-gray-900 text-white">20 minutes - Extended Session</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-3 text-sm font-semibold text-white">
                <Moon className="w-4 h-4 inline mr-2" />
                Recent Sleep Quality
              </label>
              <select
                name="sleepQuality"
                value={formData.sleepQuality}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl bg-white/5 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="" className="bg-gray-900 text-white">Select...</option>
                <option value="excellent" className="bg-gray-900 text-white">😴 Excellent - Well rested</option>
                <option value="good" className="bg-gray-900 text-white">🙂 Good - Mostly rested</option>
                <option value="fair" className="bg-gray-900 text-white">😐 Fair - Could be better</option>
                <option value="poor" className="bg-gray-900 text-white">😫 Poor - Tired</option>
              </select>
            </div>
          </div>

          {/* Additional Context */}
          <div>
            <label className="block mb-3 text-sm font-semibold text-white">
              Additional Context <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              name="additionalContext"
              value={formData.additionalContext}
              onChange={handleInputChange}
              rows={3}
              placeholder="Share any specific thoughts, situations, or feelings you'd like the meditation to address..."
              className="w-full p-4 rounded-xl bg-white/5 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none placeholder-gray-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={generateMeditation}
              disabled={!isFormValid()}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform shadow-lg flex items-center justify-center gap-3 ${
                isFormValid()
                  ? 'bg-gradient-to-r from-purple-600 to-primary hover:from-purple-700 hover:to-primary-dark text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              aria-disabled={!isFormValid()}
            >
              <Sparkles className="w-6 h-6" />
              Generate Personalized Meditation
            </button>
            {!isFormValid() && (
              <p className="text-center text-gray-400 text-sm mt-3">
                Please select at least one stress source and one mood to continue
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-primary/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-purple-500/20 flex-shrink-0">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">How it works</h3>
            <ul className="text-gray-400 text-sm leading-relaxed space-y-1">
              <li>• Select multiple stress sources and moods for a more personalized experience</li>
              <li>• Choose from soothing voice options with adjustable speed and pitch</li>
              <li>• Download your meditation script or audio for offline use</li>
              <li>• All completely free - no account or payment required!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationPage;
