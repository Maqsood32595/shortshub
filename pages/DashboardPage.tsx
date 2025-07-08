import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../components/Logo';
import { LogoutIcon, MagicWandIcon, FilmIcon, RetryIcon, SettingsIcon, UploadIcon, SparklesIcon } from '../components/icons';
import type { Video } from '../App';

interface DashboardPageProps {
  onLogout: () => void;
  onSelectVideo: (video: Video) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onLogout, 
  onSelectVideo, 
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
            if(response.status === 401) onLogout();
            throw new Error('Failed to fetch videos from the server.');
        }
        const data = await response.json();
        setVideos(data);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(errorMessage);
        console.error("Error fetching videos:", e);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('video', file);
      
      try {
        const response = await fetch('/api/videos/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const newVideo = await response.json();
        setVideos(prevVideos => [newVideo, ...prevVideos]);

      } catch (err) {
        setError('Failed to upload video. Please try again.');
        console.error(err);
      } finally {
        setUploading(false);
        // Reset the file input
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-slate-200"></div>
              <div className="p-5">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="mt-4 w-full h-10 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
        return (
            <div className="text-center py-16 border-2 border-dashed border-red-200 rounded-lg bg-red-50">
                <p className="text-xl font-medium text-red-700">Something went wrong</p>
                <p className="mt-1 text-red-600">{error}</p>
                <button 
                    onClick={fetchVideos}
                    className="mt-6 bg-red-600 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center gap-2 mx-auto"
                >
                    <RetryIcon className="h-5 w-5"/>
                    Try Again
                </button>
            </div>
        );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {videos.map(video => (
          <div 
            key={video.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group flex flex-col"
          >
            <div className="relative">
              <img className="w-full h-48 object-cover" src={video.thumbnailUrl} alt={video.title} />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{video.title}</h3>
              <div className="flex-grow"></div>
              <button 
                  onClick={() => onSelectVideo(video)}
                  className="mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300 flex items-center justify-center gap-2"
              >
                  <MagicWandIcon className="h-5 w-5" />
                  <span>Repurpose Video</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-2">
            <a href="#aiEditor" className="hidden sm:flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm">
                <SparklesIcon className="h-5 w-5" />
                <span>Create with AI</span>
            </a>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/mp4,video/mov,video/quicktime" className="hidden" disabled={uploading}/>
            <button onClick={handleUploadClick} disabled={uploading} className="hidden sm:flex items-center gap-2 text-slate-600 bg-slate-200 hover:bg-slate-300 font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-slate-300 disabled:cursor-wait">
                {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div> : <UploadIcon className="h-5 w-5" />}
                <span>{uploading ? 'Uploading...': 'Upload Short'}</span>
            </button>
            
            <a href="#myShorts" className="flex items-center justify-center h-10 w-10 text-slate-600 hover:bg-slate-200 rounded-full transition-colors duration-200">
              <FilmIcon className="h-6 w-6" />
            </a>
             <a href="#settings" className="flex items-center justify-center h-10 w-10 text-slate-600 hover:bg-slate-200 rounded-full transition-colors duration-200">
              <SettingsIcon className="h-6 w-6" />
            </a>
            <button onClick={onLogout} className="flex items-center justify-center h-10 w-10 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors duration-200">
              <LogoutIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Your Videos</h1>
             <p className="text-slate-500">Select a long-form video to repurpose.</p>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardPage;
