import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GeneratorPage from './pages/GeneratorPage';
import { ShortsHubLogo } from './components/icons';
import { setAuthToken, clearAuthToken, hasAuthToken, verifyToken } from './services/api';

const AuthWelcome = (): React.ReactNode => (
    <div className="text-center my-12 sm:my-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand-red-500 via-brand-maroon to-brand-blue bg-clip-text text-transparent">
            Welcome to shortshub.app
        </h1>
        <p className="mt-3 text-lg text-base-muted max-w-2xl mx-auto">
            Your All-in-One AI Content Repurposing Hub
        </p>
         <p className="mt-4 text-base text-base-text max-w-3xl mx-auto">
            Log in or create an account to upload videos, generate content ideas, and schedule posts across all your platforms.
        </p>
    </div>
);


const Footer = (): React.ReactNode => (
    <footer className="border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center">
            <ShortsHubLogo />
            <div className="text-center sm:text-right mt-4 sm:mt-0">
                <p className="text-sm text-base-muted">&copy; {new Date().getFullYear()} shortshub.app - AI Shorts Repurposer</p>
                <p className="text-xs text-gray-400">Not affiliated with YouTube or Google LLC.</p>
            </div>
        </div>
    </footer>
);


const App = (): React.ReactNode => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [page, setPage] = useState<'dashboard' | 'generator'>('dashboard');

    const checkAuthStatus = useCallback(async () => {
        if (hasAuthToken()) {
            try {
                // Verify the token with the backend
                await verifyToken();
                setIsAuthenticated(true);
            } catch (error) {
                // Token is invalid or expired
                console.error("Token verification failed:", error);
                clearAuthToken();
                setIsAuthenticated(false);
            }
        }
        setIsLoadingAuth(false);
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const handleLoginSuccess = (token: string) => {
        setAuthToken(token);
        setIsAuthenticated(true);
        setPage('dashboard'); 
    };
    
    const handleLogout = () => {
        clearAuthToken();
        setIsAuthenticated(false);
        setAuthMode('login');
    };

    if (isLoadingAuth) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-red-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} page={page} setPage={setPage} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {!isAuthenticated ? (
                    <>
                        <AuthWelcome />
                        <div className="flex justify-center">
                            {authMode === 'login' ? (
                                <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchMode={() => setAuthMode('register')} />
                            ) : (
                                <RegisterPage onRegisterSuccess={handleLoginSuccess} onSwitchMode={() => setAuthMode('login')} />
                            )}
                        </div>
                    </>
                ) : (
                    <>
                       {page === 'dashboard' && <DashboardPage />}
                       {page === 'generator' && <GeneratorPage />}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default App;
