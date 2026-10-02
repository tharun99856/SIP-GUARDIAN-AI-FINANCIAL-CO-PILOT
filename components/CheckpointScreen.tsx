'use client';

import { useState, useEffect } from 'react';
import { SIPDetails, SIPAction, CheckpointData, ImpactCalculation, Alternative } from '@/types';
import { calculateSIPImpact, generateAlternatives } from '@/lib/calculator';
import ImpactVisualization from './ImpactVisualization';
import AlternativesSection from './AlternativesSection';
import AIExplanationPanel from './AIExplanationPanel';

interface CheckpointScreenProps {
  sipDetails: SIPDetails;
  action: SIPAction;
  newAmount?: number;
  pauseDuration?: number;
  onConfirm: (data: CheckpointData) => void;
  onCancel: () => void;
}

export default function CheckpointScreen({
  sipDetails,
  action,
  newAmount,
  pauseDuration,
  onConfirm,
  onCancel,
}: CheckpointScreenProps) {
  const [checkpointData, setCheckpointData] = useState<CheckpointData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);

  useEffect(() => {
    // Calculate impact
    const impactCalculation = calculateSIPImpact(
      sipDetails,
      action,
      newAmount,
      pauseDuration
    );

    // Generate alternatives
    const alternatives = generateAlternatives(sipDetails, action, impactCalculation);

    // Prepare checkpoint data
    const data: CheckpointData = {
      changeRequest: {
        action,
        sipDetails,
        newAmount,
        pauseDuration,
      },
      impactCalculation,
      alternatives,
      aiExplanation: {
        summary: 'Calculating AI explanation...',
        detailedExplanation: '',
        keyPoints: [],
        riskFactors: [],
        confidence: 'medium',
      },
      effectiveDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    };

    setCheckpointData(data);
    setLoading(false);

    // Fetch AI explanation asynchronously
    fetchAIExplanation(data);
  }, [sipDetails, action, newAmount, pauseDuration]);

  const fetchAIExplanation = async (data: CheckpointData) => {
    try {
      const response = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sipDetails: data.changeRequest.sipDetails,
          action: data.changeRequest.action,
          impactCalculation: data.impactCalculation,
        }),
      });

      if (response.ok) {
        const aiExplanation = await response.json();
        setCheckpointData((prev) =>
          prev ? { ...prev, aiExplanation } : null
        );
      }
    } catch (error) {
      console.error('Failed to fetch AI explanation:', error);
      // Fallback to basic explanation
      setCheckpointData((prev) =>
        prev
          ? {
              ...prev,
              aiExplanation: {
                summary: 'Impact calculated using standard financial formulas',
                detailedExplanation: 'AI explanation unavailable. All calculations remain accurate.',
                keyPoints: ['Projections based on historical averages', 'Actual returns may vary'],
                riskFactors: ['Market volatility', 'Economic conditions'],
                confidence: 'high',
              },
            }
          : null
      );
    }
  };

  const handleConfirm = () => {
    if (checkpointData) {
      onConfirm(checkpointData);
    }
  };

  if (loading || !checkpointData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating impact...</p>
        </div>
      </div>
    );
  }

  const { impactCalculation, alternatives, aiExplanation, effectiveDate } = checkpointData;
  const actionText = {
    cancel: 'Cancel',
    pause: 'Pause',
    reduce: 'Reduce',
  }[action];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Before you {actionText.toLowerCase()} your SIP
                </h1>
                <p className="text-sm text-gray-500">
                  Effective date: {new Date(effectiveDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              We've calculated how this change will impact your <strong>{sipDetails.goalName}</strong> goal. 
              Please review the information below.
            </p>
          </div>
          
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Impact Visualization */}
      <ImpactVisualization
        impactCalculation={impactCalculation}
        action={action}
        goalAmount={sipDetails.goalAmount}
      />

      {/* AI Explanation */}
      <AIExplanationPanel
        explanation={aiExplanation}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
      />

      {/* Calculation Method Details */}
      {showDetails && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📐</span> Calculation Methodology
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {impactCalculation.calculationMethod}
            </pre>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-gray-600 mb-1">Expected Return</div>
              <div className="text-xl font-bold text-blue-600">
                {impactCalculation.assumptions.expectedReturn}%
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-gray-600 mb-1">Market Scenario</div>
              <div className="text-xl font-bold text-green-600 capitalize">
                {impactCalculation.assumptions.marketScenario}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-gray-600 mb-1">Inflation Rate</div>
              <div className="text-xl font-bold text-purple-600">
                {impactCalculation.assumptions.inflationRate}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternatives */}
      <AlternativesSection
        alternatives={alternatives}
        selectedAlternative={selectedAlternative}
        onSelectAlternative={setSelectedAlternative}
      />

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex gap-3">
          <div className="text-amber-600 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-amber-800 font-medium mb-1">
              Important Disclaimer
            </p>
            <p className="text-sm text-amber-700">
              All projections are based on assumptions and historical averages. Actual market returns may vary. 
              This is not investment advice. Past performance does not guarantee future results. 
              Please consult with a financial advisor for personalized guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {selectedAlternative
              ? `Proceed with Alternative`
              : `Confirm ${actionText}`}
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-3">
          Your choice will be processed immediately. You can always modify your SIP later.
        </p>
      </div>
    </div>
  );
}
