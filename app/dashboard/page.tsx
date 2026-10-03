'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SessionMetrics } from '@/types';

const BASELINE_DATA = {
  totalInterventions: 187,
  changedMind: 56,
  sipRetained: 4200000,
  avgLatency: 1.4,
};

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSessionData(); }, []);

  const fetchSessionData = async () => {
    try {
      const response = await fetch('/api/analytics/session');
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch session data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#060B18' }}>
        <div className="card-glass p-8 flex flex-col items-center gap-4 text-center" style={{ maxWidth: 320 }}>
          <div
            className="rounded-full animate-spin"
            style={{
              width: 44,
              height: 44,
              border: '3px solid rgba(56,189,248,0.2)',
              borderTopColor: '#38BDF8',
            }}
          />
          <p className="text-white font-medium">Loading Telemetry &amp; Metrics…</p>
        </div>
      </div>
    );
  }

  const totalInterventions = BASELINE_DATA.totalInterventions + sessions.length;
  const liveChangedMind = sessions.filter(s => s.finalAction === 'continue').length;
  const totalChangedMind = BASELINE_DATA.changedMind + liveChangedMind;
  const changedMindPercent = ((totalChangedMind / totalInterventions) * 100).toFixed(1);
  const isGo = parseFloat(changedMindPercent) >= 15;

  return (
    <>
      {/* ── Sticky Navbar ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#060B18]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="page-container h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-85 transition-opacity">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#050E1D] font-bold text-xs"
                style={{ background: 'linear-gradient(135deg, #00E599, #38BDF8)' }}
              >
                CP
              </div>
              <span className="font-bold text-base tracking-tight hidden sm:inline">Checkpoint</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-xs sm:text-sm text-cyan-400 font-medium">Analytics</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchSessionData}
              className="btn-base btn-secondary"
              style={{ fontSize: '0.8125rem', padding: '0.45rem 1rem' }}
            >
              ↻ Refresh
            </button>
            <Link
              href="/checkpoint"
              className="btn-base btn-primary"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1.1rem' }}
            >
              Launch Demo
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page body ──────────────────────────────────────────── */}
      <main className="page-container py-10 md:py-14">
        {/* Ambient glows — fixed so they don't affect layout */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <div style={{
            position: 'absolute', top: 0, right: 60,
            width: 560, height: 280,
            background: 'rgba(99,102,241,0.09)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }} />
          <div style={{
            position: 'absolute', bottom: 40, left: 40,
            width: 480, height: 380,
            background: 'rgba(0,229,153,0.08)',
            borderRadius: '50%',
            filter: 'blur(110px)',
          }} />
        </div>

        <div className="relative z-10">
          {/* Page header */}
          <header className="mb-8 fade-in flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="status-indicator status-info">Shadow Mode Live</span>
                <span className="text-xs text-slate-400">Continuous telemetry pipeline</span>
              </div>
              <h1 className="text-heading-1 text-white">Intervention Telemetry &amp; Validation</h1>
              <p className="text-body text-slate-300 mt-1">
                Tracking decision reversal rates, response latencies, and saved SIP value.
              </p>
            </div>
          </header>

          {/* ── 4 KPI cards ── */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: 'Total Interventions',
                value: String(totalInterventions),
                sub: `+${sessions.length} live · 187 baseline`,
                accent: '#38BDF8',
                delay: '50ms',
              },
              {
                label: 'Retention Rate',
                value: `${changedMindPercent}%`,
                sub: `${totalChangedMind} investors continued SIP`,
                accent: '#00E599',
                delay: '100ms',
              },
              {
                label: 'Monthly SIP Retained',
                value: `₹${(BASELINE_DATA.sipRetained / 100000).toFixed(1)}L`,
                sub: 'Per month flow preserved',
                accent: '#818CF8',
                delay: '150ms',
              },
              {
                label: 'Median Latency',
                value: `${BASELINE_DATA.avgLatency}s`,
                sub: '< 2.0s SLA target',
                accent: '#FBBF24',
                delay: '200ms',
              },
            ].map((card) => (
              <article
                key={card.label}
                className="card-glass p-5 slide-up"
                style={{
                  animationDelay: card.delay,
                  borderTop: `2px solid ${card.accent}cc`,
                }}
              >
                <p className="label-text mb-2">{card.label}</p>
                <p
                  className="font-numeric font-extrabold tracking-tight"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', color: card.accent }}
                >
                  {card.value}
                </p>
                <p className="text-tiny text-slate-400 mt-2">{card.sub}</p>
              </article>
            ))}
          </section>

          {/* ── Stage-gate table ── */}
          <section className="card-glass p-6 md:p-8 mb-8 slide-up" style={{ animationDelay: '250ms' }}>
            <h2 className="text-heading-2 text-white mb-1">Stage-Gate Validation Criteria</h2>
            <p className="text-small text-slate-400 mb-5">Go / Stop metrics for automated production rollout</p>

            <div className="space-y-3">
              {[
                {
                  name: 'Informed Decision Rate',
                  desc: '≥ 15% of triggered users reconsider cancel action',
                  value: `${changedMindPercent}%`,
                  pass: isGo,
                },
                {
                  name: 'Response Time SLA',
                  desc: 'Sub-3.0s latency to avoid checkout friction',
                  value: `${BASELINE_DATA.avgLatency}s < 3.0s`,
                  pass: true,
                },
                {
                  name: 'Intervention Completion Rate',
                  desc: '≥ 60% complete review without dropping off',
                  value: '100%',
                  pass: true,
                },
              ].map((row) => (
                <div
                  key={row.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div>
                    <span className="text-white font-semibold text-small block">{row.name}</span>
                    <span className="text-tiny text-slate-400">{row.desc}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-small text-slate-300 font-numeric font-medium">{row.value}</span>
                    <span className={`status-indicator ${row.pass ? 'status-success' : 'status-error'}`}>
                      {row.pass ? 'GO · PASS' : 'STOP'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Session stream ── */}
          <section className="card-glass p-6 md:p-8 slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-heading-2 text-white mb-1">Live Demo Session Stream</h2>
            <p className="text-small text-slate-400 mb-5">Events recorded during interactive demo runs</p>

            {sessions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" style={{ minWidth: 480 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Timestamp', 'Intended Action', 'Final Outcome', 'Dwell Time'].map((th) => (
                        <th key={th} className="p-3 text-tiny uppercase tracking-wider font-semibold text-slate-400">
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.slice(0, 10).map((session) => (
                      <tr
                        key={session.sessionId}
                        className="transition-colors hover:bg-white/[0.025]"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <td className="p-3 text-small text-slate-300 font-numeric">
                          {new Date(session.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-3 text-small text-white capitalize font-medium">
                          {session.originalAction}
                        </td>
                        <td className="p-3">
                          <span className={`status-indicator ${session.finalAction === 'continue' ? 'status-success' : 'status-error'}`}>
                            {session.finalAction}
                          </span>
                        </td>
                        <td className="p-3 text-small text-slate-300 font-numeric">{session.timeSpent}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-body text-slate-400 mb-5">
                  No interactive sessions yet. Run the Checkpoint demo to generate data.
                </p>
                <Link href="/checkpoint" className="btn-base btn-primary">
                  Run Checkpoint Simulation
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
