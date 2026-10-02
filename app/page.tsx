export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-20">
        {/* Header Badge */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block border border-cyan-500/30 rounded-full px-6 py-2 mb-6">
            <span className="text-cyan-400 font-medium tracking-wide text-sm">
              FinLit VENTURES
            </span>
            <span className="text-gray-400 mx-3">|</span>
            <span className="text-gray-300 text-sm">Product Strategy Deck</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            SIP GUARDIAN
            <span className="block gradient-text">AI Financial Co-Pilot</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Real-time behavioral intervention at critical SIP decision moments—helping retail investors preserve wealth through informed choices
          </p>
        </div>

        {/* Three Key Points */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          <div className="card-glass rounded-2xl p-8 border-l-4 border-purple-500">
            <div className="text-sm font-semibold text-purple-400 mb-3 tracking-wide">
              1. THE ATTRITION CRISIS
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              81.05% SIP stoppage rate in 2026. 70-78% of retail SIPs discontinued within 24-36 months. Indian households suffer 5.3% annual return drag solely from emotional panic-selling.
            </p>
          </div>

          <div className="card-glass rounded-2xl p-8 border-l-4 border-cyan-500">
            <div className="text-sm font-semibold text-cyan-400 mb-3 tracking-wide">
              2. THE AI INTERVENTION
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              A sub-2-second proactive decision support layer triggering precisely upon "Pause/Cancel SIP" actions—revealing compounding loss, portfolio context, goal preservation, and downscaling options.
            </p>
          </div>

          <div className="card-glass rounded-2xl p-8 border-l-4 border-blue-500">
            <div className="text-sm font-semibold text-blue-400 mb-3 tracking-wide">
              3. THE QUANTIFIED IMPACT
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Retaining just 10% of paused accounts saves ₹58 Lakh SIPs monthly and preserves ₹5,500 Cr AUM for partner platforms while protecting investor compounding.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-4xl mx-auto card-glass rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Experience the Intervention</h2>
          <p className="text-gray-400 mb-8 text-lg">
            See how we catch investors before they make emotional decisions they'll regret
          </p>
          
          <a
            href="/checkpoint"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 glow-cyan"
          >
            Try Live Demo →
          </a>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex justify-center gap-8 text-sm">
              <a href="/dashboard" className="text-cyan-400 hover:text-cyan-300">
                Analytics Dashboard
              </a>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">MVP Phase 1 • Shadow Mode</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">Gemini AI Powered</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Built for IIT Guwahati FinLit Ventures Challenge 2026</p>
        </div>
      </div>
    </main>
  );
}
