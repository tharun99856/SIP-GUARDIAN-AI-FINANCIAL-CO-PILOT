export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1B3F]">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        {/* Header Badge */}
        <div className="text-center mb-8 md:mb-12 fade-in">
          <div className="inline-flex items-center gap-3 border border-[rgba(92,214,240,0.3)] rounded-full px-6 py-3 mb-8">
            <span className="text-[#5CD6F0] font-semibold tracking-wide text-sm">
              FinLit VENTURES
            </span>
            <span className="w-1 h-1 bg-[#94A3B8] rounded-full"></span>
            <span className="text-[#CBD5E1] text-sm">Product Strategy Deck</span>
          </div>
        </div>

        {/* Main Title */}
        <header className="text-center mb-12 md:mb-16 fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="text-white">Checkpoint</span>
            <span className="block mt-2 bg-gradient-to-r from-[#0F9D8A] to-[#5CD6F0] bg-clip-text text-transparent">
              by SIP Guardian
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#CBD5E1] max-w-4xl mx-auto leading-relaxed px-4">
            AI-powered intervention at critical SIP decision moments—helping retail investors make informed choices about their wealth
          </p>
        </header>

        {/* Three Key Points */}
        <section className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          <article className="card-surface p-6 md:p-8 border-l-4 border-[#6B1FA0] slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-tiny font-semibold text-[#8e3fc7] mb-3 tracking-wider uppercase">
              1. The Problem
            </h2>
            <p className="text-small text-[#CBD5E1] leading-relaxed">
              Most retail investors stop their SIPs within 2-3 years, often during market corrections when emotions run high. These emotional decisions cost investors significant long-term returns.
            </p>
          </article>

          <article className="card-surface p-6 md:p-8 border-l-4 border-[#0F9D8A] slide-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-tiny font-semibold text-[#0F9D8A] mb-3 tracking-wider uppercase">
              2. The Solution
            </h2>
            <p className="text-small text-[#CBD5E1] leading-relaxed">
              A sub-2-second decision support layer that activates when you try to pause or cancel your SIP—showing the real math, your actual goals, and smarter alternatives.
            </p>
          </article>

          <article className="card-surface p-6 md:p-8 border-l-4 border-[#5CD6F0] sm:col-span-2 lg:col-span-1 slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-tiny font-semibold text-[#5CD6F0] mb-3 tracking-wider uppercase">
              3. The Impact
            </h2>
            <p className="text-small text-[#CBD5E1] leading-relaxed">
              Even a small reduction in premature SIP cancellations can preserve crores in AUM for platforms while protecting investor wealth through better-informed decisions.
            </p>
          </article>
        </section>

        {/* CTA Section */}
        <section className="text-center max-w-4xl mx-auto card-elevated p-8 md:p-12 slide-up" style={{ animationDelay: '250ms' }}>
          <h2 className="text-heading-1 md:text-display text-white mb-4">Experience the Intervention</h2>
          <p className="text-body text-[#CBD5E1] mb-8">
            See how we help investors pause and think before making emotional decisions
          </p>
          
          <a
            href="/checkpoint"
            className="btn-base btn-primary btn-lg inline-flex items-center gap-2"
          >
            Try Live Demo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>

          <div className="mt-8 pt-8 border-t border-[rgba(92,214,240,0.2)]">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-small">
              <a href="/dashboard" className="text-[#5CD6F0] hover:text-[#4bc3dd] transition-colors">
                Analytics Dashboard
              </a>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#94A3B8]">MVP • Shadow Mode</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#94A3B8]">Gemini AI</span>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="mt-12 md:mt-16 text-center text-tiny text-[#94A3B8] slide-up" style={{ animationDelay: '300ms' }}>
          <p>Built for IIT Guwahati FinLit Ventures Challenge</p>
          <p className="mt-2 text-[#64748B]">
            Demo uses deterministic SIP calculations. AI generates explanations only.
          </p>
        </footer>
      </div>
    </main>
  );
}
