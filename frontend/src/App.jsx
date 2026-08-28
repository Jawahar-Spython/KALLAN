import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/check', {
        message: message.trim(),
      });

      setResult(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError("Could not connect to Kallan's backend. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleScam = () => {
    setMessage("Congratulations! You've won $5000 in the Amazon lottery. Claim now by sending your bank details to claim@prize-win.com");
    setResult(null);
    setError(null);
  };

  const loadSampleSafe = () => {
    setMessage("Hey mom, just letting you know I reached home safely. Will call you after dinner!");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Main Centered Card Container */}
      <main className="relative w-full max-w-[600px] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/20 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Kallan
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            AI that thinks like a scammer to catch one.
          </p>
        </div>

        {/* Textarea Input Section */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste a suspicious message here (SMS, email, WhatsApp text)..."
              rows={5}
              disabled={loading}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y text-sm sm:text-base leading-relaxed disabled:opacity-50"
            />
          </div>

          {/* Quick Samples */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Test:</span>
            <button
              type="button"
              onClick={loadSampleScam}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/50 cursor-pointer"
            >
              Phishing Scam
            </button>
            <button
              type="button"
              onClick={loadSampleSafe}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/50 cursor-pointer"
            >
              Safe Message
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading || !message.trim()}
          className="w-full py-3.5 px-6 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin text-blue-200" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Check Message</span>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            
            {/* Verdict Badge & Confidence */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              
              {/* Verdict Badge */}
              {result.verdict === 'SCAM' ? (
                <div className="bg-red-500/15 border border-red-500/30 text-red-400 font-bold px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 text-xs sm:text-sm tracking-wide uppercase">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>SCAM DETECTED</span>
                </div>
              ) : (
                <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 text-xs sm:text-sm tracking-wide uppercase">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>LOOKS SAFE</span>
                </div>
              )}

              {/* Confidence Percentage */}
              <div className="text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">
                Confidence: <span className={result.verdict === 'SCAM' ? 'text-red-400' : 'text-emerald-400'}>{result.confidence}%</span>
              </div>
            </div>

            {/* Reasons Bulleted List */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Why:
              </h2>
              {result.reasons && result.reasons.length > 0 ? (
                <ul className="space-y-2 text-sm text-slate-300">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">No specific flags highlighted.</p>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-8 text-xs text-slate-500 text-center">
        Kallan Scam Detector • Connected to http://localhost:5000
      </footer>
    </div>
  );
}
