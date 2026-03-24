import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { cn } from './lib/utils';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Config from './pages/Config';
import Session from './pages/Session';
import Report from './pages/Report';
import Landing from './pages/Landing';
import AuthModal from './components/auth/AuthModal';

function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('is_authenticated', 'true');
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_authenticated');
  };

  const isSession = location.pathname === '/session';
  const isLanding = location.pathname === '/';

  // Redirect to dashboard if logged in and on landing
  if (isAuthenticated && isLanding) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin} 
      />
      <Navbar 
        showTimer={isSession} 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout}
        onLogin={() => setIsAuthModalOpen(true)}
      />
      <main className={cn(
        "flex-grow w-full mx-auto",
        isLanding ? "pt-24" : "pt-24 pb-20 px-8 max-w-7xl"
      )}>
        <Routes>
          <Route path="/" element={<Landing onOpenAuth={() => setIsAuthModalOpen(true)} />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/library" 
            element={isAuthenticated ? <Library /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/config" 
            element={isAuthenticated ? <Config /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/session" 
            element={isAuthenticated ? <Session /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/report" 
            element={isAuthenticated ? <Report /> : <Navigate to="/" replace />} 
          />
          <Route path="/settings" element={<div className="py-20 text-center text-secondary">Settings module coming soon.</div>} />
          {/* Fallback for legacy / path if needed, but we use / for landing now */}
        </Routes>
      </main>
      {!isSession && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
