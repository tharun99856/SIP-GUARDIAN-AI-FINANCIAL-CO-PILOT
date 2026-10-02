'use client';

import { useState, useEffect } from 'react';
import { SessionMetrics } from '@/types';
import { calculateAggregatedMetrics, exportSessionData, AggregatedMetrics } from '@/lib/analytics';

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionMetrics[]>([]);
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionData();
  }, []);

  const fetchSessionData = async () => {
    try {
      const response = await fetch('/api/analytics/session');
      const data = await response.json();
      setSessions(data.sessions || []);
      
      if (data.sessions && data.sessions.length > 0) {
        const aggregated = calculateAggregatedMetrics(data.sessions);
        setMetrics(aggregated);
      }
    } catch (error) {
      console.error('Failed to fetch session data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = exportSessionData(sessions);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checkpoint-metrics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics || sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h2>
          <p className="text-gray-600 mb-6">
            Start using the Checkpoint screen to collect shadow mode metrics
          </p>
          <a
            href="/checkpoint"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Try Demo Checkpoint
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shadow Mode Dashboard</h1>
              <p className="text-gray-600 mt-1">Success metrics and validation data</p>
            </div>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
            >
              <span>📥</span> Export CSV
            </button>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Shadow Mode:</strong> All data collected here is for testing and validation purposes only. 
              No actual SIP transactions are affected.
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Sessions"
            value={metrics.totalSessions.toString()}
            icon="📈"
            color="blue"
          />
          <MetricCard
            title="Informed Decision Rate"
            value={`${metrics.informedDecisionRate.toFixed(1)}%`}
            icon="✅"
            color="green"
            subtitle="Spent ≥15s reviewing"
          />
          <MetricCard
            title="Average Time Spent"
            value={`${metrics.averageTimeSpent.toFixed(0)}s`}
            icon="⏱️"
            color="purple"
          />
          <MetricCard
            title="Cancellation Rate"
            value={`${metrics.cancellationRate.toFixed(1)}%`}
            icon="↩️"
            color="red"
            subtitle="Went back"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎯</span> Alternative Engagement
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Viewed Alternatives</span>
                  <span className="font-semibold">{metrics.alternativeSelectionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${metrics.alternativeSelectionRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Changed Original Action</span>
                  <span className="font-semibold">{metrics.actionChangeRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${metrics.actionChangeRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎚️</span> User Friction Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(metrics.frictionDistribution).map(([level, percentage]) => (
                <div key={level}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize">{level} Friction</span>
                    <span className="font-semibold">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        level === 'low' ? 'bg-green-500' :
                        level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stop/Go Criteria */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🚦</span> Stop/Go Criteria Evaluation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CriteriaCard
              title="Engagement Rate"
              current={metrics.informedDecisionRate}
              target={60}
              unit="%"
              description="Users engaging with impact visualization"
              status={metrics.informedDecisionRate >= 60 ? 'pass' : 'fail'}
            />
            <CriteriaCard
              title="Average Friction"
              current={metrics.averageTimeSpent}
              target={30}
              unit="s"
              comparison="<"
              description="Time spent should be under 30s"
              status={metrics.averageTimeSpent < 30 ? 'pass' : 'warn'}
            />
            <CriteriaCard
              title="Drop-off Rate"
              current={metrics.cancellationRate}
              target={70}
              unit="%"
              comparison="<"
              description="Users shouldn't abandon frequently"
              status={metrics.cancellationRate < 70 ? 'pass' : 'fail'}
            />
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Decision:</strong> {evaluateStopGo(metrics)}
            </p>
          </div>
        </div>

        {/* Recent Sessions Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> Recent Sessions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Session ID</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Original Action</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Final Action</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Time Spent</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Friction</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Informed?</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(-20).reverse().map((session) => (
                  <tr key={session.sessionId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{session.sessionId.slice(0, 12)}...</td>
                    <td className="p-3 capitalize">{session.originalAction}</td>
                    <td className="p-3 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        session.finalAction === 'cancel' ? 'bg-red-100 text-red-800' :
                        session.finalAction !== session.originalAction ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {session.finalAction}
                      </span>
                    </td>
                    <td className="p-3">{session.timeSpent}s</td>
                    <td className="p-3 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        session.userFriction === 'low' ? 'bg-green-100 text-green-800' :
                        session.userFriction === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {session.userFriction}
                      </span>
                    </td>
                    <td className="p-3">
                      {session.informedDecision ? '✅' : '❌'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, subtitle }: any) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    red: 'bg-red-50 border-red-200',
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${colors[color as keyof typeof colors]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="text-3xl">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}

function CriteriaCard({ title, current, target, unit, comparison = '>', description, status }: any) {
  const statusColors = {
    pass: 'bg-green-100 border-green-300 text-green-800',
    warn: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    fail: 'bg-red-100 border-red-300 text-red-800',
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${statusColors[status as keyof typeof statusColors]}`}>
      <div className="font-semibold mb-2">{title}</div>
      <div className="text-2xl font-bold mb-1">
        {current.toFixed(1)}{unit} {comparison} {target}{unit}
      </div>
      <div className="text-sm mb-2">{description}</div>
      <div className="text-xs font-semibold uppercase">
        {status === 'pass' ? '✓ Passing' : status === 'warn' ? '⚠ Warning' : '✗ Failing'}
      </div>
    </div>
  );
}

function evaluateStopGo(metrics: AggregatedMetrics): string {
  const engagement = metrics.informedDecisionRate >= 60;
  const friction = metrics.averageTimeSpent < 30;
  const dropoff = metrics.cancellationRate < 70;

  const passingCriteria = [engagement, friction, dropoff].filter(Boolean).length;

  if (passingCriteria === 3) {
    return '🟢 Continue - All criteria met. Proceed with next phase.';
  } else if (passingCriteria === 2) {
    return '🟡 Monitor - Most criteria met. Continue testing with adjustments.';
  } else {
    return '🔴 Stop/Modify - Critical criteria failing. Redesign needed before proceeding.';
  }
}
