import React, { useState } from 'react';
import { Logo } from '../components/Logo';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        
        const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                onLoginSuccess();
            } else {
                const data = await response.json();
                setError(data.error || 'An unexpected error occurred.');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleForm = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsRegister(!isRegister);
        setError(null);
        setUsername('');
        setPassword('');
    };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 relative">
            <Logo />
            <div className="absolute top-0 left-4 -mt-px">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-b-md shadow-sm">BETA</span>
            </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center py-12 md:py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            <span className="text-purple-700">Welcome to</span>
            <span className="text-slate-800"> shortshub.app</span>
          </h1>
          <p className="text-xl text-slate-600 mb-4 font-medium">
            YouTube Shorts Repurposer
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
            Log in or create an account to start repurposing your YouTube Shorts!
          </p>

          <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-8 text-left">
            <h2 className="text-2xl font-bold text-purple-700 text-center">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-center text-slate-500 mt-1 mb-6">{isRegister ? 'Get started in seconds' : 'Log in to your shortshub.app account'}</p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password"  className="block text-sm font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm font-medium text-center mt-4">{error}</p>}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transform hover:-translate-y-0.5 transition-all duration-300 text-lg disabled:bg-red-400 disabled:cursor-wait"
              >
                {isLoading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
              </button>
            </form>

            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-sm">Or</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <a href="/api/auth/google" className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors duration-300">
                <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path fill="#FBBC05" d="M4.5 24C4.5 22.9 4.59 21.84 4.76 20.82H24V27.18H15.18C14.64 29.04 13.47 30.63 11.82 31.74V36.3H16.8C19.86 33.66 22.2 29.22 22.2 24C22.2 18.78 19.86 14.34 16.8 11.7V7.14H11.82C13.47 8.25 14.64 9.84 15.18 11.7H24V17.82H4.76C4.59 16.8 4.5 15.7 4.5 14.58C4.5 10.14 6.09 6.09 8.82 3.24L3.66 0C1.35 2.52 0 6.12 0 10.5C0 14.88 1.35 18.48 3.66 21L8.82 17.76C6.09 14.91 4.5 10.14 4.5 10.5V24Z" transform="translate(0 10.5)"></path><path fill="#EA4335" d="M24 48C29.46 48 34.26 46.32 37.62 43.44L32.46 39.24C30.6 40.56 28.02 41.64 25.26 41.64C20.22 41.64 15.96 38.46 14.4 34.2H9.24V38.88C11.88 44.22 17.58 48 24 48Z"></path><path fill="#4285F4" d="M43.62 24C43.62 22.8 43.5 21.6 43.26 20.4H24V27.6H35.22C34.62 29.88 33.12 31.8 30.9 33.24L36.06 37.44C39.3 34.92 41.64 30.84 41.64 26.22C41.64 25.2 41.52 24.12 41.34 23.04H43.62V24Z"></path><path fill="#34A853" d="M24 4.32C27.9 4.32 30.9 5.64 32.88 7.44L37.98 2.4C34.26 0.9 29.46 0 24 0C17.58 0 11.88 3.78 9.24 9.12L14.4 13.8C15.96 9.54 20.22 6.36 25.26 6.36C26.04 6.36 27.18 6.48 28.38 6.84L24 4.32Z"></path></g><defs><clipPath id="clip0_17_40"><rect width="48" height="48" fill="white"></rect></clipPath></defs></svg>
                <span>Sign in with Google</span>
            </a>

            <p className="text-center text-sm text-slate-500 mt-6">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <a href="#" onClick={toggleForm} className="font-semibold text-red-600 hover:underline">
                {isRegister ? 'Login' : 'Register'}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
