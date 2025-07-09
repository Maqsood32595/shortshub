import React, { useState, useEffect, useCallback } from 'react';
import DashboardPage from './pages/DashboardPage';
import CreatorPage from './pages/CreatorPage';
import MyShortsPage from './pages/MyShortsPage';
import SettingsPage from './pages/SettingsPage';
import AIEditorPage from './pages/AIEditorPage';
import LoginPage from './pages/LoginPage';

type View = 'dashboard' | 'creator' | 'myShorts' | 'settings' | 'aiEditor' | 'login';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  url: string;
  platform: string;
  createdAt: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error('Auth check failed:', error);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      if (['dashboard', 'creator', 'myShorts', 'settings', 'aiEditor', 'login'].includes(hash)) {
        if (isAuthenticated === false && hash !== 'login') {
          window.location.hash = 'login';
        } else if (isAuthenticated === true && hash === 'login') {
          window.location.hash = 'dashboard';
        } else {
          setView(hash as View);
        }
      } else {
        window.location.hash = isAuthenticated ? 'dashboard' : 'login';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, checkAuthStatus]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      window.location.hash = 'login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    window.location.hash = 'creator';
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const CurrentView = () => {
    const currentView = window.location.hash.replace('#', '') || 'dashboard';
    switch (currentView) {
      case 'creator':
        return <CreatorPage video={selectedVideo!} onBack={() => window.location.hash = 'dashboard'} />;
      case 'myShorts':
        return <MyShortsPage onBack={() => window.location.hash = 'dashboard'} />;
      case 'settings':
        return <SettingsPage onBack={() => window.location.hash = 'dashboard'} />;
      case 'aiEditor':
        return <AIEditorPage onBack={() => window.location.hash = 'dashboard'} />;
      case 'dashboard':
      default:
        return <DashboardPage onLogout={handleLogout} onSelectVideo={handleSelectVideo} />;
    }
  };

  return <CurrentView />;
};

export default App;