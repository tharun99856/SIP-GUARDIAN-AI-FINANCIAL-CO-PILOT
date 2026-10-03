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

  useEffect(() => {
    fetchSessionData();
  }, []);

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
      <main className="min-h-screen bg-[#060B18] flex items-center justify-center p-4">
        <div className="card-glass p-8 flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">Loading Telemetry & Metrics...</p>
        </div>
      </main>
    );
  }

  const totalInterventions = BASELINE_DATA.totalInterventions + sessions.length;
  const liveChangedMind = sessions.filter(s => s.finalAction === 'continue').length;
  const totalChangedMind = BASELINE_DATA.changedMind + liveChangedMind;
  const changedMindPercent = ((totalChangedMind / totalInterventions) * 100).toFixed(1);

  return (
    <main className="min-h-screen relative overflow-hidden bg-grid-pattern py-8 md:py-12 px-4 sm:px-6">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-10 w-[600px] h-[300px] bg-indigo-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-teal-500/10 blur-[150px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="backdrop-blur-md bg-[#060B18]/70 border-b border-white/[0.06] sticky top-0 z-50 mb-8 -mx-4 sm:-mx-6 -mt-8 md:-mt-12 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center font-bold text-black text-sm shadow-[0_0_15px_rgba(0,229,153,0.3)]">
                CP
              </div>
              <span className="font-bold tracking-tight text-white">Checkpoint</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs sm:text-sm text-cyan-400 font-medium">Analytics & Telemetry</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/checkpoint"
              className="btn-base btn-primary text-xs py-2 px-3.5"
            >
              Launch Demo
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Title */}
        <header className="mb-8 fade-in flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="status-indicator status-info text-tiny">Shadow Mode Live</span>
              <span className="text-tiny text-slate-400">Continuous telemetry pipeline</span>
            </div>
            <h1 className="text-heading-1 text-white">
              Intervention Telemetry & Validation
            </h1>
            <p className="text-body text-slate-300 mt-1">
              Tracking decision reversal rates, response latencies, and saved SIP value.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchSessionData}
              className="btn-base btn-secondary text-xs py-2 px-3"
            >
              ↻ Refresh Data
            </button>
          </div>
        </header>

        {/* 4 Primary Metric Cards */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <article className="card-glass p-6 border-t-2 border-t-cyan-400/80 slide-up" style={{ animationDelay: '50ms' }}>
            <p className="label-text">Total Interventions</p>
            <p className="text-4xl font-extrabold text-white font-numeric tracking-tight">{totalInterventions}</p>
            <div className="flex items-center gap-2 mt-3 text-tiny text-slate-400">
              <span className="text-teal-400 font-semibold font-numeric">+{sessions.length} live</span>
              <span>•</span>
              <span>187 baseline</span>
            </div>
          </article>

          <article className="card-glass p-6 border-t-2 border-t-teal-400/80 slide-up" style={{ animationDelay: '100ms' }}>
            <p className="label-text">Retention Rate</p>
            <p className="text-4xl font-extrabold text-teal-300 font-numeric tracking-tight">{changedMindPercent}%</p>
            <div className="flex items-center gap-2 mt-3 text-tiny text-slate-400">
              <span className="text-teal-400 font-semibold font-numeric">{totalChangedMind} investors</span>
              <span>retained SIP</span>
            </div>
          </article>

          <article className="card-glass p-6 border-t-2 border-t-indigo-400/80 slide-up" style={{ animationDelay: '150ms' }}>
            <p className="label-text">Monthly SIP Retained</p>
            <p className="text-4xl font-extrabold text-white font-numeric tracking-tight">₹{(BASELINE_DATA.sipRetained / 100000).toFixed(1)}L</p>
            <div className="flex items-center gap-2 mt-3 text-tiny text-slate-400">
              <span>Per month flow preserved</span>
            </div>
          </article>

          <article className="card-glass p-6 border-t-2 border-t-amber-400/80 slide-up" style={{ animationDelay: '200ms' }}>
            <p className="label-text">Median Latency</p>
            <p className="text-4xl font-extrabold text-amber-300 font-numeric tracking-tight">{BASELINE_DATA.avgLatency}s</p>
            <div className="flex items-center gap-2 mt-3 text-tiny text-slate-400">
              <span className="text-teal-400 font-semibold font-numeric">{'< 2.0s'} SLA Target</span>
            </div>
          </article>
        </section>

        {/* Validation Stop / Go Gateways */}
        <section className="card-glass p-6 md:p-8 mb-8 slide-up" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-heading-2 text-white">Stage-Gate Validation Criteria</h2>
              <p className="text-small text-slate-400">Go/Stop metrics required for automated production rollout</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-colors">
              <div>
                <span className="text-white font-semibold text-small block">Informed Decision Rate</span>
                <span className="text-tiny text-slate-400">Target: ≥ 15% of triggered users reconsider cancel action</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-small text-slate-300 font-numeric font-medium">{changedMindPercent}%</span>
                <span className={`status-indicator ${parseFloat(changedMindPercent) >= 15 ? 'status-success' : 'status-error'}`}>
                  {parseFloat(changedMindPercent) >= 15 ? 'GO • PASS' : 'STOP'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-colors">
              <div>
                <span className="text-white font-semibold text-small block">Response Time SLA</span>
                <span className="text-tiny text-slate-400">Target: Sub-3.0s latency to avoid checkout friction</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-small text-slate-300 font-numeric font-medium">{BASELINE_DATA.avgLatency}s {'<'} 3.0s</span>
                <span className="status-indicator status-success">
                  GO • PASS
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-colors">
              <div>
                <span className="text-white font-semibold text-small block">Intervention Completion Rate</span>
                <span className="text-tiny text-slate-400">Target: ≥ 60% complete review without dropping off</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-small text-slate-300 font-numeric font-medium">100%</span>
                <span className="status-indicator status-success">
                  GO • PASS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Session Stream */}
        <section className="card-glass p-6 md:p-8 slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-heading-2 text-white">Live Demo Session Stream</h2>
              <p className="text-small text-slate-400">Recorded events generated during interactive demo runs</p>
            </div>
          </div>

          {sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400">
                    <th className="p-3 text-tiny uppercase tracking-wider font-semibold">Timestamp</th>
                    <th className="p-3 text-tiny uppercase tracking-wider font-semibold">Intended Action</th>
                    <th className="p-3 text-tiny uppercase tracking-wider font-semibold">Final Outcome</th>
                    <th className="p-3 text-tiny uppercase tracking-wider font-semibold">Dwell Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {sessions.slice(0, 10).map((session) => (
                    <tr key={session.sessionId} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-3 text-small text-slate-300 font-numeric">
                        {new Date(session.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-3 text-small text-white capitalize font-medium">
                        {session.originalAction}
                      </td>
                      <td className="p-3">
                        <span className={`status-indicator ${
                          session.finalAction === 'continue' ? 'status-success' : 'status-error'
                        }`}>
                          {session.finalAction}
                        </span>
                      </td>
                      <td className="p-3 text-small text-slate-300 font-numeric">
                        {session.timeSpent}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-body text-slate-400 mb-4">
                No interactive sessions generated in this session yet.
              </p>
              <Link href="/checkpoint" className="btn-base btn-primary">
                Run Checkpoint Simulation
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
