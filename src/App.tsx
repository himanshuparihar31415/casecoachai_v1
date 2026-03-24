import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Config from './pages/Config';
import Session from './pages/Session';
import Report from './pages/Report';

function AppContent() {
  const location = useLocation();
  const isSession = location.pathname === '/session';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showTimer={isSession} />
      <main className="flex-grow pt-24 pb-20 px-8 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/config" element={<Config />} />
          <Route path="/session" element={<Session />} />
          <Route path="/report" element={<Report />} />
          <Route path="/settings" element={<div className="py-20 text-center text-secondary">Settings module coming soon.</div>} />
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
