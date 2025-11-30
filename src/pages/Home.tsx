import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, TestTube, FileText, ShieldCheck, BarChart, User, Sparkles, ArrowRight, Scale, Wind, Headphones } from 'lucide-react';
import Silk from '../components/Silk';

interface BMIInfo {
  range: string;
  advice: string;
  color: string;
}

const BMICalculator: React.FC = () => {
    const [bmi, setBmi] = useState<string | null>(null);
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [heightUnit, setHeightUnit] = useState<string>('cm');
    const [weightUnit, setWeightUnit] = useState<string>('kg');
    const [bmiInfo, setBmiInfo] = useState<BMIInfo>({ range: '', advice: '', color: '' });

    const calculateBmi = (e: React.FormEvent) => {
        e.preventDefault();
        const heightNum = parseFloat(height);
        const weightNum = parseFloat(weight);
        
        if (heightNum > 0 && weightNum > 0) {
            let heightInMeters: number;
            if (heightUnit === 'cm') {
                heightInMeters = heightNum / 100;
            } else if (heightUnit === 'in') {
                heightInMeters = heightNum * 0.0254;
            } else {
                heightInMeters = heightNum * 0.3048;
            }

            let weightInKg: number;
            if (weightUnit === 'kg') {
                weightInKg = weightNum;
            } else {
                weightInKg = weightNum * 0.453592;
            }

            const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
            const bmiNum = parseFloat(bmiValue);
            setBmi(bmiValue);

            if (bmiNum < 18.5) {
                setBmiInfo({
                    range: 'Underweight',
                    advice: 'You may want to consider gaining some weight. A balanced diet with more calories can help.',
                    color: 'text-blue-400'
                });
            } else if (bmiNum >= 18.5 && bmiNum <= 24.9) {
                setBmiInfo({
                    range: 'Healthy Weight',
                    advice: 'Great job! You are in a healthy weight range. Keep up the good work!',
                    color: 'text-green-400'
                });
            } else if (bmiNum >= 25 && bmiNum <= 29.9) {
                setBmiInfo({
                    range: 'Overweight',
                    advice: 'Consider a balanced diet and regular exercise to reach a healthier weight.',
                    color: 'text-yellow-400'
                });
            } else {
                setBmiInfo({
                    range: 'Obese',
                    advice: 'It is recommended to consult with a healthcare provider for a personalized plan.',
                    color: 'text-red-400'
                });
            }
        }
    };

    const resetCalculator = () => {
        setBmi(null);
        setHeight('');
        setWeight('');
        setBmiInfo({ range: '', advice: '', color: '' });
    };

    return (
        <div className="bg-card/95 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-xl max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/20">
                    <Scale className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white font-heading">Quick BMI Calculator</h3>
            </div>
            <form onSubmit={calculateBmi} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                        <div className="flex">
                            <input 
                                type="number" 
                                value={height} 
                                onChange={(e) => setHeight(e.target.value)} 
                                className="w-full p-3 rounded-l-xl bg-white/5 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                                placeholder="e.g., 175"
                                step="0.1"
                                aria-label="Height"
                            />
                            <select 
                                value={heightUnit} 
                                onChange={(e) => setHeightUnit(e.target.value)} 
                                className="p-3 bg-white/10 text-white rounded-r-xl border-y border-r border-white/10 focus:border-primary outline-none"
                                aria-label="Height unit"
                            >
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                                <option value="ft">ft</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Weight</label>
                        <div className="flex">
                            <input 
                                type="number" 
                                value={weight} 
                                onChange={(e) => setWeight(e.target.value)} 
                                className="w-full p-3 rounded-l-xl bg-white/5 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                                placeholder="e.g., 70"
                                step="0.1"
                                aria-label="Weight"
                            />
                            <select 
                                value={weightUnit} 
                                onChange={(e) => setWeightUnit(e.target.value)} 
                                className="p-3 bg-white/10 text-white rounded-r-xl border-y border-r border-white/10 focus:border-primary outline-none"
                                aria-label="Weight unit"
                            >
                                <option value="kg">kg</option>
                                <option value="lbs">lbs</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-primary/25"
                >
                    Calculate BMI
                </button>
            </form>
            {bmi && (
                <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/10 animate-fadeIn">
                    <div className="text-center mb-4">
                        <p className="text-gray-400 text-sm mb-1">Your BMI</p>
                        <p className="text-5xl font-bold text-primary">{bmi}</p>
                    </div>
                    <div className="text-center">
                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${bmiInfo.color} bg-white/5`}>
                            {bmiInfo.range}
                        </span>
                        <p className="text-gray-300 text-sm mt-3">{bmiInfo.advice}</p>
                        <p className="text-gray-500 text-xs mt-2">A healthy BMI is between 18.5 and 24.9</p>
                    </div>
                    <button 
                        onClick={resetCalculator}
                        className="w-full mt-4 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                        Calculate Again
                    </button>
                </div>
            )}
        </div>
    );
};

const features = [
    { icon: FileText, title: 'Personalized Plans', description: 'Get a health plan tailored to your specific needs and goals.' },
    { icon: BarChart, title: 'Progress Tracking', description: 'Monitor your progress and stay motivated with our tracking tools.' },
    { icon: ShieldCheck, title: 'Expert-Backed Advice', description: 'Our recommendations are based on the latest health and wellness research.' },
    { icon: User, title: 'Holistic Approach', description: 'We consider all aspects of your health, from diet to mental well-being.' },
];

const steps = [
    { icon: FileText, number: 1, title: 'Tell Us About You', description: 'Complete a quick, confidential profile about your lifestyle and goals.' },
    { icon: BrainCircuit, number: 2, title: 'AI-Powered Analysis', description: 'Our advanced AI analyzes your data against millions of health data points.' },
    { icon: TestTube, number: 3, title: 'Receive Your Plan', description: 'Get a unique, actionable health plan personalized for you.' },
];

const HomePage: React.FC = () => {
  return (
    <div className="relative text-white">
        {/* Background */}
        <div className="fixed inset-0 z-0">
            <Silk
              speed={5}
              scale={1}
              color="#5227ff"
              noiseIntensity={1.5}
              rotation={0}
            />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">AI-Powered Health Plans</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight">
                Your Health is Unique.
                <br />
                <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    Your Advice Should Be Too.
                </span>
            </h1>
            
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-300 leading-relaxed">
                Stop relying on generic health tips. Carely uses AI to analyze your unique profile and create a personalized health plan covering diet, exercise, sleep, and stress management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/my-plan"
                    className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
                >
                    Create Your Free Health Plan
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                    to="/about"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 border border-white/10"
                >
                    Learn More
                </Link>
            </div>
        </div>

        {/* Features Section */}
        <section className="relative z-10 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 animate-fadeIn"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <feature.icon className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="relative z-10 py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
                        A Simple Path to Better Health
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Get your personalized health plan in three easy steps
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div 
                            key={index}
                            className="text-center animate-fadeIn"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="relative inline-block mb-6">
                                <div className="w-20 h-20 rounded-2xl bg-card/95 backdrop-blur-sm border border-white/10 flex items-center justify-center mx-auto shadow-lg">
                                    <step.icon className="w-8 h-8 text-primary" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/25">
                                    {step.number}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                            <p className="text-gray-400 text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* BMI Calculator Section */}
        <section className="relative z-10 py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white font-heading mb-4">
                        Try Our Quick BMI Calculator
                    </h2>
                    <p className="text-gray-400">
                        Get a quick overview of your body mass index
                    </p>
                </div>
                <BMICalculator />
            </div>
        </section>

        {/* AI Meditation Section */}
        <section className="relative z-10 py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="bg-gradient-to-r from-purple-900/50 to-primary/30 rounded-3xl p-8 md:p-12 border border-purple-500/20 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-primary shadow-xl flex items-center justify-center animate-breathe">
                                <Wind className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                <span className="text-xs text-purple-300 font-medium uppercase tracking-wide">New Feature</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-3">
                                AI-Guided Meditation
                            </h2>
                            <p className="text-gray-300 mb-6">
                                Experience personalized meditation scripts and audio generated specifically for your emotional state. Our AI creates unique, therapeutic content tailored to help you manage stress, anxiety, and improve your mental well-being.
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <Link
                                    to="/meditation"
                                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-primary hover:from-purple-700 hover:to-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
                                >
                                    <Headphones className="w-5 h-5" />
                                    Try Meditation
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-3xl p-12 border border-primary/20">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
                    Ready to Transform Your Health?
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join thousands of users who have already started their personalized health journey with Carely.
                </p>
                <Link
                    to="/my-plan"
                    className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
                >
                    Get Started for Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </section>
    </div>
  );
};

export default HomePage;