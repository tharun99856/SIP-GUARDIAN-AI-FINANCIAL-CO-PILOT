import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-teal-500/10 via-cyan-500/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] left-[-10%] w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[60%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 blur-[150px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#060B18]/70 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center font-bold text-black text-sm shadow-[0_0_15px_rgba(0,229,153,0.4)]">
              CP
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Checkpoint <span className="text-xs font-normal text-slate-400">by SIP Guardian</span>
            </span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.04]"
            >
              Analytics
            </Link>
            <Link
              href="/checkpoint"
              className="btn-base btn-primary text-xs sm:text-sm py-2 px-4 shadow-[0_0_15px_rgba(0,229,153,0.3)]"
            >
              Launch Demo
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20 max-w-6xl relative z-10">
        {/* Header Badge */}
        <div className="flex justify-center mb-8 fade-in">
          <div className="brand-badge">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span className="text-cyan-300 font-semibold tracking-wide text-xs uppercase">
              FinLit Ventures Challenge
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 text-xs">IIT Guwahati</span>
          </div>
        </div>

        {/* Main Hero Header */}
        <section className="text-center mb-16 md:mb-20 fade-in">
          <h1 className="text-display max-w-4xl mx-auto mb-6">
            <span className="text-white block font-extrabold tracking-tight">Smarter Interventions for</span>
            <span className="gradient-text-teal block mt-1">High-Stakes SIP Decisions</span>
          </h1>
          <p className="text-body sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            A sub-2-second decision support layer that steps in when retail investors pause or cancel SIPs—replacing panic with real compounding math, goal forecasts, and calibrated middle paths.
          </p>
        </section>

        {/* Three Pillar Feature Cards */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Card 1 */}
          <article className="card-glass p-7 border-t-2 border-t-purple-500/70 hover:border-purple-500/90 transition-all group slide-up" style={{ animationDelay: '100ms' }}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold mb-5 group-hover:scale-110 transition-transform">
              01
            </div>
            <h2 className="text-heading-3 text-white mb-2.5 flex items-center gap-2">
              The Problem
            </h2>
            <p className="text-small text-slate-300 leading-relaxed">
              Over 70% of retail SIPs are terminated prematurely during short-term market dips. Emotional pullouts lock in permanent loss and ruin decade-long compounding trajectories.
            </p>
          </article>

          {/* Card 2 */}
          <article className="card-glass p-7 border-t-2 border-t-teal-400/80 hover:border-teal-400 transition-all group slide-up" style={{ animationDelay: '150ms' }}>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold mb-5 group-hover:scale-110 transition-transform">
              02
            </div>
            <h2 className="text-heading-3 text-white mb-2.5 flex items-center gap-2">
              The Intervention
            </h2>
            <p className="text-small text-slate-300 leading-relaxed">
              Instant AI + deterministic financial modeling visualizes exact opportunity loss in rupees, project goal delays, and presents sensible middle alternatives in under 2 seconds.
            </p>
          </article>

          {/* Card 3 */}
          <article className="card-glass p-7 border-t-2 border-t-cyan-400/80 hover:border-cyan-400 transition-all group slide-up" style={{ animationDelay: '200ms' }}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold mb-5 group-hover:scale-110 transition-transform">
              03
            </div>
            <h2 className="text-heading-3 text-white mb-2.5 flex items-center gap-2">
              The Impact
            </h2>
            <p className="text-small text-slate-300 leading-relaxed">
              Protects investor financial freedom while saving platforms hundreds of crores in retained AUM and customer lifetime value with zero friction.
            </p>
          </article>
        </section>

        {/* CTA Banner Section */}
        <section className="card-glass-elevated relative overflow-hidden p-8 md:p-14 text-center max-w-4xl mx-auto slide-up" style={{ animationDelay: '250ms' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 pointer-events-none" />
          
          <div className="relative z-10">
            <span className="status-indicator status-info mb-4">Interactive Simulation</span>
            <h2 className="text-heading-1 text-white mb-4">
              Experience the Live Checkpoint System
            </h2>
            <p className="text-body text-slate-300 max-w-xl mx-auto mb-8">
              Simulate an investor attempting to stop a ₹10,000/mo SIP and see the real-time AI intervention and compounding loss calculation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/checkpoint"
                className="btn-base btn-primary btn-lg w-full sm:w-auto shadow-[0_0_25px_rgba(0,229,153,0.4)]"
              >
                Launch Checkpoint Demo
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/dashboard"
                className="btn-base btn-secondary btn-lg w-full sm:w-auto"
              >
                View Analytics Dashboard
              </Link>
            </div>

            <div className="mt-10 pt-6 border-t border-white/[0.08] flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                Deterministic SIP Core
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Sub-2s Latency SLA
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Shadow Mode Telemetry
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-500 slide-up" style={{ animationDelay: '300ms' }}>
          <p className="text-slate-400">Built for IIT Guwahati FinLit Ventures Challenge • SIP Guardian Architecture</p>
          <p className="mt-1.5 text-slate-500">
            Simulations calculate compounding at 12% annualized rate. AI provides contextual cognitive support.
          </p>
        </footer>
      </div>
    </main>
  );
}
