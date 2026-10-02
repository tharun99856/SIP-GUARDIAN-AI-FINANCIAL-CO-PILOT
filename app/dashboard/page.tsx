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
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0F9D8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5CD6F0]">Loading metrics...</p>
        </div>
      </div>
    );
  }

  const totalInterventions = BASELINE_DATA.totalInterventions + sessions.length;
  const liveChangedMind = sessions.filter(s => s.finalAction === 'continue').length;
  const totalChangedMind = BASELINE_DATA.changedMind + liveChangedMind;
  const changedMindPercent = ((totalChangedMind / totalInterventions) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0B1B3F] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="accent-bar-purple mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-[#5CD6F0]">
              Shadow mode metrics and validation data
            </p>
          </div>
          <div className="card-surface p-4 border-l-4 border-[#F59E0B]">
            <p className="text-sm text-[#94A3B8]">
              <strong className="text-white">Note:</strong> Showing simulated baseline ({BASELINE_DATA.totalInterventions} events) + {sessions.length} live demo events
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-surface p-6">
            <p className="text-sm text-[#94A3B8] uppercase tracking-wide mb-2">Total Interventions</p>
            <p className="text-4xl font-bold text-white">{totalInterventions}</p>
          </div>

          <div className="card-surface p-6">
            <p className="text-sm text-[#94A3B8] uppercase tracking-wide mb-2">Changed Mind</p>
            <p className="text-4xl font-bold text-[#0F9D8A]">{changedMindPercent}%</p>
            <p className="text-xs text-[#94A3B8] mt-1">{totalChangedMind} continued SIP</p>
          </div>

          <div className="card-surface p-6">
            <p className="text-sm text-[#94A3B8] uppercase tracking-wide mb-2">SIP ₹ Retained</p>
            <p className="text-4xl font-bold text-white">₹{(BASELINE_DATA.sipRetained / 100000).toFixed(1)}L</p>
            <p className="text-xs text-[#94A3B8] mt-1">Per month</p>
          </div>

          <div className="card-surface p-6">
            <p className="text-sm text-[#94A3B8] uppercase tracking-wide mb-2">Median Latency</p>
            <p className="text-4xl font-bold text-white">{BASELINE_DATA.avgLatency}s</p>
            <p className="text-xs text-[#94A3B8] mt-1">AI response time</p>
          </div>
        </div>

        {/* Stop/Go Criteria */}
        <div className="card-surface p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Stop/Go Criteria</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#0B1B3F] rounded-lg">
              <span className="text-white">Informed Decision Rate</span>
              <div className="flex items-center gap-3">
                <span className="text-[#94A3B8]">{changedMindPercent}% {parseFloat(changedMindPercent) > 15 ? '≥' : '<'} 15%</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${parseFloat(changedMindPercent) > 15 ? 'bg-[#0F9D8A] text-white' : 'bg-[#EF4444] text-white'}`}>
                  {parseFloat(changedMindPercent) > 15 ? 'GO' : 'STOP'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0B1B3F] rounded-lg">
              <span className="text-white">Response Time</span>
              <div className="flex items-center gap-3">
                <span className="text-[#94A3B8]">{BASELINE_DATA.avgLatency}s {'<'} 3s</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F9D8A] text-white">
                  GO
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0B1B3F] rounded-lg">
              <span className="text-white">Completion Rate</span>
              <div className="flex items-center gap-3">
                <span className="text-[#94A3B8]">100% {'>='} 60%</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F9D8A] text-white">
                  GO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions Table */}
        {sessions.length > 0 && (
          <div className="card-surface p-6">
            <h2 className="text-xl font-bold text-white mb-4">Live Demo Events</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#0F9D8A]/40">
                    <th className="p-3 text-[#94A3B8] uppercase tracking-wide">Time</th>
                    <th className="p-3 text-[#94A3B8] uppercase tracking-wide">Original Action</th>
                    <th className="p-3 text-[#94A3B8] uppercase tracking-wide">Final Action</th>
                    <th className="p-3 text-[#94A3B8] uppercase tracking-wide">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(0, 10).map((session) => (
                    <tr key={session.sessionId} className="border-b border-[#0F9D8A]/20">
                      <td className="p-3 text-white">{new Date(session.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 text-white capitalize">{session.originalAction}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          session.finalAction === 'continue' ? 'bg-[#0F9D8A]/20 text-[#0F9D8A]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                        }`}>
                          {session.finalAction}
                        </span>
                      </td>
                      <td className="p-3 text-white">{(session.timeSpent / 1000).toFixed(1)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="card-surface p-12 text-center">
            <p className="text-[#94A3B8] mb-4">No live demo events yet. Try the Checkpoint demo to generate data.</p>
            <a href="/checkpoint" className="bg-[#0F9D8A] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0F9D8A]/90 btn inline-block">
              Try Demo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
