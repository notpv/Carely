import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'; // Moved to top
import Home from './pages/Home';
import MyPlan from './pages/MyPlan';
import HistoryPage from './pages/History';
import ProgressPage from './pages/Progress';
import ResourcesPage from './pages/Resources';
import AboutPage from './pages/About';
import Disclaimer from './components/Disclaimer';
import { getUser, saveUser } from './lib/storage.ts';
import type { User } from './lib/storage.ts';

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
  }

    if (showDisclaimer) {

      return <Disclaimer onAccept={handleDisclaimerAccept} />;

    }
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white font-sans">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-plan" element={<MyPlan user={user} onUserUpdate={handleUserUpdate} />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
