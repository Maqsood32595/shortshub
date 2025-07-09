import React, { useState, useEffect, useCallback } from 'react';
import { Logo } from '../components/Logo';
import { ArrowLeftIcon, YouTubeIcon, TikTokIcon, InstagramIcon, CheckCircleIcon, SpinnerIcon } from '../components/icons';
import type { Platform, PlatformConnections } from '../App';

interface SettingsPageProps {
  onBack: () => void;
}

const platformInfo = {
    youtube: { name: 'YouTube', icon: YouTubeIcon, color: 'red' },
    tiktok: { name: 'TikTok', icon: TikTokIcon, color: 'black' },
    instagram: { name: 'Instagram', icon: InstagramIcon, color: 'pink' },
};

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [connections, setConnections] = useState<PlatformConnections>({
    youtube: false,
    tiktok: false,
    instagram: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/social/connections');
        if (!response.ok) {
            throw new Error('Could not fetch connection status.');
        }
        const data = await response.json();
        setConnections(data);
    } catch (error) {
        console.error("Error fetching connections:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleConnect = (platform: Platform) => {
    window.location.href = `/api/social/${platform}`;
  };

  const handleDisconnect = async (platform: Platform) => {
    // In a real app, this would call a backend endpoint to revoke tokens
    // For now, it's a client-side simulation until the backend endpoint is built.
    // await fetch(`/api/social/${platform}/disconnect`, { method: 'POST' });
    setConnections(prev => ({...prev, [platform]: false}));
    alert(`Disconnecting from ${platformInfo[platform].name} is not yet implemented on the backend.`);
  };
  
  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold py-2 px-3 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 flex-grow">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Account Connections</h1>
          <p className="text-slate-500 mb-8">Connect your social media accounts to enable cross-platform features.</p>
          
          {isLoading ? (
             <div className="flex items-center justify-center h-48">
                <SpinnerIcon className="w-10 h-10 text-purple-500 animate-spin" />
             </div>
          ) : (
            <div className="space-y-4">
                {(Object.keys(platformInfo) as Platform[]).map((platform) => {
                const isConnected = connections[platform];
                const Info = platformInfo[platform];
                const Icon = Info.icon;

                return (
                    <div key={platform} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <Icon className={`w-8 h-8 text-${Info.color}-500`} />
                            <div>
                                <p className="font-bold text-lg text-slate-800">{Info.name}</p>
                                {isConnected ? (
                                    <div className="flex items-center gap-1.5 text-green-600">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Connected</span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">Not Connected</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => isConnected ? handleDisconnect(platform) : handleConnect(platform)}
                            className={`font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 shadow-sm ${
                                isConnected 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                        >
                            {isConnected ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                )
                })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
