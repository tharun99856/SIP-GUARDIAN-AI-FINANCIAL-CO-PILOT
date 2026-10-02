'use client';

import { Alternative } from '@/types';

interface AlternativesSectionProps {
  alternatives: Alternative[];
  selectedAlternative: string | null;
  onSelectAlternative: (id: string | null) => void;
}

export default function AlternativesSection({
  alternatives,
  selectedAlternative,
  onSelectAlternative,
}: AlternativesSectionProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Consider These Alternatives
        </h2>
        <p className="text-gray-600 text-sm">
          You don't have to stop completely. Here are some options that might work better for your situation.
        </p>
      </div>

      <div className="space-y-4">
        {alternatives.map((alternative) => {
          const isSelected = selectedAlternative === alternative.id;
          
          return (
            <button
              key={alternative.id}
              onClick={() => onSelectAlternative(isSelected ? null : alternative.id)}
              className={`w-full text-left p-5 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {alternative.title}
                    </h3>
                    {isSelected && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {alternative.description}
                  </p>
                </div>
                <div className="ml-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Impact summary */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-gray-600 text-xs mb-1">Final Amount</div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(alternative.impact.finalAmount)}
                  </div>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-gray-600 text-xs mb-1">Shortfall</div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(alternative.impact.shortfall)}
                  </div>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-gray-600 text-xs mb-1">Relief Period</div>
                  <div className="font-semibold text-gray-900">
                    {alternative.impact.monthsSaved > 0 
                      ? `${alternative.impact.monthsSaved} months`
                      : 'Ongoing'}
                  </div>
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-green-700 text-sm mb-2 flex items-center gap-1">
                    <span>✓</span> Pros
                  </div>
                  <ul className="space-y-1">
                    {alternative.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-red-700 text-sm mb-2 flex items-center gap-1">
                    <span>✗</span> Cons
                  </div>
                  <ul className="space-y-1">
                    {alternative.cons.map((con, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">
                    Click "Proceed with Alternative" to choose this option instead
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <div className="text-blue-600 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              No Pressure. Your Choice.
            </p>
            <p className="text-sm text-blue-700">
              These are suggestions, not recommendations. You can proceed with your original choice 
              or select an alternative. There's no wrong decision—only what works best for you right now.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
