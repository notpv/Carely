import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { savePlanToHistory } from '../lib/storage';
import type { User } from '../lib/storage';
import { Activity, Apple, Brain, ChevronDown, ChevronUp, Heart, Loader2, Moon, Sparkles, Download, CheckCircle, AlertCircle, Wind } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import jsPDF from 'jspdf';
import { formatAiResponseText } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MyPlanProps {
  user: User | null;
  onUserUpdate: (formData: User) => void;
}

interface FormData {
  age: string | number;
  gender: string;
  weight: string | number;
  height: string | number;
  activityLevel: string;
  conditions: string[];
  dietPreference: string;
  sleepHours: string | number;
  goals: string[];
  otherCondition: string;
  otherGoal: string;
  stressLevel: string;
  sleepQuality: string;
  alcoholConsumption: string;
  smokingHabits: string;
  workLifeBalance: string;
}

interface FieldValidation {
  isValid: boolean;
  message: string;
}

const MyPlan: React.FC<MyPlanProps> = ({ user, onUserUpdate }) => {
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

    const validateField = (field: keyof FormData, value: any): FieldValidation => {
        switch (field) {
            case 'age':
                if (!value) return { isValid: false, message: 'Age is required' };
                const age = Number(value);
                if (age < 1 || age > 120) return { isValid: false, message: 'Please enter a valid age (1-120)' };
                return { isValid: true, message: '' };
            case 'weight':
                if (!value) return { isValid: false, message: 'Weight is required' };
                const weight = Number(value);
                if (weight < 20 || weight > 500) return { isValid: false, message: 'Please enter a valid weight (20-500 kg)' };
                return { isValid: true, message: '' };
            case 'height':
                if (!value) return { isValid: false, message: 'Height is required' };
                const height = Number(value);
                if (height < 50 || height > 300) return { isValid: false, message: 'Please enter a valid height (50-300 cm)' };
                return { isValid: true, message: '' };
            case 'sleepHours':
                if (!value) return { isValid: false, message: 'Sleep hours is required' };
                const sleep = Number(value);
                if (sleep < 0 || sleep > 24) return { isValid: false, message: 'Please enter valid sleep hours (0-24)' };
                return { isValid: true, message: '' };
            default:
                return { isValid: true, message: '' };
        }
    };

    const getFieldError = (field: keyof FormData): string => {
        const value = formData[field];
        if (!value && field !== 'age' && field !== 'weight' && field !== 'height' && field !== 'sleepHours') return '';
        const validation = validateField(field, value);
        return validation.isValid ? '' : validation.message;
    };

    const isFormValid = () => {
        const requiredFieldsValid = formData.age && formData.gender && formData.weight && formData.height && formData.activityLevel && formData.sleepHours && formData.goals.length > 0;
        const ageValid = validateField('age', formData.age).isValid;
        const weightValid = validateField('weight', formData.weight).isValid;
        const heightValid = validateField('height', formData.height).isValid;
        const sleepValid = validateField('sleepHours', formData.sleepHours).isValid;
        return requiredFieldsValid && ageValid && weightValid && heightValid && sleepValid;
    };

    const getCompletionPercentage = (): number => {
        const fields = ['age', 'gender', 'weight', 'height', 'activityLevel', 'sleepHours'];
        const filled = fields.filter(f => formData[f as keyof FormData]).length;
        const goalsComplete = formData.goals.length > 0 ? 1 : 0;
        return Math.round(((filled + goalsComplete) / (fields.length + 1)) * 100);
    };


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

        // Format advice and reasoning fields
        const formattedResult = { ...result };
        for (const category of ['diet', 'exercise', 'sleep', 'stress']) {
            if (formattedResult[category]) {
                formattedResult[category].advice = formatAiResponseText(formattedResult[category].advice);
                formattedResult[category].reasoning = formatAiResponseText(formattedResult[category].reasoning);
            }
        }
        setRecommendations(formattedResult);
        savePlanToHistory({ profile: finalData, recommendations: formattedResult });
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
            const adviceLines = pdf.splitTextToSize(formatAiResponseText(data.advice), pdf.internal.pageSize.width - margin * 2);
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
            const reasoningLines = pdf.splitTextToSize(formatAiResponseText(data.reasoning), pdf.internal.pageSize.width - margin * 2);
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
        const loadingMessages = [
            'Analyzing your health profile...',
            'Generating personalized diet recommendations...',
            'Creating exercise plan...',
            'Optimizing sleep suggestions...',
            'Finalizing stress management tips...'
        ];
        
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
                <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 text-center">Creating Your Health Plan</h3>
                <p className="text-lg text-gray-400 text-center max-w-md">
                    Our AI is analyzing your profile and generating personalized recommendations tailored specifically for you.
                </p>
                <div className="mt-8 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        );
    }

    if (step === 'results' && recommendations) {
        return (
            <div className="space-y-8 animate-fadeIn">
                <div className="p-2 md:p-8 bg-card rounded-2xl border border-white/10">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-2xl border border-white/10 mb-6">
                        <div className="flex items-start justify-between flex-wrap gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <Sparkles className="w-10 h-10" />
                                    <h2 className="text-4xl font-bold">Your Personalized Health Plan</h2>
                                </div>
                                <p className="text-lg opacity-90 mb-6 leading-relaxed">{recommendations.summary}</p>
                                <div>
                                    <h3 className="text-sm font-semibold block mb-3 text-white">This plan was specifically tailored based on:</h3>
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
                                <div key={category} className="p-8 rounded-2xl bg-card shadow-xl transition-all duration-300 hover:shadow-primary-500/20 hover:scale-[1.02] animate-fadeIn border border-white/10" style={{ animationDelay: `${index * 100}ms`}}>
                                    <div className="relative mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-xl bg-gradient-to-br ${categoryColors[category]} shadow-lg`}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold capitalize">{category}</h3>
                                        </div>
                                        <div className="absolute top-0 right-0 px-4 py-2 rounded-full text-sm font-semibold shadow-md bg-card text-white">
                                            {getConfidenceText(data.confidence)}
                                        </div>
                                    </div>
                                    <div className="mb-6 text-white leading-relaxed text-base prose dark:prose-invert">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.advice}</ReactMarkdown>
                                    </div>
                                    
                                    {category === 'diet' && (
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-white mb-2">Suggested Macro Split</h4>
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

                                    {category === 'stress' && (
                                        <Link
                                            to="/meditation"
                                            className="mb-4 flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-primary/20 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                                        >
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-primary">
                                                <Wind className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium group-hover:text-purple-300 transition-colors">Try AI-Guided Meditation</p>
                                                <p className="text-gray-400 text-sm">Personalized meditation audio tailored to your needs</p>
                                            </div>
                                            <Sparkles className="w-5 h-5 text-purple-400" />
                                        </Link>
                                    )}

                                    <button onClick={() => toggleCard(category)} className="flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors">
                                        {isExpanded ? <><ChevronUp className="w-5 h-5" />Hide reasoning</> : <><ChevronDown className="w-5 h-5" />Why this advice?</>}</button>
                                    {isExpanded && (
                                        <div className="mt-4 p-5 rounded-xl bg-card border-l-4 border-primary-500 prose dark:prose-invert border border-white/10 text-white">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.reasoning}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center pt-6">
                    <button onClick={resetForm} className="px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl bg-card hover:bg-card-hover text-gray-800 dark:text-white">
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
            <div className="p-8 md:p-10 rounded-2xl bg-card/95 backdrop-blur-sm shadow-2xl border border-white/10">
                {/* Header with progress */}
                <div className="text-center mb-8 relative">
                    <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-float" />
                    <h2 className="text-4xl font-bold text-white font-heading">Your Health Profile</h2>
                    <p className="text-gray-400 mt-2">Fill out the form to generate your personalized plan.</p>
                    <button 
                        onClick={clearForm} 
                        className="absolute top-0 right-0 text-sm text-gray-400 hover:text-primary transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
                    >
                        Clear All
                    </button>
                    
                    {/* Progress Bar */}
                    <div className="mt-6 max-w-md mx-auto">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Profile Completion</span>
                            <span className="text-primary font-medium">{getCompletionPercentage()}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                                style={{ width: `${getCompletionPercentage()}%` }}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-8">
                    {/* Age and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Age <span className="text-primary">*</span></label>
                            <input 
                                type="number" 
                                name="age" 
                                value={formData.age} 
                                onChange={handleInputChange} 
                                className={`w-full p-4 rounded-xl bg-white/5 text-white border ${getFieldError('age') ? 'border-red-500' : 'border-white/10'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm`}
                                placeholder="e.g., 28"
                                min="1"
                                max="120"
                                aria-describedby={getFieldError('age') ? 'age-error' : undefined}
                            />
                            {getFieldError('age') && (
                                <p id="age-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {getFieldError('age')}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Gender <span className="text-primary">*</span></label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-900 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer">
                                <option value="" className="bg-gray-900 text-gray-400">Select...</option>
                                <option value="Male" className="bg-gray-900 text-white">Male</option>
                                <option value="Female" className="bg-gray-900 text-white">Female</option>
                                <option value="Other" className="bg-gray-900 text-white">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Weight and Height */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Weight (kg) <span className="text-primary">*</span></label>
                            <input 
                                type="number" 
                                name="weight" 
                                value={formData.weight} 
                                onChange={handleInputChange} 
                                className={`w-full p-4 rounded-xl bg-white/5 text-white border ${getFieldError('weight') ? 'border-red-500' : 'border-white/10'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm`}
                                placeholder="e.g., 70"
                                min="20"
                                max="500"
                            />
                            {getFieldError('weight') && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {getFieldError('weight')}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Height (cm) <span className="text-primary">*</span></label>
                            <input 
                                type="number" 
                                name="height" 
                                value={formData.height} 
                                onChange={handleInputChange} 
                                className={`w-full p-4 rounded-xl bg-white/5 text-white border ${getFieldError('height') ? 'border-red-500' : 'border-white/10'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm`}
                                placeholder="e.g., 165"
                                min="50"
                                max="300"
                            />
                            {getFieldError('height') && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {getFieldError('height')}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Activity Level <span className="text-primary">*</span></label>
                            <select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-900 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer">
                                <option value="" className="bg-gray-900 text-gray-400">Select...</option>
                                <option value="Sedentary" className="bg-gray-900 text-white">Sedentary (Little to no exercise)</option>
                                <option value="Lightly Active" className="bg-gray-900 text-white">Lightly Active (1-3 days/week)</option>
                                <option value="Moderately Active" className="bg-gray-900 text-white">Moderately Active (3-5 days/week)</option>
                                <option value="Very Active" className="bg-gray-900 text-white">Very Active (6-7 days/week)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Sleep Hours (per night) <span className="text-primary">*</span></label>
                            <input 
                                type="number" 
                                name="sleepHours" 
                                value={formData.sleepHours} 
                                onChange={handleInputChange} 
                                className={`w-full p-4 rounded-xl bg-white/5 text-white border ${getFieldError('sleepHours') ? 'border-red-500' : 'border-white/10'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm`}
                                placeholder="e.g., 7"
                                step="0.5"
                                min="0"
                                max="24"
                            />
                            {getFieldError('sleepHours') && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {getFieldError('sleepHours')}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Sleep Quality</label>
                            <select name="sleepQuality" value={formData.sleepQuality} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-900 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer">
                                <option value="" className="bg-gray-900 text-gray-400">Select...</option>
                                <option value="Excellent" className="bg-gray-900 text-white">Excellent</option>
                                <option value="Good" className="bg-gray-900 text-white">Good</option>
                                <option value="Fair" className="bg-gray-900 text-white">Fair</option>
                                <option value="Poor" className="bg-gray-900 text-white">Poor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Stress Level</label>
                            <select name="stressLevel" value={formData.stressLevel} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-900 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer">
                                <option value="" className="bg-gray-900 text-gray-400">Select...</option>
                                <option value="Low" className="bg-gray-900 text-white">Low</option>
                                <option value="Moderate" className="bg-gray-900 text-white">Moderate</option>
                                <option value="High" className="bg-gray-900 text-white">High</option>
                                <option value="Very High" className="bg-gray-900 text-white">Very High</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Alcohol Consumption</label>
                            <select name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-900 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer">
                                <option value="" className="bg-gray-900 text-gray-400">Select...</option>
                                <option value="None" className="bg-gray-900 text-white">None</option>
                                <option value="Occasionally" className="bg-gray-900 text-white">Occasionally</option>
                                <option value="Moderately" className="bg-gray-900 text-white">Moderately</option>
                                <option value="Frequently" className="bg-gray-900 text-white">Frequently</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-white">Smoking Habits</label>
                            <select name="smokingHabits" value={formData.smokingHabits} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-900 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer">
                                <option value="" className="bg-gray-900 text-gray-400">Select...</option>
                                <option value="Never" className="bg-gray-900 text-white">Never</option>
                                <option value="Former Smoker" className="bg-gray-900 text-white">Former Smoker</option>
                                <option value="Current Smoker" className="bg-gray-900 text-white">Current Smoker</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-white">Work/Life Balance</label>
                        <select name="workLifeBalance" value={formData.workLifeBalance} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-900 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer">
                            <option value="" className="bg-gray-900 text-gray-400">Select...</option>
                            <option value="Balanced" className="bg-gray-900 text-white">Balanced</option>
                            <option value="Slightly Unbalanced" className="bg-gray-900 text-white">Slightly Unbalanced</option>
                            <option value="Very Unbalanced" className="bg-gray-900 text-white">Very Unbalanced</option>
                        </select>
                    </div>
                     <div>
                        <label className="block mb-2 text-sm font-semibold text-white">Diet Preference</label>
                        <select name="dietPreference" value={formData.dietPreference} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-gray-900 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer">
                            <option value="" className="bg-gray-900 text-gray-400">No Preference</option>
                            <option value="Vegetarian" className="bg-gray-900 text-white">Vegetarian</option>
                            <option value="Vegan" className="bg-gray-900 text-white">Vegan</option>
                            <option value="Pescatarian" className="bg-gray-900 text-white">Pescatarian</option>
                            <option value="Keto" className="bg-gray-900 text-white">Keto</option>
                            <option value="Paleo" className="bg-gray-900 text-white">Paleo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-3 text-sm font-semibold text-white">Medical Conditions</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {conditionsList.map(c => (
                                <button key={c} type="button" onClick={() => handleMultiSelect('conditions', c)} className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${formData.conditions.includes(c) ? 'bg-primary text-white shadow-lg' : 'bg-card text-white hover:bg-card-hover border border-white/10'}`}>{c}</button>
                            ))}
                                <button type="button" onClick={() => handleMultiSelect('conditions', 'Other')} className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg ${formData.conditions.includes('Other') ? 'bg-primary text-white shadow-lg' : 'bg-card text-white hover:bg-card-hover border border-white/10'}`}>Other</button>
                        </div>
                        {formData.conditions.includes('Other') && (
                            <div className="mt-4">
                                <input type="text" name="otherCondition" value={formData.otherCondition} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-card text-white border border-white/10 focus:border-white/50 outline-none transition-all shadow-sm" placeholder="Please specify your condition" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block mb-3 text-sm font-semibold text-white">Health Goals <span className="text-primary">*</span></label>
                        <p className="text-gray-400 text-sm mb-3">Select at least one goal</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {goalsList.map(g => (
                                <button 
                                    key={g} 
                                    type="button" 
                                    onClick={() => handleMultiSelect('goals', g)} 
                                    className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                        formData.goals.includes(g) 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                    }`}
                                >
                                    {formData.goals.includes(g) && <CheckCircle className="w-4 h-4 inline mr-1" />}
                                    {g}
                                </button>
                            ))}
                            <button 
                                type="button" 
                                onClick={() => handleMultiSelect('goals', 'Other')} 
                                className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                    formData.goals.includes('Other') 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                }`}
                            >
                                {formData.goals.includes('Other') && <CheckCircle className="w-4 h-4 inline mr-1" />}
                                Other
                            </button>
                        </div>
                        {formData.goals.includes('Other') && (
                            <div className="mt-4">
                                <input 
                                    type="text" 
                                    name="otherGoal" 
                                    value={formData.otherGoal} 
                                    onChange={handleInputChange} 
                                    className="w-full p-4 rounded-xl bg-white/5 text-white border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm" 
                                    placeholder="Please specify your goal" 
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            onClick={generateAdvice} 
                            disabled={!isFormValid()} 
                            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform shadow-lg flex items-center justify-center gap-2 ${
                                isFormValid() 
                                    ? 'bg-primary hover:bg-primary-dark text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25' 
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                            aria-disabled={!isFormValid()}
                        >
                            <Sparkles className="w-5 h-5" />
                            Generate Personalized Health Plan
                        </button>
                        {!isFormValid() && (
                            <p className="text-center text-gray-400 text-sm mt-3">
                                Please fill in all required fields marked with <span className="text-primary">*</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPlan;