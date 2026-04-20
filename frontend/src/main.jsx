import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const ConfigurationError = () => (
  <div className="min-h-screen bg-[#060e06] flex items-center justify-center p-6 text-center">
    <div className="glass p-12 rounded-[2.5rem] border border-red-500/20 max-w-md">
      <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-red-500 text-3xl">⚠️</span>
      </div>
      <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Security Layer Offline</h1>
      <p className="text-gray-400 text-sm font-medium leading-relaxed uppercase tracking-widest">
        Verdentix Auth requires a Publishable Key. Please add <code className="text-primary italic">VITE_CLERK_PUBLISHABLE_KEY</code> to your .env file.
      </p>
    </div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <ConfigurationError />
    )}
  </StrictMode>,
)
