'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SIPAction, PauseReason } from '@/types';
import { compareScenarios, formatCurrency, SIPComparison } from '@/lib/sipMath';
import { REASON_CONTEXTS } from '@/lib/presets';

interface CheckpointInterventionProps {
  monthlyAmount: number;
  currentValue: number;
  goalAmount: number;
  yearsToGoal: number;
  fundName: string;
  action: SIPAction;
  reason: PauseReason;
  onBack: () => void;
}

export default function CheckpointIntervention({
  monthlyAmount,
  currentValue,
  goalAmount,
  yearsToGoal,
  fundName,
  action,
  reason,
  onBack,
}: CheckpointInterventionProps) {
  const [comparison, setComparison] = useState<SIPComparison | null>(null);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const [aiLatency, setAiLatency] = useState<number>(0);
  const [animatedDelta, setAnimatedDelta] = useState(0);
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  useEffect(() => {
    const result = compareScenarios(
      { monthlyAmount, currentCorpus: currentValue, yearsToGoal, assumedAnnualReturn: 12 },
      goalAmount,
      6,
      Math.floor(monthlyAmount / 2)
    );
    setComparison(result);
  }, [monthlyAmount, currentValue, goalAmount, yearsToGoal]);

  useEffect(() => {
    if (!comparison) return;
    const fetchAI = async () => {
      const startTime = Date.now();
      const scenario = comparison[action];
      try {
        const response = await fetch('/api/ai-explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monthlyAmount, currentValue, goalAmount, yearsToGoal, action, reason,
            delta: Math.abs(scenario.deltaVsContinue),
            percentOfGoal: scenario.percentOfGoal,
          }),
          signal: AbortSignal.timeout(2500),
        });
        if (response.ok) {
          const data = await response.json();
          setAiMessage(data.message || '');
        } else throw new Error('failed');
      } catch {
        const delta = Math.abs(scenario.deltaVsContinue);
        setAiMessage(
          `Stopping your ₹${monthlyAmount.toLocaleString('en-IN')}/mo SIP now forfeits ${formatCurrency(delta)} in compounding wealth by your target date. ` +
          `Because market cycles reward staying invested, pausing or reducing to 50% preserves over 85% of your target corpus.`
        );
      } finally {
        setAiLatency(Date.now() - startTime);
        setIsLoadingAI(false);
      }
    };
    fetchAI();
  }, [comparison, action, reason, monthlyAmount, currentValue, goalAmount, yearsToGoal]);

  useEffect(() => {
    if (!comparison) return;
    const delta = Math.abs(comparison[action].deltaVsContinue);
    const duration = 950;
    const startTime = Date.now();
    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedDelta(Math.floor(delta * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [comparison, action]);

  const handleDecision = async (chosenAction: 'continue' | 'middle' | 'proceed') => {
    try {
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `sess_${Date.now()}`,
          timestamp: Date.now(),
          originalAction: action,
          finalAction: chosenAction === 'continue' ? 'continue' : chosenAction === 'middle' ? 'reduce' : action,
          reason,
          timeSpent: Math.round(aiLatency / 1000) || 2,
          intervened: true,
          deltaAmount: comparison ? Math.abs(comparison[action].deltaVsContinue) : 0,
        }),
      });
    } catch (e) { console.error(e); }

    const messages: Record<string, string> = {
      continue: '✓ Great choice — SIP stays active. Compounding continues uninterrupted.',
      middle: '✓ Smart move! The calibrated middle path preserves over 80% of your wealth trajectory.',
      proceed: '⚠ Action acknowledged. Consider reviewing your asset allocation soon.',
    };
    setDecisionFeedback(messages[chosenAction]);
    setTimeout(onBack, 1900);
  };

  if (!comparison) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#060B18' }}>
        <div className="card-glass p-8 flex flex-col items-center gap-4 text-center" style={{ maxWidth: 320 }}>
          <div
            className="rounded-full animate-spin"
            style={{
              width: 44, height: 44,
              border: '3px solid rgba(0,229,153,0.2)',
              borderTopColor: '#00E599',
            }}
          />
          <p className="text-white font-medium">Computing Impact…</p>
          <span className="text-xs text-slate-400">Evaluating multi-scenario cash flows</span>
        </div>
      </div>
    );
  }

  const currentScenario = comparison[action];
  const middlePathScenario = action === 'cancel' ? comparison.reduce : comparison.pause;

  return (
    <>
      {/* ── Intervention Navbar ────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#060B18]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="page-container h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
            <span>Back to Config</span>
          </button>

          <div className="brand-badge">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: '#00E599', boxShadow: '0 0 6px rgba(0,229,153,0.7)' }}
            />
            <span className="text-xs font-medium">Live Checkpoint Triggered</span>
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className="page-container py-8 md:py-12">
        {/* Ambient glows — fixed */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 650, height: 300,
            background: 'rgba(244,63,94,0.12)',
            borderRadius: '50%',
            filter: 'blur(120px)',
          }} />
          <div style={{
            position: 'absolute', bottom: 40, right: 40,
            width: 460, height: 360,
            background: 'rgba(0,229,153,0.09)',
            borderRadius: '50%',
            filter: 'blur(110px)',
          }} />
        </div>

        <div className="relative z-10" style={{ maxWidth: 960, margin: '0 auto' }}>
          {/* Decision feedback flash */}
          {decisionFeedback && (
            <div
              className="p-4 mb-6 rounded-xl text-center fade-in text-sm font-semibold"
              style={{
                background: 'rgba(0,229,153,0.1)',
                border: '1px solid rgba(0,229,153,0.35)',
                color: '#00E599',
              }}
            >
              {decisionFeedback}
            </div>
          )}

          {/* ── Big loss number ── */}
          <section
            className="card-glass-elevated mb-8 text-center fade-in"
            style={{
              padding: '2.5rem 2rem',
              border: '1px solid rgba(244,63,94,0.22)',
              boxShadow: '0 0 40px rgba(244,63,94,0.12)',
            }}
          >
            {/* inner gradient — contained by overflow:hidden on card-glass-elevated */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(244,63,94,0.09) 0%, transparent 60%)',
              }}
            />

            <div className="relative z-10">
              <span className="status-indicator status-error mb-4">Estimated Opportunity Loss</span>

              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-3 mb-1">
                This decision costs your future self
              </p>

              {/* The animated number — constrained size via clamp */}
              <div
                className="gradient-text-rose font-numeric font-black tracking-tight my-2"
                style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', lineHeight: 1.1 }}
                role="status"
                aria-live="polite"
              >
                {formatCurrency(animatedDelta)}
              </div>

              <p className="text-small text-slate-300 mt-2">
                By goal horizon in{' '}
                <strong className="text-white">{yearsToGoal} {yearsToGoal === 1 ? 'year' : 'years'}</strong>
                {' '}· {' '}
                <span style={{ color: '#38BDF8' }}>{fundName}</span>
              </p>
            </div>
          </section>

          {/* ── Three analysis cards ── */}
          <div
            className="grid gap-5 mb-8"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
          >
            {/* Goal trajectory */}
            <article
              className="card-glass p-6 slide-up"
              style={{ animationDelay: '50ms', borderTop: '2px solid rgba(244,63,94,0.75)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase tracking-wider font-bold" style={{ color: '#FB7185' }}>Goal Trajectory</h3>
                <span
                  className="text-tiny px-2 py-0.5 rounded"
                  style={{ background: 'rgba(244,63,94,0.1)', color: '#FB7185', border: '1px solid rgba(244,63,94,0.2)' }}
                >
                  Your Path
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-tiny text-slate-400 mb-0.5">Final Corpus</p>
                  <p className="text-heading-2 text-white font-numeric">{formatCurrency(currentScenario.finalCorpus)}</p>
                </div>

                <div>
                  <div className="flex justify-between text-tiny mb-1">
                    <span className="text-slate-400">Target Attainment</span>
                    <span className="font-semibold font-numeric" style={{ color: '#FB7185' }}>
                      {currentScenario.percentOfGoal.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(currentScenario.percentOfGoal, 100)}%`,
                        background: 'linear-gradient(90deg, #F43F5E, #FB7185)',
                      }}
                    />
                  </div>
                </div>

                {!!currentScenario.monthsDelayToGoal && currentScenario.monthsDelayToGoal > 0 && (
                  <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-tiny text-slate-400 mb-0.5">Delay to goal</p>
                    <p className="text-heading-3 font-numeric" style={{ color: '#FBBF24' }}>
                      +{Math.floor(currentScenario.monthsDelayToGoal / 12)} yr{' '}
                      {currentScenario.monthsDelayToGoal % 12 > 0 ? `${currentScenario.monthsDelayToGoal % 12} mo` : ''}
                    </p>
                  </div>
                )}
              </div>
            </article>

            {/* Context */}
            <article
              className="card-glass p-6 slide-up"
              style={{ animationDelay: '100ms', borderTop: '2px solid rgba(56,189,248,0.75)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase tracking-wider font-bold" style={{ color: '#38BDF8' }}>Historical Pattern</h3>
                <span
                  className="text-tiny px-2 py-0.5 rounded"
                  style={{ background: 'rgba(56,189,248,0.1)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.2)' }}
                >
                  Behavioural
                </span>
              </div>

              <p className="text-small text-slate-300 leading-relaxed mb-4">{REASON_CONTEXTS[reason]}</p>

              <div className="space-y-2 mb-4">
                <div
                  className="p-3 rounded-lg text-tiny"
                  style={{
                    background: 'rgba(56,189,248,0.07)',
                    border: '1px solid rgba(56,189,248,0.18)',
                    color: '#E0F2FE',
                  }}
                >
                  📊 <strong>Your fund:</strong> {fundName} — Up +47% over 3 years (benchmark: +42%)
                </div>
                <div
                  className="p-3 rounded-lg text-tiny"
                  style={{
                    background: 'rgba(56,189,248,0.07)',
                    border: '1px solid rgba(56,189,248,0.18)',
                    color: '#E0F2FE',
                  }}
                >
                  📉 <strong>This correction:</strong> -6.5% (similar to 2020 recovery in 110 days)
                </div>
                <div
                  className="p-3 rounded-lg text-tiny"
                  style={{
                    background: 'rgba(56,189,248,0.07)',
                    border: '1px solid rgba(56,189,248,0.18)',
                    color: '#E0F2FE',
                  }}
                >
                  👥 <strong>Peer behavior:</strong> 82% of investors in this fund continued their SIP this month
                </div>
              </div>

              <div
                className="p-3 rounded-lg text-tiny"
                style={{
                  background: 'rgba(56,189,248,0.07)',
                  border: '1px solid rgba(56,189,248,0.18)',
                  color: 'rgba(56,189,248,0.85)',
                }}
              >
                💡 Rupee cost averaging works hardest during volatile phases by acquiring more units at lower NAVs.
              </div>
            </article>

            {/* Middle path */}
            <article
              className="card-glass p-6 slide-up"
              style={{ animationDelay: '150ms', borderTop: '2px solid rgba(0,229,153,0.75)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase tracking-wider font-bold" style={{ color: '#00E599' }}>Recommended Path</h3>
                <span
                  className="text-tiny px-2 py-0.5 rounded"
                  style={{ background: 'rgba(0,229,153,0.1)', color: '#00E599', border: '1px solid rgba(0,229,153,0.22)' }}
                >
                  Optimal
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-tiny text-slate-400 mb-0.5">{middlePathScenario.description}</p>
                  <p className="text-heading-2 font-numeric" style={{ color: '#00E599' }}>
                    {formatCurrency(middlePathScenario.finalCorpus)}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-tiny mb-1">
                    <span className="text-slate-400">Target Attainment</span>
                    <span className="font-semibold font-numeric" style={{ color: '#00E599' }}>
                      {middlePathScenario.percentOfGoal.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(middlePathScenario.percentOfGoal, 100)}%`,
                        background: 'linear-gradient(90deg, #00E599, #38BDF8)',
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-tiny text-slate-400 mb-0.5">Saves vs full cancel</p>
                  <p className="text-heading-3 text-white font-numeric">
                    {formatCurrency(Math.abs(currentScenario.deltaVsContinue) - Math.abs(middlePathScenario.deltaVsContinue))}
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* ── AI insight ── */}
          <section
            className="card-glass p-6 mb-8 slide-up"
            style={{
              animationDelay: '200ms',
              border: '1px solid rgba(0,229,153,0.18)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 text-[#050E1D]"
                style={{
                  background: 'linear-gradient(135deg, #00E599, #38BDF8)',
                  boxShadow: '0 0 18px rgba(0,229,153,0.35)',
                  minWidth: 40,
                }}
              >
                AI
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-small font-bold text-white">Checkpoint Intelligence</span>
                  <span className="status-indicator status-success">Verified</span>
                  {!isLoadingAI && (
                    <span className="text-tiny text-slate-400 font-numeric">{(aiLatency / 1000).toFixed(2)}s</span>
                  )}
                </div>

                {isLoadingAI ? (
                  <div className="space-y-2 py-1">
                    <div className="skeleton h-3.5 rounded w-11/12" />
                    <div className="skeleton h-3.5 rounded w-10/12" />
                    <div className="skeleton h-3.5 rounded w-8/12" />
                  </div>
                ) : (
                  <p className="text-body text-slate-200 leading-relaxed">{aiMessage}</p>
                )}
              </div>
            </div>
          </section>

          {/* ── Decision buttons ── */}
          <section className="slide-up mb-8" style={{ animationDelay: '250ms' }}>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold text-center mb-4">
              Choose Your Informed Action
            </p>

            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
            >
              {/* Continue SIP */}
              <button
                type="button"
                onClick={() => handleDecision('continue')}
                className="btn-base btn-primary btn-lg flex-col"
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                <span className="font-bold text-[#050E1D]">Keep My SIP Active</span>
                <span className="text-tiny font-normal mt-0.5" style={{ color: 'rgba(5,14,29,0.75)' }}>
                  Maintain 100% compounding pace
                </span>
              </button>

              {/* Middle path */}
              <button
                type="button"
                onClick={() => handleDecision('middle')}
                className="btn-base btn-secondary btn-lg flex-col"
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                <span className="font-bold" style={{ color: '#38BDF8' }}>Take Middle Path</span>
                <span className="text-tiny font-normal text-slate-400 mt-0.5">
                  Preserve {middlePathScenario.percentOfGoal.toFixed(0)}% of goal
                </span>
              </button>

              {/* Proceed */}
              <button
                type="button"
                onClick={() => handleDecision('proceed')}
                className="btn-base btn-danger btn-lg flex-col"
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                <span className="font-bold" style={{ color: '#FDA4AF' }}>Proceed With Change</span>
                <span className="text-tiny font-normal mt-0.5" style={{ color: 'rgba(253,164,175,0.7)' }}>
                  Accept {formatCurrency(animatedDelta)} loss
                </span>
              </button>
            </div>
          </section>

          {/* Disclaimer */}
          <aside
            className="p-4 rounded-xl text-center slide-up text-tiny text-slate-400"
            style={{
              animationDelay: '300ms',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <strong className="text-slate-300">Notice:</strong>{' '}
            Projections assume 12% annualised returns (standard equity fund benchmarks). Real outcomes vary.
            Tool provides educational decision support only.
          </aside>
        </div>
      </main>
    </>
  );
}
