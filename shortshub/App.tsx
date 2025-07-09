import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreatorPage from './pages/CreatorPage';
import MyShortsPage from './pages/MyShortsPage';
import SettingsPage from './pages/SettingsPage';
import AIEditorPage from './pages/AIEditorPage';
import { SpinnerIcon } from './components/icons';

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  description: string;
}

export interface Idea {
    title: string;
    timestamp: string;
    description: string;
    generatedThumbnailUrl?: string;
}

export interface Creation {
    id: number;
    type: 'generated' | 'uploaded' | 'ai-generated';
    title: string;
    description: string;
    timestamp?: string;
    originalVideoId?: string;
    originalVideoThumbnailUrl?: string;
    generatedThumbnailUrl?: string;
    videoUrl?: string; 
    platformReady: {
        youtube: boolean;
        tiktok: boolean;
        instagram: boolean;
    };
}

export type Platform = 'youtube' | 'tiktok' | 'instagram';
export type PlatformConnections = Record<Platform, boolean>;

type View = 'login' | 'dashboard' | 'creator' | 'myShorts' | 'settings' | 'aiEditor';

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
                 if(isAuthenticated === false && hash !== 'login') {
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

        window.addEventListener('hashchange', handleHashChange, false);
        handleHashChange(); // Check hash on initial load

        return () => window.removeEventListener('hashchange', handleHashChange);

    }, [checkAuthStatus, isAuthenticated]);
    
    useEffect(() => {
        if (isAuthenticated === false) {
             window.location.hash = 'login';
        } else if (isAuthenticated === true && (view === 'login' || window.location.hash.replace('#','') === 'login')) {
            window.location.hash = 'dashboard';
        }
    }, [isAuthenticated, view]);


    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        window.location.hash = 'dashboard';
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setIsAuthenticated(false);
        window.location.hash = 'login';
    };
    
    const handleSelectVideo = (video: Video) => {
        setSelectedVideo(video);
        window.location.hash = 'creator';
    };

    if (isAuthenticated === null) {
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center">
                <SpinnerIcon className="h-12 w-12 text-purple-600 animate-spin" />
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
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
    }

    return <CurrentView />;
};

export default App;
