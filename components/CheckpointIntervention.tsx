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
    let start = 0;
    const duration = 600;
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
        <div className="text-[#5CD6F0]">Calculating impact...</div>
      </div>
    );
  }

  const currentScenario = comparison[action];
  const middlePathScenario = action === 'cancel' ? comparison.reduce : comparison.pause;
  const delta = Math.abs(currentScenario.deltaVsContinue);

  return (
    <div className="min-h-screen bg-[#0B1B3F] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Big Number - The Cost */}
        <div className="card-surface p-8 mb-6 text-center fade-in">
          <p className="text-[#94A3B8] text-sm uppercase tracking-wide mb-2">
            This decision costs you
          </p>
          <div className="text-5xl md:text-7xl font-bold text-[#EF4444] mb-2">
            {formatCurrency(animatedDelta)}
          </div>
          <p className="text-[#94A3B8]">
            by your goal date ({yearsToGoal} years from now)
          </p>
        </div>

        {/* Three Compact Blocks */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Goal Impact */}
          <div className="card-surface p-6">
            <h3 className="text-sm uppercase tracking-wide text-[#5CD6F0] mb-3">Goal Impact</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#94A3B8]">Corpus at goal date</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(currentScenario.finalCorpus)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Percentage of goal</p>
                <p className="text-xl font-bold text-white">
                  {currentScenario.percentOfGoal.toFixed(1)}%
                </p>
              </div>
              {currentScenario.monthsDelayToGoal && currentScenario.monthsDelayToGoal > 0 && (
                <div>
                  <p className="text-xs text-[#94A3B8]">Delay to reach goal</p>
                  <p className="text-xl font-bold text-[#F59E0B]">
                    +{Math.floor(currentScenario.monthsDelayToGoal / 12)} years
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Context */}
          <div className="card-surface p-6">
            <h3 className="text-sm uppercase tracking-wide text-[#5CD6F0] mb-3">Context</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {REASON_CONTEXTS[reason]}
            </p>
            <p className="text-xs text-[#94A3B8] mt-3 italic">
              Note: Illustrative context based on historical patterns. Not a guarantee.
            </p>
          </div>

          {/* Middle Path */}
          <div className="card-surface p-6">
            <h3 className="text-sm uppercase tracking-wide text-[#5CD6F0] mb-3">Middle Path</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#94A3B8]">{middlePathScenario.description}</p>
                <p className="text-xl font-bold text-white mt-1">
                  {formatCurrency(middlePathScenario.finalCorpus)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Loss vs continuing</p>
                <p className="text-lg font-bold text-[#F59E0B]">
                  {formatCurrency(Math.abs(middlePathScenario.deltaVsContinue))}
                </p>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Reaches {middlePathScenario.percentOfGoal.toFixed(1)}% of your goal
              </p>
            </div>
          </div>
        </div>

        {/* AI Message */}
        <div className="card-surface p-6 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-[#0F9D8A] rounded-full mt-2"></div>
            <div className="flex-1">
              {isLoadingAI ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-[#12244F] rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-[#12244F] rounded w-1/2"></div>
                </div>
              ) : (
                <>
                  <p className="text-white leading-relaxed">{aiMessage}</p>
                  <p className="text-xs text-[#94A3B8] mt-2">
                    Generated in {(aiLatency / 1000).toFixed(1)}s
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="card-surface p-4 mb-6 border-l-4 border-[#F59E0B]">
          <p className="text-xs text-[#94A3B8]">
            <strong className="text-white">Disclaimer:</strong> This is a decision-support tool, not investment advice.
            Projections assume 12% annual returns (not guaranteed). Based on historical equity fund averages.
            Actual returns will vary. Markets fluctuate.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              console.log('Continue SIP');
              onBack();
            }}
            className="bg-[#0F9D8A] text-white p-4 rounded-lg font-bold hover:bg-[#0F9D8A]/90 btn"
          >
            Continue My SIP
          </button>

          <button
            onClick={() => {
              console.log('Take middle path');
              onBack();
            }}
            className="bg-[#F59E0B] text-white p-4 rounded-lg font-bold hover:bg-[#F59E0B]/90 btn"
          >
            Take the Middle Path
          </button>

          <button
            onClick={() => {
              console.log('Proceed anyway');
              onBack();
            }}
            className="bg-transparent border-2 border-[#EF4444] text-[#EF4444] p-4 rounded-lg font-bold hover:bg-[#EF4444]/10 btn"
          >
            Proceed Anyway
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onBack}
            className="text-[#5CD6F0] text-sm hover:underline"
          >
            ← Back to inputs
          </button>
        </div>
      </div>
    </div>
  );
}
