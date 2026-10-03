'use client';

import { useState, useEffect } from 'react';
import { SessionMetrics } from '@/types';

// Simulated baseline data (pre-seeded for demo)
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
      <div className="min-h-screen bg-[#0B1B3F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#0F9D8A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body text-[#5CD6F0]">Loading metrics...</p>
        </div>
      </div>
    );
  }

  const totalInterventions = BASELINE_DATA.totalInterventions + sessions.length;
  const liveChangedMind = sessions.filter(s => s.finalAction === 'continue').length;
  const totalChangedMind = BASELINE_DATA.changedMind + liveChangedMind;
  const changedMindPercent = ((totalChangedMind / totalInterventions) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0B1B3F] py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 fade-in">
          <div className="accent-bar mb-6">
            <h1 className="text-heading-1 md:text-display text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-body text-[#5CD6F0]">
              Shadow mode metrics and validation data
            </p>
          </div>
          <aside className="card-surface p-4 border-l-4 border-[#F59E0B]">
            <p className="text-small text-[#CBD5E1]">
              <strong className="text-white font-semibold">Note:</strong> Showing simulated baseline ({BASELINE_DATA.totalInterventions} events) + {sessions.length} live demo events
            </p>
          </aside>
        </header>

        {/* Key Metrics Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <article className="card-surface p-5 md:p-6 slide-up" style={{ animationDelay: '50ms' }}>
            <p className="label-text mb-2">Total Interventions</p>
            <p className="text-display text-white font-numeric">{totalInterventions}</p>
          </article>

          <article className="card-surface p-5 md:p-6 slide-up" style={{ animationDelay: '100ms' }}>
            <p className="label-text mb-2">Changed Mind</p>
            <p className="text-display text-[#0F9D8A] font-numeric">{changedMindPercent}%</p>
            <p className="text-tiny text-[#94A3B8] mt-2">{totalChangedMind} continued SIP</p>
          </article>

          <article className="card-surface p-5 md:p-6 slide-up" style={{ animationDelay: '150ms' }}>
            <p className="label-text mb-2">SIP ₹ Retained</p>
            <p className="text-display text-white font-numeric">₹{(BASELINE_DATA.sipRetained / 100000).toFixed(1)}L</p>
            <p className="text-tiny text-[#94A3B8] mt-2">Per month</p>
          </article>

          <article className="card-surface p-5 md:p-6 slide-up" style={{ animationDelay: '200ms' }}>
            <p className="label-text mb-2">Median Latency</p>
            <p className="text-display text-white font-numeric">{BASELINE_DATA.avgLatency}s</p>
            <p className="text-tiny text-[#94A3B8] mt-2">AI response time</p>
          </article>
        </section>

        {/* Stop/Go Criteria */}
        <section className="card-surface p-5 md:p-6 mb-8 slide-up" style={{ animationDelay: '250ms' }}>
          <h2 className="text-heading-2 text-white mb-5">Stop/Go Criteria</h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[rgba(11,27,63,0.6)] rounded-lg">
              <span className="text-white font-medium">Informed Decision Rate</span>
              <div className="flex items-center gap-3">
                <span className="text-small text-[#CBD5E1] font-numeric">{changedMindPercent}% {parseFloat(changedMindPercent) > 15 ? '≥' : '<'} 15%</span>
                <span className={`status-indicator ${parseFloat(changedMindPercent) > 15 ? 'status-success' : 'status-error'}`}>
                  {parseFloat(changedMindPercent) > 15 ? 'GO' : 'STOP'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[rgba(11,27,63,0.6)] rounded-lg">
              <span className="text-white font-medium">Response Time</span>
              <div className="flex items-center gap-3">
                <span className="text-small text-[#CBD5E1] font-numeric">{BASELINE_DATA.avgLatency}s {'<'} 3s</span>
                <span className="status-indicator status-success">
                  GO
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[rgba(11,27,63,0.6)] rounded-lg">
              <span className="text-white font-medium">Completion Rate</span>
              <div className="flex items-center gap-3">
                <span className="text-small text-[#CBD5E1]">100% {'>='} 60%</span>
                <span className="status-indicator status-success">
                  GO
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Sessions Table */}
        {sessions.length > 0 && (
          <section className="card-surface p-5 md:p-6 slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-heading-2 text-white mb-5">Live Demo Events</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[rgba(92,214,240,0.2)]">
                    <th className="p-3 label-text">Time</th>
                    <th className="p-3 label-text">Original Action</th>
                    <th className="p-3 label-text">Final Action</th>
                    <th className="p-3 label-text">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(0, 10).map((session, index) => (
                    <tr key={session.sessionId} className="border-b border-[rgba(92,214,240,0.1)] hover:bg-[rgba(92,214,240,0.03)] transition-colors">
                      <td className="p-3 text-small text-white">{new Date(session.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 text-small text-white capitalize">{session.originalAction}</td>
                      <td className="p-3">
                        <span className={`status-indicator ${
                          session.finalAction === 'continue' ? 'status-success' : 'status-error'
                        }`}>
                          {session.finalAction}
                        </span>
                      </td>
                      <td className="p-3 text-small text-white font-numeric">{session.timeSpent}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {sessions.length === 0 && (
          <section className="card-surface p-8 md:p-12 text-center slide-up" style={{ animationDelay: '300ms' }}>
            <p className="text-body text-[#CBD5E1] mb-5">No live demo events yet. Try the Checkpoint demo to generate data.</p>
            <a href="/checkpoint" className="btn-base btn-primary">
              Try Demo
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
