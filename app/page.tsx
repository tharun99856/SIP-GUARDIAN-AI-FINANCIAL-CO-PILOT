import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ── Sticky Navbar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#060B18]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="page-container h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#050E1D] font-bold text-xs"
              style={{ background: "linear-gradient(135deg, #00E599, #38BDF8)" }}
            >
              CP
            </div>
            <span className="font-bold text-base tracking-tight text-white leading-none">
              Checkpoint{" "}
              <span className="text-xs font-normal text-slate-400">
                by SIP Guardian
              </span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05]"
            >
              Analytics
            </Link>
            <Link
              href="/checkpoint"
              className="btn-base btn-primary"
              style={{ fontSize: "0.875rem", padding: "0.5rem 1.1rem" }}
            >
              Launch Demo
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main>
        {/* Ambient glow layer — fixed-position, purely decorative */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <div
            className="absolute"
            style={{
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 700,
              height: 320,
              background:
                "radial-gradient(ellipse at center, rgba(0,229,153,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "35%",
              left: "-8%",
              width: 420,
              height: 420,
              background: "rgba(99,102,241,0.09)",
              borderRadius: "50%",
              filter: "blur(100px)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "60%",
              right: "-8%",
              width: 460,
              height: 460,
              background: "rgba(0,229,153,0.08)",
              borderRadius: "50%",
              filter: "blur(110px)",
            }}
          />
        </div>

        <div className="page-container relative z-10 py-14 md:py-20">
          {/* ── Event badge ── */}
          <div className="flex justify-center mb-8 fade-in">
            <div className="brand-badge">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  background: "#00E599",
                  boxShadow: "0 0 6px rgba(0,229,153,0.7)",
                }}
              />
              <span className="text-cyan-300 font-semibold tracking-wide text-xs uppercase">
                FinLit Ventures Challenge
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 text-xs">IIT Guwahati</span>
            </div>
          </div>

          {/* ── Hero ── */}
          <section className="text-center mb-16 md:mb-20 fade-in">
            <h1
              className="text-display mx-auto mb-5"
              style={{ maxWidth: "42rem" }}
            >
              <span className="text-white block">Smarter Interventions for</span>
              <span className="gradient-text-teal block mt-1">
                High-Stakes SIP Decisions
              </span>
            </h1>
            <p
              className="text-body text-slate-300 mx-auto leading-relaxed"
              style={{ maxWidth: "36rem", fontSize: "1.05rem" }}
            >
              A sub-2-second decision support layer that steps in when retail
              investors pause or cancel SIPs — replacing panic with real
              compounding math, goal forecasts, and calibrated middle paths.
            </p>
          </section>

          {/* ── Three feature cards ── */}
          <section
            className="grid gap-5 mb-16"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
          >
            {[
              {
                num: "01",
                accent: "#A855F7",
                accentBg: "rgba(168,85,247,0.1)",
                borderColor: "rgba(168,85,247,0.7)",
                title: "The Problem",
                body: "Over 70% of retail SIPs are terminated prematurely during short-term market dips. Emotional pullouts lock in permanent loss and ruin decade-long compounding trajectories.",
                delay: "80ms",
              },
              {
                num: "02",
                accent: "#00E599",
                accentBg: "rgba(0,229,153,0.1)",
                borderColor: "rgba(0,229,153,0.75)",
                title: "The Intervention",
                body: "Instant AI + deterministic financial modeling shows the exact opportunity loss in rupees, projects goal delays, and presents sensible middle alternatives in under 2 seconds.",
                delay: "140ms",
              },
              {
                num: "03",
                accent: "#38BDF8",
                accentBg: "rgba(56,189,248,0.1)",
                borderColor: "rgba(56,189,248,0.7)",
                title: "The Impact",
                body: "Protects investor financial freedom while saving platforms hundreds of crores in retained AUM and customer lifetime value — with zero friction.",
                delay: "200ms",
              },
            ].map((card) => (
              <article
                key={card.num}
                className="card-glass p-7 slide-up"
                style={{
                  animationDelay: card.delay,
                  borderTop: `2px solid ${card.borderColor}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mb-5"
                  style={{
                    background: card.accentBg,
                    border: `1px solid ${card.accent}33`,
                    color: card.accent,
                  }}
                >
                  {card.num}
                </div>
                <h2 className="text-heading-3 text-white mb-2">{card.title}</h2>
                <p className="text-small text-slate-300 leading-relaxed">
                  {card.body}
                </p>
              </article>
            ))}
          </section>

          {/* ── CTA card ── */}
          <section
            className="card-glass-elevated text-center mx-auto slide-up"
            style={{
              maxWidth: "48rem",
              animationDelay: "240ms",
              padding: "2.5rem 2rem",
            }}
          >
            {/* inner glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,229,153,0.08) 0%, rgba(56,189,248,0.07) 50%, rgba(99,102,241,0.06) 100%)",
              }}
            />

            <div className="relative z-10">
              <span className="status-indicator status-info mb-4">
                Interactive Simulation
              </span>

              <h2 className="text-heading-1 text-white mt-4 mb-3">
                Experience the Live Checkpoint System
              </h2>
              <p
                className="text-body text-slate-300 mb-8 mx-auto"
                style={{ maxWidth: "32rem" }}
              >
                Simulate an investor attempting to stop a ₹10,000/mo SIP and see
                the real-time AI intervention with compounding loss calculation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/checkpoint"
                  className="btn-base btn-primary btn-lg w-full sm:w-auto"
                  style={{
                    boxShadow: "0 0 22px rgba(0,229,153,0.38)",
                  }}
                >
                  Launch Checkpoint Demo
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/dashboard"
                  className="btn-base btn-secondary btn-lg w-full sm:w-auto"
                >
                  View Analytics Dashboard
                </Link>
              </div>

              <div className="mt-8 pt-5 flex flex-wrap justify-center items-center gap-5 text-xs text-slate-400"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                {[
                  { dot: "#00E599", label: "Deterministic SIP Core" },
                  { dot: "#38BDF8", label: "Sub-2s Latency SLA" },
                  { dot: "#818CF8", label: "Shadow Mode Telemetry" },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: item.dot }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="mt-14 text-center slide-up" style={{ animationDelay: "300ms" }}>
            <p className="text-xs text-slate-400">
              Built for IIT Guwahati FinLit Ventures Challenge · SIP Guardian Architecture
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Simulations use 12% annualised return assumption. AI provides contextual cognitive support.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
