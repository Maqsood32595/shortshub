import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { ArrowLeftIcon, MagicWandIcon, SpinnerIcon, DownloadIcon, SparklesIcon } from '../components/icons';

interface GeneratedContent {
    title: string;
    description: string;
    videoUrl: string;
}

interface AIEditorPageProps {
  onBack: () => void;
}

const AIEditorPage: React.FC<AIEditorPageProps> = ({ onBack }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError(null);
        setGeneratedContent(null);

        try {
            const response = await fetch('/api/ai/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to generate video.');
            }
            const data = await response.json();
            setGeneratedContent(data);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReGenerate = () => {
        setGeneratedContent(null);
        handleGenerate();
    };

    const handleSave = async () => {
        if (!generatedContent) return;
        
        setIsSaving(true);
        try {
            const response = await fetch('/api/videos/save-ai-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generatedContent),
            });
            if (!response.ok) {
                throw new Error('Failed to save the AI video.');
            }
            // Navigate back to dashboard after successful save.
            onBack();
        } catch (err) {
            console.error(err);
            // Optionally show an error to the user
            setError("Failed to save your creation. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (generatedContent) setGeneratedContent({ ...generatedContent, title: e.target.value });
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (generatedContent) setGeneratedContent({ ...generatedContent, description: e.target.value });
    };

    const PromptView = () => (
        <div className="max-w-xl mx-auto text-center">
            <SparklesIcon className="w-16 h-16 mx-auto text-purple-500" />
            <h1 className="text-3xl font-bold text-slate-800 mt-4 mb-2">Create New Video with AI</h1>
            <p className="text-slate-500 mb-8">Describe the video you want to create. Be as specific as you want!</p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full text-base text-slate-700 bg-slate-100 p-4 rounded-lg border border-slate-200 h-28 resize-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                placeholder="e.g., A cinematic shot of a coffee being poured in slow motion..."
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="w-full mt-4 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
            >
                {isLoading ? <><SpinnerIcon className="animate-spin h-5 w-5" /><span>Generating...</span></> : <><MagicWandIcon className="h-6 w-6" /><span>Generate Video</span></>}
            </button>
        </div>
    );

    const EditorView = () => {
        if (!generatedContent) return null;
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">AI Generated Video</h3>
                    <div className="aspect-[9/16] bg-slate-900 rounded-lg overflow-hidden shadow-lg">
                        <video src={generatedContent.videoUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                    </div>
                </div>
                 <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Edit & Save</h3>
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg flex-grow space-y-4">
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-1">Title</h4>
                            <input type="text" value={generatedContent.title} onChange={handleTitleChange} className="w-full text-slate-900 bg-white p-2 rounded border border-slate-300" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-1">Description</h4>
                            <textarea value={generatedContent.description} onChange={handleDescriptionChange} className="w-full text-sm text-slate-600 bg-white p-2 rounded border border-slate-300 h-28 resize-none" />
                        </div>
                         {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <div className="flex items-center gap-4 mt-6">
                         <button onClick={handleReGenerate} disabled={isLoading} className="w-full bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                            {isLoading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : <MagicWandIcon className="h-5 w-5" />}
                            <span>Create Similar</span>
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 flex items-center justify-center gap-2 disabled:bg-green-300 disabled:cursor-wait">
                           {isSaving ? <SpinnerIcon className="animate-spin h-5 w-5" /> : <DownloadIcon className="h-5 w-5"/>}
                           <span>{isSaving ? 'Saving...' : 'Save to My Shorts'}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-100 min-h-screen flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Logo />
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold py-2 px-3 rounded-lg transition-colors">
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>
            </header>
            <main className="container mx-auto p-6 flex-grow flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl">
                    {generatedContent ? <EditorView /> : <PromptView />}
                </div>
            </main>
        </div>
    );
};

export default AIEditorPage;
