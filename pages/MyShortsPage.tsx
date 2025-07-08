import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { ArrowLeftIcon, FilmIcon, YouTubeIcon, TikTokIcon, InstagramIcon, RetryIcon, SpinnerIcon } from '../components/icons';
import type { Creation } from '../App';

interface MyShortsPageProps {
  onBack: () => void;
}

const MyShortsPage: React.FC<MyShortsPageProps> = ({ onBack }) => {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreations = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
            throw new Error('Failed to fetch your Shorts.');
        }
        const data = await response.json();
        // The endpoint returns videos with camelCase properties already.
        // But we need to add the `platformReady` property.
        const creationsWithPlatformStatus = data.map((video: any) => ({
          ...video,
          platformReady: { youtube: true, tiktok: true, instagram: true } // Placeholder
        }));
        setCreations(creationsWithPlatformStatus);
    } catch(err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(message);
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCreations();
  }, [])


  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-white">
                <SpinnerIcon className="h-12 w-12 animate-spin text-purple-400" />
                <p className="mt-4 text-lg">Loading your Shorts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-white bg-red-900/50 p-8 rounded-lg">
                <p className="text-xl font-medium text-red-300">Something went wrong</p>
                <p className="mt-1 text-red-400">{error}</p>
                <button 
                    onClick={fetchCreations}
                    className="mt-6 bg-red-500 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center gap-2 mx-auto"
                >
                    <RetryIcon className="h-5 w-5"/>
                    Try Again
                </button>
            </div>
        );
    }

    if (creations.length === 0) {
       return (
            <div className="text-center text-white">
                <FilmIcon className="mx-auto h-16 w-16 text-slate-500" />
                <h3 className="mt-4 text-2xl font-bold">Your Library is Empty</h3>
                <p className="mt-1 text-slate-400">Upload a video or use AI to create your first Short.</p>
                <button 
                    onClick={onBack} 
                    className="mt-6 bg-indigo-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }
    
    return (
        <div className="relative w-full h-screen snap-y snap-mandatory overflow-y-auto">
            {creations.map((creation, index) => (
                <div key={creation.id || index} className="w-full h-screen snap-center flex items-center justify-center relative bg-black">
                    <div className="relative w-full h-full max-w-[450px] max-h-[800px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 bg-slate-900">
                        {creation.type === 'uploaded' || creation.type === 'ai-generated' ? (
                            <video
                                src={creation.videoUrl}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                                key={creation.videoUrl} // Add key to force re-render on src change
                            />
                        ) : (
                            <img
                                src={creation.generatedThumbnailUrl || creation.originalVideoThumbnailUrl}
                                alt={creation.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
                            <h4 className="text-white font-bold text-lg leading-tight [text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]">{creation.title}</h4>
                            <p className="text-white/80 text-sm mt-1 [text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)] line-clamp-2">{creation.description}</p>
                            <div className="border-t border-white/20 mt-3 pt-3 flex items-center justify-between">
                                <p className="text-white/70 text-xs font-semibold">Ready for:</p>
                                <div className="flex items-center gap-3">
                                    {creation.platformReady.youtube && <YouTubeIcon className="w-6 h-6 text-white" />}
                                    {creation.platformReady.tiktok && <TikTokIcon className="w-5 h-5 text-white" />}
                                    {creation.platformReady.instagram && <InstagramIcon className="w-5 h-5 text-white" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
  }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center relative">
        <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Logo />
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    <span>Dashboard</span>
                </button>
            </div>
        </header>
        {renderContent()}
    </div>
  );
};

export default MyShortsPage;
