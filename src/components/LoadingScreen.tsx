import { useState, useEffect } from 'react';
import { Loader, AlertCircle } from 'lucide-react';

interface LoadingScreenProps {
  onSkip: () => void;
}

export const LoadingScreen = ({ onSkip }: LoadingScreenProps) => {
  const [seconds, setSeconds] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Show skip button after 2 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 2000);

    // Auto-skip after 3 seconds
    const autoSkip = setTimeout(() => {
      onSkip();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(skipTimer);
      clearTimeout(autoSkip);
    };
  }, [onSkip]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative">
          <Loader className="w-16 h-16 text-green-500 animate-spin mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full animate-ping"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mt-6 mb-2">
          SmartPay
        </h2>
        <p className="text-slate-300 mb-4">
          Loading your dashboard...
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{seconds}s</span>
        </div>

        {showSkip && (
          <div className="mt-6 animate-fadeIn">
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition backdrop-blur-sm border border-white/20"
            >
              Continue to Registration
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Taking too long? Click to skip
            </p>
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg max-w-md mx-auto">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-yellow-200 font-semibold">Connection Issue?</p>
              <p className="text-xs text-yellow-300/80 mt-1">
                If this takes more than 3 seconds, you'll be automatically redirected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
