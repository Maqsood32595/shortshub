import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { ArrowLeftIcon, MagicWandIcon, SpinnerIcon, DownloadIcon, CheckCircleIcon, PhotoIcon } from '../components/icons';
import type { Video, Idea } from '../App';

interface CreatorPageProps {
  video: Video;
  onBack: () => void;
}

const CreatorPage: React.FC<CreatorPageProps> = ({ video, onBack }) => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);


    const handleGenerateIdeas = async () => {
        setIsLoading(true);
        setError(null);
        setIdeas([]);
        setSelectedIdea(null);

        try {
            const response = await fetch('/api/ai/generate-ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: video.title,
                    description: video.description,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.error || `Request failed with status ${response.status}`);
            }

            const generatedIdeas = await response.json();
            setIdeas(generatedIdeas);

        } catch (e) {
            console.error("Error generating ideas:", e);
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Sorry, we couldn't generate ideas. (${errorMessage})`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectIdea = (idea: Idea) => {
        setSelectedIdea(idea);
    };

    const handleBackToIdeas = () => {
        setSelectedIdea(null);
    };

    const handleExport = async () => {
        if (!selectedIdea) return;
        
        setIsExporting(true);
        try {
            const response = await fetch('/api/videos/save-repurpose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    idea: selectedIdea,
                    originalVideoId: video.id 
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save the short.');
            }
             setShowSuccess(true);
             setTimeout(() => {
                onBack(); 
            }, 2500);

        } catch (err) {
            console.error(err);
            // Optionally show an error to the user
        } finally {
             setIsExporting(false);
        }
    };

    const handleRefineDescription = async () => {
        if (!selectedIdea) return;
        
        setIsRefining(true);
        try {
            const response = await fetch('/api/ai/refine-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: selectedIdea.title,
                    description: selectedIdea.description
                })
            });

            if (!response.ok) throw new Error('Failed to refine description');
            
            const data = await response.json();
            
            setSelectedIdea(prev => prev ? { ...prev, description: data.newDescription } : null);

        } catch(e) {
            console.error("Refine error:", e);
        } finally {
            setIsRefining(false);
        }
    };

    const handleGenerateThumbnail = async () => {
        if (!selectedIdea) return;
        
        setIsGeneratingThumbnail(true);
        try {
            const response = await fetch('/api/ai/generate-thumbnail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: selectedIdea.title })
            });

            if (!response.ok) throw new Error('Failed to generate thumbnail');
            
            const data = await response.json();
            
            setSelectedIdea(prev => prev ? { ...prev, generatedThumbnailUrl: data.imageUrl } : null);

        } catch(e) {
            console.error("Thumbnail generation error:", e);
        } finally {
            setIsGeneratingThumbnail(false);
        }
    };

    const IdeaGenerationView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Video Info */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Create Shorts From</h1>
                <h2 className="text-xl font-semibold text-indigo-600 mb-4">{video.title}</h2>
                <div className="aspect-video bg-slate-200 rounded-lg mb-4 overflow-hidden shadow-md">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-slate-600 text-sm">{video.description}</p>
            </div>

            {/* Right Column: AI Generation */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">AI-Powered Ideas</h3>
                <button
                    onClick={handleGenerateIdeas}
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-purple-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <SpinnerIcon className="animate-spin h-5 w-5" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <MagicWandIcon className="h-6 w-6" />
                            <span>Generate 5 Clip Ideas</span>
                        </>
                    )}
                </button>
                
                <div className="mt-6 space-y-4 h-96 overflow-y-auto pr-2">
                    {error && <div className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</div>}

                    {ideas.map((idea, index) => (
                        <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-lg animate-fade-in group hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200">
                            <h4 className="font-bold text-slate-800">{idea.title}</h4>
                            <p className="text-sm font-semibold text-indigo-600 my-1">{idea.timestamp}</p>
                            <p className="text-sm text-slate-600 mb-4">{idea.description}</p>
                            <button onClick={() => handleSelectIdea(idea)} className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300">
                                Select & Edit
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const EditorView = () => {
        const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (selectedIdea) setSelectedIdea({ ...selectedIdea, title: e.target.value });
        };

        const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (selectedIdea) setSelectedIdea({ ...selectedIdea, description: e.target.value });
        };

        return (
            <div className="animate-fade-in">
                <button onClick={handleBackToIdeas} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold mb-6">
                    <ArrowLeftIcon className="h-5 w-5" />
                    <span>Back to Ideas</span>
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column: Editor Preview */}
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Editing Short</h3>
                        <div className="aspect-[9/16] bg-slate-900 rounded-lg overflow-hidden relative shadow-lg">
                            <img src={selectedIdea?.generatedThumbnailUrl || video.thumbnailUrl} alt="Video content" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-t from-black/60 to-transparent">
                                <div></div>
                                <div className="text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
                                    <h4 className="font-bold text-xl leading-tight">{selectedIdea?.title}</h4>
                                    <p className="text-base opacity-90">{selectedIdea?.timestamp}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Customization & Export */}
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Customize & Export</h3>
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg flex-grow space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-700 mb-1">Title</h4>
                                <input
                                    type="text"
                                    value={selectedIdea?.title || ''}
                                    onChange={handleTitleChange}
                                    className="w-full text-slate-900 bg-white p-2 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                                    placeholder="Enter a title..."
                                />
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold text-slate-700">Description</h4>
                                    <button 
                                        onClick={handleRefineDescription} 
                                        disabled={isRefining}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 disabled:text-purple-300 disabled:cursor-wait transition-colors"
                                        aria-label="Refine description with AI"
                                    >
                                        {isRefining ? <><SpinnerIcon className="animate-spin h-3 w-3" /><span>Refining...</span></> : <><MagicWandIcon className="h-4 w-4" /><span>Refine with AI</span></>}
                                    </button>
                                </div>
                                <textarea
                                    value={selectedIdea?.description || ''}
                                    onChange={handleDescriptionChange}
                                    className="w-full text-sm text-slate-600 bg-white p-2 rounded border border-slate-300 h-28 resize-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                                    placeholder="Enter a description..."
                                />
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-700 mb-2">AI Thumbnail</h4>
                                <div className="aspect-video w-full bg-slate-200 rounded overflow-hidden mb-2">
                                     {isGeneratingThumbnail ? (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500">
                                            <SpinnerIcon className="animate-spin h-8 w-8" />
                                        </div>
                                     ) : (
                                        <img src={selectedIdea?.generatedThumbnailUrl || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Generate+a+Thumbnail'} alt="Generated thumbnail" className="w-full h-full object-cover"/>
                                     )}
                                </div>
                                <button 
                                    onClick={handleGenerateThumbnail} 
                                    disabled={isGeneratingThumbnail}
                                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 bg-purple-100 hover:bg-purple-200 disabled:text-purple-300 disabled:cursor-wait transition-colors p-2 rounded-lg"
                                >
                                    {isGeneratingThumbnail ? <><SpinnerIcon className="animate-spin h-4 w-4" /><span>Generating...</span></> : <><PhotoIcon className="h-5 w-5" /><span>Generate Thumbnail</span></>}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-green-300 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <><SpinnerIcon className="animate-spin h-5 w-5" /><span>Exporting...</span></>
                            ) : (
                                <><DownloadIcon className="h-6 w-6" /><span>Export Short</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    const SuccessOverlay = () => (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-30 animate-fade-in">
            <CheckCircleIcon className="w-24 h-24 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-slate-800">Short Exported!</h3>
            <p className="text-slate-600">Your new Short is ready in "My Shorts".</p>
        </div>
    );

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
                <div className="relative bg-white p-8 rounded-2xl shadow-lg">
                    {showSuccess && <SuccessOverlay />}
                    {selectedIdea ? <EditorView /> : <IdeaGenerationView />}
                </div>
            </main>
        </div>
    );
};

export default CreatorPage;
