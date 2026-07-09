import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('recruitai_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('recruitai_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('recruitai_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-2xl z-50 flex flex-col sm:flex-row items-center justify-between border-t border-slate-700">
      <div className="mb-4 sm:mb-0 mr-4 text-sm text-slate-300">
        <p>
          <strong>Privacy & Cookies (Layer 15 Compliance):</strong> We use cookies to secure your session and track token limits. 
          By clicking "Accept", you consent to our <a href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</a> and <a href="/terms" className="text-emerald-400 hover:underline">Terms of Service</a>.
        </p>
      </div>
      <div className="flex shrink-0 space-x-3">
        <button 
          onClick={handleDecline}
          className="px-4 py-2 border border-slate-600 rounded text-slate-300 hover:bg-slate-800 transition text-sm"
        >
          Decline Optional
        </button>
        <button 
          onClick={handleAccept}
          className="px-4 py-2 bg-emerald-600 rounded text-white font-medium hover:bg-emerald-500 transition text-sm"
        >
          Accept All
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
