
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building ShortsHub application...');

// Build server
console.log('📦 Building server...');
try {
  execSync('cd server && npm run build', { stdio: 'inherit' });
  console.log('✅ Server built successfully');
} catch (error) {
  console.error('❌ Server build failed:', error);
  process.exit(1);
}

// Create a simple static build directory
console.log('📦 Creating frontend build...');
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy static files
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(buildDir, 'index.html'));

// Create a simple production HTML file
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShortsHub - AI-Powered Video Management</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        
        function App() {
            const [status, setStatus] = useState('loading');
            
            useEffect(() => {
                fetch('/health')
                    .then(res => res.json())
                    .then(data => setStatus('connected'))
                    .catch(() => setStatus('error'));
            }, []);
            
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-purple-700 mb-4">ShortsHub</h1>
                        <p className="text-lg text-slate-600 mb-8">AI-Powered Video Management</p>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-sm text-slate-500">
                                Server Status: <span className={status === 'connected' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-yellow-600'}>{status}</span>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(buildDir, 'index.html'), htmlContent);

console.log('✅ Build completed successfully!');
