'use client';

import { useState } from 'react';
import { SIPPreset, SIPAction, PauseReason } from '@/types';
import { SIP_PRESETS, REASON_LABELS } from '@/lib/presets';
import CheckpointIntervention from '@/components/CheckpointIntervention';

export default function CheckpointPage() {
  // Step 1: Select or customize SIP
  const [selectedPreset, setSelectedPreset] = useState<string>(SIP_PRESETS[0].id);
  const [monthlyAmount, setMonthlyAmount] = useState(SIP_PRESETS[0].monthlyAmount);
  const [currentValue, setCurrentValue] = useState(SIP_PRESETS[0].currentValue);
  const [goalAmount, setGoalAmount] = useState(SIP_PRESETS[0].goalAmount);
  const [yearsToGoal, setYearsToGoal] = useState(SIP_PRESETS[0].yearsToGoal);
  const [fundName, setFundName] = useState(SIP_PRESETS[0].fundName);
  
  // Step 2: Select action
  const [action, setAction] = useState<SIPAction | null>(null);
  
  // Step 3: Select reason
  const [reason, setReason] = useState<PauseReason | null>(null);
  
  // Step 4: Show intervention
  const [showIntervention, setShowIntervention] = useState(false);

  const handlePresetChange = (presetId: string) => {
    const preset = SIP_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setMonthlyAmount(preset.monthlyAmount);
      setCurrentValue(preset.currentValue);
      setGoalAmount(preset.goalAmount);
      setYearsToGoal(preset.yearsToGoal);
      setFundName(preset.fundName);
      setAction(null);
      setReason(null);
    }
  };

  const handleProceed = () => {
    if (action && reason) {
      setShowIntervention(true);
    }
  };

  const handleBack = () => {
    setShowIntervention(false);
  };

  if (showIntervention && action && reason) {
    return (
      <CheckpointIntervention
        monthlyAmount={monthlyAmount}
        currentValue={currentValue}
        goalAmount={goalAmount}
        yearsToGoal={yearsToGoal}
        fundName={fundName}
        action={action}
        reason={reason}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1B3F] py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 fade-in">
          <div className="accent-bar mb-6">
            <h1 className="text-heading-1 md:text-display text-white mb-2">
              SIP Change Request
            </h1>
            <p className="text-body text-[#5CD6F0]">
              Before we proceed, let us show you what this decision means for your goal.
            </p>
          </div>
        </header>

        {/* Step 1: Select or Customize SIP */}
        <section className="card-surface mb-6 p-5 md:p-6 slide-up" style={{ animationDelay: '50ms' }}>
          <h2 className="text-heading-2 text-white mb-5">Your SIP Details</h2>
          
          {/* Preset Selection */}
          <div className="mb-6">
            <label className="label-text">
              Quick Presets
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              {SIP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetChange(preset.id)}
                  className={`select-card ${selectedPreset === preset.id ? 'selected' : ''}`}
                  aria-pressed={selectedPreset === preset.id}
                >
                  <div className="font-semibold text-white text-sm mb-1">{preset.name}</div>
                  <div className="text-tiny text-[#94A3B8]">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Editable Inputs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fundName" className="label-text">Fund Name</label>
              <input
                id="fundName"
                type="text"
                value={fundName}
                onChange={(e) => setFundName(e.target.value)}
                className="input-base"
                placeholder="Enter fund name"
              />
            </div>
            
            <div>
              <label htmlFor="monthlyAmount" className="label-text">
                Monthly SIP Amount (₹)
              </label>
              <input
                id="monthlyAmount"
                type="number"
                min="500"
                max="100000"
                step="500"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="input-base font-numeric"
              />
            </div>

            <div>
              <label htmlFor="currentValue" className="label-text">
                Current Value (₹)
              </label>
              <input
                id="currentValue"
                type="number"
                min="0"
                max="10000000"
                step="10000"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                className="input-base font-numeric"
              />
            </div>

            <div>
              <label htmlFor="goalAmount" className="label-text">
                Goal Amount (₹)
              </label>
              <input
                id="goalAmount"
                type="number"
                min="100000"
                max="100000000"
                step="100000"
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
                className="input-base font-numeric"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="yearsToGoal" className="label-text mb-0">
                  Years to Goal
                </label>
                <output className="text-heading-3 text-[#0F9D8A] font-numeric">
                  {yearsToGoal} {yearsToGoal === 1 ? 'year' : 'years'}
                </output>
              </div>
              <input
                id="yearsToGoal"
                type="range"
                min="1"
                max="30"
                step="1"
                value={yearsToGoal}
                onChange={(e) => setYearsToGoal(Number(e.target.value))}
                aria-label="Years to goal"
              />
            </div>
          </div>
        </section>

        {/* Step 2: Select Action */}
        <section className="card-surface mb-6 p-5 md:p-6 slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-heading-2 text-white mb-4">What do you want to do?</h2>
          
          <div className="space-y-3" role="radiogroup" aria-label="Select SIP action">
            <button
              type="button"
              role="radio"
              aria-checked={action === 'cancel'}
              onClick={() => setAction('cancel')}
              className={`w-full p-4 md:p-5 rounded-lg border-2 text-left transition-all ${
                action === 'cancel'
                  ? 'bg-[#EF4444]/10 border-[#EF4444] shadow-md'
                  : 'bg-transparent border-[rgba(92,214,240,0.2)] hover:border-[#EF4444] hover:bg-[#EF4444]/5'
              }`}
            >
              <div className="font-semibold text-white mb-1">Cancel SIP Completely</div>
              <div className="text-small text-[#CBD5E1]">Stop all future investments permanently</div>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={action === 'pause'}
              onClick={() => setAction('pause')}
              className={`w-full p-4 md:p-5 rounded-lg border-2 text-left transition-all ${
                action === 'pause'
                  ? 'bg-[#F59E0B]/10 border-[#F59E0B] shadow-md'
                  : 'bg-transparent border-[rgba(92,214,240,0.2)] hover:border-[#F59E0B] hover:bg-[#F59E0B]/5'
              }`}
            >
              <div className="font-semibold text-white mb-1">Pause for 6 Months</div>
              <div className="text-small text-[#CBD5E1]">Temporarily stop, resume later</div>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={action === 'reduce'}
              onClick={() => setAction('reduce')}
              className={`w-full p-4 md:p-5 rounded-lg border-2 text-left transition-all ${
                action === 'reduce'
                  ? 'bg-[#5CD6F0]/10 border-[#5CD6F0] shadow-md'
                  : 'bg-transparent border-[rgba(92,214,240,0.2)] hover:border-[#5CD6F0] hover:bg-[#5CD6F0]/5'
              }`}
            >
              <div className="font-semibold text-white mb-1">Reduce to ₹{Math.floor(monthlyAmount / 2).toLocaleString('en-IN')}/month</div>
              <div className="text-small text-[#CBD5E1]">Cut your monthly investment</div>
            </button>
          </div>
        </section>

        {/* Step 3: Select Reason (only if action selected) */}
        {action && (
          <section className="card-surface mb-6 p-5 md:p-6 slide-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-heading-2 text-white mb-3">Why are you doing this?</h2>
            <p className="text-small text-[#94A3B8] mb-4">
              This helps us show you relevant information for your situation.
            </p>
            
            <div className="space-y-3" role="radiogroup" aria-label="Select reason">
              {(Object.keys(REASON_LABELS) as PauseReason[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={reason === key}
                  onClick={() => setReason(key)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    reason === key
                      ? 'bg-[#0F9D8A]/10 border-[#0F9D8A] shadow-md'
                      : 'bg-transparent border-[rgba(92,214,240,0.2)] hover:border-[#0F9D8A] hover:bg-[#0F9D8A]/5'
                  }`}
                >
                  <div className="text-white text-small">{REASON_LABELS[key]}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Proceed Button (only if both action and reason selected) */}
        {action && reason && (
          <div className="text-center slide-up" style={{ animationDelay: '200ms' }}>
            <button
              type="button"
              onClick={handleProceed}
              className="btn-base btn-primary btn-lg"
            >
              Show Me the Impact
            </button>
            <p className="text-small text-[#94A3B8] mt-3">
              Demo mode. Your actual SIP will not be affected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
