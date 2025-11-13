import React, { useState, useEffect } from 'react';
import { savePlanToHistory } from '../lib/storage';
import { Activity, Apple, Brain, ChevronDown, ChevronUp, Heart, Loader2, Moon, Sparkles, Download, Info, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import jsPDF from 'jspdf';

const MyPlan = ({ user, onUserUpdate }) => {
    const [step, setStep] = useState('form');
    const [recommendations, setRecommendations] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});

    const [formData, setFormData] = useState({
        age: user?.age || '',
        gender: user?.gender || '',
        weight: user?.weight || '',
        height: user?.height || '',
        activityLevel: user?.activityLevel || '',
        conditions: user?.conditions || [],
        dietPreference: user?.dietPreference || '',
        sleepHours: user?.sleepHours || '',
        goals: user?.goals || [],
        otherCondition: '',
        otherGoal: '',
        stressLevel: '',
        sleepQuality: '',
        alcoholConsumption: '',
        smokingHabits: '',
        workLifeBalance: ''
    });

    const conditionsList = ['Diabetes', 'Hypertension', 'High Cholesterol', 'Thyroid Issues', 'PCOS', 'Asthma', 'Arthritis'];
    const goalsList = ['Weight Loss', 'Muscle Gain', 'Better Sleep', 'Stress Management', 'Increased Energy', 'Better Digestion', 'Improve Flexibility'];


    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleMultiSelect = (field, value) => {
        const current = formData[field];
        const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
        setFormData({ ...formData, [field]: updated });
    };

    const isFormValid = () => formData.age && formData.gender && formData.weight && formData.height && formData.activityLevel && formData.sleepHours && formData.goals.length > 0;


    const generateAdvice = async () => {
        if (!isFormValid()) return;
        setStep('loading');
        
        const finalData = { ...formData };
        if (finalData.conditions.includes('Other') && finalData.otherCondition) {
            finalData.conditions = finalData.conditions.filter(c => c !== 'Other');
            finalData.conditions.push(finalData.otherCondition);
        }
        if (finalData.goals.includes('Other') && finalData.otherGoal) {
            finalData.goals = finalData.goals.filter(g => g !== 'Other');
            finalData.goals.push(finalData.otherGoal);
        }
        
        onUserUpdate(finalData);

        try {
            const response = await fetch('http://localhost:3001/api/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.details || `Server responded with status: ${response.status}`;
            throw new Error(errorMessage);
        }

        const result = await response.json();
        // Add mock data for pie chart
        result.diet.macros = { protein: 30, carbs: 45, fat: 25 };
        setRecommendations(result);
        savePlanToHistory({ profile: finalData, recommendations: result });
        setStep('results');
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        setStep('form');
        alert(`Could not generate plan.\n\nError: ${error.message}`);
    }
    };
    
    const clearForm = () => {
        setFormData({
            age: '',
            gender: '',
            weight: '',
            height: '',
            activityLevel: '',
            conditions: [],
            dietPreference: '',
            sleepHours: '',
            goals: [],
            otherCondition: '',
            otherGoal: '',
            stressLevel: '',
            sleepQuality: '',
            alcoholConsumption: '',
            smokingHabits: '',
            workLifeBalance: ''
        });
    };

    const toggleCard = (category) => setExpandedCards(prev => ({ ...prev, [category]: !prev[category] }));
    const resetForm = () => {
        setStep('form');
        setRecommendations(null);
        setExpandedCards({});
    };

    const getConfidenceText = (confidence) => {
        if (confidence > 90) {
            return "High Confidence";
        } else if (confidence > 75) {
            return "Confident";
        } else {
            return "General Advice";
        }
    };

    const downloadPdf = () => {
        const pdf = new jsPDF();
        const today = new Date();
        const margin = 15;
        const pageHeight = pdf.internal.pageSize.height;
        const bottomMargin = 20;
        let y = margin;

        const checkPageBreak = (currentY) => {
            if (currentY > pageHeight - bottomMargin) {
                pdf.addPage();
                return margin;
            }
            return currentY;
        };

        // Header
        pdf.setFontSize(24);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(40, 40, 40);
        pdf.text("Carely Health Plan", margin, y);
        y += 10;
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);
        pdf.text(today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, y);
        y += 15;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, y, pdf.internal.pageSize.width - margin, y);
        y += 10;

        // Profile Summary
        y = checkPageBreak(y);
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(40, 40, 40);
        pdf.text("Patient Profile", margin, y);
        y += 8;
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80, 80, 80);
        const profileText = `Age: ${formData.age} | Gender: ${formData.gender} | Weight: ${formData.weight}kg | Height: ${formData.height}cm`;
        pdf.text(profileText, margin, y);
        y += 15;

        // Recommendations
        Object.entries(recommendations).forEach(([category, data]) => {
            if (!['diet', 'exercise', 'sleep', 'stress'].includes(category)) return;

            y = checkPageBreak(y + 20);
            pdf.setFontSize(18);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(40, 40, 40);
            pdf.text(category.charAt(0).toUpperCase() + category.slice(1) + " Recommendations", margin, y);
            y += 10;

            y = checkPageBreak(y);
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(60, 60, 60);
            pdf.text("Advice:", margin, y);
            y += 7;
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(80, 80, 80);
            const adviceLines = pdf.splitTextToSize(data.advice, pdf.internal.pageSize.width - margin * 2);
            pdf.text(adviceLines, margin, y);
            y += adviceLines.length * 5 + 10;

            y = checkPageBreak(y);
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(60, 60, 60);
            pdf.text("Reasoning:", margin, y);
            y += 7;
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "italic");
            pdf.setTextColor(100, 100, 100);
            const reasoningLines = pdf.splitTextToSize(data.reasoning, pdf.internal.pageSize.width - margin * 2);
            pdf.text(reasoningLines, margin, y);
            y += reasoningLines.length * 5 + 15;
        });

        pdf.save('Carely_Health_Plan.pdf');
    };

    const categoryIcons = { diet: Apple, exercise: Activity, sleep: Moon, stress: Brain };
    const categoryColors = {
        diet: 'from-green-500 to-green-600',
        exercise: 'from-primary-500 to-primary-600',
        sleep: 'from-purple-500 to-purple-600',
        stress: 'from-pink-500 to-pink-600',
    };
    
    const pieChartData = recommendations?.diet.macros ? [
        { name: 'Protein', value: recommendations.diet.macros.protein },
        { name: 'Carbs', value: recommendations.diet.macros.carbs },
        { name: 'Fat', value: recommendations.diet.macros.fat },
    ] : [];
    const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

    if (step === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-20 h-20 text-primary-500 animate-spin mb-6" />
                <h3 className="text-3xl font-bold text-white mb-2">Analyzing Your Health Profile...</h3>
                <p className="mt-2 text-lg text-gray-700">Generating personalized recommendations</p>
            </div>
        );
    }

    if (step === 'results' && recommendations) {
        return (
            <div className="space-y-8 animate-fadeIn">
                <div className="p-2 md:p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-2xl mb-6">
                        <div className="flex items-start justify-between flex-wrap gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <Sparkles className="w-10 h-10" />
                                    <h2 className="text-4xl font-bold">Your Personalized Health Plan</h2>
                                </div>
                                <p className="text-lg opacity-90 mb-6 leading-relaxed">{recommendations.summary}</p>
                                <div>
                                    <h3 className="text-sm font-semibold block mb-3 text-primary-300">This plan was specifically tailored based on:</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {recommendations.keyFactors.map((factor, index) => (
                                            <div key={index} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                                <span>{factor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(recommendations).map(([category, data], index) => {
                            if (!['diet', 'exercise', 'sleep', 'stress'].includes(category)) return null;
                            const Icon = categoryIcons[category];
                            const isExpanded = expandedCards[category];
                            return (
                                <div key={category} className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 shadow-xl transition-all duration-300 hover:shadow-primary-500/20 hover:scale-[1.02] animate-fadeIn" style={{ animationDelay: `${index * 100}ms`}}>
                                    <div className="relative mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-xl bg-gradient-to-br ${categoryColors[category]} shadow-lg`}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold capitalize">{category}</h3>
                                        </div>
                                        <div className="absolute top-0 right-0 px-4 py-2 rounded-full text-sm font-semibold shadow-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                            {getConfidenceText(data.confidence)}
                                        </div>
                                    </div>
                                    <p className="mb-6 text-gray-800 dark:text-gray-300 leading-relaxed text-base">{data.advice}</p>
                                    
                                    {category === 'diet' && (
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Suggested Macro Split</h4>
                                            <ResponsiveContainer width="100%" height={150}>
                                                <PieChart>
                                                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
                                                        {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                                    </Pie>
                                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', color: '#ffffff' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}

                                    <button onClick={() => toggleCard(category)} className="flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors">
                                        {isExpanded ? <><ChevronUp className="w-5 h-5" />Hide reasoning</> : <><ChevronDown className="w-5 h-5" />Why this advice?</>}</button>
                                    {isExpanded && (
                                        <div className="mt-4 p-5 rounded-xl bg-gray-200 dark:bg-gray-700/50 border-l-4 border-primary-500">
                                            <p className="text-sm text-gray-800 dark:text-gray-300 italic leading-relaxed">{data.reasoning}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center pt-6">
                    <button onClick={resetForm} className="px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white">
                        Create New Profile
                    </button>
                    <button onClick={downloadPdf} className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl bg-primary-600 hover:bg-primary-700 text-white">
                        <Download className="w-5 h-5" />
                        Download as PDF
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="p-8 md:p-10 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-2xl">
                <div className="text-center mb-8 relative">
                    <Heart className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h2 className="text-4xl font-bold">Your Health Profile</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Fill out the form to generate your personalized plan.</p>
                    <button onClick={clearForm} className="absolute top-0 right-0 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">Clear Selections</button>
                </div>
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Age *</label>
                            <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm" placeholder="e.g., 28" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm">
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Weight (kg) *</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm" placeholder="e.g., 70" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Height (cm) *</label>
                            <input type="number" name="height" value={formData.height} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm" placeholder="e.g., 165" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Activity Level *</label>
                            <select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm">
                                <option value="">Select...</option>
                                <option value="Sedentary">Sedentary</option>
                                <option value="Lightly Active">Lightly Active</option>
                                <option value="Moderately Active">Moderately Active</option>
                                <option value="Very Active">Very Active</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Sleep Hours (per night) *</label>
                            <input type="number" name="sleepHours" value={formData.sleepHours} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm" placeholder="e.g., 7" step="0.5" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Sleep Quality</label>
                            <select name="sleepQuality" value={formData.sleepQuality} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm">
                                <option value="">Select...</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Stress Level</label>
                            <select name="stressLevel" value={formData.stressLevel} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm">
                                <option value="">Select...</option>
                                <option value="Low">Low</option>
                                <option value="Moderate">Moderate</option>
                                <option value="High">High</option>
                                <option value="Very High">Very High</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Alcohol Consumption</label>
                            <select name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm">
                                <option value="">Select...</option>
                                <option value="None">None</option>
                                <option value="Occasionally">Occasionally</option>
                                <option value="Moderately">Moderately</option>
                                <option value="Frequently">Frequently</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Smoking Habits</label>
                            <select name="smokingHabits" value={formData.smokingHabits} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm">
                                <option value="">Select...</option>
                                <option value="Never">Never</option>
                                <option value="Former Smoker">Former Smoker</option>
                                <option value="Current Smoker">Current Smoker</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Work/Life Balance</label>
                        <select name="workLifeBalance" value={formData.workLifeBalance} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm">
                            <option value="">Select...</option>
                            <option value="Balanced">Balanced</option>
                            <option value="Slightly Unbalanced">Slightly Unbalanced</option>
                            <option value="Very Unbalanced">Very Unbalanced</option>
                        </select>
                    </div>
                     <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Diet Preference</label>
                        <select name="dietPreference" value={formData.dietPreference} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm">
                            <option value="">No Preference</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Pescatarian">Pescatarian</option>
                            <option value="Keto">Keto</option>
                            <option value="Paleo">Paleo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Medical Conditions</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {conditionsList.map(c => (
                                <button key={c} type="button" onClick={() => handleMultiSelect('conditions', c)} className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${formData.conditions.includes(c) ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{c}</button>
                            ))}
                            <button type="button" onClick={() => handleMultiSelect('conditions', 'Other')} className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${formData.conditions.includes('Other') ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Other</button>
                        </div>
                        {formData.conditions.includes('Other') && (
                            <div className="mt-4">
                                <input type="text" name="otherCondition" value={formData.otherCondition} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm" placeholder="Please specify your condition" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Health Goals *</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {goalsList.map(g => (
                                <button key={g} type="button" onClick={() => handleMultiSelect('goals', g)} className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${formData.goals.includes(g) ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{g}</button>
                            ))}
                            <button type="button" onClick={() => handleMultiSelect('goals', 'Other')} className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${formData.goals.includes('Other') ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Other</button>
                        </div>
                        {formData.goals.includes('Other') && (
                            <div className="mt-4">
                                <input type="text" name="otherGoal" value={formData.otherGoal} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent focus:border-primary-500 outline-none transition-all shadow-sm" placeholder="Please specify your goal" />
                            </div>
                        )}
                    </div>
                    <button onClick={generateAdvice} disabled={!isFormValid()} className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${isFormValid() ? 'bg-primary text-white' : 'bg-gray-600 text-gray-700 cursor-not-allowed'}`}>
                        Generate Personalized Advice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyPlan;