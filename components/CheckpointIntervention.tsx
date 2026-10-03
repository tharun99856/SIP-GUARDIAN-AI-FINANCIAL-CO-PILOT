'use client';

import { useState, useEffect } from 'react';
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
          signal: AbortSignal.timeout(2000), // 2 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          setAiMessage(data.message || '');
        } else {
          throw new Error('AI request failed');
        }
      } catch (error) {
        // Fallback template message
        const delta = Math.abs(scenario.deltaVsContinue);
        setAiMessage(
          `Stopping your SIP now means losing ${formatCurrency(delta)} in potential wealth. ` +
          `This loss comes from missing both future contributions and the compounding returns on that money.`
        );
      } finally {
        const latency = Date.now() - startTime;
        setAiLatency(latency);
        setIsLoadingAI(false);
      }
    };

    fetchAI();
  }, [comparison, action, reason, monthlyAmount, currentValue, goalAmount, yearsToGoal]);

  // Animate the big number counting up
  useEffect(() => {
    if (!comparison) return;
    
    const delta = Math.abs(comparison[action].deltaVsContinue);
    const duration = 800;
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

  if (!comparison) {
    return (
      <div className="min-h-screen bg-[#0B1B3F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#0F9D8A] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-[#5CD6F0] text-body">Calculating impact...</div>
        </div>
      </div>
    );
  }

  const currentScenario = comparison[action];
  const middlePathScenario = action === 'cancel' ? comparison.reduce : comparison.pause;

  return (
    <div className="min-h-screen bg-[#0B1B3F] py-8 md:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Big Number - The Cost */}
        <section className="card-elevated p-6 md:p-8 mb-6 text-center fade-in" role="region" aria-label="Financial impact">
          <p className="text-tiny uppercase tracking-wider text-[#94A3B8] mb-3">
            This decision costs you
          </p>
          <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#EF4444] mb-3 font-numeric" role="status" aria-live="polite">
            {formatCurrency(animatedDelta)}
          </div>
          <p className="text-small text-[#CBD5E1]">
            by your goal date ({yearsToGoal} {yearsToGoal === 1 ? 'year' : 'years'} from now)
          </p>
        </section>

        {/* Three Information Blocks */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Goal Impact */}
          <article className="card-surface p-5 slide-up" style={{ animationDelay: '50ms' }}>
            <h3 className="text-tiny uppercase tracking-wider text-[#5CD6F0] mb-4 font-semibold">Goal Impact</h3>
            <div className="space-y-4">
              <div>
                <p className="text-tiny text-[#94A3B8] mb-1">Corpus at goal date</p>
                <p className="text-heading-3 text-white font-numeric">
                  {formatCurrency(currentScenario.finalCorpus)}
                </p>
              </div>
              <div>
                <p className="text-tiny text-[#94A3B8] mb-1">Percentage of goal</p>
                <p className="text-heading-3 text-white font-numeric">
                  {currentScenario.percentOfGoal.toFixed(1)}%
                </p>
              </div>
              {currentScenario.monthsDelayToGoal && currentScenario.monthsDelayToGoal > 0 && (
                <div>
                  <p className="text-tiny text-[#94A3B8] mb-1">Delay to reach goal</p>
                  <p className="text-heading-3 text-[#F59E0B] font-numeric">
                    +{Math.floor(currentScenario.monthsDelayToGoal / 12)} years
                  </p>
                </div>
              )}
            </div>
          </article>

          {/* Context */}
          <article className="card-surface p-5 slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-tiny uppercase tracking-wider text-[#5CD6F0] mb-4 font-semibold">Context</h3>
            <p className="text-small text-[#CBD5E1] leading-relaxed mb-3">
              {REASON_CONTEXTS[reason]}
            </p>
            <p className="text-tiny text-[#94A3B8] italic">
              Note: Illustrative context based on historical patterns. Not a guarantee.
            </p>
          </article>

          {/* Middle Path */}
          <article className="card-surface p-5 sm:col-span-2 lg:col-span-1 slide-up" style={{ animationDelay: '150ms' }}>
            <h3 className="text-tiny uppercase tracking-wider text-[#5CD6F0] mb-4 font-semibold">Middle Path</h3>
            <div className="space-y-4">
              <div>
                <p className="text-tiny text-[#94A3B8] mb-1">{middlePathScenario.description}</p>
                <p className="text-heading-3 text-white mt-2 font-numeric">
                  {formatCurrency(middlePathScenario.finalCorpus)}
                </p>
              </div>
              <div>
                <p className="text-tiny text-[#94A3B8] mb-1">Loss vs continuing</p>
                <p className="text-xl font-bold text-[#F59E0B] font-numeric">
                  {formatCurrency(Math.abs(middlePathScenario.deltaVsContinue))}
                </p>
              </div>
              <p className="text-tiny text-[#94A3B8]">
                Reaches {middlePathScenario.percentOfGoal.toFixed(1)}% of your goal
              </p>
            </div>
          </article>
        </div>

        {/* AI Message */}
        <section className="card-surface p-5 md:p-6 mb-6 slide-up" style={{ animationDelay: '200ms' }} role="region" aria-label="AI explanation">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0F9D8A]/20 flex items-center justify-center mt-1">
              <div className="w-2.5 h-2.5 bg-[#0F9D8A] rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              {isLoadingAI ? (
                <div className="space-y-2" role="status" aria-label="Loading AI explanation">
                  <div className="h-4 skeleton rounded w-11/12"></div>
                  <div className="h-4 skeleton rounded w-10/12"></div>
                  <div className="h-4 skeleton rounded w-9/12"></div>
                </div>
              ) : (
                <>
                  <p className="text-body text-white leading-relaxed">{aiMessage}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="status-indicator status-success">
                      AI Generated
                    </span>
                    <span className="text-tiny text-[#94A3B8]">
                      {(aiLatency / 1000).toFixed(2)}s
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <aside className="card-surface p-4 mb-6 border-l-4 border-[#F59E0B] slide-up" style={{ animationDelay: '250ms' }}>
          <p className="text-tiny text-[#CBD5E1]">
            <strong className="text-white font-semibold">Disclaimer:</strong> This is a decision-support tool, not investment advice.
            Projections assume 12% annual returns (not guaranteed). Based on historical equity fund averages.
            Actual returns will vary. Markets fluctuate.
          </p>
        </aside>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-3 md:gap-4 slide-up" style={{ animationDelay: '300ms' }}>
          <button
            type="button"
            onClick={() => {
              console.log('Continue SIP');
              onBack();
            }}
            className="btn-base btn-primary"
          >
            Continue My SIP
          </button>

          <button
            type="button"
            onClick={() => {
              console.log('Take middle path');
              onBack();
            }}
            className="btn-base btn-secondary"
          >
            Take Middle Path
          </button>

          <button
            type="button"
            onClick={() => {
              console.log('Proceed anyway');
              onBack();
            }}
            className="btn-base btn-danger"
          >
            Proceed Anyway
          </button>
        </div>

        <div className="text-center mt-6 slide-up" style={{ animationDelay: '350ms' }}>
          <button
            type="button"
            onClick={onBack}
            className="btn-base btn-ghost text-small"
          >
            ← Back to inputs
          </button>
        </div>
      </div>
    </div>
  );
}
