import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyPlan from './pages/MyPlan';
import MeditationPage from './pages/Meditation';
import HistoryPage from './pages/History';
import ProgressPage from './pages/Progress';
import ResourcesPage from './pages/Resources';
import AboutPage from './pages/About';
import Disclaimer from './components/Disclaimer';
import Plasma from './components/Plasma';
import { getUser, saveUser } from './lib/storage.ts';
import type { User } from './lib/storage.ts';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  
  return null;
};

// Plasma background wrapper component
const PlasmaBackground = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  if (isHomePage) return null;
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Plasma
        color="#5227ff"
        speed={0.8}
        scale={1.2}
        opacity={0.6}
        mouseInteractive={false}
      />
    </div>
  );
};

function AppContent({ user, onUserUpdate }: { user: User | null; onUserUpdate: (formData: User) => void }) {
  return (
    <>
      <ScrollToTop />
      <PlasmaBackground />
      <div className="min-h-screen flex flex-col text-gray-800 dark:text-white font-sans relative z-10">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-plan" element={<MyPlan user={user} onUserUpdate={onUserUpdate} />} />
            <Route path="/meditation" element={<MeditationPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(getUser());
  const [showDisclaimer, setShowDisclaimer] = useState(!user);

  const handleDisclaimerAccept = () => {
    const newUser: User = { name: 'User', createdAt: new Date().toISOString() };
    setUser(newUser);
    saveUser(newUser);
    setShowDisclaimer(false);
  };

  const handleUserUpdate = (formData: User) => {
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  if (showDisclaimer) {
    return <Disclaimer onAccept={handleDisclaimerAccept} />;
  }

  return (
    <BrowserRouter>
      <AppContent user={user} onUserUpdate={handleUserUpdate} />
    </BrowserRouter>
  );
}

export default App;
