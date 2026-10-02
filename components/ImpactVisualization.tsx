'use client';

import { ImpactCalculation, SIPAction } from '@/types';

interface ImpactVisualizationProps {
  impactCalculation: ImpactCalculation;
  action: SIPAction;
  goalAmount?: number;
}

export default function ImpactVisualization({
  impactCalculation,
  action,
  goalAmount,
}: ImpactVisualizationProps) {
  const { originalProjection, projectedImpact } = impactCalculation;
  
  const difference = originalProjection.finalAmount - projectedImpact.finalAmount;
  const percentageChange = ((difference / originalProjection.finalAmount) * 100).toFixed(1);
  
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
  const formatMonths = (months: number) => {
    if (months === Infinity) return 'Goal unreachable';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return years > 0 
      ? `${years}y ${remainingMonths}m`
      : `${remainingMonths}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Impact on Your Goal
      </h2>

      {/* Main comparison */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Original Projection */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✅</span>
            <h3 className="font-semibold text-lg text-green-900">
              Current Path
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-green-700 mb-1">Final Amount</div>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(originalProjection.finalAmount)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-green-600">Investment</div>
                <div className="font-semibold text-green-900">
                  {formatCurrency(originalProjection.totalInvestment)}
                </div>
              </div>
              <div>
                <div className="text-green-600">Returns</div>
                <div className="font-semibold text-green-900">
                  {formatCurrency(originalProjection.estimatedReturns)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-green-600">Time to Goal</div>
              <div className="font-semibold text-green-900">
                {formatMonths(originalProjection.timeToGoal)}
              </div>
            </div>
          </div>
        </div>

        {/* Projected Impact */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-semibold text-lg text-red-900">
              After {action === 'cancel' ? 'Cancellation' : action === 'pause' ? 'Pause' : 'Reduction'}
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-red-700 mb-1">Final Amount</div>
              <div className="text-2xl font-bold text-red-900">
                {formatCurrency(projectedImpact.finalAmount)}
              </div>
              <div className="text-sm text-red-600 mt-1">
                ↓ {formatCurrency(difference)} ({percentageChange}% lower)
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-red-600">Investment</div>
                <div className="font-semibold text-red-900">
                  {formatCurrency(projectedImpact.totalInvestment)}
                </div>
              </div>
              <div>
                <div className="text-red-600">Returns</div>
                <div className="font-semibold text-red-900">
                  {formatCurrency(projectedImpact.estimatedReturns)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-red-600">Time to Goal</div>
              <div className="font-semibold text-red-900">
                {formatMonths(projectedImpact.timeToGoal)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal progress bars */}
      {goalAmount && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Current Path Progress</span>
              <span className="font-semibold text-green-700">
                {((originalProjection.finalAmount / goalAmount) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (originalProjection.finalAmount / goalAmount) * 100)}%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress After Change</span>
              <span className="font-semibold text-red-700">
                {((projectedImpact.finalAmount / goalAmount) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (projectedImpact.finalAmount / goalAmount) * 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {projectedImpact.shortfall > 0 && (
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-semibold text-red-900 mb-1">
                    Goal Shortfall: {formatCurrency(projectedImpact.shortfall)}
                  </div>
                  <div className="text-sm text-red-700">
                    You'll be {formatCurrency(projectedImpact.shortfall)} short of your {formatCurrency(goalAmount)} goal
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key impact metrics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Key Differences</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Lost Investment</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(originalProjection.totalInvestment - projectedImpact.totalInvestment)}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Lost Returns</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(originalProjection.estimatedReturns - projectedImpact.estimatedReturns)}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Time Delay</div>
            <div className="text-lg font-bold text-gray-900">
              {projectedImpact.timeToGoal === Infinity 
                ? '∞' 
                : `+${formatMonths(projectedImpact.timeToGoal - originalProjection.timeToGoal)}`}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Power of Compounding</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(difference - (originalProjection.totalInvestment - projectedImpact.totalInvestment))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
