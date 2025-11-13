import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { BrainCircuit, TestTube, FileText, ShieldCheck, BarChart, User, Star } from 'lucide-react';

const BMICalculator = () => {
    const [bmi, setBmi] = useState(null);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [weightUnit, setWeightUnit] = useState('kg');
    const [bmiInfo, setBmiInfo] = useState({ range: '', advice: '' });

    const calculateBmi = (e) => {
        e.preventDefault();
        if (height > 0 && weight > 0) {
            let heightInMeters;
            if (heightUnit === 'cm') {
                heightInMeters = height / 100;
            } else if (heightUnit === 'in') {
                heightInMeters = height * 0.0254;
            } else { // ft
                heightInMeters = height * 0.3048;
            }

            let weightInKg;
            if (weightUnit === 'kg') {
                weightInKg = weight;
            } else { // lbs
                weightInKg = weight * 0.453592;
            }

            const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
            setBmi(bmiValue);

            if (bmiValue < 18.5) {
                setBmiInfo({
                    range: 'Underweight',
                    advice: 'You may want to consider gaining some weight. A balanced diet with more calories can help.'
                });
            } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
                setBmiInfo({
                    range: 'Healthy Weight',
                    advice: 'Great job! You are in a healthy weight range. Keep up the good work with a balanced diet and regular exercise.'
                });
            } else if (bmiValue >= 25 && bmiValue <= 29.9) {
                setBmiInfo({
                    range: 'Overweight',
                    advice: 'You may want to consider losing some weight. A balanced diet and regular exercise can help you reach a healthier weight.'
                });
            } else {
                setBmiInfo({
                    range: 'Obese',
                    advice: 'It is recommended to lose weight for your health. Please consult with a healthcare provider for a personalized plan.'
                });
            }
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-primary-500/20">
            <h3 className="text-2xl font-bold text-center mb-4">Quick BMI Calculator</h3>
            <form onSubmit={calculateBmi} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">Height</label>
                        <div className="flex">
                            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-2 rounded-l-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white" placeholder="e.g., 175" />
                            <select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)} className="p-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-r-md">
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                                <option value="ft">ft</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">Weight</label>
                        <div className="flex">
                            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-2 rounded-l-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white" placeholder="e.g., 70" />
                            <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="p-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-r-md">
                                <option value="kg">kg</option>
                                <option value="lbs">lbs</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md">Calculate</button>
            </form>
            {bmi && (
                <div className="mt-4 text-center">
                    <p className="text-lg">Your BMI is: <span className="font-bold text-primary text-2xl">{bmi}</span></p>
                    <p className="text-lg">This is considered: <span className="font-bold text-primary">{bmiInfo.range}</span></p>
                    <p className="text-sm mt-2 text-gray-800 dark:text-gray-300">{bmiInfo.advice}</p>
                    <p className="text-xs mt-2 text-gray-700 dark:text-gray-400">A healthy BMI is between 18.5 and 24.9.</p>
                </div>
            )}
        </div>
    );
};


const HomePage = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const particlesOptions = { /* ... existing options ... */ };

  return (
    <div className="relative text-white">
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
        </div>
        <div className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
                Your Health is Unique.
                <br />
                <span className="text-primary">Your Advice Should Be Too.</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-6">AI-Powered Personalized Health Plans</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-800 dark:text-gray-300">
                Stop relying on generic health tips. Carely uses AI to analyze your unique profile and create a personalized health plan just for you. We consider your lifestyle, conditions, and goals to provide actionable advice for a healthier life.
            </p>
            <Link
                to="/my-plan"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
                Create Your Free Health Plan
            </Link>
        </div>

        <div className="relative z-10 py-20 px-4 space-y-20">
            <section className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                        <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Personalized Plans</h3>
                        <p className="text-gray-700 dark:text-gray-400">Get a health plan tailored to your specific needs and goals.</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                        <BarChart className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                        <p className="text-gray-700 dark:text-gray-400">Monitor your progress and stay motivated with our tracking tools.</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                        <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Expert-Backed Advice</h3>
                        <p className="text-gray-700 dark:text-gray-400">Our recommendations are based on the latest health and wellness research.</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                        <User className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Holistic Approach</h3>
                        <p className="text-gray-700 dark:text-gray-400">We consider all aspects of your health, from diet to mental well-being.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">A Simple Path to Better Health</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-primary-500 mb-4">
                            <FileText className="w-10 h-10 text-primary-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">1. Tell Us About You</h3>
                        <p className="text-gray-700 dark:text-gray-400">Complete a quick, confidential profile about your lifestyle and goals.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-primary-500 mb-4">
                            <BrainCircuit className="w-10 h-10 text-primary-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">2. AI-Powered Analysis</h3>
                        <p className="text-gray-700 dark:text-gray-400">Our advanced AI analyzes your data against millions of health points.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-primary-500 mb-4">
                            <TestTube className="w-10 h-10 text-primary-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">3. Receive Your Plan</h3>
                        <p className="text-gray-700 dark:text-gray-400">Get a unique, actionable health plan in seconds.</p>
                    </div>
                </div>
            </section>

            {/* Interactive Tool & Testimonials */}
            <section className="max-w-5xl mx-auto grid lg:grid-cols-1 gap-12 items-center">
                <BMICalculator />
            </section>
        </div>
    </div>
  );
};

export default HomePage;