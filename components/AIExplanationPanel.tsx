'use client';

import { AIExplanation } from '@/types';

interface AIExplanationPanelProps {
  explanation: AIExplanation;
  showDetails: boolean;
  onToggleDetails: () => void;
}

export default function AIExplanationPanel({
  explanation,
  showDetails,
  onToggleDetails,
}: AIExplanationPanelProps) {
  const confidenceColor = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-red-100 text-red-800 border-red-200',
  }[explanation.confidence];

  const isLoading = explanation.summary.includes('Calculating');

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-6 border-2 border-purple-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl">🤖</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              AI Explanation
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full border ${confidenceColor}`}>
              {explanation.confidence} confidence
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Plain language explanation of your impact calculations
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-gray-800 leading-relaxed">
              {explanation.summary}
            </p>
          </div>

          {/* Key Points */}
          {explanation.keyPoints.length > 0 && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>💡</span> Key Points
              </h4>
              <ul className="space-y-2">
                {explanation.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-sm text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Factors */}
          {explanation.riskFactors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <span>⚠️</span> Risk Factors to Consider
              </h4>
              <ul className="space-y-2">
                {explanation.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-amber-600 mt-1">•</span>
                    <span className="text-sm text-amber-800">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Explanation Toggle */}
          {explanation.detailedExplanation && (
            <button
              onClick={onToggleDetails}
              className="w-full bg-white hover:bg-gray-50 rounded-lg p-3 flex items-center justify-between transition-colors border border-gray-200"
            >
              <span className="text-sm font-medium text-gray-700">
                {showDetails ? 'Hide' : 'Show'} Calculation Details
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  showDetails ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {/* Detailed Explanation */}
          {showDetails && explanation.detailedExplanation && (
            <div className="mt-4 bg-white rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {explanation.detailedExplanation}
              </p>
            </div>
          )}
        </>
      )}

      {/* AI Disclaimer */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> AI explanations are generated to help you understand the calculations. 
          All numerical projections come from our deterministic calculation engine, not AI. 
          The AI only explains what the numbers mean in simple language.
        </p>
      </div>
    </div>
  );
}
