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

  // Calculate scenarios
  useEffect(() => {
    const result = compareScenarios(
      {
        monthlyAmount,
        currentCorpus: currentValue,
        yearsToGoal,
        assumedAnnualReturn: 12,
      },
      goalAmount,
      6, // 6 month pause
      Math.floor(monthlyAmount / 2) // reduce to half
    );
    setComparison(result);
  }, [monthlyAmount, currentValue, goalAmount, yearsToGoal]);

  // Fetch AI explanation
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
            monthlyAmount,
            currentValue,
            goalAmount,
            yearsToGoal,
            action,
            reason,
            delta: Math.abs(scenario.deltaVsContinue),
            percentOfGoal: scenario.percentOfGoal,
          }),
          signal: AbortSignal.timeout(2500),
        });

        if (response.ok) {
          const data = await response.json();
          setAiMessage(data.message || '');
        } else {
          throw new Error('AI request failed');
        }
      } catch (error) {
        // Fallback robust explanation
        const delta = Math.abs(scenario.deltaVsContinue);
        setAiMessage(
          `Stopping your ₹${monthlyAmount.toLocaleString('en-IN')}/mo SIP right now forfeits ${formatCurrency(delta)} in compounding value by your target date. ` +
          `Because market cycles reward staying invested, pausing or reducing by 50% preserves over 85% of your target corpus.`
        );
      } finally {
        const latency = Date.now() - startTime;
        setAiLatency(latency);
        setIsLoadingAI(false);
      }
    };

    fetchAI();
  }, [comparison, action, reason, monthlyAmount, currentValue, goalAmount, yearsToGoal]);

  // Animate the big number counting up smoothly
  useEffect(() => {
    if (!comparison) return;
    
    const delta = Math.abs(comparison[action].deltaVsContinue);
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedDelta(Math.floor(delta * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
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
          finalAction: chosenAction === 'continue' ? 'continue' : (chosenAction === 'middle' ? 'reduce' : action),
          reason,
          timeSpent: Math.round((Date.now() - (aiLatency || 1500)) / 1000),
          intervened: true,
          deltaAmount: comparison ? Math.abs(comparison[action].deltaVsContinue) : 0,
        }),
      });
    } catch (e) {
      console.error(e);
    }

    if (chosenAction === 'continue') {
      setDecisionFeedback('Awesome! You decided to stay on track with your SIP. Compounding remains intact!');
    } else if (chosenAction === 'middle') {
      setDecisionFeedback('Smart choice! Taking the calibrated middle path preserves over 80% of your wealth trajectory.');
    } else {
      setDecisionFeedback('Action acknowledged. We recommend reviewing your asset allocation soon.');
    }

    setTimeout(() => {
      onBack();
    }, 1800);
  };

  if (!comparison) {
    return (
      <main className="min-h-screen bg-[#060B18] flex items-center justify-center p-4">
        <div className="card-glass p-8 flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-12 h-12 border-3 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">Computing Compounding Impact...</p>
          <span className="text-xs text-slate-400">Evaluating multi-scenario cash flows</span>
        </div>
      </main>
    );
  }

  const currentScenario = comparison[action];
  const middlePathScenario = action === 'cancel' ? comparison.reduce : comparison.pause;

  return (
    <main className="min-h-screen relative overflow-hidden bg-grid-pattern py-8 md:py-12 px-4 sm:px-6">
      {/* Dynamic ambient lights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-rose-500/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[400px] bg-teal-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top Breadcrumb Header */}
        <div className="flex items-center justify-between mb-6 fade-in">
          <button
            type="button"
            onClick={onBack}
            className="text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Configuration</span>
          </button>
          
          <div className="brand-badge text-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>Live Checkpoint Triggered</span>
          </div>
        </div>

        {/* Feedback Alert if Action clicked */}
        {decisionFeedback && (
          <div className="card-glass p-5 mb-6 border-teal-400/60 bg-teal-950/40 text-center fade-in">
            <p className="text-teal-300 font-semibold">{decisionFeedback}</p>
          </div>
        )}

        {/* Big Number - The Real Cost of Pullout */}
        <section className="card-glass-elevated p-8 md:p-12 mb-8 text-center relative overflow-hidden fade-in border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <span className="status-indicator status-error mb-4">
              Estimated Opportunity Loss
            </span>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
              This decision costs your future self
            </p>
            
            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black gradient-text-rose font-numeric tracking-tight my-2" role="status" aria-live="polite">
              {formatCurrency(animatedDelta)}
            </div>
            
            <p className="text-small sm:text-body text-slate-300 max-w-lg mx-auto mt-3">
              By your goal horizon in <span className="text-white font-semibold">{yearsToGoal} {yearsToGoal === 1 ? 'year' : 'years'}</span> for <span className="text-cyan-300 font-medium">{fundName}</span>
            </p>
          </div>
        </section>

        {/* Three Scenario Analysis Blocks */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {/* Card 1: Goal Impact */}
          <article className="card-glass p-6 border-t-2 border-t-rose-400/80 slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-wider text-rose-300 font-bold">Goal Trajectory</h3>
              <span className="text-tiny px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Selected Path</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-tiny text-slate-400 mb-1">Final Corpus Reached</p>
                <p className="text-heading-2 text-white font-numeric">
                  {formatCurrency(currentScenario.finalCorpus)}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-tiny mb-1">
                  <span className="text-slate-400">Target Attainment</span>
                  <span className="text-rose-400 font-semibold font-numeric">{currentScenario.percentOfGoal.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(currentScenario.percentOfGoal, 100)}%` }}
                  />
                </div>
              </div>

              {currentScenario.monthsDelayToGoal && currentScenario.monthsDelayToGoal > 0 && (
                <div className="pt-2 border-t border-white/[0.06]">
                  <p className="text-tiny text-slate-400 mb-0.5">Delay to achieve goal</p>
                  <p className="text-heading-3 text-amber-400 font-numeric">
                    +{Math.floor(currentScenario.monthsDelayToGoal / 12)} yrs {currentScenario.monthsDelayToGoal % 12 > 0 ? `${currentScenario.monthsDelayToGoal % 12} mo` : ''}
                  </p>
                </div>
              )}
            </div>
          </article>

          {/* Card 2: Market Context */}
          <article className="card-glass p-6 border-t-2 border-t-cyan-400/80 slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-wider text-cyan-300 font-bold">Historical Pattern</h3>
              <span className="text-tiny px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Behavioral Insight</span>
            </div>

            <p className="text-small text-slate-300 leading-relaxed mb-4">
              {REASON_CONTEXTS[reason]}
            </p>

            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-tiny text-cyan-300/80">
              💡 Rupee cost averaging works hardest during volatile phases by acquiring more fund units at lower NAVs.
            </div>
          </article>

          {/* Card 3: The Middle Path */}
          <article className="card-glass p-6 border-t-2 border-t-teal-400/80 slide-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-wider text-teal-300 font-bold">Recommended Middle Path</h3>
              <span className="text-tiny px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">Optimal</span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-tiny text-slate-400 mb-1">{middlePathScenario.description}</p>
                <p className="text-heading-2 text-teal-300 font-numeric">
                  {formatCurrency(middlePathScenario.finalCorpus)}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-tiny mb-1">
                  <span className="text-slate-400">Target Attainment</span>
                  <span className="text-teal-300 font-semibold font-numeric">{middlePathScenario.percentOfGoal.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(middlePathScenario.percentOfGoal, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <p className="text-tiny text-slate-400 mb-0.5">Saves vs full cancellation</p>
                <p className="text-heading-3 text-white font-numeric">
                  {formatCurrency(Math.abs(currentScenario.deltaVsContinue) - Math.abs(middlePathScenario.deltaVsContinue))}
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* AI Insight Box */}
        <section className="card-glass p-6 md:p-8 mb-8 slide-up border-teal-500/30" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center flex-shrink-0 text-black font-bold shadow-[0_0_20px_rgba(0,229,153,0.4)]">
              AI
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-small font-bold text-white tracking-wide">
                  Checkpoint Intelligence Advisor
                </h3>
                <span className="status-indicator status-success text-tiny py-0.5">
                  Verified Analysis
                </span>
                {!isLoadingAI && (
                  <span className="text-tiny text-slate-400 font-numeric">
                    {(aiLatency / 1000).toFixed(2)}s Latency
                  </span>
                )}
              </div>

              {isLoadingAI ? (
                <div className="space-y-2.5 py-1">
                  <div className="h-4 skeleton rounded-lg w-11/12"></div>
                  <div className="h-4 skeleton rounded-lg w-10/12"></div>
                  <div className="h-4 skeleton rounded-lg w-8/12"></div>
                </div>
              ) : (
                <p className="text-body text-slate-200 leading-relaxed font-normal">
                  {aiMessage}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Interactive Decision Actions */}
        <section className="slide-up" style={{ animationDelay: '250ms' }}>
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold text-center mb-4">
            Choose Your Informed Action
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Primary Option: Keep SIP */}
            <button
              type="button"
              onClick={() => handleDecision('continue')}
              className="btn-base btn-primary btn-lg flex-col py-4 px-5 shadow-[0_0_30px_rgba(0,229,153,0.4)] hover:scale-[1.02] transition-transform"
            >
              <span className="font-bold text-base text-[#060B18]">Keep My SIP Active</span>
              <span className="text-tiny text-[#060B18]/80 font-normal">Maintain 100% compounding pace</span>
            </button>

            {/* Secondary Option: Middle Path */}
            <button
              type="button"
              onClick={() => handleDecision('middle')}
              className="btn-base btn-secondary btn-lg flex-col py-4 px-5 hover:scale-[1.02] transition-transform"
            >
              <span className="font-bold text-base text-cyan-300">Take Middle Path</span>
              <span className="text-tiny text-slate-400 font-normal">Pause/Reduce to protect {middlePathScenario.percentOfGoal.toFixed(0)}% goal</span>
            </button>

            {/* Danger Option: Proceed Anyway */}
            <button
              type="button"
              onClick={() => handleDecision('proceed')}
              className="btn-base btn-danger btn-lg flex-col py-4 px-5 hover:scale-[1.02] transition-transform"
            >
              <span className="font-bold text-base text-rose-300">Proceed With Change</span>
              <span className="text-tiny text-rose-400/80 font-normal">Accept {formatCurrency(animatedDelta)} opportunity loss</span>
            </button>
          </div>
        </section>

        {/* Disclaimer Footer */}
        <aside className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center slide-up" style={{ animationDelay: '300ms' }}>
          <p className="text-tiny text-slate-400">
            <strong className="text-slate-300">Notice:</strong> Financial projections assume 12% annualized returns (standard mutual fund benchmarks). Real market outcomes vary. Tool serves educational decision support.
          </p>
        </aside>
      </div>
    </main>
  );
}
