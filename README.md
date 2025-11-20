# Carely - AI-Powered Personalized Health Advisor

<div align="center">
    
![Carely Logo](https://img.shields.io/badge/Carely-Health_Companion-06b6d4?style=for-the-badge&logo=heart&logoColor=white)

**Your Health is Unique. Your Advice Should Be Too.**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Technologies](#-technologies)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Team](#-team)
- [License](#-license)

---

## 🎯 About

Carely is an innovative AI-powered health advisory platform that moves beyond generic advice. By analyzing your unique health profile—including demographics, activity levels, medical conditions, and personal goals—our system generates holistic and actionable wellness plans covering diet, exercise, sleep, and stress management.

Built with cutting-edge web technologies and powered by Google's Gemini AI, Carely provides transparent, evidence-based reasoning for every recommendation, making personalized health guidance accessible to everyone.

---

## ✨ Features

### 🧠 **AI-Powered Personalization**
- Advanced AI analysis using Google Gemini 2.5 Pro/Flash models
- Comprehensive health profile assessment
- Evidence-based recommendations with confidence scores
- Transparent reasoning for every piece of advice

### 📊 **Holistic Health Plans**
- **Diet Recommendations**: Personalized nutrition advice with macro-nutrient breakdowns
- **Exercise Guidance**: Activity plans tailored to your fitness level
- **Sleep Optimization**: Strategies for better rest and recovery
- **Stress Management**: Techniques for mental well-being

### 📈 **Progress Tracking**
- Visual progress charts for weight, sleep, and mood
- Daily journal entries for health metrics
- Historical trend analysis
- Export functionality for personal records

### 💾 **Plan Management**
- Save and review past health plans
- Track multiple wellness goals simultaneously
- Export plans as professional PDF documents
- Local data persistence for privacy

### 🧮 **Interactive Tools**
- Built-in BMI calculator with unit conversions
- Real-time form validation
- Dynamic macro-nutrient visualization
- Responsive charts and graphs

### 🎨 **Modern UI/UX**
- Beautiful dark-themed interface
- Smooth animations and transitions
- Particle effects background
- Mobile-responsive design
- Accessible component design

---

## 🛠 Technologies

### **Frontend**
- **React 19.2.0** - Latest React with modern features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.2.2** - Lightning-fast build tool
- **React Router 7.9.5** - Client-side routing
- **TailwindCSS 3.4.18** - Utility-first CSS framework

### **UI Components & Visualization**
- **Lucide React** - Beautiful icon library
- **Recharts 3.4.1** - Responsive chart components
- **tsParticles** - Interactive particle animations
- **jsPDF** - PDF generation for plan exports
- **html2canvas** - HTML to image conversion

### **Backend**
- **Node.js & Express** - RESTful API server
- **Google Generative AI (@google/generative-ai)** - Gemini AI integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### **Development Tools**
- **ESLint** - Code linting and quality
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS & Autoprefixer** - CSS processing
- **Babel React Compiler** - React optimization

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v20.19.0 or higher recommended)
- npm (v8.0.0 or higher)
- A Google Gemini API key ([Get one here](https://ai.google.dev/))

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carely
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   touch .env
   ```
   
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   
   Replace `your_api_key_here` with your actual Gemini API key.

### **Running the Application**

You need to run both the backend server and the frontend development server simultaneously.

1. **Start the backend server** (in one terminal):
   ```bash
   cd backend
   npm start
   ```
   The backend will start on `http://localhost:3001`

2. **Launch the frontend** (in a separate terminal):
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

### **Building for Production**

```bash
# Build the frontend
npm run build

# Preview the production build
npm run preview
```

---

## 📁 Project Structure

```
carely/
├── backend/
│   ├── server.js          # Express server with Gemini AI integration
│   ├── package.json       # Backend dependencies
│   └── .env              # API keys (gitignored)
├── src/
│   ├── components/
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Footer.tsx    # Footer component
│   │   └── Disclaimer.tsx # Medical disclaimer modal
│   ├── contexts/
│   │   └── ThemeContext.tsx # Dark mode theme provider
│   ├── lib/
│   │   └── storage.ts    # LocalStorage utilities
│   ├── pages/
│   │   ├── Home.tsx      # Landing page
│   │   ├── MyPlan.tsx    # Health plan generator
│   │   ├── History.tsx   # Past plans viewer
│   │   ├── Progress.tsx  # Progress tracking
│   │   ├── Resources.tsx # Health resources
│   │   └── About.tsx     # Team information
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

---

## 👥 Team

This project was developed by a passionate team of undergraduate students from **Dayananda Sagar University (DSU)**, Bengaluru, under the expert guidance of **Dr. Savitha Hiremath**.

### **Development Team**
- **Midde Prerana** - Team Member
- **N M Bhavana** - Team Member
- **Pranav Vinod Pillai** - Team Member
- **R S Chiraag** - Team Member
- **Rishika Talasila** - Team Member

### **Mentor**
- **Dr. Savitha Hiremath** - Project Mentor

---

## ⚠️ Medical Disclaimer

**Important**: This AI-powered tool is designed for **informational and educational purposes only**. It is **NOT a substitute** for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals before making any health-related decisions.

---

## 📄 License

Copyright © 2025 Carely. All Rights Reserved.

---

## 🤝 Contributing

We welcome contributions! If you'd like to improve Carely, please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📞 Support

For questions or support, please reach out to the development team or open an issue in the repository.

---

<div align="center">

**Made with ❤️ by DSU Students**

*"The greatest wealth is health."*

</div>
